"use strict";

const {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} = require("discord.js");
const { COLORS } = require("../utils/embeds");

module.exports = {
	name: "guildCreate",

	async execute(guild) {
		console.log(`[Gamify Bot] Joined guild: ${guild.name} (${guild.id})`);

		// Try to find a suitable channel to send the welcome message
		const channel =
			guild.systemChannel ??
			guild.channels.cache
				.filter(
					(c) =>
						c.isTextBased() &&
						c.permissionsFor(guild.members.me)?.has("SendMessages"),
				)
				.sort((a, b) => a.position - b.position)
				.first();

		if (!channel) return;

		const embed = new EmbedBuilder()
			.setColor(COLORS.primary)
			.setTitle("👋  Thanks for adding Gamify Bot!")
			.setDescription(
				"Gamify turns your Discord server into a gamified community — award points, host events, " +
					"run challenges, and manage a rewards shop, all from Discord.\n\n" +
					"**Get started in 3 steps:**\n" +
					"1. Run `/setup` to link this server to a Gamify organization\n" +
					"2. Map your Discord roles to Gamify roles (Admin, Moderator, Event Staff)\n" +
					"3. Use `/help` to explore all available commands\n\n" +
					"*Everything stays in sync with the Gamify web dashboard automatically.*",
			)
			.setFooter({ text: "Gamify Bot  •  Run /setup to get started" })
			.setTimestamp();

		const row = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setLabel("📖  View Docs")
				.setStyle(ButtonStyle.Link)
				.setURL("https://github.com/your-org/Gamify"),
		);

		try {
			await channel.send({ embeds: [embed], components: [row] });
		} catch (err) {
			console.warn(
				`[Gamify Bot] Could not send welcome message to ${guild.name}:`,
				err.message,
			);
		}
	},
};
