"use strict";

const { EmbedBuilder } = require("discord.js");

// ─────────────────────────────────────────────────────────────────────────────
// Brand colours
// ─────────────────────────────────────────────────────────────────────────────
const COLORS = {
	primary: 0x5865f2, // Discord blurple
	success: 0x57f287, // Green
	warning: 0xfee75c, // Yellow
	danger: 0xed4245, // Red
	info: 0x4ecdc4, // Teal
	gold: 0xffd700, // Points / leaderboard
	purple: 0x9b59b6, // Events
	orange: 0xff7675, // Shop
};

const FOOTER_TEXT = "Gamify Bot";

function baseEmbed(color = COLORS.primary) {
	return new EmbedBuilder()
		.setColor(color)
		.setFooter({ text: FOOTER_TEXT })
		.setTimestamp();
}

// ─────────────────────────────────────────────────────────────────────────────
// Generic embeds
// ─────────────────────────────────────────────────────────────────────────────

function successEmbed(title, description) {
	return baseEmbed(COLORS.success)
		.setTitle(`✅  ${title}`)
		.setDescription(description ?? null);
}

function errorEmbed(title, description) {
	return baseEmbed(COLORS.danger)
		.setTitle(`❌  ${title}`)
		.setDescription(description ?? null);
}

function infoEmbed(title, description) {
	return baseEmbed(COLORS.info)
		.setTitle(`ℹ️  ${title}`)
		.setDescription(description ?? null);
}

function warnEmbed(title, description) {
	return baseEmbed(COLORS.warning)
		.setTitle(`⚠️  ${title}`)
		.setDescription(description ?? null);
}

function loadingEmbed(description = "Fetching data…") {
	return baseEmbed(COLORS.primary).setDescription(
		`<a:loading:1> ${description}`,
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// Profile embed
// ─────────────────────────────────────────────────────────────────────────────

function profileEmbed(gamifyUser, discordMember) {
	const {
		formatPoints,
		formatRole,
		levelProgress,
		formatDate,
		formatNumber,
		truncate,
	} = require("./formatters");

	const { level, xpInLevel, xpNeeded, bar, pct } = levelProgress(
		gamifyUser.totalPointsEarned ?? 0,
	);

	const embed = baseEmbed(COLORS.primary)
		.setTitle(`👤  ${gamifyUser.username}`)
		.setDescription(
			gamifyUser.profile?.bio
				? truncate(gamifyUser.profile.bio, 300)
				: "*No bio set.*",
		)
		.addFields(
			{ name: "🏅 Role", value: formatRole(gamifyUser.role), inline: true },
			{ name: "⭐ Level", value: `Level ${level}`, inline: true },
			{
				name: "💰 Points",
				value: `${formatPoints(gamifyUser.points)} (spendable)`,
				inline: true,
			},
			{
				name: "📈 XP Progress",
				value: `\`${bar}\` ${pct}%\n${formatNumber(xpInLevel)} / ${formatNumber(xpNeeded)} XP  →  Level ${level + 1}`,
				inline: false,
			},
			{
				name: "🏆 Total XP Earned",
				value: formatPoints(gamifyUser.totalPointsEarned),
				inline: true,
			},
			{
				name: "🎖️ Badges",
				value: gamifyUser.badges?.length
					? gamifyUser.badges.map((b) => `\`${b}\``).join("  ")
					: "*None yet*",
				inline: true,
			},
			{
				name: "📅 Member Since",
				value: formatDate(gamifyUser.profile?.joinDate ?? gamifyUser.createdAt),
				inline: true,
			},
		);

	if (discordMember?.user?.displayAvatarURL) {
		embed.setThumbnail(discordMember.user.displayAvatarURL({ dynamic: true }));
	}

	return embed;
}

// ─────────────────────────────────────────────────────────────────────────────
// Leaderboard embed
// ─────────────────────────────────────────────────────────────────────────────

function leaderboardEmbed(users, callerRank) {
	const { formatPoints, formatRole, truncate } = require("./formatters");

	const MEDALS = ["🥇", "🥈", "🥉"];

	const rows = users
		.slice(0, 10)
		.map((u, i) => {
			const medal = MEDALS[i] ?? `**#${i + 1}**`;
			return `${medal}  **${truncate(u.username, 20)}**  ·  ${formatPoints(u.points)}  ·  Lv. ${u.level}  ·  ${formatRole(u.role)}`;
		})
		.join("\n");

	const embed = baseEmbed(COLORS.gold)
		.setTitle("🏆  Leaderboard")
		.setDescription(rows || "*No members yet.*");

	if (callerRank) {
		embed.addFields({
			name: "📍 Your Position",
			value: `#${callerRank.rank}  —  ${formatPoints(callerRank.points)}`,
			inline: false,
		});
	}

	return embed;
}

// ─────────────────────────────────────────────────────────────────────────────
// Event embeds
// ─────────────────────────────────────────────────────────────────────────────

function eventListEmbed(events, page, totalPages) {
	const { formatDate, formatStatus, truncate } = require("./formatters");

	const rows = events
		.map((e) => {
			const ends = e.endDate ? `  ·  Ends ${formatDate(e.endDate)}` : "";
			return `**${truncate(e.title, 40)}**  ${formatStatus(e.status)}${ends}\n> ${truncate(e.description, 80)}\n> ID: \`${e._id}\``;
		})
		.join("\n\n");

	return baseEmbed(COLORS.purple)
		.setTitle("🎉  Events")
		.setDescription(rows || "*No events found.*")
		.setFooter({ text: `Gamify Bot  •  Page ${page} / ${totalPages}` });
}

function eventDetailEmbed(event) {
	const {
		formatDate,
		formatStatus,
		formatPoints,
		truncate,
	} = require("./formatters");

	const embed = baseEmbed(COLORS.purple)
		.setTitle(`🎉  ${event.title}`)
		.setDescription(truncate(event.description, 400))
		.addFields(
			{ name: "📊 Status", value: formatStatus(event.status), inline: true },
			{
				name: "👥 Participants",
				value: `${event.currentParticipants ?? 0} / ${event.maxParticipants ?? "∞"}`,
				inline: true,
			},
			{
				name: "💰 Total Points",
				value: formatPoints(event.totalPoints),
				inline: true,
			},
			{ name: "📅 Start", value: formatDate(event.startDate), inline: true },
			{ name: "🏁 End", value: formatDate(event.endDate), inline: true },
		);

	if (event.rewards) {
		const r = event.rewards;
		const rewardLines = [
			r.firstPlace && `🥇 1st: ${formatPoints(r.firstPlace)}`,
			r.secondPlace && `🥈 2nd: ${formatPoints(r.secondPlace)}`,
			r.thirdPlace && `🥉 3rd: ${formatPoints(r.thirdPlace)}`,
			r.participation && `🎫 Participation: ${formatPoints(r.participation)}`,
		]
			.filter(Boolean)
			.join("\n");
		if (rewardLines)
			embed.addFields({
				name: "🏅 Rewards",
				value: rewardLines,
				inline: false,
			});
	}

	if (event.tags?.length) {
		embed.addFields({
			name: "🏷️ Tags",
			value: event.tags.map((t) => `\`${t}\``).join("  "),
			inline: false,
		});
	}

	embed.setFooter({ text: `Gamify Bot  •  ID: ${event._id}` });
	return embed;
}

// ─────────────────────────────────────────────────────────────────────────────
// Task embeds
// ─────────────────────────────────────────────────────────────────────────────

function taskListEmbed(tasks, page, totalPages) {
	const {
		difficultyEmoji,
		formatPoints,
		formatStatus,
		truncate,
	} = require("./formatters");

	const rows = tasks
		.map((t) => {
			return `${difficultyEmoji(t.difficulty)} **${truncate(t.title, 40)}**  ·  ${formatPoints(t.points)}  ${formatStatus(t.status)}\n> ${truncate(t.description, 70)}\n> ID: \`${t._id}\``;
		})
		.join("\n\n");

	return baseEmbed(COLORS.info)
		.setTitle("📋  Tasks")
		.setDescription(rows || "*No tasks found.*")
		.setFooter({ text: `Gamify Bot  •  Page ${page} / ${totalPages}` });
}

function taskDetailEmbed(task) {
	const {
		difficultyEmoji,
		formatPoints,
		formatStatus,
		formatDate,
		truncate,
	} = require("./formatters");

	return baseEmbed(COLORS.info)
		.setTitle(`📋  ${task.title}`)
		.setDescription(truncate(task.description, 500))
		.addFields(
			{ name: "💰 Points", value: formatPoints(task.points), inline: true },
			{
				name: "🎯 Difficulty",
				value: `${difficultyEmoji(task.difficulty)} ${task.difficulty}`,
				inline: true,
			},
			{ name: "📊 Status", value: formatStatus(task.status), inline: true },
			{ name: "🗂️ Type", value: task.type ?? "submission", inline: true },
			{
				name: "📤 Submissions",
				value: `${task.maxSubmissions ?? 1} max`,
				inline: true,
			},
			{
				name: "📅 Deadline",
				value: task.deadline ? formatDate(task.deadline) : "None",
				inline: true,
			},
		)
		.setFooter({ text: `Gamify Bot  •  ID: ${task._id}` });
}

function submissionEmbed(sub, index, total) {
	const { formatStatus, formatDateTime, truncate } = require("./formatters");

	return baseEmbed(COLORS.warning)
		.setTitle(`📬  Submission ${index} / ${total}`)
		.setDescription(truncate(sub.content, 500) || "*No text content.*")
		.addFields(
			{
				name: "👤 Submitter",
				value: sub.user?.username ?? "Unknown",
				inline: true,
			},
			{ name: "📊 Status", value: formatStatus(sub.status), inline: true },
			{
				name: "🕐 Submitted",
				value: formatDateTime(sub.createdAt),
				inline: true,
			},
		)
		.setFooter({ text: `Gamify Bot  •  Submission ID: ${sub._id}` });
}

// ─────────────────────────────────────────────────────────────────────────────
// Shop embeds
// ─────────────────────────────────────────────────────────────────────────────

function shopListEmbed(items, page, totalPages) {
	const { formatPoints, truncate } = require("./formatters");

	const rows = items
		.map((item) => {
			const stock = item.stock === -1 ? "∞" : item.stock;
			return `🛒 **${truncate(item.title ?? item.name, 40)}**  ·  ${formatPoints(item.price)}  ·  Stock: ${stock}\n> \`${item._id}\``;
		})
		.join("\n\n");

	return baseEmbed(COLORS.orange)
		.setTitle("🛍️  Shop")
		.setDescription(rows || "*The shop is empty.*")
		.setFooter({ text: `Gamify Bot  •  Page ${page} / ${totalPages}` });
}

function shopItemEmbed(item) {
	const { formatPoints } = require("./formatters");

	const embed = baseEmbed(COLORS.orange)
		.setTitle(`🛒  ${item.title ?? item.name}`)
		.setDescription(item.description ?? "*No description.*")
		.addFields(
			{ name: "💰 Price", value: formatPoints(item.price), inline: true },
			{
				name: "📦 Stock",
				value: item.stock === -1 ? "Unlimited" : String(item.stock),
				inline: true,
			},
			{ name: "🏷️ Category", value: item.category ?? "general", inline: true },
		);

	if (item.requirements) {
		const r = item.requirements;
		const req = [
			r.minLevel > 1 && `Level ${r.minLevel}+`,
			r.minPoints > 0 && `${formatPoints(r.minPoints)} minimum`,
			r.requiredRole && `Role: ${r.requiredRole}`,
		]
			.filter(Boolean)
			.join("  ·  ");
		if (req)
			embed.addFields({ name: "📋 Requirements", value: req, inline: false });
	}

	embed.setFooter({ text: `Gamify Bot  •  ID: ${item._id}` });
	return embed;
}

// ─────────────────────────────────────────────────────────────────────────────
// Points history embed
// ─────────────────────────────────────────────────────────────────────────────

function pointsHistoryEmbed(transactions, page, totalPages, username) {
	const { formatPoints, relativeTime, truncate } = require("./formatters");

	const TYPE_EMOJI = {
		earned: "📈",
		spent: "📉",
		awarded: "🎁",
		deducted: "➖",
		bonus: "⭐",
		refund: "↩️",
	};

	const rows = transactions
		.map((tx) => {
			const sign = ["earned", "awarded", "bonus", "refund"].includes(tx.type)
				? "+"
				: "-";
			const emoji = TYPE_EMOJI[tx.type] ?? "💰";
			const reason = tx.metadata?.reason ?? tx.metadata?.taskTitle ?? tx.source;
			return `${emoji} \`${sign}${formatPoints(Math.abs(tx.amount))}\`  —  ${truncate(reason, 40)}  ·  *${relativeTime(tx.createdAt)}*`;
		})
		.join("\n");

	return baseEmbed(COLORS.gold)
		.setTitle(`💰  Points History${username ? `  —  ${username}` : ""}`)
		.setDescription(rows || "*No transactions yet.*")
		.setFooter({ text: `Gamify Bot  •  Page ${page} / ${totalPages}` });
}

// ─────────────────────────────────────────────────────────────────────────────
// Config / setup embed
// ─────────────────────────────────────────────────────────────────────────────

function configEmbed(guildConfig, guild) {
	const embed = baseEmbed(COLORS.primary)
		.setTitle("⚙️  Server Configuration")
		.addFields(
			{
				name: "🏢 Organization",
				value: guildConfig.organizationId?.name ?? "Unknown",
				inline: true,
			},
			{
				name: "📢 Announcement Channel",
				value: guildConfig.settings?.announcementChannelId
					? `<#${guildConfig.settings.announcementChannelId}>`
					: "*Not set*",
				inline: true,
			},
			{
				name: "🤖 Auto-Register",
				value: guildConfig.settings?.autoRegister
					? "Enabled ✅"
					: "Disabled ❌",
				inline: true,
			},
		);

	const {
		admin = [],
		moderator = [],
		eventStaff = [],
	} = guildConfig.roleMapping ?? {};
	embed.addFields(
		{
			name: "🛡️ Admin Roles",
			value: admin.length ? admin.map((id) => `<@&${id}>`).join(" ") : "*None*",
			inline: false,
		},
		{
			name: "⚔️ Moderator Roles",
			value: moderator.length
				? moderator.map((id) => `<@&${id}>`).join(" ")
				: "*None*",
			inline: false,
		},
		{
			name: "🎪 Event Staff Roles",
			value: eventStaff.length
				? eventStaff.map((id) => `<@&${id}>`).join(" ")
				: "*None*",
			inline: false,
		},
	);

	if (guild?.name)
		embed.setAuthor({
			name: guild.name,
			iconURL: guild.iconURL?.() ?? undefined,
		});

	return embed;
}

// ─────────────────────────────────────────────────────────────────────────────
// Confirm dialog
// ─────────────────────────────────────────────────────────────────────────────

function confirmEmbed(title, description) {
	return baseEmbed(COLORS.warning)
		.setTitle(`⚠️  ${title}`)
		.setDescription(`${description}\n\nThis action **cannot** be undone.`);
}

module.exports = {
	COLORS,
	baseEmbed,
	successEmbed,
	errorEmbed,
	infoEmbed,
	warnEmbed,
	loadingEmbed,
	profileEmbed,
	leaderboardEmbed,
	eventListEmbed,
	eventDetailEmbed,
	taskListEmbed,
	taskDetailEmbed,
	submissionEmbed,
	shopListEmbed,
	shopItemEmbed,
	pointsHistoryEmbed,
	configEmbed,
	confirmEmbed,
};
