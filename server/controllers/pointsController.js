import PointTransaction from "../models/PointTransaction.js";
import { creditPoints } from "../services/pointService.js";
import { resolveOrganizationId } from "../services/organizationService.js";

// ✅ Award Points to a User
export const award = async (req, res) => {
	try {
		const { userId, points, reason } = req.body;
		const parsedPoints = parseInt(points, 10);

		if (!userId || !reason || Number.isNaN(parsedPoints)) {
			return res.status(400).json({
				success: false,
				message: "userId, points and reason are required",
			});
		}

		const organizationId = await resolveOrganizationId(req.user.organization);

		await creditPoints({
			userId,
			organizationId,
			amount: parsedPoints,
			type: "awarded",
			source: "admin_award",
			reference: req.user._id,
			referenceType: "User",
			description: reason,
			processedBy: req.user._id,
			metadata: {
				reason,
			},
		});

		return res
			.status(200)
			.json({ success: true, message: "Points awarded successfully" });
	} catch (error) {
		console.error("Award points error:", error);
		return res.status(error.statusCode || 500).json({
			success: false,
			message: error.message || "Server error",
		});
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

		if (req.user.organization) {
			filter.organization = req.user.organization;
		}

		const transactions = await PointTransaction.find(filter)
			.populate("user", "username email")
			.populate("processedBy", "username email role")
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
