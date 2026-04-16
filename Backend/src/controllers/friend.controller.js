import User from "../models/User.model.js";
import Friendship from "../models/Friendship.model.js";

//search users
export const searchUsers = async (req, res) => {
  try {
    const keyword = req.query.q;

    if (!keyword) {
      return res.status(400).json({ message: "Search query required" });
    }

    const users = await User.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
      ],
    }).select("-password");

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//send friend request
export const sendRequest = async (req, res) => {
  try {
    const requesterId = req.user._id;
    const recipientId = req.params.id;

    if (requesterId.toString() === recipientId) {
      return res.status(400).json({ message: "Cannot add yourself" });
    }

    const existing = await Friendship.findOne({
      $or: [
        { requester: requesterId, recipient: recipientId },
        { requester: recipientId, recipient: requesterId },
      ],
    });

    if (existing) {
      return res.status(400).json({ message: "Request already exists" });
    }

    const request = await Friendship.create({
      requester: requesterId,
      recipient: recipientId,
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//accept request
export const acceptRequest = async (req, res) => {
  try {
    const requestId = req.params.id;

    const request = await Friendship.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = "accepted";
    await request.save();

    res.json({ message: "Friend request accepted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//reject request
export const rejectRequest = async (req, res) => {
  try {
    const requestId = req.params.id;

    await Friendship.findByIdAndDelete(requestId);

    res.json({ message: "Friend request rejected" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get friend list
export const getFriends = async (req, res) => {
  try {
    const userId = req.user._id;

    const friends = await Friendship.find({
      $and: [
        { status: "accepted" },
        {
          $or: [{ requester: userId }, { recipient: userId }],
        },
      ],
    }).populate("requester recipient", "name email");

    res.json(friends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get requests list
export const getFriendRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const requests = await Friendship.find({
      recipient: userId,
      status: "pending",
    }).populate("requester", "name email");

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};