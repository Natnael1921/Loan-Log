import Loan from "../models/Loan.model.js";
import Friendship from "../models/Friendship.model.js";

//create loan request
export const createLoan = async (req, res) => {
  try {
    const { receiverId, amount, type, note } = req.body;

    const senderId = req.user._id;

    // 1. check friendship
    const friendship = await Friendship.findOne({
      $or: [
        { requester: senderId, recipient: receiverId, status: "accepted" },
        { requester: receiverId, recipient: senderId, status: "accepted" },
      ],
    });

    if (!friendship) {
      return res.status(400).json({
        message: "You are not friends with this user",
      });
    }

    // 2. create loan
    const loan = await Loan.create({
      sender: senderId,
      receiver: receiverId,
      amount,
      type,
      note,
    });

    res.status(201).json(loan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get loan history
export const getLoans = async (req, res) => {
  try {
    const userId = req.user._id;
    const friendId = req.params.friendId;

    const loans = await Loan.find({
      $or: [
        { sender: userId, receiver: friendId },
        { sender: friendId, receiver: userId },
      ],
    }).sort({ createdAt: 1 });

    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//accept loan
export const acceptLoan = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    if (loan.status !== "pending") {
      return res.status(400).json({ message: "Already processed" });
    }

    loan.status = "accepted";
    await loan.save();

    res.json({ message: "Loan accepted", loan });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//reject loan
export const rejectLoan = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    if (loan.status !== "pending") {
      return res.status(400).json({ message: "Already processed" });
    }

    loan.status = "rejected";
    await loan.save();

    res.json({ message: "Loan rejected", loan });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
