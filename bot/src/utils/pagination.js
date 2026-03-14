"use strict";

const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

/**
 * Build a pagination button row.
 *
 * customId format: page:{type}:{direction}:{page}:{extra}
 *   direction: "prev" | "next"
 *   extra: URL-encoded extra data (e.g. eventId=abc)
 *
 * Total length must stay under 100 chars.
 */
function buildPageButtons(type, currentPage, totalPages, extra = "") {
	// Truncate extra to keep customIds safe
	const safeExtra = extra.slice(0, 30);

	const prevId = `page:${type}:prev:${currentPage}:${safeExtra}`;
	const nextId = `page:${type}:next:${currentPage}:${safeExtra}`;

	const prevBtn = new ButtonBuilder()
		.setCustomId(prevId)
		.setLabel("◀  Prev")
		.setStyle(ButtonStyle.Secondary)
		.setDisabled(currentPage <= 1);

	const nextBtn = new ButtonBuilder()
		.setCustomId(nextId)
		.setLabel("Next  ▶")
		.setStyle(ButtonStyle.Secondary)
		.setDisabled(currentPage >= totalPages);

	return new ActionRowBuilder().addComponents(prevBtn, nextBtn);
}

/**
 * Parse a pagination button customId.
 * Returns { type, direction, page, extra } or null if invalid.
 */
function parsePaginationId(customId) {
	if (!customId.startsWith("page:")) return null;
	const parts = customId.split(":");
	if (parts.length < 5) return null;

	const [, type, direction, pageStr, ...extraParts] = parts;
	const page = parseInt(pageStr, 10);
	if (isNaN(page)) return null;

	return {
		type,
		direction,
		page,
		extra: extraParts.join(":"),
	};
}

/**
 * Compute the new page number given a direction.
 */
function nextPage(currentPage, direction, totalPages) {
	if (direction === "prev") return Math.max(1, currentPage - 1);
	if (direction === "next") return Math.min(totalPages, currentPage + 1);
	return currentPage;
}

/**
 * Compute total pages.
 */
function totalPages(totalItems, perPage) {
	return Math.max(1, Math.ceil(totalItems / perPage));
}

module.exports = {
	buildPageButtons,
	parsePaginationId,
	nextPage,
	totalPages,
};
