import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

const award = async (req, res) => {
  const { userId, points, reason } = req.body;

  if (!userId || !points || !reason) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const reci = await User.findById(userId);
    if (!reci) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    reci.points += points;
    await reci.save();

    await Transaction.create({
      user: userId,
      points,
      type: "credit",
      reason,
      createdBy: req.user._id,
    });
    res
      .status(200)
      .json({ success: true, message: "Points awarded successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getHistory = async (req, res) => {
  const { userId } = req.query;
  try {
    let filter = {};
    if (req.user.role === "Member") {
      filter.user = req.user._id;
    } else if (userId) {
      filter.user = userId;
    }

    const transactions = await Transaction.find(filter)
      .populate("user", "username email")
      .populate("createdBy", "username email")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
export { award, getHistory };
