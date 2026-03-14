"use strict";

const { SlashCommandBuilder } = require("discord.js");
const { resolveContext } = require("../apiClient");
const { profileEmbed, errorEmbed, infoEmbed } = require("../utils/embeds");
const {
	formatRole,
	formatPoints,
	levelProgress,
	formatDate,
	formatNumber,
} = require("../utils/formatters");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("profile")
		.setDescription("View a Gamify profile")
		.addUserOption((opt) =>
			opt
				.setName("user")
				.setDescription("Discord user to look up (defaults to yourself)")
				.setRequired(false),
		),

	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });

		let ctx;
		try {
			ctx = await resolveContext(interaction);
		} catch (err) {
			if (err.code === "not_configured") {
				return interaction.editReply({
					embeds: [
						infoEmbed(
							"Not Configured",
							"Run `/setup` to configure Gamify for this server.",
						),
					],
				});
			}
			throw err;
		}

		const targetDiscordUser = interaction.options.getUser("user");
		const isSelf =
			!targetDiscordUser || targetDiscordUser.id === interaction.user.id;

		let gamifyUser;
		if (isSelf) {
			// Fetch our own full profile
			try {
				const res = await ctx.api.get("/api/users/profile");
				gamifyUser = res.data.user ?? res.data;
			} catch {
				return interaction.editReply({
					embeds: [errorEmbed("Error", "Could not fetch your profile.")],
				});
			}
		} else {
			// Look up another Discord user's Gamify account
			try {
				// Authenticate target to ensure they are registered
				const { botAxios } = require("../apiClient");
				const memberRoleIds = interaction.guild.members.cache.get(
					targetDiscordUser.id,
				)
					? [
							...interaction.guild.members.cache
								.get(targetDiscordUser.id)
								.roles.cache.keys(),
						]
					: [];

				const authRes = await botAxios.post("/api/discord/auth", {
					discordId: targetDiscordUser.id,
					discordUsername: targetDiscordUser.username,
					guildId: interaction.guildId,
					memberRoleIds,
				});

				const targetToken = authRes.data.token;
				const { userAxios } = require("../apiClient");
				const targetApi = userAxios(targetToken);
				const profileRes = await targetApi.get("/api/users/profile");
				gamifyUser = profileRes.data.user ?? profileRes.data;
			} catch {
				return interaction.editReply({
					embeds: [
						infoEmbed(
							"Not Found",
							`<@${targetDiscordUser.id}> doesn't have a Gamify account yet.`,
						),
					],
				});
			}
		}

		const discordMember = isSelf
			? interaction.member
			: interaction.guild.members.cache.get(targetDiscordUser?.id);

		const embed = profileEmbed(gamifyUser, discordMember);
		return interaction.editReply({ embeds: [embed] });
	},
};
