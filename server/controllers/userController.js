export const getProfile = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Protected data",
      user: req.user,
    });
  } catch (err) {
    console.error("Get profile error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error during profile fetch" });
  }
};
