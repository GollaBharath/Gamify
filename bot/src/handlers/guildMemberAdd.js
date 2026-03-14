"use strict";

const { botAxios, getGuildConfig } = require("../apiClient");

module.exports = {
	name: "guildMemberAdd",

	async execute(member) {
		const { guild, user } = member;

		// Fetch guild config. If not set up, skip silently.
		let guildConfig;
		try {
			guildConfig = await getGuildConfig(guild.id);
		} catch {
			return; // Guild not configured yet
		}

		if (!guildConfig.settings?.autoRegister) return;

		// Auto-register the new member by calling the Discord auth endpoint.
		// This creates their Gamify account if it doesn't exist yet.
		try {
			const memberRoleIds = [...member.roles.cache.keys()];
			await botAxios.post("/api/discord/auth", {
				discordId: user.id,
				discordUsername: user.username,
				guildId: guild.id,
				memberRoleIds,
			});
			console.log(
				`[Gamify Bot] Auto-registered ${user.username} in ${guild.name}`,
			);
		} catch (err) {
			console.warn(
				`[Gamify Bot] Auto-register failed for ${user.username}:`,
				err.response?.data?.message ?? err.message,
			);
		}

		// DM the new member with the welcome message if configured
		if (guildConfig.settings?.welcomeMessage) {
			try {
				await user.send(
					`**Welcome to ${guild.name}!** 🎉\n\n${guildConfig.settings.welcomeMessage}\n\nUse \`/help\` in the server to explore all commands.`,
				);
			} catch {
				// DMs may be closed — ignore silently
			}
		}
	},
};
