import express from "express";
import {
	createShopItem,
	listShopItems,
	purchaseItem,
	listMyPurchases,
} from "../controllers/shopController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/items", protect, listShopItems);
router.post("/items", protect, createShopItem);
router.post("/items/:itemId/purchase", protect, purchaseItem);
router.get("/purchases/me", protect, listMyPurchases);

export default router;
