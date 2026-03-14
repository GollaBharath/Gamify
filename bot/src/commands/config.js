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
} = require("discord.js");

const {
	botAxios,
	invalidateGuildCache,
	getGuildConfig,
} = require("../apiClient");
const { resolveContext } = require("../apiClient");
const {
	configEmbed,
	successEmbed,
	errorEmbed,
	infoEmbed,
	COLORS,
} = require("../utils/embeds");
const { welcomeMessageModal } = require("../utils/modals");
const { EmbedBuilder } = require("discord.js");

// ─── Config view ─────────────────────────────────────────────────────────────

async function showConfig(interaction, guildConfig) {
	const embed = configEmbed(guildConfig, interaction.guild);

	const row = new ActionRowBuilder().addComponents(
		new ButtonBuilder()
			.setCustomId("btn:config:editroles")
			.setLabel("🔧 Edit Role Mapping")
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId("btn:config:editchannel")
			.setLabel("📢 Change Channel")
			.setStyle(ButtonStyle.Secondary),
		new ButtonBuilder()
			.setCustomId("btn:config:editwelcome")
			.setLabel("✉️ Welcome Message")
			.setStyle(ButtonStyle.Secondary),
		new ButtonBuilder()
			.setCustomId("btn:config:toggleauto")
			.setLabel(
				guildConfig.settings?.autoRegister
					? "🚫 Disable Auto-Register"
					: "✅ Enable Auto-Register",
			)
			.setStyle(ButtonStyle.Secondary),
	);

	return { embeds: [embed], components: [row], ephemeral: true };
}

// ─── Role edit flow ───────────────────────────────────────────────────────────

function roleEditEmbeds(step) {
	const titles = {
		admin: "Admin Roles",
		mod: "Moderator Roles",
		staff: "Event Staff Roles",
	};
	const descs = {
		admin: "Select Discord roles that map to **Admin** in Gamify.",
		mod: "Select Discord roles that map to **Moderator** in Gamify.",
		staff: "Select Discord roles that map to **Event Staff** in Gamify.",
	};
	return new EmbedBuilder()
		.setColor(COLORS.primary)
		.setTitle(`⚙️  Edit Role Mapping — ${titles[step]}`)
		.setDescription(descs[step])
		.setFooter({ text: "Gamify Bot" })
		.setTimestamp();
}

// ─── Button handler ───────────────────────────────────────────────────────────

async function handleButton(interaction) {
	const id = interaction.customId;

	if (id === "btn:config:editroles") {
		const embed = roleEditEmbeds("admin");
		const select = new RoleSelectMenuBuilder()
			.setCustomId("sel:config:adminroles")
			.setPlaceholder("Select Admin role(s)")
			.setMinValues(0)
			.setMaxValues(10);
		return interaction.update({
			embeds: [embed],
			components: [new ActionRowBuilder().addComponents(select)],
		});
	}

	if (id === "btn:config:editchannel") {
		const embed = new EmbedBuilder()
			.setColor(COLORS.info)
			.setTitle("⚙️  Announcement Channel")
			.setDescription("Select a text channel for Gamify announcements.")
			.setFooter({ text: "Gamify Bot" });

		const select = new ChannelSelectMenuBuilder()
			.setCustomId("sel:config:channel")
			.setPlaceholder("Select a channel…")
			.addChannelTypes(ChannelType.GuildText)
			.setMinValues(1)
			.setMaxValues(1);

		return interaction.update({
			embeds: [embed],
			components: [new ActionRowBuilder().addComponents(select)],
		});
	}

	if (id === "btn:config:editwelcome") {
		let current = "";
		try {
			const cfg = await getGuildConfig(interaction.guildId);
			current = cfg.settings?.welcomeMessage ?? "";
		} catch (_) {}
		return interaction.showModal(welcomeMessageModal(current));
	}

	if (id === "btn:config:toggleauto") {
		try {
			let cfg = await getGuildConfig(interaction.guildId);
			const newVal = !cfg.settings?.autoRegister;
			await botAxios.patch(`/api/discord/guilds/${interaction.guildId}`, {
				"settings.autoRegister": newVal,
			});
			invalidateGuildCache(interaction.guildId);
			cfg = await getGuildConfig(interaction.guildId);
			const payload = await showConfig(interaction, cfg);
			return interaction.update(payload);
		} catch (err) {
			return interaction.update({
				embeds: [
					errorEmbed("Error", "Could not update auto-register setting."),
				],
				components: [],
			});
		}
	}
}

// ─── Select menu handler ───────────────────────────────────────────────────────

async function handleSelectMenu(interaction) {
	const id = interaction.customId;
	await interaction.deferUpdate();

	try {
		if (id === "sel:config:adminroles") {
			const adminRoles = [...interaction.values];
			// Show mod roles step
			const embed = roleEditEmbeds("mod");
			const select = new RoleSelectMenuBuilder()
				.setCustomId(`sel:config:modroles:${adminRoles.join(",")}`)
				.setPlaceholder("Select Moderator role(s)")
				.setMinValues(0)
				.setMaxValues(10);
			return interaction.editReply({
				embeds: [embed],
				components: [new ActionRowBuilder().addComponents(select)],
			});
		}

		if (id.startsWith("sel:config:modroles:")) {
			const adminRoles = id.split(":")[3]?.split(",").filter(Boolean) ?? [];
			const modRoles = [...interaction.values];

			// Show staff roles step
			const embed = roleEditEmbeds("staff");
			const encoded = `${adminRoles.join(",")};${modRoles.join(",")}`;
			const select = new RoleSelectMenuBuilder()
				.setCustomId(`sel:config:staffroles:${encoded}`)
				.setPlaceholder("Select Event Staff role(s)")
				.setMinValues(0)
				.setMaxValues(10);
			return interaction.editReply({
				embeds: [embed],
				components: [new ActionRowBuilder().addComponents(select)],
			});
		}

		if (id.startsWith("sel:config:staffroles:")) {
			const encoded = id.slice("sel:config:staffroles:".length);
			const [adminPart, modPart] = encoded.split(";");
			const adminRoles = adminPart?.split(",").filter(Boolean) ?? [];
			const modRoles = modPart?.split(",").filter(Boolean) ?? [];
			const staffRoles = [...interaction.values];

			await botAxios.patch(`/api/discord/guilds/${interaction.guildId}`, {
				roleMapping: {
					admin: adminRoles,
					moderator: modRoles,
					eventStaff: staffRoles,
				},
			});
			invalidateGuildCache(interaction.guildId);

			const cfg = await getGuildConfig(interaction.guildId);
			const payload = await showConfig(interaction, cfg);
			return interaction.editReply(payload);
		}

		if (id === "sel:config:channel") {
			const channelId = interaction.values[0];
			await botAxios.patch(`/api/discord/guilds/${interaction.guildId}`, {
				"settings.announcementChannelId": channelId,
			});
			invalidateGuildCache(interaction.guildId);

			const cfg = await getGuildConfig(interaction.guildId);
			const payload = await showConfig(interaction, cfg);
			return interaction.editReply(payload);
		}
	} catch (err) {
		console.error(
			"config selectMenu error:",
			err.response?.data ?? err.message,
		);
		return interaction.editReply({
			embeds: [errorEmbed("Error", "Could not update configuration.")],
			components: [],
		});
	}
}

// ─── Modal handler ─────────────────────────────────────────────────────────────

async function handleModal(interaction) {
	if (interaction.customId === "modal:config:welcome") {
		const message = interaction.fields
			.getTextInputValue("welcomeMessage")
			.trim();
		await interaction.deferUpdate();
		try {
			await botAxios.patch(`/api/discord/guilds/${interaction.guildId}`, {
				"settings.welcomeMessage": message,
			});
			invalidateGuildCache(interaction.guildId);
			const cfg = await getGuildConfig(interaction.guildId);
			const payload = await showConfig(interaction, cfg);
			return interaction.editReply(payload);
		} catch (err) {
			return interaction.editReply({
				embeds: [errorEmbed("Error", "Could not update welcome message.")],
				components: [],
			});
		}
	}
}

// ─── Slash command ────────────────────────────────────────────────────────────

module.exports = {
	data: new SlashCommandBuilder()
		.setName("config")
		.setDescription("View or update Gamify server configuration")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	async execute(interaction) {
		if (!interaction.memberPermissions.has(PermissionFlagsBits.Administrator)) {
			return interaction.reply({
				embeds: [
					errorEmbed(
						"Permission Denied",
						"Only Administrators can use `/config`.",
					),
				],
				ephemeral: true,
			});
		}

		await interaction.deferReply({ ephemeral: true });

		let guildConfig;
		try {
			guildConfig = await getGuildConfig(interaction.guildId);
		} catch (err) {
			if (err.response?.status === 404) {
				return interaction.editReply({
					embeds: [
						infoEmbed(
							"Not Configured",
							"This server has not been set up yet. Run `/setup` to get started.",
						),
					],
					components: [],
				});
			}
			return interaction.editReply({
				embeds: [errorEmbed("Error", "Could not fetch configuration.")],
				components: [],
			});
		}

		const payload = await showConfig(interaction, guildConfig);
		return interaction.editReply(payload);
	},

	handleButton,
	handleModal,
	handleSelectMenu,
};
