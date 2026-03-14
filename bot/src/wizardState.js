"use strict";

/**
 * In-memory store for multi-step wizard sessions.
 * Key: `${userId}:${guildId}`
 * Value: wizard state object (shape depends on wizard type)
 *
 * Sessions are auto-expired after WIZARD_TTL_MS of inactivity.
 */

const WIZARD_TTL_MS = 5 * 60 * 1000; // 5 minutes

const sessions = new Map();

function sessionKey(userId, guildId) {
	return `${userId}:${guildId}`;
}

function set(userId, guildId, data) {
	const key = sessionKey(userId, guildId);
	// Clear any existing timer
	const existing = sessions.get(key);
	if (existing?._timer) clearTimeout(existing._timer);

	const timer = setTimeout(() => sessions.delete(key), WIZARD_TTL_MS);
	timer.unref?.(); // Don't keep the process alive for this timer
	sessions.set(key, { ...data, _timer: timer });
}

function get(userId, guildId) {
	const entry = sessions.get(sessionKey(userId, guildId));
	if (!entry) return null;
	const { _timer, ...data } = entry; // eslint-disable-line no-unused-vars
	return data;
}

function remove(userId, guildId) {
	const key = sessionKey(userId, guildId);
	const entry = sessions.get(key);
	if (entry?._timer) clearTimeout(entry._timer);
	sessions.delete(key);
}

function has(userId, guildId) {
	return sessions.has(sessionKey(userId, guildId));
}

module.exports = { set, get, remove, has };
