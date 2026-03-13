import Event from "../models/Event.js";
import Task from "../models/Task.js";
import TaskSubmission from "../models/TaskSubmission.js";
import { creditPoints } from "../services/pointService.js";
import { resolveOrganizationId } from "../services/organizationService.js";

const TASK_CREATOR_ROLES = ["Event Staff", "Admin", "Organisation"];
const REVIEWER_ROLES = ["Moderator", "Admin", "Organisation"];

const isTaskCreator = (role) => TASK_CREATOR_ROLES.includes(role);
const isReviewer = (role) => REVIEWER_ROLES.includes(role);

export const createTask = async (req, res) => {
	try {
		if (!isTaskCreator(req.user.role)) {
			return res.status(403).json({ success: false, message: "Forbidden" });
		}

		const {
			eventId,
			title,
			description,
			points,
			difficulty,
			type,
			requirements,
			submissionFormat,
			deadline,
			status,
			isRequired,
			order,
		} = req.body;

		if (!eventId || !title || !points) {
			return res.status(400).json({
				success: false,
				message: "eventId, title, and points are required",
			});
		}

		const event = await Event.findById(eventId);
		if (!event) {
			return res
				.status(404)
				.json({ success: false, message: "Event not found" });
		}

		const task = await Task.create({
			event: eventId,
			title,
			description,
			points,
			difficulty,
			type,
			requirements,
			submissionFormat,
			deadline,
			status: status || "draft",
			isRequired,
			order,
			createdBy: req.user._id,
		});

		return res.status(201).json({ success: true, data: task });
	} catch (error) {
		console.error("Create task error:", error);
		return res
			.status(500)
			.json({ success: false, message: "Failed to create task" });
	}
};

export const listTasks = async (req, res) => {
	try {
		const { eventId, status } = req.query;

		if (!eventId) {
			return res
				.status(400)
				.json({ success: false, message: "eventId is required" });
		}

		const filter = { event: eventId };
		if (status) {
			filter.status = status;
		}

		const tasks = await Task.find(filter)
			.populate("createdBy", "username role")
			.sort({ order: 1, createdAt: 1 });

		return res.status(200).json({ success: true, data: tasks });
	} catch (error) {
		console.error("List tasks error:", error);
		return res
			.status(500)
			.json({ success: false, message: "Failed to fetch tasks" });
	}
};

export const submitTask = async (req, res) => {
	try {
		const { taskId } = req.params;
		const { content, links, attachments, timeSpent } = req.body;

		if (!content) {
			return res
				.status(400)
				.json({ success: false, message: "content is required" });
		}

		const task = await Task.findById(taskId).populate(
			"event",
			"status endDate organization",
		);
		if (!task) {
			return res
				.status(404)
				.json({ success: false, message: "Task not found" });
		}

		if (task.status !== "active") {
			return res
				.status(400)
				.json({ success: false, message: "Task is not active" });
		}

		const existingCount = await TaskSubmission.countDocuments({
			task: taskId,
			user: req.user._id,
		});
		if (existingCount >= task.maxSubmissions) {
			return res.status(400).json({
				success: false,
				message: "Submission limit reached for this task",
			});
		}

		const isLate = Boolean(task.deadline && new Date() > task.deadline);

		const submission = await TaskSubmission.create({
			task: taskId,
			event: task.event._id,
			user: req.user._id,
			content,
			links,
			attachments,
			timeSpent,
			isLate,
			version: existingCount + 1,
			status: "pending",
		});

		return res.status(201).json({ success: true, data: submission });
	} catch (error) {
		console.error("Submit task error:", error);
		return res
			.status(500)
			.json({ success: false, message: "Failed to submit task" });
	}
};

export const listSubmissionsForTask = async (req, res) => {
	try {
		if (!isReviewer(req.user.role) && !isTaskCreator(req.user.role)) {
			return res.status(403).json({ success: false, message: "Forbidden" });
		}

		const { taskId } = req.params;
		const { status } = req.query;

		const filter = { task: taskId };
		if (status) {
			filter.status = status;
		}

		const submissions = await TaskSubmission.find(filter)
			.populate("user", "username role points level")
			.populate("reviewedBy", "username role")
			.sort({ submittedAt: -1 });

		return res.status(200).json({ success: true, data: submissions });
	} catch (error) {
		console.error("List submissions error:", error);
		return res
			.status(500)
			.json({ success: false, message: "Failed to fetch submissions" });
	}
};

export const reviewSubmission = async (req, res) => {
	try {
		if (!isReviewer(req.user.role)) {
			return res.status(403).json({ success: false, message: "Forbidden" });
		}

		const { submissionId } = req.params;
		const { status, reviewNotes, feedback, pointsAwarded } = req.body;

		if (!["approved", "rejected"].includes(status)) {
			return res.status(400).json({
				success: false,
				message: "status must be approved or rejected",
			});
		}

		const submission = await TaskSubmission.findById(submissionId)
			.populate("task")
			.populate("event", "organization title");

		if (!submission) {
			return res
				.status(404)
				.json({ success: false, message: "Submission not found" });
		}

		if (submission.status === "approved") {
			return res
				.status(400)
				.json({ success: false, message: "Submission already approved" });
		}

		submission.status = status;
		submission.reviewNotes = reviewNotes;
		submission.feedback = feedback;
		submission.reviewedBy = req.user._id;
		submission.reviewedAt = new Date();

		if (status === "approved") {
			const parsedPointsAwarded = Number.isInteger(pointsAwarded)
				? pointsAwarded
				: parseInt(pointsAwarded, 10);
			const approvedPoints = Number.isNaN(parsedPointsAwarded)
				? submission.task.points
				: parsedPointsAwarded;

			if (approvedPoints < 0) {
				return res
					.status(400)
					.json({
						success: false,
						message: "pointsAwarded cannot be negative",
					});
			}

			submission.pointsAwarded = approvedPoints;

			if (approvedPoints > 0) {
				const organizationId = await resolveOrganizationId(
					submission.event.organization,
				);

				await creditPoints({
					userId: submission.user,
					organizationId,
					amount: approvedPoints,
					type: "earned",
					source: "task",
					reference: submission._id,
					referenceType: "TaskSubmission",
					description: `Points for approved task: ${submission.task.title}`,
					processedBy: req.user._id,
					metadata: {
						taskTitle: submission.task.title,
						eventTitle: submission.event.title,
					},
				});
			}
		} else {
			submission.pointsAwarded = 0;
		}

		await submission.save();

		return res.status(200).json({ success: true, data: submission });
	} catch (error) {
		console.error("Review submission error:", error);
		return res.status(error.statusCode || 500).json({
			success: false,
			message: error.message || "Failed to review submission",
		});
	}
};

export const listMySubmissions = async (req, res) => {
	try {
		const submissions = await TaskSubmission.find({ user: req.user._id })
			.populate("task", "title points event")
			.populate("event", "title status")
			.sort({ submittedAt: -1 });

		return res.status(200).json({ success: true, data: submissions });
	} catch (error) {
		console.error("List my submissions error:", error);
		return res
			.status(500)
			.json({ success: false, message: "Failed to fetch submissions" });
	}
};
