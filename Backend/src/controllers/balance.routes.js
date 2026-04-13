import Loan from "../models/Loan.model.js";

export const getBalance = async (req, res) => {
  try {
    const userId = req.user._id;
    const friendId = req.params.friendId;

    // 1. get all accepted loans between users
    const loans = await Loan.find({
      $or: [
        { sender: userId, receiver: friendId, status: "accepted" },
        { sender: friendId, receiver: userId, status: "accepted" },
      ],
    });

    let youOwe = 0;
    let theyOwe = 0;

    // 2. calculate balance
    loans.forEach((loan) => {
      // if YOU sent money → THEY owe YOU
      if (loan.sender.toString() === userId.toString()) {
        if (loan.type === "give") {
          theyOwe += loan.amount;
        } else {
          youOwe += loan.amount;
        }
      }

      // if FRIEND sent money → YOU owe THEM
      if (loan.sender.toString() === friendId.toString()) {
        if (loan.type === "give") {
          youOwe += loan.amount;
        } else {
          theyOwe += loan.amount;
        }
      }
    });

    const net = theyOwe - youOwe;

    res.json({
      youOwe,
      theyOwe,
      net,
      status:
        net > 0
          ? "they_owe_you"
          : net < 0
          ? "you_owe_them"
          : "settled",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};