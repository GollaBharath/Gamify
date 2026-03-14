"use strict";

const {
	SlashCommandBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} = require("discord.js");

const {
	resolveContext,
	botAxios,
	userAxios,
	invalidateUserToken,
} = require("../apiClient");
const {
	errorEmbed,
	successEmbed,
	infoEmbed,
	COLORS,
} = require("../utils/embeds");
const { buildPageButtons, nextPage } = require("../utils/pagination");
const {
	formatRole,
	formatPoints,
	relativeTime,
	truncate,
} = require("../utils/formatters");
const { EmbedBuilder } = require("discord.js");

const ROLES = ["Member", "Moderator", "Event Staff", "Admin"];

// ─── User list embed ──────────────────────────────────────────────────────────

function userListEmbed(users, page, totalPages) {
	const rows = users
		.map((u, i) => {
			const idx = (page - 1) * 10 + i + 1;
			return `**${idx}.** ${formatRole(u.role)}  **${truncate(u.username, 25)}**  ·  ${formatPoints(u.points)}  ·  Lv.${u.level}`;
		})
		.join("\n");

	return new EmbedBuilder()
		.setColor(COLORS.primary)
		.setTitle("👥  Members")
		.setDescription(rows || "*No members found.*")
		.setFooter({ text: `Gamify Bot  •  Page ${page} / ${totalPages}` })
		.setTimestamp();
}

// ─── Pagination ───────────────────────────────────────────────────────────────

async function handlePageButton(interaction, parsed) {
	if (parsed.type !== "modusers") return false;
	await interaction.deferUpdate();
	let ctx;
	try {
		ctx = await resolveContext(interaction);
	} catch {
		return;
	}

	const newPage = nextPage(parsed.page, parsed.direction, 9999);
	try {
		const res = await ctx.api.get("/api/users/", {
			params: { page: newPage, limit: 10 },
		});
		const allUsers = res.data.data ?? [];
		const total = Math.max(1, Math.ceil(allUsers.length / 10));
		const safePage = Math.min(newPage, total);
		const users = allUsers.slice((safePage - 1) * 10, safePage * 10);
		const embed = userListEmbed(users, newPage, total);
		const row = buildPageButtons("modusers", newPage, total);
		return interaction.editReply({ embeds: [embed], components: [row] });
	} catch {}
}

// ─── Slash command ────────────────────────────────────────────────────────────

module.exports = {
	data: new SlashCommandBuilder()
		.setName("mod")
		.setDescription("Moderation tools")
		.addSubcommand((sub) =>
			sub.setName("users").setDescription("List all members (Moderator+)"),
		)
		.addSubcommand((sub) =>
			sub
				.setName("setrole")
				.setDescription("Change a member's role (Admin+)")
				.addUserOption((opt) =>
					opt.setName("user").setDescription("Discord user").setRequired(true),
				)
				.addStringOption((opt) =>
					opt
						.setName("role")
						.setDescription("New Gamify role")
						.setRequired(true)
						.addChoices(
							{ name: "👤 Member", value: "Member" },
							{ name: "⚔️ Moderator", value: "Moderator" },
							{ name: "🎪 Event Staff", value: "Event Staff" },
							{ name: "🛡️ Admin", value: "Admin" },
						),
				),
		)
		.addSubcommand((sub) =>
			sub
				.setName("userinfo")
				.setDescription("View a member's full account info (Moderator+)")
				.addUserOption((opt) =>
					opt.setName("user").setDescription("Discord user").setRequired(true),
				),
		),

	async execute(interaction) {
		const sub = interaction.options.getSubcommand();
		await interaction.deferReply({ ephemeral: true });

		let ctx;
		try {
			ctx = await resolveContext(interaction);
		} catch (err) {
			if (err.code === "not_configured") {
				return interaction.editReply({
					embeds: [infoEmbed("Not Configured", "Run `/setup` first.")],
				});
			}
			throw err;
		}

		const isMod = ["Admin", "Moderator", "Organisation"].includes(
			ctx.user.role,
		);
		const isAdmin = ["Admin", "Organisation"].includes(ctx.user.role);

		if (sub === "users") {
			if (!isMod) {
				return interaction.editReply({
					embeds: [
						errorEmbed(
							"Permission Denied",
							"Only Moderators can view the member list.",
						),
					],
				});
			}

			try {
				const res = await ctx.api.get("/api/users/", {
					params: { page: 1, limit: 10 },
				});
				const allUsers = res.data.data ?? [];
				const total = Math.max(1, Math.ceil(allUsers.length / 10));
				const users = allUsers.slice(0, 10);
				const embed = userListEmbed(users, 1, total);
				const row = buildPageButtons("modusers", 1, total);
				return interaction.editReply({ embeds: [embed], components: [row] });
			} catch (err) {
				return interaction.editReply({
					embeds: [errorEmbed("Error", "Could not load member list.")],
				});
			}
		}

		if (sub === "setrole") {
			if (!isAdmin) {
				return interaction.editReply({
					embeds: [
						errorEmbed("Permission Denied", "Only Admins can change roles."),
					],
				});
			}

			const targetDiscord = interaction.options.getUser("user");
			const newRole = interaction.options.getString("role");

			try {
				const memberRoles = interaction.guild.members.cache.get(
					targetDiscord.id,
				)
					? [
							...interaction.guild.members.cache
								.get(targetDiscord.id)
								.roles.cache.keys(),
						]
					: [];

				const authRes = await botAxios.post("/api/discord/auth", {
					discordId: targetDiscord.id,
					discordUsername: targetDiscord.username,
					guildId: interaction.guildId,
					memberRoleIds: memberRoles,
				});

				const targetId = authRes.data.user.id;
				await ctx.api.patch(`/api/users/${targetId}/role`, { role: newRole });
				invalidateUserToken(targetDiscord.id, interaction.guildId);

				return interaction.editReply({
					embeds: [
						successEmbed(
							"Role Updated",
							`<@${targetDiscord.id}>'s Gamify role is now **${formatRole(newRole)}**.`,
						),
					],
				});
			} catch (err) {
				return interaction.editReply({
					embeds: [
						errorEmbed(
							"Error",
							err.response?.data?.message ?? "Could not update role.",
						),
					],
				});
			}
		}

		if (sub === "userinfo") {
			if (!isMod) {
				return interaction.editReply({
					embeds: [
						errorEmbed(
							"Permission Denied",
							"Only Moderators can view user info.",
						),
					],
				});
			}

			const targetDiscord = interaction.options.getUser("user");
			try {
				const memberRoles = interaction.guild.members.cache.get(
					targetDiscord.id,
				)
					? [
							...interaction.guild.members.cache
								.get(targetDiscord.id)
								.roles.cache.keys(),
						]
					: [];

				const authRes = await botAxios.post("/api/discord/auth", {
					discordId: targetDiscord.id,
					discordUsername: targetDiscord.username,
					guildId: interaction.guildId,
					memberRoleIds: memberRoles,
				});

				const targetApi = userAxios(authRes.data.token);
				const profileRes = await targetApi.get("/api/users/profile");
				const gamifyUser = profileRes.data.user ?? profileRes.data;
				const { profileEmbed } = require("../utils/embeds");
				const member = interaction.guild.members.cache.get(targetDiscord.id);
				return interaction.editReply({
					embeds: [profileEmbed(gamifyUser, member)],
				});
			} catch {
				return interaction.editReply({
					embeds: [
						infoEmbed(
							"Not Found",
							`<@${targetDiscord.id}> has no Gamify account yet.`,
						),
					],
				});
			}
		}
	},

	handlePageButton,
};
