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
	taskListEmbed,
	taskDetailEmbed,
	submissionEmbed,
	successEmbed,
	errorEmbed,
	infoEmbed,
} = require("../utils/embeds");
const {
	buildPageButtons,
	parsePaginationId,
	nextPage,
} = require("../utils/pagination");
const {
	taskCreateModal,
	taskSubmitModal,
	rejectReasonModal,
} = require("../utils/modals");
const { formatPoints } = require("../utils/formatters");

const PER_PAGE = 5;

async function fetchTasksPage(api, page, eventId) {
	const params = {};
	if (eventId) params.eventId = eventId;
	const res = await api.get('/api/tasks/', { params });
	const allTasks = res.data.data ?? [];
	const total = Math.max(1, Math.ceil(allTasks.length / PER_PAGE));
	const safePage = Math.min(page, total);
	const tasks = allTasks.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);
	return { tasks, totalPages: total };
}

// ─── Pagination button ────────────────────────────────────────────────────────

async function handlePageButton(interaction, parsed) {
	if (parsed.type !== "tasks") return false;
	await interaction.deferUpdate();
	let ctx;
	try {
		ctx = await resolveContext(interaction);
	} catch {
		return;
	}

	const extra = parsed.extra ?? "";
	let eventId;
	if (extra.startsWith("e=")) eventId = extra.slice(2);

	const newPage = nextPage(parsed.page, parsed.direction, 9999);
	try {
		const { tasks, totalPages } = await fetchTasksPage(
			ctx.api,
			newPage,
			eventId,
		);
		const embed = taskListEmbed(tasks, newPage, totalPages);
		const row = buildPageButtons(
			"tasks",
			newPage,
			totalPages,
			eventId ? `e=${eventId}` : "",
		);
		return interaction.editReply({ embeds: [embed], components: [row] });
	} catch {}
}

// ─── Submissions pagination ───────────────────────────────────────────────────

async function handleSubmissionPageButton(interaction, parsed) {
	if (parsed.type !== "modqueue") return false;
	await interaction.deferUpdate();
	let ctx;
	try {
		ctx = await resolveContext(interaction);
	} catch {
		return;
	}

	const taskId = parsed.extra?.split("t=")?.[1];
	const newPage = nextPage(parsed.page, parsed.direction, 9999);

	try {
		const res = await ctx.api.get(`/api/tasks/${taskId}/submissions`, {
			params: { page: newPage, limit: 1, status: "pending" },
		});
		const subs = res.data.data ?? [];
		const total = Math.max(1, subs.length);

		if (!subs.length) {
			return interaction.editReply({
				embeds: [infoEmbed("No Submissions", "No pending submissions found.")],
				components: [],
			});
		}

		const sub = subs[0];
		const embed = submissionEmbed(sub, newPage, total);
		const row = buildApproveRejectRow(sub._id, newPage, total, taskId);
		return interaction.editReply({ embeds: [embed], components: [row] });
	} catch {}
}

function buildApproveRejectRow(subId, page, total, taskId) {
	return new ActionRowBuilder().addComponents(
		new ButtonBuilder()
			.setCustomId(`btn:tasks:approve:${subId}`)
			.setLabel("✅  Approve")
			.setStyle(ButtonStyle.Success),
		new ButtonBuilder()
			.setCustomId(`btn:tasks:reject:${subId}`)
			.setLabel("❌  Reject")
			.setStyle(ButtonStyle.Danger),
		new ButtonBuilder()
			.setCustomId(`page:modqueue:prev:${page}:t=${taskId}`)
			.setLabel("◀  Prev")
			.setStyle(ButtonStyle.Secondary)
			.setDisabled(page <= 1),
		new ButtonBuilder()
			.setCustomId(`page:modqueue:next:${page}:t=${taskId}`)
			.setLabel("Next  ▶")
			.setStyle(ButtonStyle.Secondary)
			.setDisabled(page >= total),
	);
}

// ─── Button handler ───────────────────────────────────────────────────────────

async function handleButton(interaction) {
	const id = interaction.customId;

	if (id.startsWith("btn:tasks:view:")) {
		const taskId = id.split(":")[3];
		await interaction.deferReply({ ephemeral: true });
		let ctx;
		try {
			ctx = await resolveContext(interaction);
		} catch {
			return;
		}

		try {
			const res = await ctx.api.get("/api/tasks/", { params: { taskId } });
			// Try direct lookup by fetching task list and filter — or use event-scoped approach
			// Actually try fetching via submission endpoint
			const allRes = await ctx.api.get("/api/tasks/");
			const tasks = allRes.data.tasks ?? allRes.data ?? [];
			const task = tasks.find((t) => t._id === taskId);
			if (!task) throw new Error("Not found");

			const embed = taskDetailEmbed(task);
			const row = new ActionRowBuilder();

			if (task.status === "active") {
				row.addComponents(
					new ButtonBuilder()
						.setCustomId(`btn:tasks:submitmodal:${taskId}`)
						.setLabel("📤  Submit")
						.setStyle(ButtonStyle.Primary),
				);
			}

			return interaction.editReply({
				embeds: [embed],
				components: row.components.length ? [row] : [],
			});
		} catch {
			return interaction.editReply({
				embeds: [errorEmbed("Not Found", "Task not found.")],
			});
		}
	}

	if (id.startsWith("btn:tasks:submitmodal:")) {
		const taskId = id.split(":")[3];
		return interaction.showModal(taskSubmitModal(taskId));
	}

	if (id.startsWith("btn:tasks:approve:")) {
		const subId = id.split(":")[3];
		await interaction.deferUpdate();
		let ctx;
		try {
			ctx = await resolveContext(interaction);
		} catch {
			return;
		}

		if (!["Admin", "Moderator", "Organisation"].includes(ctx.user.role)) {
			return interaction.editReply({
				embeds: [
					errorEmbed(
						"Permission Denied",
						"Only Moderators can review submissions.",
					),
				],
			});
		}

		try {
			const res = await ctx.api.patch(
				`/api/tasks/submissions/${subId}/review`,
				{
					status: "approved",
				},
			);
			const pts = res.data.data?.pointsAwarded;
			return interaction.editReply({
				embeds: [
					successEmbed(
						"Submission Approved",
						pts
							? `User awarded **${formatPoints(pts)}**.`
							: "Submission approved.",
					),
				],
				components: [],
			});
		} catch (err) {
			return interaction.editReply({
				embeds: [
					errorEmbed(
						"Error",
						err.response?.data?.message ?? "Could not approve.",
					),
				],
				components: [],
			});
		}
	}

	if (id.startsWith("btn:tasks:reject:")) {
		const subId = id.split(":")[3];
		return interaction.showModal(rejectReasonModal(subId));
	}
}

// ─── Modal handler ─────────────────────────────────────────────────────────────

async function handleModal(interaction) {
	const id = interaction.customId;

	if (id.startsWith("modal:tasks:create:")) {
		const eventId = id.split(":")[3];
		const title = interaction.fields.getTextInputValue("title").trim();
		const description = interaction.fields
			.getTextInputValue("description")
			.trim();
		const points = parseInt(interaction.fields.getTextInputValue("points"), 10);
		const difficulty = interaction.fields
			.getTextInputValue("difficulty")
			.trim()
			.toLowerCase();

		await interaction.deferReply({ ephemeral: true });
		let ctx;
		try {
			ctx = await resolveContext(interaction);
		} catch {
			return;
		}

		if (!["Admin", "Organisation", "Event Staff"].includes(ctx.user.role)) {
			return interaction.editReply({
				embeds: [
					errorEmbed("Permission Denied", "Only Event Staff can create tasks."),
				],
			});
		}

		if (!["easy", "medium", "hard", "expert"].includes(difficulty)) {
			return interaction.editReply({
				embeds: [
					errorEmbed(
						"Invalid Difficulty",
						"Use one of: easy, medium, hard, expert.",
					),
				],
			});
		}

		try {
			const res = await ctx.api.post("/api/tasks/", {
				eventId,
				title,
				description,
				points: Math.max(1, Math.min(1000, points || 100)),
				difficulty,
				status: "active",
			});
			const task = res.data.data;
			return interaction.editReply({
				embeds: [
					successEmbed(
						"Task Created",
						`**${task.title}** is now live! (${formatPoints(task.points)})\nID: \`${task._id}\``,
					),
				],
			});
		} catch (err) {
			return interaction.editReply({
				embeds: [
					errorEmbed(
						"Error",
						err.response?.data?.message ?? "Could not create task.",
					),
				],
			});
		}
	}

	if (id.startsWith("modal:tasks:submit:")) {
		const taskId = id.split(":")[3];
		const content = interaction.fields.getTextInputValue("content").trim();

		await interaction.deferReply({ ephemeral: true });
		let ctx;
		try {
			ctx = await resolveContext(interaction);
		} catch {
			return;
		}

		try {
			await ctx.api.post(`/api/tasks/${taskId}/submissions`, { content });
			return interaction.editReply({
				embeds: [
					successEmbed(
						"Submission Received",
						"Your submission has been sent for review. You'll earn points once it's approved.",
					),
				],
			});
		} catch (err) {
			return interaction.editReply({
				embeds: [
					errorEmbed(
						"Error",
						err.response?.data?.message ?? "Could not submit.",
					),
				],
			});
		}
	}

	if (id.startsWith("modal:mod:reject:")) {
		const subId = id.split(":")[3];
		const feedback = interaction.fields.getTextInputValue("feedback").trim();

		await interaction.deferReply({ ephemeral: true });
		let ctx;
		try {
			ctx = await resolveContext(interaction);
		} catch {
			return;
		}

		try {
			await ctx.api.patch(`/api/tasks/submissions/${subId}/review`, {
				status: "rejected",
				reviewNotes: feedback,
				feedback,
			});
			return interaction.editReply({
				embeds: [
					successEmbed(
						"Submission Rejected",
						"Feedback has been sent to the submitter.",
					),
				],
			});
		} catch (err) {
			return interaction.editReply({
				embeds: [
					errorEmbed(
						"Error",
						err.response?.data?.message ?? "Could not reject.",
					),
				],
			});
		}
	}
}

// ─── Slash command ────────────────────────────────────────────────────────────

module.exports = {
	data: new SlashCommandBuilder()
		.setName("tasks")
		.setDescription("Browse, submit, and manage tasks")
		.addSubcommand((sub) =>
			sub
				.setName("list")
				.setDescription("List tasks")
				.addStringOption((opt) =>
					opt
						.setName("event")
						.setDescription("Filter by event ID")
						.setRequired(false),
				),
		)
		.addSubcommand((sub) =>
			sub
				.setName("view")
				.setDescription("View a task and submit")
				.addStringOption((opt) =>
					opt.setName("id").setDescription("Task ID").setRequired(true),
				),
		)
		.addSubcommand((sub) =>
			sub
				.setName("create")
				.setDescription("Create a task (Event Staff+)")
				.addStringOption((opt) =>
					opt
						.setName("event")
						.setDescription("Event ID to attach the task to")
						.setRequired(true),
				),
		)
		.addSubcommand((sub) =>
			sub
				.setName("submit")
				.setDescription("Submit a task by ID")
				.addStringOption((opt) =>
					opt.setName("id").setDescription("Task ID").setRequired(true),
				),
		)
		.addSubcommand((sub) =>
			sub
				.setName("review")
				.setDescription("Review pending submissions for a task (Moderator+)")
				.addStringOption((opt) =>
					opt.setName("task").setDescription("Task ID").setRequired(true),
				),
		)
		.addSubcommand((sub) =>
			sub.setName("mine").setDescription("View your submission history"),
		),

	async execute(interaction) {
		const sub = interaction.options.getSubcommand();

		if (sub === "create") {
			const eventId = interaction.options.getString("event");
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
							"Only Event Staff can create tasks.",
						),
					],
					ephemeral: true,
				});
			}
			return interaction.showModal(taskCreateModal(eventId));
		}

		if (sub === "submit") {
			const taskId = interaction.options.getString("id");
			return interaction.showModal(taskSubmitModal(taskId));
		}

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

		if (sub === "list") {
			const eventId = interaction.options.getString("event");
			try {
				const { tasks, totalPages } = await fetchTasksPage(ctx.api, 1, eventId);
				const embed = taskListEmbed(tasks, 1, totalPages);
				const row = buildPageButtons(
					"tasks",
					1,
					totalPages,
					eventId ? `e=${eventId}` : "",
				);

				const components = [row];
				if (tasks.length > 0) {
					const select = new StringSelectMenuBuilder()
						.setCustomId("sel:tasks:view")
						.setPlaceholder("View task details…")
						.addOptions(
							tasks
								.slice(0, 25)
								.map((t) =>
									new StringSelectMenuOptionBuilder()
										.setLabel(t.title.slice(0, 100))
										.setValue(t._id)
										.setDescription(`${t.points} pts • ${t.difficulty}`),
								),
						);
					components.push(new ActionRowBuilder().addComponents(select));
				}

				return interaction.editReply({ embeds: [embed], components });
			} catch {
				return interaction.editReply({
					embeds: [errorEmbed("Error", "Could not load tasks.")],
				});
			}
		}

		if (sub === "view") {
			const taskId = interaction.options.getString("id");
			try {
				const res = await ctx.api.get('/api/tasks/');
				const allTasks = res.data.data ?? [];
				const task = allTasks.find(
					(t) => t._id === taskId || t._id.toString() === taskId,
				);
				if (!task)
					return interaction.editReply({
						embeds: [errorEmbed("Not Found", "Task not found.")],
					});

				const embed = taskDetailEmbed(task);
				const components = [];

				if (task.status === "active") {
					components.push(
						new ActionRowBuilder().addComponents(
							new ButtonBuilder()
								.setCustomId(`btn:tasks:submitmodal:${taskId}`)
								.setLabel("📤  Submit This Task")
								.setStyle(ButtonStyle.Primary),
						),
					);
				}

				return interaction.editReply({ embeds: [embed], components });
			} catch {
				return interaction.editReply({
					embeds: [errorEmbed("Error", "Could not load task.")],
				});
			}
		}

		if (sub === "review") {
			if (!["Admin", "Moderator", "Organisation"].includes(ctx.user.role)) {
				return interaction.editReply({
					embeds: [
						errorEmbed(
							"Permission Denied",
							"Only Moderators can review submissions.",
						),
					],
				});
			}

			const taskId = interaction.options.getString("task");
			try {
				const res = await ctx.api.get(`/api/tasks/${taskId}/submissions`, {
					params: { page: 1, limit: 1, status: "pending" },
				});
				const subs = res.data.data ?? [];
				const total = subs.length;

				if (!subs.length) {
					return interaction.editReply({
						embeds: [
							infoEmbed(
								"No Pending Submissions",
								"All caught up! No submissions waiting for review.",
							),
						],
					});
				}

				const sub0 = subs[0];
				const embed = submissionEmbed(sub0, 1, total);
				const row = buildApproveRejectRow(sub0._id, 1, total, taskId);
				return interaction.editReply({ embeds: [embed], components: [row] });
			} catch (err) {
				return interaction.editReply({
					embeds: [
						errorEmbed(
							"Error",
							err.response?.data?.message ?? "Could not load submissions.",
						),
					],
				});
			}
		}

		if (sub === "mine") {
			try {
				const res = await ctx.api.get("/api/tasks/submissions/me");
				const subs = res.data.data ?? [];
				const {
					formatStatus,
					relativeTime,
					truncate,
				} = require("../utils/formatters");
				const { EmbedBuilder } = require("discord.js");
				const rows = subs
					.slice(0, 10)
					.map((s) => {
						return `${formatStatus(s.status)}  **${truncate(s.task?.title ?? "Task", 40)}**  ·  *${relativeTime(s.createdAt)}*`;
					})
					.join("\n");

				const embed = new EmbedBuilder()
					.setColor(0x4ecdc4)
					.setTitle("📬  My Submissions")
					.setDescription(rows || "*No submissions yet.*")
					.setFooter({ text: "Gamify Bot" })
					.setTimestamp();

				return interaction.editReply({ embeds: [embed] });
			} catch {
				return interaction.editReply({
					embeds: [errorEmbed("Error", "Could not load your submissions.")],
				});
			}
		}
	},

	handleButton,
	handleModal,
	handlePageButton,
	handleSubmissionPageButton,

	async handleSelectMenu(interaction) {
		if (interaction.customId !== "sel:tasks:view") return;
		const taskId = interaction.values[0];
		await interaction.deferReply({ ephemeral: true });
		let ctx;
		try {
			ctx = await resolveContext(interaction);
		} catch {
			return;
		}

		try {
			const res = await ctx.api.get('/api/tasks/');
			const allTasks = res.data.data ?? [];
			const task = allTasks.find((t) => t._id === taskId);
			if (!task)
				return interaction.editReply({
					embeds: [errorEmbed("Not Found", "Task not found.")],
				});

			const embed = taskDetailEmbed(task);
			const components = [];

			if (task.status === "active") {
				components.push(
					new ActionRowBuilder().addComponents(
						new ButtonBuilder()
							.setCustomId(`btn:tasks:submitmodal:${taskId}`)
							.setLabel("📤  Submit This Task")
							.setStyle(ButtonStyle.Primary),
					),
				);
			}

			return interaction.editReply({ embeds: [embed], components });
		} catch {
			return interaction.editReply({
				embeds: [errorEmbed("Error", "Could not load task.")],
			});
		}
	},
};
