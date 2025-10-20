import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

// ✅ Award Points to a User
export const award = async (req, res) => {
  try {
    const { userId, points, reason } = req.body;

    if (!userId || !points || !reason) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const recipient = await User.findById(userId);
    if (!recipient) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    recipient.points += points;
    await recipient.save();

    await Transaction.create({
      user: userId,
      points,
      type: "credit",
      reason,
      createdBy: req.user._id,
    });

    return res
      .status(200)
      .json({ success: true, message: "Points awarded successfully" });
  } catch (error) {
    console.error("Award points error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Get Transaction History
export const getHistory = async (req, res) => {
  try {
    const { userId } = req.query;

    const filter = {};
    if (req.user.role === "Member") {
      filter.user = req.user._id;
    } else if (userId) {
      filter.user = userId;
    }

    const transactions = await Transaction.find(filter)
      .populate("user", "username email")
      .populate("createdBy", "username email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    console.error("Get transaction history error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
