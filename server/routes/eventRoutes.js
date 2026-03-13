import express from "express";
import {
	createEvent,
	listEvents,
	getEventById,
	updateEvent,
} from "../controllers/eventController.js";
import { optionalProtect, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", optionalProtect, listEvents);
router.get("/:id", optionalProtect, getEventById);
router.post("/", protect, createEvent);
router.patch("/:id", protect, updateEvent);

export default router;
