"use strict";

const { SlashCommandBuilder } = require("discord.js");
const { resolveContext } = require("../apiClient");
const { leaderboardEmbed, errorEmbed, infoEmbed } = require("../utils/embeds");
const { formatPoints } = require("../utils/formatters");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("leaderboard")
		.setDescription("Show the top members by points"),

	async execute(interaction) {
		await interaction.deferReply();

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

		try {
			const res = await ctx.api.get("/api/leaderboard/?limit=10");
			const users = res.data.data ?? [];

			// Find caller's rank
			let callerRank = null;
			const callerIdx = users.findIndex(
				(u) => String(u._id) === String(ctx.user.id),
			);
			if (callerIdx !== -1) {
				callerRank = { rank: callerIdx + 1, points: users[callerIdx].points };
			}

			const embed = leaderboardEmbed(users, callerRank);
			return interaction.editReply({ embeds: [embed] });
		} catch (err) {
			console.error("leaderboard error:", err.response?.data ?? err.message);
			return interaction.editReply({
				embeds: [errorEmbed("Error", "Could not fetch the leaderboard.")],
			});
		}
	},
};
