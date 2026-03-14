import Event from "../models/Event.js";
import Task from "../models/Task.js";
import { resolveOrganizationId } from "../services/organizationService.js";

const canManageEvent = (user) =>
	["Admin", "Organisation", "Event Staff"].includes(user.role);

export const createEvent = async (req, res) => {
	try {
		if (!canManageEvent(req.user)) {
			return res.status(403).json({ success: false, message: "Forbidden" });
		}

		const {
			title,
			description,
			startDate,
			endDate,
			maxParticipants,
			tags,
			rules,
			isPublic,
		} = req.body;

		if (!title || !startDate || !endDate) {
			return res.status(400).json({
				success: false,
				message: "title, startDate and endDate are required",
			});
		}

		const organizationId = await resolveOrganizationId(req.user.organization);

		const eventDoc = {
			title,
			description,
			startDate,
			endDate,
			tags,
			rules,
			isPublic,
			organization: organizationId,
			createdBy: req.user._id,
			status: "draft",
		};
		// 0 means "unlimited" — omit field so Mongoose min:1 is not violated
		if (maxParticipants && maxParticipants > 0) {
			eventDoc.maxParticipants = maxParticipants;
		}

		const event = await Event.create(eventDoc);

		return res.status(201).json({ success: true, data: event });
	} catch (error) {
		console.error("Create event error:", error);
		return res
			.status(500)
			.json({ success: false, message: "Failed to create event" });
	}
};

export const listEvents = async (req, res) => {
	try {
		const { status, organizationId, includePrivate } = req.query;
		const effectiveOrgId = await resolveOrganizationId(
			organizationId || req.user?.organization,
		);

		const filter = { organization: effectiveOrgId };
		if (status) {
			filter.status = status;
		}

		const shouldIncludePrivate = includePrivate === "true" && Boolean(req.user);
		if (!shouldIncludePrivate) {
			filter.isPublic = true;
		}

		const events = await Event.find(filter)
			.populate("createdBy", "username role")
			.sort({ startDate: 1, createdAt: -1 });

		return res.status(200).json({ success: true, data: events });
	} catch (error) {
		console.error("List events error:", error);
		return res
			.status(500)
			.json({ success: false, message: "Failed to fetch events" });
	}
};

export const getEventById = async (req, res) => {
	try {
		const { id } = req.params;

		const event = await Event.findById(id).populate(
			"createdBy",
			"username role",
		);
		if (!event) {
			return res
				.status(404)
				.json({ success: false, message: "Event not found" });
		}

		if (!event.isPublic && !req.user) {
			return res.status(403).json({ success: false, message: "Private event" });
		}

		const tasksCount = await Task.countDocuments({ event: event._id });

		return res.status(200).json({
			success: true,
			data: {
				event,
				tasksCount,
			},
		});
	} catch (error) {
		console.error("Get event error:", error);
		return res
			.status(500)
			.json({ success: false, message: "Failed to fetch event" });
	}
};

export const updateEvent = async (req, res) => {
	try {
		if (!canManageEvent(req.user)) {
			return res.status(403).json({ success: false, message: "Forbidden" });
		}

		const { id } = req.params;
		const allowedFields = [
			"title",
			"description",
			"startDate",
			"endDate",
			"status",
			"maxParticipants",
			"tags",
			"rules",
			"isPublic",
			"rewards",
		];

		const updateData = Object.fromEntries(
			Object.entries(req.body).filter(([key]) => allowedFields.includes(key)),
		);

		const event = await Event.findById(id);
		if (!event) {
			return res
				.status(404)
				.json({ success: false, message: "Event not found" });
		}

		const sameCreator = String(event.createdBy) === String(req.user._id);
		if (!sameCreator && req.user.role !== "Organisation") {
			return res.status(403).json({
				success: false,
				message: "Only creator or Organisation can update",
			});
		}

		// 0 means "unlimited" — clear any existing cap
		if ("maxParticipants" in updateData && !(updateData.maxParticipants > 0)) {
			delete updateData.maxParticipants;
			event.maxParticipants = undefined;
		}

		Object.assign(event, updateData);
		await event.save();

		return res.status(200).json({ success: true, data: event });
	} catch (error) {
		console.error("Update event error:", error);
		return res
			.status(500)
			.json({ success: false, message: "Failed to update event" });
	}
};
