"use strict";

const axios = require("axios");
const NodeCache = require("node-cache");

const API_URL = process.env.API_URL || "http://localhost:5000";
const BOT_API_KEY = process.env.BOT_API_KEY || "";

// JWT cache: 45-minute TTL (slightly under the default 1h expiry)
const jwtCache = new NodeCache({ stdTTL: 2700, checkperiod: 300 });
// Guild config cache: 5-minute TTL
const guildCache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

// Axios instance that authenticates as the bot (for /api/discord/* routes)
const botAxios = axios.create({
	baseURL: API_URL,
	headers: { "x-bot-api-key": BOT_API_KEY },
	timeout: 12000,
});

// Create an axios instance pre-authorised with a user JWT
function userAxios(token) {
	return axios.create({
		baseURL: API_URL,
		headers: { Authorization: `Bearer ${token}` },
		timeout: 12000,
	});
}

/**
 * Authenticate a Discord user against the backend.
 * Returns { token, user } and caches the result.
 */
async function getUserToken(
	discordId,
	discordUsername,
	guildId,
	memberRoleIds = [],
) {
	const cacheKey = `jwt:${discordId}:${guildId}`;
	const cached = jwtCache.get(cacheKey);
	if (cached) return cached;

	const res = await botAxios.post("/api/discord/auth", {
		discordId,
		discordUsername,
		guildId,
		memberRoleIds,
	});

	const result = { token: res.data.token, user: res.data.user };
	jwtCache.set(cacheKey, result);
	return result;
}

/**
 * Fetch (and cache) the guild configuration from the backend.
 */
async function getGuildConfig(guildId) {
	const cacheKey = `guild:${guildId}`;
	const cached = guildCache.get(cacheKey);
	if (cached) return cached;

	const res = await botAxios.get(`/api/discord/guilds/${guildId}`);
	guildCache.set(cacheKey, res.data.guild);
	return res.data.guild;
}

/**
 * Flush the cached guild config — call after /setup or /config changes.
 */
function invalidateGuildCache(guildId) {
	guildCache.del(`guild:${guildId}`);
}

/**
 * Flush the cached JWT for a specific Discord user — call after role changes.
 */
function invalidateUserToken(discordId, guildId) {
	jwtCache.del(`jwt:${discordId}:${guildId}`);
}

/**
 * Resolve everything needed for a command interaction.
 * Returns { guild, user, api } or throws with a .code property.
 *
 * Possible error codes:
 *   'not_configured'  — guild has no /setup
 *   'dm_not_supported' — interaction came from a DM
 */
async function resolveContext(interaction) {
	if (!interaction.guildId) {
		const err = new Error("DM interactions are not supported.");
		err.code = "dm_not_supported";
		throw err;
	}

	let guild;
	try {
		guild = await getGuildConfig(interaction.guildId);
	} catch (e) {
		if (e.response?.status === 404) {
			const err = new Error("Guild not configured.");
			err.code = "not_configured";
			throw err;
		}
		throw e;
	}

	const memberRoleIds = interaction.member
		? [...interaction.member.roles.cache.keys()]
		: [];

	const { token, user } = await getUserToken(
		interaction.user.id,
		interaction.user.username,
		interaction.guildId,
		memberRoleIds,
	);

	const api = userAxios(token);
	return { guild, user, api };
}

module.exports = {
	botAxios,
	userAxios,
	getUserToken,
	getGuildConfig,
	invalidateGuildCache,
	invalidateUserToken,
	resolveContext,
};
