"use strict";

require("dotenv").config();

const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, GatewayIntentBits } = require("discord.js");

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.MessageContent,
	],
});

client.commands = new Collection();

// ─── Load commands ────────────────────────────────────────────────────────────

const commandsPath = path.join(__dirname, "src", "commands");
for (const file of fs
	.readdirSync(commandsPath)
	.filter((f) => f.endsWith(".js"))) {
	const cmd = require(path.join(commandsPath, file));
	if (cmd?.data?.name && cmd?.execute) {
		client.commands.set(cmd.data.name, cmd);
		console.log(`[Gamify Bot] Loaded command: /${cmd.data.name}`);
	}
}

// ─── Load event handlers ──────────────────────────────────────────────────────

const handlersPath = path.join(__dirname, "src", "handlers");
for (const file of fs
	.readdirSync(handlersPath)
	.filter((f) => f.endsWith(".js"))) {
	const handler = require(path.join(handlersPath, file));
	if (handler?.name && typeof handler.execute === "function") {
		if (handler.once) {
			client.once(handler.name, (...args) => handler.execute(...args));
		} else {
			client.on(handler.name, (...args) => handler.execute(...args));
		}
		console.log(`[Gamify Bot] Registered handler: ${handler.name}`);
	}
}

// ─── Ready event ──────────────────────────────────────────────────────────────

client.once("ready", (c) => {
	console.log(`\n✅  Gamify Bot is online as ${c.user.tag}`);
	console.log(`    Serving ${c.guilds.cache.size} guild(s)\n`);
	c.user.setActivity("Gamify  |  /help", { type: 4 /* CUSTOM */ });
});

// ─── Global error handling ────────────────────────────────────────────────────

client.on("error", (err) => console.error("[Discord Client Error]", err));
process.on("unhandledRejection", (err) =>
	console.error("[Unhandled Rejection]", err),
);

// ─── Login ────────────────────────────────────────────────────────────────────

if (!process.env.DISCORD_TOKEN) {
	console.error("❌  DISCORD_TOKEN is not set in .env");
	process.exit(1);
}

client.login(process.env.DISCORD_TOKEN);
