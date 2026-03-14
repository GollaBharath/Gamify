"use strict";

const {
	SlashCommandBuilder,
	PermissionFlagsBits,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	RoleSelectMenuBuilder,
	ChannelSelectMenuBuilder,
	ChannelType,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
} = require("discord.js");

const { botAxios, invalidateGuildCache } = require("../apiClient");
const wizardState = require("../wizardState");
const {
	successEmbed,
	errorEmbed,
	infoEmbed,
	configEmbed,
	COLORS,
} = require("../utils/embeds");
const { EmbedBuilder } = require("discord.js");
const { orgNameModal } = require("../utils/modals");

// ─── Shared helpers ─────────────────────────────────────────────────────────

function wizardEmbed(title, description, step, total) {
	return new EmbedBuilder()
		.setColor(COLORS.primary)
		.setTitle(`🔧  Setup Wizard  •  Step ${step}/${total}`)
		.setDescription(`### ${title}\n\n${description}`)
		.setFooter({ text: "Gamify Bot  •  Session expires in 5 minutes" })
		.setTimestamp();
}

function cancelBtn() {
	return new ButtonBuilder()
		.setCustomId("btn:setup:cancel")
		.setLabel("Cancel")
		.setStyle(ButtonStyle.Danger);
}

function skipBtn(id) {
	return new ButtonBuilder()
		.setCustomId(`btn:setup:skip:${id}`)
		.setLabel("Skip (none)")
		.setStyle(ButtonStyle.Secondary);
}

// ─── Step renderers ──────────────────────────────────────────────────────────

async function showOrgStep(interaction, isFollowUp = false) {
	const embed = wizardEmbed(
		"Organization",
		"First, give your Gamify organization a name. All members and data in this server will be grouped under it.\n\nPress **Set Name** to open the form.",
		1,
		4,
	);

	const row = new ActionRowBuilder().addComponents(
		new ButtonBuilder()
			.setCustomId("btn:setup:orgnamemodal")
			.setLabel("📝  Set Name")
			.setStyle(ButtonStyle.Primary),
		cancelBtn(),
	);

	const payload = { embeds: [embed], components: [row], ephemeral: true };
	if (isFollowUp) return interaction.followUp(payload);
	return interaction.reply(payload);
}

async function showAdminRolesStep(interaction) {
	const embed = wizardEmbed(
		"Admin Roles",
		"Select which Discord roles should have **Admin** access in Gamify.\nAdmins can manage users, events, tasks, shop, and points.\n\n*You can select multiple roles.*",
		2,
		4,
	);

	const select = new RoleSelectMenuBuilder()
		.setCustomId("sel:setup:adminroles")
		.setPlaceholder("Select Admin role(s)…")
		.setMinValues(0)
		.setMaxValues(10);

	const row1 = new ActionRowBuilder().addComponents(select);
	const row2 = new ActionRowBuilder().addComponents(
		skipBtn("adminroles"),
		cancelBtn(),
	);

	return interaction.update({ embeds: [embed], components: [row1, row2] });
}

async function showModRolesStep(interaction) {
	const embed = wizardEmbed(
		"Moderator Roles",
		"Select which Discord roles should be **Moderators**.\nModerators can award points and review task submissions.\n\n*You can select multiple roles.*",
		3,
		4,
	);

	const select = new RoleSelectMenuBuilder()
		.setCustomId("sel:setup:modroles")
		.setPlaceholder("Select Moderator role(s)…")
		.setMinValues(0)
		.setMaxValues(10);

	const row1 = new ActionRowBuilder().addComponents(select);
	const row2 = new ActionRowBuilder().addComponents(
		skipBtn("modroles"),
		cancelBtn(),
	);

	return interaction.update({ embeds: [embed], components: [row1, row2] });
}

async function showStaffRolesStep(interaction) {
	const embed = wizardEmbed(
		"Event Staff Roles",
		"Select which Discord roles should be **Event Staff**.\nEvent Staff can create and manage tasks.\n\n*You can select multiple roles.*",
		4,
		4,
	);

	const select = new RoleSelectMenuBuilder()
		.setCustomId("sel:setup:staffroles")
		.setPlaceholder("Select Event Staff role(s)…")
		.setMinValues(0)
		.setMaxValues(10);

	const row1 = new ActionRowBuilder().addComponents(select);
	const row2 = new ActionRowBuilder().addComponents(
		skipBtn("staffroles"),
		cancelBtn(),
	);

	return interaction.update({ embeds: [embed], components: [row1, row2] });
}

async function showChannelStep(interaction) {
	const embed = new EmbedBuilder()
		.setColor(COLORS.primary)
		.setTitle("🔧  Setup Wizard  •  Final Step")
		.setDescription(
			"### Announcement Channel\n\nPick a channel where Gamify will post announcements (e.g. new events, leaderboard resets).\n\n*This is optional — press Skip to finish without one.*",
		)
		.setFooter({ text: "Gamify Bot  •  Session expires in 5 minutes" })
		.setTimestamp();

	const select = new ChannelSelectMenuBuilder()
		.setCustomId("sel:setup:channel")
		.setPlaceholder("Select a channel…")
		.addChannelTypes(ChannelType.GuildText)
		.setMinValues(0)
		.setMaxValues(1);

	const row1 = new ActionRowBuilder().addComponents(select);
	const row2 = new ActionRowBuilder().addComponents(
		skipBtn("channel"),
		cancelBtn(),
	);

	return interaction.update({ embeds: [embed], components: [row1, row2] });
}

async function showConfirmStep(interaction, state) {
	const adminRoles =
		state.adminRoles?.map((id) => `<@&${id}>`).join(" ") || "*None*";
	const modRoles =
		state.modRoles?.map((id) => `<@&${id}>`).join(" ") || "*None*";
	const staffRoles =
		state.staffRoles?.map((id) => `<@&${id}>`).join(" ") || "*None*";
	const channel = state.channelId ? `<#${state.channelId}>` : "*None*";

	const embed = new EmbedBuilder()
		.setColor(COLORS.success)
		.setTitle("🔧  Setup Wizard  •  Confirm")
		.setDescription("Review your configuration and click **Confirm** to save.")
		.addFields(
			{ name: "🏢 Organization", value: state.orgName, inline: true },
			{ name: "📢 Channel", value: channel, inline: true },
			{ name: "🛡️ Admin Roles", value: adminRoles, inline: false },
			{ name: "⚔️ Moderator Roles", value: modRoles, inline: false },
			{ name: "🎪 Event Staff Roles", value: staffRoles, inline: false },
		)
		.setFooter({ text: "Gamify Bot" })
		.setTimestamp();

	const row = new ActionRowBuilder().addComponents(
		new ButtonBuilder()
			.setCustomId("btn:setup:confirm")
			.setLabel("✓  Confirm & Save")
			.setStyle(ButtonStyle.Success),
		cancelBtn(),
	);

	return interaction.update({ embeds: [embed], components: [row] });
}

// ─── Save to backend ─────────────────────────────────────────────────────────

async function saveSetup(interaction, state) {
	await interaction.deferUpdate();

	try {
		await botAxios.post("/api/discord/guilds", {
			guildId: interaction.guildId,
			guildName: interaction.guild.name,
			organizationId: null, // backend will find-or-create by name
			roleMapping: {
				admin: state.adminRoles ?? [],
				moderator: state.modRoles ?? [],
				eventStaff: state.staffRoles ?? [],
			},
			settings: {
				announcementChannelId: state.channelId ?? null,
				autoRegister: true,
			},
		});

		invalidateGuildCache(interaction.guildId);
		wizardState.remove(interaction.user.id, interaction.guildId);

		const embed = successEmbed(
			"Setup Complete!",
			`Gamify is now configured for **${interaction.guild.name}**.\n\nAll members can now use bot commands. Use \`/help\` to explore everything.\nRun \`/config view\` any time to review or update settings.`,
		);

		return interaction.editReply({ embeds: [embed], components: [] });
	} catch (err) {
		console.error("Setup save error:", err.response?.data ?? err.message);
		const embed = errorEmbed(
			"Setup Failed",
			"Could not save configuration. Check that the backend is running and `BOT_API_KEY` is set correctly.",
		);
		return interaction.editReply({ embeds: [embed], components: [] });
	}
}

// ─── Interaction routing (exported for interactionCreate handler) ────────────

async function handleButton(interaction) {
	const id = interaction.customId;

	if (id === "btn:setup:cancel") {
		wizardState.remove(interaction.user.id, interaction.guildId);
		return interaction.update({
			embeds: [
				infoEmbed("Setup Cancelled", "You can run `/setup` again any time."),
			],
			components: [],
		});
	}

	if (id === "btn:setup:orgnamemodal") {
		return interaction.showModal(orgNameModal());
	}

	if (id === "btn:setup:skip:adminroles") {
		const state =
			wizardState.get(interaction.user.id, interaction.guildId) ?? {};
		wizardState.set(interaction.user.id, interaction.guildId, {
			...state,
			adminRoles: [],
		});
		return showModRolesStep(interaction);
	}

	if (id === "btn:setup:skip:modroles") {
		const state =
			wizardState.get(interaction.user.id, interaction.guildId) ?? {};
		wizardState.set(interaction.user.id, interaction.guildId, {
			...state,
			modRoles: [],
		});
		return showStaffRolesStep(interaction);
	}

	if (id === "btn:setup:skip:staffroles") {
		const state =
			wizardState.get(interaction.user.id, interaction.guildId) ?? {};
		wizardState.set(interaction.user.id, interaction.guildId, {
			...state,
			staffRoles: [],
		});
		return showChannelStep(interaction);
	}

	if (id === "btn:setup:skip:channel") {
		const state =
			wizardState.get(interaction.user.id, interaction.guildId) ?? {};
		wizardState.set(interaction.user.id, interaction.guildId, {
			...state,
			channelId: null,
		});
		return showConfirmStep(interaction, { ...state, channelId: null });
	}

	if (id === "btn:setup:confirm") {
		const state = wizardState.get(interaction.user.id, interaction.guildId);
		if (!state) {
			return interaction.update({
				embeds: [errorEmbed("Session Expired", "Run `/setup` again.")],
				components: [],
			});
		}
		return saveSetup(interaction, state);
	}
}

async function handleModal(interaction) {
	if (interaction.customId === "modal:setup:orgname") {
		const orgName = interaction.fields.getTextInputValue("orgName").trim();
		const state =
			wizardState.get(interaction.user.id, interaction.guildId) ?? {};
		wizardState.set(interaction.user.id, interaction.guildId, {
			...state,
			orgName,
		});

		// Defer update so we can edit the original setup message
		await interaction.deferUpdate();

		const originalInteraction = state._originalInteraction;
		if (originalInteraction) {
			// Edit the original ephemeral reply to show next step
			await originalInteraction.editReply(
				await _buildAdminRolesPayload(interaction),
			);
		}
	}
}

async function _buildAdminRolesPayload(interaction) {
	const embed = wizardEmbed(
		"Admin Roles",
		"Select which Discord roles should have **Admin** access in Gamify.\n\n*You can select multiple roles.*",
		2,
		4,
	);

	const select = new RoleSelectMenuBuilder()
		.setCustomId("sel:setup:adminroles")
		.setPlaceholder("Select Admin role(s)…")
		.setMinValues(0)
		.setMaxValues(10);

	return {
		embeds: [embed],
		components: [
			new ActionRowBuilder().addComponents(select),
			new ActionRowBuilder().addComponents(skipBtn("adminroles"), cancelBtn()),
		],
	};
}

async function handleSelectMenu(interaction) {
	const id = interaction.customId;
	const state = wizardState.get(interaction.user.id, interaction.guildId) ?? {};

	if (id === "sel:setup:adminroles") {
		const roles = [...interaction.values];
		wizardState.set(interaction.user.id, interaction.guildId, {
			...state,
			adminRoles: roles,
		});
		return showModRolesStep(interaction);
	}

	if (id === "sel:setup:modroles") {
		const roles = [...interaction.values];
		wizardState.set(interaction.user.id, interaction.guildId, {
			...state,
			modRoles: roles,
		});
		return showStaffRolesStep(interaction);
	}

	if (id === "sel:setup:staffroles") {
		const roles = [...interaction.values];
		wizardState.set(interaction.user.id, interaction.guildId, {
			...state,
			staffRoles: roles,
		});
		return showChannelStep(interaction);
	}

	if (id === "sel:setup:channel") {
		const channelId = interaction.values[0] ?? null;
		const updated = { ...state, channelId };
		wizardState.set(interaction.user.id, interaction.guildId, updated);
		return showConfirmStep(interaction, updated);
	}
}

// ─── Slash command definition ─────────────────────────────────────────────────

module.exports = {
	data: new SlashCommandBuilder()
		.setName("setup")
		.setDescription("Configure Gamify for this Discord server")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	async execute(interaction) {
		if (!interaction.memberPermissions.has(PermissionFlagsBits.Administrator)) {
			return interaction.reply({
				embeds: [
					errorEmbed(
						"Permission Denied",
						"Only server Administrators can run `/setup`.",
					),
				],
				ephemeral: true,
			});
		}

		// Initialise wizard state
		wizardState.set(interaction.user.id, interaction.guildId, {
			step: "orgname",
			orgName: interaction.guild.name,
			_originalInteraction: interaction,
		});

		await showOrgStep(interaction);
	},

	// These are called by interactionCreate handler
	handleButton,
	handleModal,
	handleSelectMenu,
};
