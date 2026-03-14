"use strict";

require("dotenv").config();

const fs = require("node:fs");
const path = require("node:path");
const { REST, Routes } = require("discord.js");

const commands = [];
const commandsPath = path.join(__dirname, "src", "commands");

for (const file of fs
	.readdirSync(commandsPath)
	.filter((f) => f.endsWith(".js"))) {
	const cmd = require(path.join(commandsPath, file));
	if (cmd?.data?.toJSON) {
		commands.push(cmd.data.toJSON());
		console.log(`  + ${cmd.data.name}`);
	}
}

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
	try {
		const clientId = process.env.DISCORD_CLIENT_ID;
		const guildId = process.env.GUILD_ID; // Optional: set for instant guild-scoped deploy

		if (!clientId) {
			throw new Error("DISCORD_CLIENT_ID is not set in .env");
		}

		console.log(`\nDeploying ${commands.length} command(s)…`);

		if (guildId) {
			await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
				body: commands,
			});
			console.log(`✅  Guild commands deployed to ${guildId} (instant)`);
		} else {
			await rest.put(Routes.applicationCommands(clientId), { body: commands });
			console.log(
				"✅  Global commands deployed (may take up to 1 hour to propagate)",
			);
		}
	} catch (err) {
		console.error("❌  Deploy failed:", err);
		process.exitCode = 1;
	}
})();
