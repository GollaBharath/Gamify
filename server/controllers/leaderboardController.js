import User from "../models/User.js";
import { resolveOrganizationId } from "../services/organizationService.js";

export const getLeaderboard = async (req, res) => {
	try {
		const { organizationId, limit = 20 } = req.query;
		const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
		const effectiveOrgId = await resolveOrganizationId(
			organizationId || req.user?.organization,
		);

		const leaders = await User.find({
			organization: effectiveOrgId,
			isActive: true,
		})
			.select("username role points totalPointsEarned level badges")
			.sort({ points: -1, totalPointsEarned: -1, createdAt: 1 })
			.limit(parsedLimit);

		const ranked = leaders.map((user, index) => ({
			rank: index + 1,
			...user.toObject(),
		}));

		return res.status(200).json({ success: true, data: ranked });
	} catch (error) {
		console.error("Leaderboard error:", error);
		return res
			.status(500)
			.json({ success: false, message: "Failed to fetch leaderboard" });
	}
};
