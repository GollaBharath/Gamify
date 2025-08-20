import express from "express";
import { award,getHistory } from "../controllers/pointsController.js";
import { protect,authorize } from "../middlewares/authMiddleware.js";

const pointsRouter = express.Router();

pointsRouter.post("/award", protect, authorize("Admin", "Moderator", "Event Staff"), award);
pointsRouter.get("/history", protect, getHistory);
export default pointsRouter