"use strict";

const { parsePaginationId } = require("../utils/pagination");
const { errorEmbed } = require("../utils/embeds");

// Load all command modules once
let commandModules;
function getModules(client) {
	if (commandModules) return commandModules;
	commandModules = {};
	client.commands.forEach((cmd, name) => {
		commandModules[name] = cmd;
	});
	return commandModules;
}

module.exports = {
	name: "interactionCreate",

	async execute(interaction) {
		const mods = getModules(interaction.client);

		// ── Slash commands ──────────────────────────────────────────────────────
		if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);
			if (!command) return;

			try {
				await command.execute(interaction);
			} catch (err) {
				console.error(`Command /${interaction.commandName} error:`, err);
				const payload = {
					embeds: [
						errorEmbed(
							"Something went wrong",
							err.message?.slice(0, 200) ?? "Unknown error.",
						),
					],
					ephemeral: true,
				};
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp(payload).catch(() => {});
				} else {
					await interaction.reply(payload).catch(() => {});
				}
			}
			return;
		}

		// ── Button interactions ─────────────────────────────────────────────────
		if (interaction.isButton()) {
			const id = interaction.customId;

			// Pagination buttons (shared across commands)
			if (id.startsWith("page:")) {
				const parsed = parsePaginationId(id);
				if (!parsed) return;

				// Route to the right command's pagination handler
				const handlers = [
					mods.events,
					mods.tasks,
					mods.shop,
					mods.points,
					mods.mod,
				];

				for (const mod of handlers) {
					if (mod?.handlePageButton) {
						const handled = await mod
							.handlePageButton(interaction, parsed)
							.catch((e) => {
								console.error("Pagination handler error:", e);
							});
						if (handled !== false) return;
					}
					if (mod?.handleSubmissionPageButton) {
						const handled = await mod
							.handleSubmissionPageButton(interaction, parsed)
							.catch(() => {});
						if (handled !== false) return;
					}
				}
				return;
			}

			// Setup wizard buttons
			if (id.startsWith("btn:setup:")) {
				return mods.setup
					?.handleButton?.(interaction)
					.catch(safeErr(interaction));
			}

			// Config buttons
			if (id.startsWith("btn:config:")) {
				return mods.config
					?.handleButton?.(interaction)
					.catch(safeErr(interaction));
			}

			// Points buttons
			if (id.startsWith("btn:points:")) {
				return mods.points
					?.handleButton?.(interaction)
					.catch(safeErr(interaction));
			}

			// Events buttons
			if (id.startsWith("btn:events:")) {
				return mods.events
					?.handleButton?.(interaction)
					.catch(safeErr(interaction));
			}

			// Tasks buttons
			if (id.startsWith("btn:tasks:")) {
				return mods.tasks
					?.handleButton?.(interaction)
					.catch(safeErr(interaction));
			}

			// Shop buttons
			if (id.startsWith("btn:shop:")) {
				return mods.shop
					?.handleButton?.(interaction)
					.catch(safeErr(interaction));
			}

			// Admin buttons
			if (id.startsWith("btn:admin:")) {
				return mods.admin
					?.handleButton?.(interaction)
					.catch(safeErr(interaction));
			}

			return;
		}

		// ── Select menus ────────────────────────────────────────────────────────
		if (interaction.isAnySelectMenu()) {
			const id = interaction.customId;

			if (id.startsWith("sel:setup:")) {
				return mods.setup
					?.handleSelectMenu?.(interaction)
					.catch(safeErr(interaction));
			}
			if (id.startsWith("sel:config:")) {
				return mods.config
					?.handleSelectMenu?.(interaction)
					.catch(safeErr(interaction));
			}
			if (id.startsWith("sel:events:")) {
				return mods.events
					?.handleSelectMenu?.(interaction)
					.catch(safeErr(interaction));
			}
			if (id.startsWith("sel:tasks:")) {
				return mods.tasks
					?.handleSelectMenu?.(interaction)
					.catch(safeErr(interaction));
			}
			if (id.startsWith("sel:shop:")) {
				return mods.shop
					?.handleSelectMenu?.(interaction)
					.catch(safeErr(interaction));
			}
			return;
		}

		// ── Modals ──────────────────────────────────────────────────────────────
		if (interaction.isModalSubmit()) {
			const id = interaction.customId;

			if (id.startsWith("modal:setup:")) {
				return mods.setup
					?.handleModal?.(interaction)
					.catch(safeErr(interaction));
			}
			if (id.startsWith("modal:config:")) {
				return mods.config
					?.handleModal?.(interaction)
					.catch(safeErr(interaction));
			}
			if (id.startsWith("modal:events:")) {
				return mods.events
					?.handleModal?.(interaction)
					.catch(safeErr(interaction));
			}
			if (id.startsWith("modal:tasks:") || id.startsWith("modal:mod:reject:")) {
				return mods.tasks
					?.handleModal?.(interaction)
					.catch(safeErr(interaction));
			}
			if (id.startsWith("modal:points:")) {
				return mods.points
					?.handleModal?.(interaction)
					.catch(safeErr(interaction));
			}
			if (id.startsWith("modal:shop:")) {
				return mods.shop
					?.handleModal?.(interaction)
					.catch(safeErr(interaction));
			}
			if (id.startsWith("modal:admin:")) {
				return mods.admin
					?.handleModal?.(interaction)
					.catch(safeErr(interaction));
			}
			return;
		}
	},
};

function safeErr(interaction) {
	return async (err) => {
		console.error("Interaction handler error:", err);
		const payload = {
			embeds: [
				errorEmbed(
					"Error",
					err.message?.slice(0, 200) ?? "Something went wrong.",
				),
			],
			ephemeral: true,
		};
		try {
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp(payload);
			} else {
				await interaction.reply(payload);
			}
		} catch (_) {}
	};
}
