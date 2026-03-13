import Purchase from "../models/Purchase.js";
import ShopItem from "../models/ShopItem.js";
import { debitPoints } from "../services/pointService.js";
import { resolveOrganizationId } from "../services/organizationService.js";

const SHOP_MANAGER_ROLES = ["Admin", "Organisation"];

const canManageShop = (role) => SHOP_MANAGER_ROLES.includes(role);

export const createShopItem = async (req, res) => {
	try {
		if (!canManageShop(req.user.role)) {
			return res.status(403).json({ success: false, message: "Forbidden" });
		}

		const {
			name,
			description,
			price,
			category,
			stock,
			image,
			isFeatured,
			requirements,
			benefits,
			tags,
		} = req.body;

		if (!name || !price) {
			return res
				.status(400)
				.json({ success: false, message: "name and price are required" });
		}

		const organizationId = await resolveOrganizationId(req.user.organization);

		const item = await ShopItem.create({
			name,
			description,
			price,
			category,
			stock,
			image,
			isFeatured,
			requirements,
			benefits,
			tags,
			organization: organizationId,
			createdBy: req.user._id,
		});

		return res.status(201).json({ success: true, data: item });
	} catch (error) {
		console.error("Create shop item error:", error);
		return res
			.status(500)
			.json({ success: false, message: "Failed to create shop item" });
	}
};

export const listShopItems = async (req, res) => {
	try {
		const { category, featured, includeInactive, organizationId } = req.query;
		const effectiveOrgId = await resolveOrganizationId(
			organizationId || req.user?.organization,
		);

		const filter = { organization: effectiveOrgId };
		if (category) {
			filter.category = category;
		}
		if (featured === "true") {
			filter.isFeatured = true;
		}
		if (includeInactive !== "true") {
			filter.isActive = true;
		}

		const items = await ShopItem.find(filter).sort({
			isFeatured: -1,
			createdAt: -1,
		});
		return res.status(200).json({ success: true, data: items });
	} catch (error) {
		console.error("List shop items error:", error);
		return res
			.status(500)
			.json({ success: false, message: "Failed to fetch shop items" });
	}
};

export const purchaseItem = async (req, res) => {
	try {
		const { itemId } = req.params;

		const item = await ShopItem.findById(itemId);
		if (!item || !item.isActive) {
			return res
				.status(404)
				.json({ success: false, message: "Item not found" });
		}

		if (item.stock === 0) {
			return res
				.status(400)
				.json({ success: false, message: "Item out of stock" });
		}

		if (
			item.requirements?.minLevel &&
			req.user.level < item.requirements.minLevel
		) {
			return res
				.status(400)
				.json({ success: false, message: "Level requirement not met" });
		}

		if (
			item.requirements?.requiredRole &&
			req.user.role !== item.requirements.requiredRole
		) {
			return res
				.status(400)
				.json({ success: false, message: "Role requirement not met" });
		}

		if (item.requirements?.requiredBadges?.length) {
			const hasBadges = item.requirements.requiredBadges.every((badge) =>
				req.user.badges.includes(badge),
			);

			if (!hasBadges) {
				return res
					.status(400)
					.json({ success: false, message: "Required badges missing" });
			}
		}

		const organizationId = await resolveOrganizationId(
			item.organization || req.user.organization,
		);

		await debitPoints({
			userId: req.user._id,
			organizationId,
			amount: item.price,
			type: "spent",
			source: "shop_purchase",
			reference: item._id,
			referenceType: "ShopItem",
			description: `Purchased item: ${item.name}`,
			processedBy: req.user._id,
			metadata: {
				itemName: item.name,
			},
		});

		const purchase = await Purchase.create({
			user: req.user._id,
			item: item._id,
			organization: organizationId,
			pointsSpent: item.price,
			status: "completed",
			processedBy: req.user._id,
			processedAt: new Date(),
			benefitsApplied: {
				pointsBonus: item.benefits?.pointsBonus || 0,
				roleUpgrade: item.benefits?.roleUpgrade,
				customBadge: item.benefits?.customBadge,
				specialAccess: item.benefits?.specialAccess,
			},
		});

		item.soldCount += 1;
		if (item.stock > 0) {
			item.stock -= 1;
		}
		await item.save();

		return res.status(201).json({ success: true, data: purchase });
	} catch (error) {
		console.error("Purchase item error:", error);
		return res.status(error.statusCode || 500).json({
			success: false,
			message: error.message || "Failed to purchase item",
		});
	}
};

export const listMyPurchases = async (req, res) => {
	try {
		const purchases = await Purchase.find({ user: req.user._id })
			.populate("item", "name category price")
			.sort({ purchasedAt: -1 });

		return res.status(200).json({ success: true, data: purchases });
	} catch (error) {
		console.error("List purchases error:", error);
		return res
			.status(500)
			.json({ success: false, message: "Failed to fetch purchases" });
	}
};
