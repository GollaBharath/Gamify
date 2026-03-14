"use strict";

const { SlashCommandBuilder } = require("discord.js");
const { COLORS } = require("../utils/embeds");
const { EmbedBuilder } = require("discord.js");

const COMMANDS = [
	{
		name: "/setup",
		category: "⚙️ Setup",
		description:
			"Run the interactive setup wizard to configure Gamify for this server.",
		usage: "/setup",
		roles: "Server Administrator only",
	},
	{
		name: "/config",
		category: "⚙️ Setup",
		description:
			"View or edit the server configuration, role mappings, and settings.",
		usage: "/config",
		roles: "Server Administrator only",
	},
	{
		name: "/profile",
		category: "👤 Members",
		description:
			"View your (or another member's) Gamify profile: level, points, badges.",
		usage: "/profile [user]",
		roles: "All",
	},
	{
		name: "/points balance",
		category: "💰 Points",
		description: "Check the spendable points balance and level progress.",
		usage: "/points balance [user]",
		roles: "All",
	},
	{
		name: "/points history",
		category: "💰 Points",
		description:
			"Browse transaction history (Moderators can look up other users).",
		usage: "/points history [user]",
		roles: "All (paginated)",
	},
	{
		name: "/points award",
		category: "💰 Points",
		description: "Award points to a member.",
		usage: "/points award <user>",
		roles: "Moderator, Admin",
	},
	{
		name: "/leaderboard",
		category: "🏆 Leaderboard",
		description: "Display the top 10 members by points.",
		usage: "/leaderboard",
		roles: "All",
	},
	{
		name: "/events list",
		category: "🎉 Events",
		description: "Browse all events with paginated navigation.",
		usage: "/events list",
		roles: "All",
	},
	{
		name: "/events view",
		category: "🎉 Events",
		description: "View full details of an event.",
		usage: "/events view <id>",
		roles: "All",
	},
	{
		name: "/events create",
		category: "🎉 Events",
		description: "Create a new event via a form.",
		usage: "/events create",
		roles: "Event Staff, Admin",
	},
	{
		name: "/events status",
		category: "🎉 Events",
		description:
			"Change an event's status (draft/active/paused/completed/cancelled).",
		usage: "/events status <id> <status>",
		roles: "Event Staff, Admin",
	},
	{
		name: "/tasks list",
		category: "📋 Tasks",
		description: "Browse tasks, optionally filtered by event.",
		usage: "/tasks list [event]",
		roles: "All",
	},
	{
		name: "/tasks view",
		category: "📋 Tasks",
		description: "View task details and submit it.",
		usage: "/tasks view <id>",
		roles: "All",
	},
	{
		name: "/tasks submit",
		category: "📋 Tasks",
		description: "Submit a task by ID.",
		usage: "/tasks submit <id>",
		roles: "All",
	},
	{
		name: "/tasks create",
		category: "📋 Tasks",
		description: "Create a new task for an event.",
		usage: "/tasks create <event>",
		roles: "Event Staff, Admin",
	},
	{
		name: "/tasks review",
		category: "📋 Tasks",
		description: "Review pending submissions for a task.",
		usage: "/tasks review <task>",
		roles: "Moderator, Admin",
	},
	{
		name: "/tasks mine",
		category: "📋 Tasks",
		description: "View your own submission history.",
		usage: "/tasks mine",
		roles: "All",
	},
	{
		name: "/shop list",
		category: "🛍️ Shop",
		description: "Browse items in the rewards shop.",
		usage: "/shop list",
		roles: "All",
	},
	{
		name: "/shop view",
		category: "🛍️ Shop",
		description: "View details and buy a shop item.",
		usage: "/shop view <id>",
		roles: "All",
	},
	{
		name: "/shop buy",
		category: "🛍️ Shop",
		description: "Purchase a shop item by ID.",
		usage: "/shop buy <id>",
		roles: "All",
	},
	{
		name: "/shop create",
		category: "🛍️ Shop",
		description: "Add a new item to the shop.",
		usage: "/shop create",
		roles: "Admin",
	},
	{
		name: "/shop mypurchases",
		category: "🛍️ Shop",
		description: "View your purchase history.",
		usage: "/shop mypurchases",
		roles: "All",
	},
	{
		name: "/mod users",
		category: "⚔️ Moderation",
		description: "List all registered members.",
		usage: "/mod users",
		roles: "Moderator, Admin",
	},
	{
		name: "/mod setrole",
		category: "⚔️ Moderation",
		description: "Change a member's Gamify role.",
		usage: "/mod setrole <user> <role>",
		roles: "Admin",
	},
	{
		name: "/mod userinfo",
		category: "⚔️ Moderation",
		description: "View a member's full profile (mod view).",
		usage: "/mod userinfo <user>",
		roles: "Moderator, Admin",
	},
	{
		name: "/admin stats",
		category: "🛡️ Admin",
		description: "View organization-level statistics.",
		usage: "/admin stats",
		roles: "Admin",
	},
	{
		name: "/admin newsletter",
		category: "🛡️ Admin",
		description: "Compose and send a newsletter to subscribers.",
		usage: "/admin newsletter",
		roles: "Admin",
	},
	{
		name: "/admin subscribers",
		category: "🛡️ Admin",
		description: "View newsletter subscriber count.",
		usage: "/admin subscribers",
		roles: "Admin",
	},
];

module.exports = {
	data: new SlashCommandBuilder()
		.setName("help")
		.setDescription("Show all Gamify commands")
		.addStringOption((opt) =>
			opt
				.setName("command")
				.setDescription("Get detailed info about a specific command")
				.setRequired(false),
		),

	async execute(interaction) {
		const query = interaction.options.getString("command")?.toLowerCase();

		if (query) {
			const match = COMMANDS.find(
				(c) =>
					c.name.toLowerCase().includes(query) ||
					c.usage.toLowerCase().includes(query),
			);

			if (!match) {
				return interaction.reply({
					embeds: [
						new EmbedBuilder()
							.setColor(COLORS.danger)
							.setTitle("❌  Command Not Found")
							.setDescription(
								`No command matching \`${query}\` was found. Run \`/help\` for the full list.`,
							)
							.setFooter({ text: "Gamify Bot" }),
					],
					ephemeral: true,
				});
			}

			return interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor(COLORS.primary)
						.setTitle(`📖  ${match.name}`)
						.setDescription(match.description)
						.addFields(
							{ name: "Usage", value: `\`${match.usage}\``, inline: false },
							{ name: "🔐 Required Role", value: match.roles, inline: false },
						)
						.setFooter({ text: "Gamify Bot" })
						.setTimestamp(),
				],
				ephemeral: true,
			});
		}

		// Group by category
		const categories = {};
		for (const cmd of COMMANDS) {
			if (!categories[cmd.category]) categories[cmd.category] = [];
			categories[cmd.category].push(cmd);
		}

		const embed = new EmbedBuilder()
			.setColor(COLORS.primary)
			.setTitle("📖  Gamify Bot — Command Reference")
			.setDescription(
				"All commands are slash commands. Use `/help <command>` for detailed info on any command.\n\n" +
					"Members interact with the bot and are automatically registered as Gamify users.",
			)
			.setFooter({
				text: "Gamify Bot  •  Tip: all your data is synced with the web dashboard",
			})
			.setTimestamp();

		for (const [cat, cmds] of Object.entries(categories)) {
			embed.addFields({
				name: cat,
				value: cmds
					.map((c) => `\`${c.usage}\`  —  ${c.description.slice(0, 60)}`)
					.join("\n"),
				inline: false,
			});
		}

		return interaction.reply({ embeds: [embed], ephemeral: true });
	},
};
