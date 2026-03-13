import express from "express";
import { award, getHistory } from "../controllers/pointsController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const pointsRouter = express.Router();

pointsRouter.post(
	"/award",
	protect,
	authorize("Admin", "Moderator", "Organisation"),
	award,
);
pointsRouter.get("/history", protect, getHistory);

pointsRouter.post("/transfer", protect, (req, res) => {
	return res.status(403).json({
		success: false,
		message: "Point transfer between members is not allowed.",
	});
});
export default pointsRouter;
