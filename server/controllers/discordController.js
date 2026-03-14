import jwt from "jsonwebtoken";
import User from "../models/User.js";
import DiscordGuild from "../models/DiscordGuild.js";
import DiscordUser from "../models/DiscordUser.js";
import { resolveOrganizationId } from "../services/organizationService.js";

const JWT_SECRET = process.env.JWT_SECRET || "changeme-super-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

const signToken = (id) =>
	jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

/**
 * Resolve a Gamify role from the Discord member's role IDs and
 * the guild's configured roleMapping. Priority: admin > moderator > eventStaff > Member.
 */
const resolveGamifyRole = (memberRoleIds, guildConfig) => {
	const { roleMapping } = guildConfig;
	if (memberRoleIds.some((id) => roleMapping.admin.includes(id)))
		return "Admin";
	if (memberRoleIds.some((id) => roleMapping.moderator.includes(id)))
		return "Moderator";
	if (memberRoleIds.some((id) => roleMapping.eventStaff.includes(id)))
		return "Event Staff";
	return "Member";
};

// ─────────────────────────────────────────────────
// Guild management
// ─────────────────────────────────────────────────

export const registerGuild = async (req, res) => {
	try {
		const { guildId, guildName, organizationId, roleMapping, settings } =
			req.body;

		if (!guildId || !guildName) {
			return res.status(400).json({
				success: false,
				message: "guildId and guildName are required.",
			});
		}

		const orgId = await resolveOrganizationId(organizationId);

		const updateData = {
			guildId,
			guildName,
			organizationId: orgId,
		};
		if (roleMapping) updateData.roleMapping = roleMapping;
		if (settings) updateData.settings = settings;

		const guild = await DiscordGuild.findOneAndUpdate(
			{ guildId },
			{ $set: updateData },
			{ upsert: true, new: true, setDefaultsOnInsert: true },
		);

		return res.status(200).json({ success: true, guild });
	} catch (error) {
		console.error("registerGuild error:", error);
		return res.status(500).json({ success: false, message: "Server error." });
	}
};

export const getGuild = async (req, res) => {
	try {
		const guild = await DiscordGuild.findOne({
			guildId: req.params.guildId,
		}).populate("organizationId");

		if (!guild) {
			return res.status(404).json({
				success: false,
				message: "Guild not found. Run /setup in your Discord server first.",
			});
		}

		return res.json({ success: true, guild });
	} catch (error) {
		console.error("getGuild error:", error);
		return res.status(500).json({ success: false, message: "Server error." });
	}
};

export const updateGuild = async (req, res) => {
	try {
		const guild = await DiscordGuild.findOneAndUpdate(
			{ guildId: req.params.guildId },
			{ $set: req.body },
			{ new: true },
		);

		if (!guild) {
			return res
				.status(404)
				.json({ success: false, message: "Guild not found." });
		}

		return res.json({ success: true, guild });
	} catch (error) {
		console.error("updateGuild error:", error);
		return res.status(500).json({ success: false, message: "Server error." });
	}
};

export const listGuilds = async (req, res) => {
	try {
		const guilds = await DiscordGuild.find({ isActive: true }).populate(
			"organizationId",
			"name",
		);
		return res.json({ success: true, guilds });
	} catch (error) {
		return res.status(500).json({ success: false, message: "Server error." });
	}
};

// ─────────────────────────────────────────────────
// Discord Auth Bridge
// ─────────────────────────────────────────────────

export const discordAuth = async (req, res) => {
	try {
		const {
			discordId,
			discordUsername,
			guildId,
			memberRoleIds = [],
		} = req.body;

		if (!discordId || !discordUsername || !guildId) {
			return res.status(400).json({
				success: false,
				message: "discordId, discordUsername, and guildId are required.",
			});
		}

		// Fetch guild config
		const guildConfig = await DiscordGuild.findOne({ guildId });
		if (!guildConfig) {
			return res.status(404).json({
				success: false,
				message:
					"This server has not been configured yet. Ask an admin to run /setup.",
			});
		}

		const effectiveRole = resolveGamifyRole(memberRoleIds, guildConfig);

		// Find or create DiscordUser + linked Gamify user
		let discordUser = await DiscordUser.findOne({ discordId });
		let gamifyUser;

		if (discordUser) {
			gamifyUser = await User.findById(discordUser.gamifyUserId);

			// Track new guild membership
			if (!discordUser.guilds.includes(guildId)) {
				discordUser.guilds.push(guildId);
			}
			// Keep username in sync
			if (discordUser.discordUsername !== discordUsername) {
				discordUser.discordUsername = discordUsername;
			}
			await discordUser.save();
		} else {
			// Build a safe, unique username
			const sanitized = discordUsername
				.replace(/[^a-zA-Z0-9]/g, "")
				.toLowerCase()
				.slice(0, 20);
			const suffix = discordId.slice(-5);
			const username = `${sanitized || "user"}_${suffix}`;

			gamifyUser = await User.create({
				username,
				discordId,
				organization: guildConfig.organizationId,
				role: effectiveRole,
			});

			discordUser = await DiscordUser.create({
				discordId,
				discordUsername,
				gamifyUserId: gamifyUser._id,
				guilds: [guildId],
			});
		}

		// Sync role (never demote Organisation)
		if (gamifyUser && gamifyUser.role !== effectiveRole) {
			if (gamifyUser.role !== "Organisation") {
				gamifyUser.role = effectiveRole;
				await gamifyUser.save();
			}
		}

		if (!gamifyUser) {
			return res
				.status(500)
				.json({ success: false, message: "Failed to resolve Gamify user." });
		}

		const token = signToken(gamifyUser._id);

		return res.json({
			success: true,
			token,
			user: {
				id: gamifyUser._id,
				username: gamifyUser.username,
				role: gamifyUser.role,
				points: gamifyUser.points,
				totalPointsEarned: gamifyUser.totalPointsEarned,
				level: gamifyUser.level,
				badges: gamifyUser.badges,
			},
		});
	} catch (error) {
		console.error("discordAuth error:", error);
		return res
			.status(500)
			.json({ success: false, message: "Server error during Discord auth." });
	}
};

// ─────────────────────────────────────────────────
// Guild user listing
// ─────────────────────────────────────────────────

export const getGuildUsers = async (req, res) => {
	try {
		const guildConfig = await DiscordGuild.findOne({
			guildId: req.params.guildId,
		});
		if (!guildConfig) {
			return res
				.status(404)
				.json({ success: false, message: "Guild not found." });
		}

		const discordUsers = await DiscordUser.find({
			guilds: req.params.guildId,
		}).populate("gamifyUserId", "-password");

		return res.json({ success: true, users: discordUsers });
	} catch (error) {
		console.error("getGuildUsers error:", error);
		return res.status(500).json({ success: false, message: "Server error." });
	}
};
