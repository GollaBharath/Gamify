"use strict";

// ─────────────────────────────────────────────────────────────────────────────
// Number / points
// ─────────────────────────────────────────────────────────────────────────────

function formatPoints(n) {
	if (n === undefined || n === null) return "0 pts";
	return `${Number(n).toLocaleString()} pts`;
}

function formatNumber(n) {
	return Number(n ?? 0).toLocaleString();
}

// ─────────────────────────────────────────────────────────────────────────────
// Dates
// ─────────────────────────────────────────────────────────────────────────────

function formatDate(d) {
	if (!d) return "N/A";
	return new Date(d).toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
}

function formatDateTime(d) {
	if (!d) return "N/A";
	return new Date(d).toLocaleString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

function relativeTime(d) {
	if (!d) return "N/A";
	const diff = Date.now() - new Date(d).getTime();
	const abs = Math.abs(diff);
	const future = diff < 0;
	const prefix = future ? "in " : "";
	const suffix = future ? "" : " ago";

	if (abs < 60_000) return "just now";
	if (abs < 3_600_000) return `${prefix}${Math.floor(abs / 60_000)}m${suffix}`;
	if (abs < 86_400_000)
		return `${prefix}${Math.floor(abs / 3_600_000)}h${suffix}`;
	return `${prefix}${Math.floor(abs / 86_400_000)}d${suffix}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Roles
// ─────────────────────────────────────────────────────────────────────────────

const ROLE_EMOJI = {
	Organisation: "👑",
	Admin: "🛡️",
	Moderator: "⚔️",
	"Event Staff": "🎪",
	Member: "👤",
};

function roleEmoji(role) {
	return ROLE_EMOJI[role] ?? "👤";
}

function formatRole(role) {
	return `${roleEmoji(role)} ${role}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Level / XP
// ─────────────────────────────────────────────────────────────────────────────

function levelProgress(totalPointsEarned) {
	const level = Math.floor(totalPointsEarned / 1000) + 1;
	const xpInLevel = totalPointsEarned % 1000;
	const xpNeeded = 1000;
	const pct = Math.floor((xpInLevel / xpNeeded) * 20); // out of 20 blocks
	const bar = "█".repeat(pct) + "░".repeat(20 - pct);
	return {
		level,
		xpInLevel,
		xpNeeded,
		bar,
		pct: Math.round((xpInLevel / xpNeeded) * 100),
	};
}

// ─────────────────────────────────────────────────────────────────────────────
// Status badges
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_EMOJI = {
	active: "🟢",
	draft: "📝",
	paused: "⏸️",
	completed: "✅",
	cancelled: "🚫",
	pending: "🕐",
	approved: "✅",
	rejected: "❌",
	resubmitted: "🔄",
};

function statusEmoji(status) {
	return STATUS_EMOJI[status] ?? "⚪";
}

function formatStatus(status) {
	if (!status) return "Unknown";
	return `${statusEmoji(status)} ${status.charAt(0).toUpperCase() + status.slice(1)}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Difficulty
// ─────────────────────────────────────────────────────────────────────────────

const DIFFICULTY_EMOJI = {
	easy: "🟩",
	medium: "🟨",
	hard: "🟧",
	expert: "🟥",
};

function difficultyEmoji(d) {
	return DIFFICULTY_EMOJI[d] ?? "⬜";
}

// ─────────────────────────────────────────────────────────────────────────────
// Misc
// ─────────────────────────────────────────────────────────────────────────────

function truncate(str, max = 100) {
	if (!str) return "";
	return str.length <= max ? str : `${str.slice(0, max - 3)}...`;
}

function codeBlock(text, lang = "") {
	return `\`\`\`${lang}\n${text}\n\`\`\``;
}

function bold(text) {
	return `**${text}**`;
}

function inlineCode(text) {
	return `\`${text}\``;
}

module.exports = {
	formatPoints,
	formatNumber,
	formatDate,
	formatDateTime,
	relativeTime,
	roleEmoji,
	formatRole,
	levelProgress,
	statusEmoji,
	formatStatus,
	difficultyEmoji,
	truncate,
	codeBlock,
	bold,
	inlineCode,
};
