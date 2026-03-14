"use strict";

const {
	SlashCommandBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
} = require("discord.js");

const { resolveContext } = require("../apiClient");
const {
	eventListEmbed,
	eventDetailEmbed,
	successEmbed,
	errorEmbed,
	infoEmbed,
	COLORS,
} = require("../utils/embeds");
const {
	buildPageButtons,
	parsePaginationId,
	nextPage,
} = require("../utils/pagination");
const { eventCreateModal, eventEditModal } = require("../utils/modals");
const { EmbedBuilder } = require("discord.js");
const { formatStatus } = require("../utils/formatters");

const PER_PAGE = 5;

async function fetchEventsPage(api, page) {
	const res = await api.get('/api/events/');
	const allEvents = res.data.data ?? [];
	const total = Math.max(1, Math.ceil(allEvents.length / PER_PAGE));
	const safePage = Math.min(page, total);
	const events = allEvents.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);
	return { events, totalPages: total };
}

// ─── Pagination button handler ─────────────────────────────────────────────────

async function handlePageButton(interaction, parsed) {
	if (parsed.type !== "events") return false;
	await interaction.deferUpdate();

	let ctx;
	try {
		ctx = await resolveContext(interaction);
	} catch {
		return;
	}

	const newPage = nextPage(parsed.page, parsed.direction, 9999);
	try {
		const { events, totalPages } = await fetchEventsPage(ctx.api, newPage);
		const embed = eventListEmbed(events, newPage, totalPages);
		const row = buildPageButtons("events", newPage, totalPages);
		return interaction.editReply({ embeds: [embed], components: [row] });
	} catch {}
}

// ─── Button handler ────────────────────────────────────────────────────────────

async function handleButton(interaction) {
	const id = interaction.customId;

	// View event detail
	if (id.startsWith("btn:events:view:")) {
		const eventId = id.split(":")[3];
		await interaction.deferReply({ ephemeral: true });
		let ctx;
		try {
			ctx = await resolveContext(interaction);
		} catch {
			return;
		}

		try {
			const res = await ctx.api.get(`/api/events/${eventId}`);
			const event = res.data.data?.event ?? res.data.data;
			const embed = eventDetailEmbed(event);

			const row = new ActionRowBuilder().addComponents(
				new ButtonBuilder()
					.setCustomId(`btn:events:tasks:${eventId}`)
					.setLabel("📋 View Tasks")
					.setStyle(ButtonStyle.Primary),
			);

			if (["Admin", "Organisation", "Event Staff"].includes(ctx.user.role)) {
				row.addComponents(
					new ButtonBuilder()
						.setCustomId(`btn:events:editmodal:${eventId}`)
						.setLabel("✏️ Edit")
						.setStyle(ButtonStyle.Secondary),
				);
			}

			return interaction.editReply({ embeds: [embed], components: [row] });
		} catch {
			return interaction.editReply({
				embeds: [errorEmbed("Error", "Event not found.")],
			});
		}
	}

	// See tasks for event
	if (id.startsWith("btn:events:tasks:")) {
		const eventId = id.split(":")[3];
		await interaction.deferReply({ ephemeral: true });
		let ctx;
		try {
			ctx = await resolveContext(interaction);
		} catch {
			return;
		}

		try {
			const res = await ctx.api.get('/api/tasks/', { params: { eventId } });
			const allTasks = res.data.data ?? [];
			const total = Math.max(1, Math.ceil(allTasks.length / PER_PAGE));
			const tasks = allTasks.slice(0, PER_PAGE);
			const { taskListEmbed } = require("../utils/embeds");
			const embed = taskListEmbed(tasks, 1, total);
			const row = buildPageButtons("tasks", 1, total, `e=${eventId}`);
			return interaction.editReply({ embeds: [embed], components: [row] });
		} catch {
			return interaction.editReply({
				embeds: [errorEmbed("Error", "Could not load tasks.")],
			});
		}
	}

	// Edit event (open modal)
	if (id.startsWith("btn:events:editmodal:")) {
		const eventId = id.split(":")[3];
		let ctx;
		try {
			ctx = await resolveContext(interaction);
		} catch {
			return;
		}

		if (!["Admin", "Organisation", "Event Staff"].includes(ctx.user.role)) {
			return interaction.reply({
				embeds: [
					errorEmbed(
						"Permission Denied",
						"Only Event Staff or higher can edit events.",
					),
				],
				ephemeral: true,
			});
		}

		try {
			const res = await ctx.api.get(`/api/events/${eventId}`);
			const event = res.data.data?.event ?? res.data.data;
			return interaction.showModal(eventEditModal(event));
		} catch {
			return interaction.reply({
				embeds: [errorEmbed("Error", "Event not found.")],
				ephemeral: true,
			});
		}
	}

	// Status selector confirm
	if (id.startsWith("btn:events:status:")) {
		const parts = id.split(":");
		const eventId = parts[3];
		const status = parts[4];

		await interaction.deferUpdate();
		let ctx;
		try {
			ctx = await resolveContext(interaction);
		} catch {
			return;
		}

		try {
			await ctx.api.patch(`/api/events/${eventId}`, { status });
			return interaction.editReply({
				embeds: [
					successEmbed(
						"Status Updated",
						`Event status changed to **${formatStatus(status)}**.`,
					),
				],
				components: [],
			});
		} catch (err) {
			return interaction.editReply({
				embeds: [
					errorEmbed(
						"Error",
						err.response?.data?.message ?? "Could not update status.",
					),
				],
				components: [],
			});
		}
	}
}

// ─── Modal handler ─────────────────────────────────────────────────────────────

async function handleModal(interaction) {
	const id = interaction.customId;

	if (id === "modal:events:create") {
		const title = interaction.fields.getTextInputValue("title").trim();
		const description = interaction.fields
			.getTextInputValue("description")
			.trim();
		const startDate = interaction.fields.getTextInputValue("startDate").trim();
		const endDate = interaction.fields.getTextInputValue("endDate").trim();
		const maxPart =
			interaction.fields.getTextInputValue("maxParticipants")?.trim() || "0";

		await interaction.deferReply({ ephemeral: true });
		let ctx;
		try {
			ctx = await resolveContext(interaction);
		} catch {
			return;
		}

		try {
			const eventPayload = {
				title,
				description,
				startDate: new Date(startDate).toISOString(),
				endDate: new Date(endDate).toISOString(),
				status: "draft",
			};
			const mp = parseInt(maxPart, 10);
			if (mp > 0) eventPayload.maxParticipants = mp;
			const res = await ctx.api.post("/api/events/", eventPayload);
			const event = res.data.data;
			return interaction.editReply({
				embeds: [
					successEmbed(
						"Event Created",
						`**${event.title}** has been created as a draft.\nID: \`${event._id}\`\n\nSet it to \`active\` when you're ready.`,
					),
				],
			});
		} catch (err) {
			const msg = err.response?.data?.message ?? "Could not create event.";
			return interaction.editReply({ embeds: [errorEmbed("Error", msg)] });
		}
	}

	if (id.startsWith("modal:events:edit:")) {
		const eventId = id.split(":")[3];
		const title = interaction.fields.getTextInputValue("title").trim();
		const description = interaction.fields
			.getTextInputValue("description")
			.trim();
		const maxPart =
			interaction.fields.getTextInputValue("maxParticipants")?.trim() || "0";

		await interaction.deferReply({ ephemeral: true });
		let ctx;
		try {
			ctx = await resolveContext(interaction);
		} catch {
			return;
		}

		try {
			const editPayload = { title, description };
			const mpEdit = parseInt(maxPart, 10);
			if (mpEdit > 0) editPayload.maxParticipants = mpEdit;
			await ctx.api.patch(`/api/events/${eventId}`, editPayload);
			return interaction.editReply({
				embeds: [
					successEmbed(
						"Event Updated",
						`Event **${title}** has been updated successfully.`,
					),
				],
			});
		} catch (err) {
			return interaction.editReply({
				embeds: [
					errorEmbed(
						"Error",
						err.response?.data?.message ?? "Could not update event.",
					),
				],
			});
		}
	}
}

// ─── Slash command ────────────────────────────────────────────────────────────

module.exports = {
	data: new SlashCommandBuilder()
		.setName("events")
		.setDescription("Browse and manage events")
		.addSubcommand((sub) =>
			sub.setName("list").setDescription("Browse all events"),
		)
		.addSubcommand((sub) =>
			sub
				.setName("view")
				.setDescription("View details of a specific event")
				.addStringOption((opt) =>
					opt.setName("id").setDescription("Event ID").setRequired(true),
				),
		)
		.addSubcommand((sub) =>
			sub.setName("create").setDescription("Create a new event (Event Staff+)"),
		)
		.addSubcommand((sub) =>
			sub
				.setName("status")
				.setDescription("Update an event's status (Event Staff+)")
				.addStringOption((opt) =>
					opt.setName("id").setDescription("Event ID").setRequired(true),
				)
				.addStringOption((opt) =>
					opt
						.setName("status")
						.setDescription("New status")
						.setRequired(true)
						.addChoices(
							{ name: "📝 Draft", value: "draft" },
							{ name: "🟢 Active", value: "active" },
							{ name: "⏸️ Paused", value: "paused" },
							{ name: "✅ Completed", value: "completed" },
							{ name: "🚫 Cancelled", value: "cancelled" },
						),
				),
		),

	async execute(interaction) {
		const sub = interaction.options.getSubcommand();

		if (sub === "create") {
			let ctx;
			try {
				ctx = await resolveContext(interaction);
			} catch {
				return interaction.reply({
					embeds: [errorEmbed("Error", "Could not authenticate.")],
					ephemeral: true,
				});
			}
			if (!["Admin", "Organisation", "Event Staff"].includes(ctx.user.role)) {
				return interaction.reply({
					embeds: [
						errorEmbed(
							"Permission Denied",
							"Only Event Staff or higher can create events.",
						),
					],
					ephemeral: true,
				});
			}
			return interaction.showModal(eventCreateModal());
		}

		await interaction.deferReply({ ephemeral: sub !== "list" });

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

		if (sub === "list") {
			try {
				const { events, totalPages } = await fetchEventsPage(ctx.api, 1);
				const embed = eventListEmbed(events, 1, totalPages);
				const pageRow = buildPageButtons("events", 1, totalPages);

				const detailRow = new ActionRowBuilder();
				if (events.length > 0) {
					const select = new StringSelectMenuBuilder()
						.setCustomId("sel:events:view")
						.setPlaceholder("View event details…")
						.addOptions(
							events.slice(0, 25).map((e) =>
								new StringSelectMenuOptionBuilder()
									.setLabel(e.title.slice(0, 100))
									.setValue(e._id)
									.setDescription((e.description ?? "").slice(0, 100)),
							),
						);
					detailRow.addComponents(select);
				}

				const components = [pageRow];
				if (events.length > 0) components.push(detailRow);

				return interaction.editReply({ embeds: [embed], components });
			} catch (err) {
				return interaction.editReply({
					embeds: [errorEmbed("Error", "Could not load events.")],
				});
			}
		}

		if (sub === "view") {
			const eventId = interaction.options.getString("id");
			try {
				const res = await ctx.api.get(`/api/events/${eventId}`);
				const event = res.data.data?.event ?? res.data.data;
				const embed = eventDetailEmbed(event);

				const row = new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setCustomId(`btn:events:tasks:${eventId}`)
						.setLabel("📋 View Tasks")
						.setStyle(ButtonStyle.Primary),
				);

				if (["Admin", "Organisation", "Event Staff"].includes(ctx.user.role)) {
					row.addComponents(
						new ButtonBuilder()
							.setCustomId(`btn:events:editmodal:${eventId}`)
							.setLabel("✏️ Edit")
							.setStyle(ButtonStyle.Secondary),
					);
				}

				return interaction.editReply({ embeds: [embed], components: [row] });
			} catch {
				return interaction.editReply({
					embeds: [errorEmbed("Not Found", "Event not found.")],
				});
			}
		}

		if (sub === "status") {
			if (!["Admin", "Organisation", "Event Staff"].includes(ctx.user.role)) {
				return interaction.editReply({
					embeds: [
						errorEmbed(
							"Permission Denied",
							"Only Event Staff or higher can change event status.",
						),
					],
				});
			}

			const eventId = interaction.options.getString("id");
			const status = interaction.options.getString("status");

			try {
				await ctx.api.patch(`/api/events/${eventId}`, { status });
				return interaction.editReply({
					embeds: [
						successEmbed(
							"Status Updated",
							`Event status changed to **${formatStatus(status)}**.`,
						),
					],
				});
			} catch (err) {
				return interaction.editReply({
					embeds: [
						errorEmbed(
							"Error",
							err.response?.data?.message ?? "Could not update event.",
						),
					],
				});
			}
		}
	},

	handleButton,
	handleModal,
	handlePageButton,

	// Called from events list select menu
	async handleSelectMenu(interaction) {
		if (interaction.customId !== "sel:events:view") return;
		const eventId = interaction.values[0];
		await interaction.deferReply({ ephemeral: true });
		let ctx;
		try {
			ctx = await resolveContext(interaction);
		} catch {
			return;
		}

		try {
			const res = await ctx.api.get(`/api/events/${eventId}`);
			const event = res.data.data?.event ?? res.data.data;
			const embed = eventDetailEmbed(event);
			const row = new ActionRowBuilder().addComponents(
				new ButtonBuilder()
					.setCustomId(`btn:events:tasks:${eventId}`)
					.setLabel("📋 View Tasks")
					.setStyle(ButtonStyle.Primary),
			);
			return interaction.editReply({ embeds: [embed], components: [row] });
		} catch {
			return interaction.editReply({
				embeds: [errorEmbed("Not Found", "Event not found.")],
			});
		}
	},
};
