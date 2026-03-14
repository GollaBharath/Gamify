"use strict";

const {
	SlashCommandBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} = require("discord.js");

const { resolveContext, botAxios, userAxios } = require("../apiClient");
const {
	pointsHistoryEmbed,
	successEmbed,
	errorEmbed,
	infoEmbed,
	COLORS,
} = require("../utils/embeds");
const {
	buildPageButtons,
	parsePaginationId,
	nextPage,
	totalPages,
} = require("../utils/pagination");
const { awardPointsModal } = require("../utils/modals");
const { formatPoints, levelProgress } = require("../utils/formatters");
const { EmbedBuilder } = require("discord.js");

const PER_PAGE = 8;

// ─── Balance embed ────────────────────────────────────────────────────────────

function balanceEmbed(user, targetName) {
	const { level, xpInLevel, xpNeeded, bar, pct } = levelProgress(
		user.totalPointsEarned ?? 0,
	);

	return new EmbedBuilder()
		.setColor(0xffd700)
		.setTitle(`💰  ${targetName}'s Balance`)
		.addFields(
			{
				name: "💵 Spendable Points",
				value: formatPoints(user.points),
				inline: true,
			},
			{
				name: "🏆 Total XP Earned",
				value: formatPoints(user.totalPointsEarned),
				inline: true,
			},
			{ name: "⭐ Level", value: `Level ${level}`, inline: true },
			{
				name: "📈 Progress to next level",
				value: `\`${bar}\` ${pct}%  (${user.totalPointsEarned % 1000} / 1000 XP)`,
				inline: false,
			},
		)
		.setFooter({ text: "Gamify Bot" })
		.setTimestamp();
}

// ─── Fetch and render history page ────────────────────────────────────────────

async function renderHistoryPage(api, page, targetUserId, targetName) {
	const params = { page, limit: PER_PAGE };
	if (targetUserId) params.userId = targetUserId;

	const res = await api.get("/api/points/history", { params });
	const allTxs = res.data.data ?? [];
	const total = Math.max(1, Math.ceil(allTxs.length / PER_PAGE));
	const safePage = Math.min(page, total);
	const transactions = allTxs.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

	const embed = pointsHistoryEmbed(transactions, page, total, targetName);
	const row = buildPageButtons(
		"ptshist",
		page,
		total,
		targetUserId ? `u=${targetUserId}` : "",
	);

	return { embed, row, total };
}

// ─── Pagination button handler ────────────────────────────────────────────────

async function handlePageButton(interaction, parsed) {
	if (parsed.type !== "ptshist") return false;

	await interaction.deferUpdate();

	let ctx;
	try {
		ctx = await resolveContext(interaction);
	} catch {
		return interaction.editReply({
			embeds: [errorEmbed("Error", "Session expired.")],
		});
	}

	const extra = parsed.extra ?? "";
	let targetUserId = null;
	if (extra.startsWith("u=")) targetUserId = extra.slice(2);

	const newPage = nextPage(parsed.page, parsed.direction, 9999);

	try {
		const { embed, row } = await renderHistoryPage(
			ctx.api,
			newPage,
			targetUserId || undefined,
			undefined,
		);
		return interaction.editReply({ embeds: [embed], components: [row] });
	} catch (err) {
		return interaction.editReply({
			embeds: [errorEmbed("Error", "Could not load page.")],
		});
	}
}

// ─── Modal handler (award points confirm) ─────────────────────────────────────

async function handleModal(interaction) {
	if (!interaction.customId.startsWith("modal:points:award:")) return;

	const targetGamifyUserId = interaction.customId.split(":")[3];
	const rawAmount = interaction.fields.getTextInputValue("amount");
	const reason =
		interaction.fields.getTextInputValue("reason")?.trim() ||
		"Awarded via Discord";
	const amount = parseInt(rawAmount, 10);

	if (isNaN(amount) || amount <= 0) {
		return interaction.reply({
			embeds: [errorEmbed("Invalid Amount", "Please enter a positive number.")],
			ephemeral: true,
		});
	}

	await interaction.deferReply({ ephemeral: true });

	let ctx;
	try {
		ctx = await resolveContext(interaction);
	} catch {
		return interaction.editReply({
			embeds: [errorEmbed("Error", "Could not authenticate.")],
		});
	}

	if (!["Admin", "Moderator", "Organisation"].includes(ctx.user.role)) {
		return interaction.editReply({
			embeds: [
				errorEmbed(
					"Permission Denied",
					"Only Admins and Moderators can award points.",
				),
			],
		});
	}

	try {
		await ctx.api.post('/api/points/award', {
			userId: targetGamifyUserId,
			points: amount,
			reason,
		});

		return interaction.editReply({
			embeds: [
				successEmbed(
					"Points Awarded",
					`Successfully awarded **${formatPoints(amount)}**.\nReason: *${reason}*`,
				),
			],
		});
	} catch (err) {
		const msg = err.response?.data?.message ?? "Could not award points.";
		return interaction.editReply({ embeds: [errorEmbed("Error", msg)] });
	}
}

// ─── Slash command ────────────────────────────────────────────────────────────

module.exports = {
	data: new SlashCommandBuilder()
		.setName("points")
		.setDescription("Manage and view points")
		.addSubcommand((sub) =>
			sub
				.setName("balance")
				.setDescription("Check a member's points balance")
				.addUserOption((opt) =>
					opt
						.setName("user")
						.setDescription("Discord user (defaults to you)")
						.setRequired(false),
				),
		)
		.addSubcommand((sub) =>
			sub
				.setName("history")
				.setDescription("View points transaction history")
				.addUserOption((opt) =>
					opt
						.setName("user")
						.setDescription("Discord user (defaults to you)")
						.setRequired(false),
				),
		)
		.addSubcommand((sub) =>
			sub
				.setName("award")
				.setDescription("Award points to a member (Moderator+)")
				.addUserOption((opt) =>
					opt
						.setName("user")
						.setDescription("Discord user to award")
						.setRequired(true),
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

		// ── balance ──────────────────────────────────────────────────────────────
		if (sub === "balance") {
			const targetDiscord = interaction.options.getUser("user");
			const isSelf = !targetDiscord || targetDiscord.id === interaction.user.id;

			let targetUser = ctx.user;
			let targetName = interaction.user.username;

			if (!isSelf) {
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
					targetUser = profileRes.data.user ?? profileRes.data;
					targetName = targetDiscord.username;
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
			} else {
				try {
					const profileRes = await ctx.api.get("/api/users/profile");
					targetUser = profileRes.data.user ?? profileRes.data;
				} catch {}
			}

			return interaction.editReply({
				embeds: [balanceEmbed(targetUser, targetName)],
			});
		}

		// ── history ───────────────────────────────────────────────────────────────
		if (sub === "history") {
			const targetDiscord = interaction.options.getUser("user");
			const isSelf = !targetDiscord || targetDiscord.id === interaction.user.id;
			let targetGamifyId = null;
			let targetName = interaction.user.username;

			if (!isSelf) {
				if (
					!["Admin", "Moderator", "Organisation", "Event Staff"].includes(
						ctx.user.role,
					)
				) {
					return interaction.editReply({
						embeds: [
							errorEmbed(
								"Permission Denied",
								"You can only view your own history.",
							),
						],
					});
				}
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
					targetGamifyId = authRes.data.user.id;
					targetName = targetDiscord.username;
				} catch {
					return interaction.editReply({
						embeds: [
							infoEmbed("Not Found", `<@${targetDiscord.id}> has no account.`),
						],
					});
				}
			}

			try {
				const { embed, row } = await renderHistoryPage(
					ctx.api,
					1,
					targetGamifyId,
					targetName,
				);
				return interaction.editReply({ embeds: [embed], components: [row] });
			} catch (err) {
				return interaction.editReply({
					embeds: [errorEmbed("Error", "Could not load history.")],
				});
			}
		}

		// ── award ─────────────────────────────────────────────────────────────────
		if (sub === "award") {
			if (!["Admin", "Moderator", "Organisation"].includes(ctx.user.role)) {
				return interaction.editReply({
					embeds: [
						errorEmbed(
							"Permission Denied",
							"Only Admins and Moderators can award points.",
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
				const targetGamifyId = authRes.data.user.id;
				// Show the modal (can't defer reply before showing a modal)
				// We need to re-think — we already deferred, so use followUp approach
				// Just ask for amount inline
				return interaction.editReply({
					embeds: [
						new EmbedBuilder()
							.setColor(0xffd700)
							.setTitle("🎁  Award Points")
							.setDescription(
								`Use the button below to award points to <@${targetDiscord.id}>.`,
							)
							.setFooter({ text: "Gamify Bot" }),
					],
					components: [
						new ActionRowBuilder().addComponents(
							new ButtonBuilder()
								.setCustomId(`btn:points:awardmodal:${targetGamifyId}`)
								.setLabel("💰  Enter Amount")
								.setStyle(ButtonStyle.Success),
						),
					],
				});
			} catch {
				return interaction.editReply({
					embeds: [
						infoEmbed(
							"Not Found",
							`<@${targetDiscord.id}> has no Gamify account.`,
						),
					],
				});
			}
		}
	},

	async handleButton(interaction) {
		if (interaction.customId.startsWith("btn:points:awardmodal:")) {
			const targetGamifyId = interaction.customId.split(":")[3];
			return interaction.showModal(awardPointsModal(targetGamifyId));
		}
	},

	handleModal,
	handlePageButton,
};
