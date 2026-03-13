import express from "express";
import {
	createTask,
	listTasks,
	submitTask,
	listSubmissionsForTask,
	reviewSubmission,
	listMySubmissions,
} from "../controllers/taskController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, listTasks);
router.post("/", protect, createTask);
router.post("/:taskId/submissions", protect, submitTask);
router.get("/submissions/me", protect, listMySubmissions);
router.get("/:taskId/submissions", protect, listSubmissionsForTask);
router.patch("/submissions/:submissionId/review", protect, reviewSubmission);

export default router;
