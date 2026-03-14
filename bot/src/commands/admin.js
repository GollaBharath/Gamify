"use strict";

const {
	SlashCommandBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} = require("discord.js");

const { resolveContext } = require("../apiClient");
const {
	successEmbed,
	errorEmbed,
	infoEmbed,
	COLORS,
} = require("../utils/embeds");
const { newsletterModal } = require("../utils/modals");
const {
	formatPoints,
	formatNumber,
	formatDate,
} = require("../utils/formatters");
const { EmbedBuilder } = require("discord.js");

// ─── Stats embed ──────────────────────────────────────────────────────────────

function statsEmbed(data) {
	return new EmbedBuilder()
		.setColor(COLORS.primary)
		.setTitle("📊  Organization Stats")
		.addFields(
			{
				name: "👥 Total Members",
				value: formatNumber(data.totalMembers ?? 0),
				inline: true,
			},
			{
				name: "💰 Points Distributed",
				value: formatPoints(data.totalPointsDistributed ?? 0),
				inline: true,
			},
			{
				name: "🎉 Active Events",
				value: formatNumber(data.activeEvents ?? 0),
				inline: true,
			},
			{
				name: "📋 Total Tasks",
				value: formatNumber(data.totalTasks ?? 0),
				inline: true,
			},
			{
				name: "🛒 Shop Purchases",
				value: formatNumber(data.totalPurchases ?? 0),
				inline: true,
			},
			{
				name: "📬 Pending Reviews",
				value: formatNumber(data.pendingSubmissions ?? 0),
				inline: true,
			},
		)
		.setFooter({ text: "Gamify Bot" })
		.setTimestamp();
}

// ─── Modal handler ─────────────────────────────────────────────────────────────

async function handleModal(interaction) {
	if (interaction.customId !== "modal:admin:newsletter") return;

	const subject = interaction.fields.getTextInputValue("subject").trim();
	const message = interaction.fields.getTextInputValue("message").trim();

	await interaction.deferReply({ ephemeral: true });
	let ctx;
	try {
		ctx = await resolveContext(interaction);
	} catch {
		return;
	}

	if (!["Admin", "Organisation"].includes(ctx.user.role)) {
		return interaction.editReply({
			embeds: [
				errorEmbed("Permission Denied", "Only Admins can send newsletters."),
			],
		});
	}

	try {
		const res = await ctx.api.post('/api/newsletter/send', {
			subject,
			content: message,
		});
		// API returns { message: "Newsletter sent to N subscribers" }
		const sentMatch = res.data.message?.match(/(\d+)/);
		const sent = sentMatch ? sentMatch[1] : '?';
		return interaction.editReply({
			embeds: [
				successEmbed(
					"Newsletter Sent",
					`Successfully sent to **${sent}** subscribers.\nSubject: *${subject}*`,
				),
			],
		});
	} catch (err) {
		return interaction.editReply({
			embeds: [
				errorEmbed(
					"Error",
					err.response?.data?.message ?? "Could not send newsletter.",
				),
			],
		});
	}
}

// ─── Button handler ───────────────────────────────────────────────────────────

async function handleButton(interaction) {
	if (interaction.customId === "btn:admin:newsletter") {
		return interaction.showModal(newsletterModal());
	}
}

// ─── Slash command ────────────────────────────────────────────────────────────

module.exports = {
	data: new SlashCommandBuilder()
		.setName("admin")
		.setDescription("Admin tools")
		.addSubcommand((sub) =>
			sub
				.setName("stats")
				.setDescription("View organization statistics (Admin+)"),
		)
		.addSubcommand((sub) =>
			sub
				.setName("newsletter")
				.setDescription("Send a newsletter to all subscribers (Admin+)"),
		)
		.addSubcommand((sub) =>
			sub
				.setName("subscribers")
				.setDescription("View newsletter subscriber count (Admin+)"),
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

		const isAdmin = ["Admin", "Organisation"].includes(ctx.user.role);
		if (!isAdmin) {
			return interaction.editReply({
				embeds: [
					errorEmbed(
						"Permission Denied",
						"Only Admins can use `/admin` commands.",
					),
				],
			});
		}

		if (sub === "stats") {
			try {
				// Gather stats from multiple endpoints
				const [usersRes, eventsRes, tasksRes, purchasesRes, subCountRes] =
					await Promise.allSettled([
						ctx.api.get("/api/users/"),
						ctx.api.get("/api/events/"),
						ctx.api.get("/api/tasks/"),
						ctx.api.get("/api/shop/purchases/me").catch(() => ({ data: {} })),
						ctx.api.get("/api/newsletter/count"),
					]);

				const totalMembers =
					usersRes.status === "fulfilled"
						? (usersRes.value.data.pagination?.total ??
							(usersRes.value.data.users ?? []).length)
						: 0;
				const activeEvents =
					eventsRes.status === "fulfilled"
						? (eventsRes.value.data.events ?? []).filter(
								(e) => e.status === "active",
							).length
						: 0;
				const totalTasks =
					tasksRes.status === "fulfilled"
						? (tasksRes.value.data.pagination?.total ??
							(tasksRes.value.data.tasks ?? []).length)
						: 0;
				const subscriberCount =
					subCountRes.status === "fulfilled"
						? (subCountRes.value.data.count ?? 0)
						: 0;

				const data = {
					totalMembers,
					activeEvents,
					totalTasks,
					totalPointsDistributed: 0,
					totalPurchases: 0,
					pendingSubmissions: 0,
				};

				const embed = statsEmbed(data);
				embed.addFields({
					name: "📧 Newsletter Subscribers",
					value: formatNumber(subscriberCount),
					inline: true,
				});
				return interaction.editReply({ embeds: [embed] });
			} catch (err) {
				return interaction.editReply({
					embeds: [errorEmbed("Error", "Could not load stats.")],
				});
			}
		}

		if (sub === "newsletter") {
			// Show modal to compose newsletter
			// Since we deferred, we can't show a modal. Show a button instead.
			try {
				const countRes = await ctx.api.get("/api/newsletter/count");
				const count = countRes.data.count ?? 0;

				const embed = new EmbedBuilder()
					.setColor(COLORS.info)
					.setTitle("📧  Send Newsletter")
					.setDescription(
						`You are about to compose a newsletter.\n\n**Active subscribers:** ${formatNumber(count)}\n\nClick the button below to write and send the email.`,
					)
					.setFooter({ text: "Gamify Bot" })
					.setTimestamp();

				const row = new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setCustomId("btn:admin:newsletter")
						.setLabel("✏️  Compose & Send")
						.setStyle(ButtonStyle.Primary),
				);

				return interaction.editReply({ embeds: [embed], components: [row] });
			} catch {
				return interaction.editReply({
					embeds: [errorEmbed("Error", "Could not load newsletter info.")],
				});
			}
		}

		if (sub === "subscribers") {
			try {
				const res = await ctx.api.get("/api/newsletter/count");
				const count = res.data.count ?? 0;

				const embed = new EmbedBuilder()
					.setColor(COLORS.info)
					.setTitle("📧  Newsletter Subscribers")
					.setDescription(`**${formatNumber(count)}** active subscribers.`)
					.setFooter({ text: "Gamify Bot" })
					.setTimestamp();

				return interaction.editReply({ embeds: [embed] });
			} catch {
				return interaction.editReply({
					embeds: [errorEmbed("Error", "Could not fetch subscriber count.")],
				});
			}
		}
	},

	handleButton,
	handleModal,
};
