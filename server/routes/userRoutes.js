import express from "express";
import {
	getProfile,
	listUsers,
	updateUserRole,
} from "../controllers/userController.js";
import { authorize, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Protected route for auth check
router.get("/protected", protect, (req, res) => {
	res.json({ user: req.user });
});

router.get("/profile", protect, getProfile);
router.get(
	"/",
	protect,
	authorize("Admin", "Organisation", "Moderator"),
	listUsers,
);
router.patch(
	"/:userId/role",
	protect,
	authorize("Admin", "Organisation"),
	updateUserRole,
);

export default router;
