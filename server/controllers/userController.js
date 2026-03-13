import User from "../models/User.js";

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

export const listUsers = async (req, res) => {
	try {
		const filter = {};
		if (req.user.organization) {
			filter.organization = req.user.organization;
		}

		const users = await User.find(filter)
			.select("username email role points level isActive createdAt")
			.sort({ createdAt: -1 });

		return res.status(200).json({ success: true, data: users });
	} catch (err) {
		console.error("List users error:", err);
		return res
			.status(500)
			.json({ success: false, message: "Server error while listing users" });
	}
};

export const updateUserRole = async (req, res) => {
	try {
		const { userId } = req.params;
		const { role } = req.body;

		const allowedRoles = ["Member", "Moderator", "Event Staff", "Admin"];
		if (!allowedRoles.includes(role)) {
			return res.status(400).json({
				success: false,
				message: "Invalid role",
			});
		}

		const user = await User.findById(userId);
		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}

		if (
			req.user.organization &&
			user.organization &&
			String(req.user.organization) !== String(user.organization)
		) {
			return res
				.status(403)
				.json({
					success: false,
					message: "Cannot update users from another organization",
				});
		}

		if (user.role === "Organisation") {
			return res.status(400).json({
				success: false,
				message: "Organisation role cannot be modified",
			});
		}

		user.role = role;
		await user.save();

		return res.status(200).json({
			success: true,
			message: "User role updated",
			data: {
				id: user._id,
				username: user.username,
				role: user.role,
			},
		});
	} catch (err) {
		console.error("Update role error:", err);
		return res
			.status(500)
			.json({ success: false, message: "Server error while updating role" });
	}
};
