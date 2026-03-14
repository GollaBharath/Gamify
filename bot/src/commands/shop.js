"use strict";

const {
	SlashCommandBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
} = require("discord.js");

const { resolveContext } = require("../apiClient");
const {
	shopListEmbed,
	shopItemEmbed,
	successEmbed,
	errorEmbed,
	infoEmbed,
	confirmEmbed,
	COLORS,
} = require("../utils/embeds");
const { buildPageButtons, nextPage } = require("../utils/pagination");
const { shopItemCreateModal } = require("../utils/modals");
const { formatPoints } = require("../utils/formatters");
const { EmbedBuilder } = require("discord.js");

const PER_PAGE = 5;

async function fetchShopPage(api, page) {
	const res = await api.get('/api/shop/items');
	const allItems = res.data.data ?? [];
	const total = Math.max(1, Math.ceil(allItems.length / PER_PAGE));
	const safePage = Math.min(page, total);
	const items = allItems.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);
	return { items, totalPages: total };
}

// ─── Pagination ────────────────────────────────────────────────────────────────

async function handlePageButton(interaction, parsed) {
	if (parsed.type !== "shop") return false;
	await interaction.deferUpdate();
	let ctx;
	try {
		ctx = await resolveContext(interaction);
	} catch {
		return;
	}

	const newPage = nextPage(parsed.page, parsed.direction, 9999);
	try {
		const { items, totalPages } = await fetchShopPage(ctx.api, newPage);
		const embed = shopListEmbed(items, newPage, totalPages);
		const pageRow = buildPageButtons("shop", newPage, totalPages);

		const components = [pageRow];
		if (items.length > 0) {
			const select = new StringSelectMenuBuilder()
				.setCustomId("sel:shop:view")
				.setPlaceholder("View item details…")
				.addOptions(
					items.slice(0, 25).map((it) =>
						new StringSelectMenuOptionBuilder()
							.setLabel((it.title ?? it.name ?? "Item").slice(0, 100))
							.setValue(it._id)
							.setDescription(formatPoints(it.price)),
					),
				);
			components.push(new ActionRowBuilder().addComponents(select));
		}

		return interaction.editReply({ embeds: [embed], components });
	} catch {}
}

// ─── Button handler ───────────────────────────────────────────────────────────

async function handleButton(interaction) {
	const id = interaction.customId;

	// Show buy confirm dialog
	if (id.startsWith("btn:shop:buyconfirm:")) {
		const itemId = id.split(":")[3];
		await interaction.deferUpdate();
		let ctx;
		try {
			ctx = await resolveContext(interaction);
		} catch {
			return;
		}

		try {
			const res = await ctx.api.get("/api/shop/items");
			const items = res.data.data ?? [];
			const item = items.find((i) => i._id === itemId);
			if (!item)
				return interaction.editReply({
					embeds: [errorEmbed("Not Found", "Item not found.")],
				});

			const embed = confirmEmbed(
				`Buy ${item.title ?? item.name}`,
				`This will deduct **${formatPoints(item.price)}** from your balance.\n\nYour current balance: **${formatPoints(ctx.user.points)}**`,
			);

			const row = new ActionRowBuilder().addComponents(
				new ButtonBuilder()
					.setCustomId(`btn:shop:dopurchase:${itemId}`)
					.setLabel("✓  Confirm Purchase")
					.setStyle(ButtonStyle.Success),
				new ButtonBuilder()
					.setCustomId("btn:shop:cancel")
					.setLabel("Cancel")
					.setStyle(ButtonStyle.Secondary),
			);

			return interaction.editReply({ embeds: [embed], components: [row] });
		} catch {
			return interaction.editReply({
				embeds: [errorEmbed("Error", "Could not load item.")],
			});
		}
	}

	// Execute purchase
	if (id.startsWith("btn:shop:dopurchase:")) {
		const itemId = id.split(":")[3];
		await interaction.deferUpdate();
		let ctx;
		try {
			ctx = await resolveContext(interaction);
		} catch {
			return;
		}

		try {
			const res = await ctx.api.post(`/api/shop/items/${itemId}/purchase`);
			const purchase = res.data.data;
			return interaction.editReply({
				embeds: [
					successEmbed(
						"Purchase Complete!",
						`Item purchased successfully!\nPoints spent: **${formatPoints(purchase.pointsSpent ?? 0)}**\n\nYour purchase is being processed.`,
					),
				],
				components: [],
			});
		} catch (err) {
			return interaction.editReply({
				embeds: [
					errorEmbed(
						"Purchase Failed",
						err.response?.data?.message ?? "Could not complete purchase.",
					),
				],
				components: [],
			});
		}
	}

	if (id === "btn:shop:cancel") {
		return interaction.update({
			embeds: [infoEmbed("Cancelled", "Purchase cancelled.")],
			components: [],
		});
	}
}

// ─── Modal handler ─────────────────────────────────────────────────────────────

async function handleModal(interaction) {
	if (interaction.customId !== "modal:shop:create") return;

	const name = interaction.fields.getTextInputValue("name").trim();
	const description = interaction.fields
		.getTextInputValue("description")
		.trim();
	const price = parseInt(interaction.fields.getTextInputValue("price"), 10);
	const stock = parseInt(interaction.fields.getTextInputValue("stock"), 10);

	await interaction.deferReply({ ephemeral: true });
	let ctx;
	try {
		ctx = await resolveContext(interaction);
	} catch {
		return;
	}

	if (!["Admin", "Organisation"].includes(ctx.user.role)) {
		return interaction.editReply({
			embeds: [
				errorEmbed("Permission Denied", "Only Admins can create shop items."),
			],
		});
	}

	try {
		const res = await ctx.api.post("/api/shop/items", {
			name,
			description,
			price: Math.max(1, price || 100),
			stock: isNaN(stock) ? -1 : stock,
			isActive: true,
		});
		const item = res.data.data;
		return interaction.editReply({
			embeds: [
				successEmbed(
					"Item Created",
					`**${item.name ?? item.title}** is now in the shop!\nPrice: ${formatPoints(item.price)}\nID: \`${item._id}\``,
				),
			],
		});
	} catch (err) {
		return interaction.editReply({
			embeds: [
				errorEmbed(
					"Error",
					err.response?.data?.message ?? "Could not create item.",
				),
			],
		});
	}
}

// ─── Slash command ────────────────────────────────────────────────────────────

module.exports = {
	data: new SlashCommandBuilder()
		.setName("shop")
		.setDescription("Browse and purchase shop items")
		.addSubcommand((sub) =>
			sub.setName("list").setDescription("Browse all shop items"),
		)
		.addSubcommand((sub) =>
			sub
				.setName("view")
				.setDescription("View a shop item")
				.addStringOption((opt) =>
					opt.setName("id").setDescription("Item ID").setRequired(true),
				),
		)
		.addSubcommand((sub) =>
			sub
				.setName("buy")
				.setDescription("Purchase an item")
				.addStringOption((opt) =>
					opt.setName("id").setDescription("Item ID").setRequired(true),
				),
		)
		.addSubcommand((sub) =>
			sub.setName("create").setDescription("Create a shop item (Admin+)"),
		)
		.addSubcommand((sub) =>
			sub.setName("mypurchases").setDescription("View your purchase history"),
		),

	async execute(interaction) {
		const sub = interaction.options.getSubcommand();

		if (sub === "create") {
			let ctx;
			try {
				ctx = await resolveContext(interaction);
			} catch {
				return interaction.reply({
					embeds: [errorEmbed("Error", "Could not authenticate.")],
					ephemeral: true,
				});
			}
			if (!["Admin", "Organisation"].includes(ctx.user.role)) {
				return interaction.reply({
					embeds: [
						errorEmbed(
							"Permission Denied",
							"Only Admins can create shop items.",
						),
					],
					ephemeral: true,
				});
			}
			return interaction.showModal(shopItemCreateModal());
		}

		await interaction.deferReply({ ephemeral: true });

		let ctx;
		try {
			ctx = await resolveContext(interaction);
		} catch (err) {
			if (err.code === "not_configured") {
				return interaction.editReply({
					embeds: [infoEmbed("Not Configured", "Run `/setup` first.")],
				});
			}
			throw err;
		}

		if (sub === "list") {
			try {
				const { items, totalPages } = await fetchShopPage(ctx.api, 1);
				const embed = shopListEmbed(items, 1, totalPages);
				const pageRow = buildPageButtons("shop", 1, totalPages);

				const components = [pageRow];
				if (items.length > 0) {
					const select = new StringSelectMenuBuilder()
						.setCustomId("sel:shop:view")
						.setPlaceholder("View item details…")
						.addOptions(
							items.slice(0, 25).map((it) =>
								new StringSelectMenuOptionBuilder()
									.setLabel((it.title ?? it.name ?? "Item").slice(0, 100))
									.setValue(it._id)
									.setDescription(formatPoints(it.price)),
							),
						);
					components.push(new ActionRowBuilder().addComponents(select));
				}

				return interaction.editReply({ embeds: [embed], components });
			} catch {
				return interaction.editReply({
					embeds: [errorEmbed("Error", "Could not load shop.")],
				});
			}
		}

		if (sub === "view") {
			const itemId = interaction.options.getString("id");
			try {
				const res = await ctx.api.get("/api/shop/items");
				const items = res.data.data ?? [];
				const item = items.find((i) => i._id === itemId);
				if (!item)
					return interaction.editReply({
						embeds: [errorEmbed("Not Found", "Item not found.")],
					});

				const embed = shopItemEmbed(item);
				const row = new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setCustomId(`btn:shop:buyconfirm:${itemId}`)
						.setLabel(`🛒  Buy — ${formatPoints(item.price)}`)
						.setStyle(ButtonStyle.Primary)
						.setDisabled(item.stock === 0),
				);

				return interaction.editReply({ embeds: [embed], components: [row] });
			} catch {
				return interaction.editReply({
					embeds: [errorEmbed("Error", "Could not load item.")],
				});
			}
		}

		if (sub === "buy") {
			const itemId = interaction.options.getString("id");
			try {
				const res = await ctx.api.get("/api/shop/items");
				const items = res.data.data ?? [];
				const item = items.find((i) => i._id === itemId);
				if (!item)
					return interaction.editReply({
						embeds: [errorEmbed("Not Found", "Item not found.")],
					});

				const embed = confirmEmbed(
					`Buy ${item.title ?? item.name}`,
					`This will deduct **${formatPoints(item.price)}** from your balance.\n\nYour current balance: **${formatPoints(ctx.user.points)}**`,
				);

				const row = new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setCustomId(`btn:shop:dopurchase:${itemId}`)
						.setLabel("✓  Confirm Purchase")
						.setStyle(ButtonStyle.Success),
					new ButtonBuilder()
						.setCustomId("btn:shop:cancel")
						.setLabel("Cancel")
						.setStyle(ButtonStyle.Secondary),
				);

				return interaction.editReply({ embeds: [embed], components: [row] });
			} catch {
				return interaction.editReply({
					embeds: [errorEmbed("Error", "Could not load item.")],
				});
			}
		}

		if (sub === "mypurchases") {
			try {
				const res = await ctx.api.get("/api/shop/purchases/me");
				const purchases = res.data.data ?? [];
				const { relativeTime, truncate } = require("../utils/formatters");

				const rows = purchases
					.slice(0, 10)
					.map((p) => {
						return `🛒 **${truncate(p.item?.name ?? p.item?.title ?? "Item", 40)}**  ·  ${formatPoints(p.pointsSpent)}  ·  *${relativeTime(p.createdAt)}*  ·  ${p.status}`;
					})
					.join("\n");

				const embed = new EmbedBuilder()
					.setColor(0xff7675)
					.setTitle("🛍️  My Purchases")
					.setDescription(rows || "*No purchases yet.*")
					.setFooter({ text: "Gamify Bot" })
					.setTimestamp();

				return interaction.editReply({ embeds: [embed] });
			} catch {
				return interaction.editReply({
					embeds: [errorEmbed("Error", "Could not load purchases.")],
				});
			}
		}
	},

	handleButton,
	handleModal,
	handlePageButton,

	async handleSelectMenu(interaction) {
		if (interaction.customId !== "sel:shop:view") return;
		const itemId = interaction.values[0];
		await interaction.deferReply({ ephemeral: true });
		let ctx;
		try {
			ctx = await resolveContext(interaction);
		} catch {
			return;
		}

		try {
			const res = await ctx.api.get("/api/shop/items");
			const items = res.data.data ?? [];
			const item = items.find((i) => i._id === itemId);
			if (!item)
				return interaction.editReply({
					embeds: [errorEmbed("Not Found", "Item not found.")],
				});

			const embed = shopItemEmbed(item);
			const row = new ActionRowBuilder().addComponents(
				new ButtonBuilder()
					.setCustomId(`btn:shop:buyconfirm:${itemId}`)
					.setLabel(`🛒  Buy — ${formatPoints(item.price)}`)
					.setStyle(ButtonStyle.Primary)
					.setDisabled(item.stock === 0),
			);

			return interaction.editReply({ embeds: [embed], components: [row] });
		} catch {
			return interaction.editReply({
				embeds: [errorEmbed("Error", "Could not load item.")],
			});
		}
	},
};
