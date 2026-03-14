"use strict";

const {
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
	ActionRowBuilder,
} = require("discord.js");

function row(component) {
	return new ActionRowBuilder().addComponents(component);
}

// ─────────────────────────────────────────────────────────────────────────────
// Setup / Config modals
// ─────────────────────────────────────────────────────────────────────────────

function orgNameModal() {
	return new ModalBuilder()
		.setCustomId("modal:setup:orgname")
		.setTitle("Organization Name")
		.addComponents(
			row(
				new TextInputBuilder()
					.setCustomId("orgName")
					.setLabel("Organization Name")
					.setStyle(TextInputStyle.Short)
					.setPlaceholder("e.g. My Awesome Community")
					.setMinLength(2)
					.setMaxLength(50)
					.setRequired(true),
			),
		);
}

function welcomeMessageModal(current = "") {
	return new ModalBuilder()
		.setCustomId("modal:config:welcome")
		.setTitle("Welcome Message")
		.addComponents(
			row(
				new TextInputBuilder()
					.setCustomId("welcomeMessage")
					.setLabel("Welcome message for new members")
					.setStyle(TextInputStyle.Paragraph)
					.setValue(current)
					.setPlaceholder("Welcome to Gamify! Use /profile to get started.")
					.setMaxLength(500)
					.setRequired(true),
			),
		);
}

// ─────────────────────────────────────────────────────────────────────────────
// Event modals
// ─────────────────────────────────────────────────────────────────────────────

function eventCreateModal() {
	return new ModalBuilder()
		.setCustomId("modal:events:create")
		.setTitle("Create Event")
		.addComponents(
			row(
				new TextInputBuilder()
					.setCustomId("title")
					.setLabel("Event Title")
					.setStyle(TextInputStyle.Short)
					.setMaxLength(100)
					.setRequired(true),
			),
			row(
				new TextInputBuilder()
					.setCustomId("description")
					.setLabel("Description")
					.setStyle(TextInputStyle.Paragraph)
					.setMaxLength(1000)
					.setRequired(true),
			),
			row(
				new TextInputBuilder()
					.setCustomId("startDate")
					.setLabel("Start Date (YYYY-MM-DD)")
					.setStyle(TextInputStyle.Short)
					.setPlaceholder("2025-08-01")
					.setRequired(true),
			),
			row(
				new TextInputBuilder()
					.setCustomId("endDate")
					.setLabel("End Date (YYYY-MM-DD)")
					.setStyle(TextInputStyle.Short)
					.setPlaceholder("2025-08-31")
					.setRequired(true),
			),
			row(
				new TextInputBuilder()
					.setCustomId("maxParticipants")
					.setLabel("Max Participants (0 = unlimited)")
					.setStyle(TextInputStyle.Short)
					.setPlaceholder("0")
					.setRequired(false),
			),
		);
}

function eventEditModal(event) {
	return new ModalBuilder()
		.setCustomId(`modal:events:edit:${event._id}`)
		.setTitle(`Edit: ${event.title.slice(0, 40)}`)
		.addComponents(
			row(
				new TextInputBuilder()
					.setCustomId("title")
					.setLabel("Event Title")
					.setStyle(TextInputStyle.Short)
					.setValue(event.title ?? "")
					.setMaxLength(100)
					.setRequired(true),
			),
			row(
				new TextInputBuilder()
					.setCustomId("description")
					.setLabel("Description")
					.setStyle(TextInputStyle.Paragraph)
					.setValue(event.description ?? "")
					.setMaxLength(1000)
					.setRequired(true),
			),
			row(
				new TextInputBuilder()
					.setCustomId("maxParticipants")
					.setLabel("Max Participants (0 = unlimited)")
					.setStyle(TextInputStyle.Short)
					.setValue(String(event.maxParticipants ?? 0))
					.setRequired(false),
			),
		);
}

// ─────────────────────────────────────────────────────────────────────────────
// Task modals
// ─────────────────────────────────────────────────────────────────────────────

function taskCreateModal(eventId) {
	return new ModalBuilder()
		.setCustomId(`modal:tasks:create:${eventId}`)
		.setTitle("Create Task")
		.addComponents(
			row(
				new TextInputBuilder()
					.setCustomId("title")
					.setLabel("Task Title")
					.setStyle(TextInputStyle.Short)
					.setMaxLength(100)
					.setRequired(true),
			),
			row(
				new TextInputBuilder()
					.setCustomId("description")
					.setLabel("Description")
					.setStyle(TextInputStyle.Paragraph)
					.setMaxLength(1000)
					.setRequired(true),
			),
			row(
				new TextInputBuilder()
					.setCustomId("points")
					.setLabel("Points (1–1000)")
					.setStyle(TextInputStyle.Short)
					.setPlaceholder("100")
					.setRequired(true),
			),
			row(
				new TextInputBuilder()
					.setCustomId("difficulty")
					.setLabel("Difficulty (easy / medium / hard / expert)")
					.setStyle(TextInputStyle.Short)
					.setPlaceholder("medium")
					.setRequired(true),
			),
		);
}

function taskSubmitModal(taskId) {
	return new ModalBuilder()
		.setCustomId(`modal:tasks:submit:${taskId}`)
		.setTitle("Submit Task")
		.addComponents(
			row(
				new TextInputBuilder()
					.setCustomId("content")
					.setLabel("Your Submission")
					.setStyle(TextInputStyle.Paragraph)
					.setPlaceholder(
						"Describe your work, paste a link, share your solution…",
					)
					.setMinLength(10)
					.setMaxLength(4000)
					.setRequired(true),
			),
		);
}

// ─────────────────────────────────────────────────────────────────────────────
// Moderation modals
// ─────────────────────────────────────────────────────────────────────────────

function rejectReasonModal(submissionId) {
	return new ModalBuilder()
		.setCustomId(`modal:mod:reject:${submissionId}`)
		.setTitle("Reject Submission")
		.addComponents(
			row(
				new TextInputBuilder()
					.setCustomId("feedback")
					.setLabel("Feedback for the submitter")
					.setStyle(TextInputStyle.Paragraph)
					.setPlaceholder("Explain why the submission was rejected…")
					.setMinLength(10)
					.setMaxLength(500)
					.setRequired(true),
			),
		);
}

// ─────────────────────────────────────────────────────────────────────────────
// Points modals
// ─────────────────────────────────────────────────────────────────────────────

function awardPointsModal(targetUserId) {
	return new ModalBuilder()
		.setCustomId(`modal:points:award:${targetUserId}`)
		.setTitle("Award Points")
		.addComponents(
			row(
				new TextInputBuilder()
					.setCustomId("amount")
					.setLabel("Amount of points")
					.setStyle(TextInputStyle.Short)
					.setPlaceholder("100")
					.setRequired(true),
			),
			row(
				new TextInputBuilder()
					.setCustomId("reason")
					.setLabel("Reason")
					.setStyle(TextInputStyle.Short)
					.setPlaceholder("Outstanding contribution…")
					.setMaxLength(200)
					.setRequired(false),
			),
		);
}

// ─────────────────────────────────────────────────────────────────────────────
// Shop modals
// ─────────────────────────────────────────────────────────────────────────────

function shopItemCreateModal() {
	return new ModalBuilder()
		.setCustomId("modal:shop:create")
		.setTitle("Create Shop Item")
		.addComponents(
			row(
				new TextInputBuilder()
					.setCustomId("name")
					.setLabel("Item Name")
					.setStyle(TextInputStyle.Short)
					.setMaxLength(80)
					.setRequired(true),
			),
			row(
				new TextInputBuilder()
					.setCustomId("description")
					.setLabel("Description")
					.setStyle(TextInputStyle.Paragraph)
					.setMaxLength(500)
					.setRequired(true),
			),
			row(
				new TextInputBuilder()
					.setCustomId("price")
					.setLabel("Price (points)")
					.setStyle(TextInputStyle.Short)
					.setPlaceholder("500")
					.setRequired(true),
			),
			row(
				new TextInputBuilder()
					.setCustomId("stock")
					.setLabel("Stock (-1 = unlimited)")
					.setStyle(TextInputStyle.Short)
					.setPlaceholder("-1")
					.setRequired(true),
			),
		);
}

// ─────────────────────────────────────────────────────────────────────────────
// Newsletter modal
// ─────────────────────────────────────────────────────────────────────────────

function newsletterModal() {
	return new ModalBuilder()
		.setCustomId("modal:admin:newsletter")
		.setTitle("Send Newsletter")
		.addComponents(
			row(
				new TextInputBuilder()
					.setCustomId("subject")
					.setLabel("Subject")
					.setStyle(TextInputStyle.Short)
					.setMaxLength(150)
					.setRequired(true),
			),
			row(
				new TextInputBuilder()
					.setCustomId("message")
					.setLabel("Message Body")
					.setStyle(TextInputStyle.Paragraph)
					.setMaxLength(2000)
					.setRequired(true),
			),
		);
}

module.exports = {
	orgNameModal,
	welcomeMessageModal,
	eventCreateModal,
	eventEditModal,
	taskCreateModal,
	taskSubmitModal,
	rejectReasonModal,
	awardPointsModal,
	shopItemCreateModal,
	newsletterModal,
};
