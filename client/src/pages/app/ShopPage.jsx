import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	RiStore2Line,
	RiAddLine,
	RiCloseLine,
	RiCheckLine,
	RiCoinsLine,
	RiShoppingCartLine,
	RiHistoryLine,
	RiSearchLine,
	RiGiftLine,
	RiStarLine,
} from "react-icons/ri";
import { toast } from "react-toastify";
import { api } from "../../api/client.js";
import { useAuth } from "../../Context/AuthContext.jsx";

const ADMIN_ORG = ["Admin", "Organisation"];
const prettyDate = (v) =>
	v
		? new Date(v).toLocaleDateString("en-GB", {
				day: "numeric",
				month: "short",
				year: "numeric",
			})
		: "–";
const CATEGORIES = [
	"all",
	"badge",
	"role",
	"feature",
	"physical",
	"virtual",
	"custom",
];

const catColor = {
	badge: "var(--amber-mid)",
	role: "var(--purple-light)",
	feature: "var(--cyan-light)",
	physical: "var(--green-mid)",
	virtual: "var(--text-2)",
	custom: "var(--orange-mid)",
};
const catBg = {
	badge: "rgba(245,158,11,0.12)",
	role: "rgba(124,58,237,0.12)",
	feature: "rgba(6,182,212,0.12)",
	physical: "rgba(16,185,129,0.12)",
	virtual: "rgba(100,116,139,0.1)",
	custom: "rgba(249,115,22,0.12)",
};
const catIcon = {
	badge: "🏅",
	role: "👑",
	feature: "⚡",
	physical: "📦",
	virtual: "💫",
	custom: "✨",
};

const fade = {
	hidden: { opacity: 0, y: 12 },
	show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

// ── Create Item Modal ─────────────────────────────────────────
const CreateItemModal = ({ onClose, onCreated }) => {
	const [form, setForm] = useState({
		name: "",
		description: "",
		price: 50,
		category: "virtual",
		stock: -1,
		isFeatured: false,
	});
	const [loading, setLoading] = useState(false);
	const update = (f) => (e) =>
		setForm((p) => ({
			...p,
			[f]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
		}));

	const submit = async (e) => {
		e.preventDefault();
		if (!form.name || !form.price) {
			toast.error("Name and price are required.");
			return;
		}
		setLoading(true);
		try {
			await api.post("/api/shop/items", {
				...form,
				price: parseInt(form.price, 10),
				stock: parseInt(form.stock, 10),
			});
			toast.success("Shop item created!");
			onCreated();
		} catch (err) {
			toast.error(err?.response?.data?.message || "Failed to create item.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			className="modal-overlay"
			onClick={(e) => e.target === e.currentTarget && onClose()}>
			<motion.div
				className="modal"
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}>
				<div className="modal-header">
					<h2 className="modal-title">Create Shop Item</h2>
					<button className="btn btn-ghost btn-sm" onClick={onClose}>
						<RiCloseLine />
					</button>
				</div>
				<form onSubmit={submit} className="form-section">
					<div className="form-group">
						<label className="form-label">Item Name *</label>
						<input
							className="form-input"
							value={form.name}
							onChange={update("name")}
							placeholder="e.g. Gold Badge"
							required
						/>
					</div>
					<div className="form-group">
						<label className="form-label">Description</label>
						<textarea
							className="form-textarea"
							value={form.description}
							onChange={update("description")}
							placeholder="What does this item do?"
							style={{ minHeight: 70 }}
						/>
					</div>
					<div className="form-row">
						<div className="form-group">
							<label className="form-label">Price (points) *</label>
							<input
								className="form-input"
								type="number"
								min={1}
								value={form.price}
								onChange={update("price")}
								required
							/>
						</div>
						<div className="form-group">
							<label className="form-label">Category</label>
							<select
								className="form-select"
								value={form.category}
								onChange={update("category")}>
								{[
									"badge",
									"role",
									"feature",
									"physical",
									"virtual",
									"custom",
								].map((c) => (
									<option
										key={c}
										value={c}
										style={{ textTransform: "capitalize" }}>
										{c}
									</option>
								))}
							</select>
						</div>
					</div>
					<div className="form-group">
						<label className="form-label">Stock (-1 = unlimited)</label>
						<input
							className="form-input"
							type="number"
							min={-1}
							value={form.stock}
							onChange={update("stock")}
						/>
					</div>
					<label
						style={{
							display: "flex",
							alignItems: "center",
							gap: "0.6rem",
							cursor: "pointer",
							fontSize: "0.88rem",
						}}>
						<input
							type="checkbox"
							checked={form.isFeatured}
							onChange={update("isFeatured")}
							style={{ width: 16, height: 16, accentColor: "var(--purple)" }}
						/>
						<span>Mark as featured item</span>
					</label>
					<div
						style={{
							display: "flex",
							gap: "0.75rem",
							justifyContent: "flex-end",
						}}>
						<button type="button" className="btn btn-ghost" onClick={onClose}>
							Cancel
						</button>
						<button
							type="submit"
							className="btn btn-primary"
							disabled={loading}>
							{loading ? (
								<>
									<div
										className="spinner"
										style={{ width: 14, height: 14, borderWidth: 2 }}
									/>{" "}
									Creating…
								</>
							) : (
								<>
									<RiCheckLine /> Publish Item
								</>
							)}
						</button>
					</div>
				</form>
			</motion.div>
		</div>
	);
};

// ── Purchase Confirm Modal ────────────────────────────────────
const ConfirmModal = ({ item, userPoints, onClose, onConfirm }) => {
	const [loading, setLoading] = useState(false);
	const canAfford = userPoints >= item.price;

	const doPurchase = async () => {
		setLoading(true);
		try {
			await onConfirm();
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			className="modal-overlay"
			onClick={(e) => e.target === e.currentTarget && onClose()}>
			<motion.div
				className="modal"
				style={{ maxWidth: 440 }}
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}>
				<div className="modal-header">
					<h2 className="modal-title">Confirm Purchase</h2>
					<button className="btn btn-ghost btn-sm" onClick={onClose}>
						<RiCloseLine />
					</button>
				</div>
				<div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
					<div
						style={{
							background: "var(--bg-2)",
							border: "1px solid var(--border)",
							borderRadius: "var(--r-lg)",
							padding: "1rem",
						}}>
						<h3 style={{ fontWeight: 700, marginBottom: "0.35rem" }}>
							{item.name}
						</h3>
						{item.description && (
							<p style={{ fontSize: "0.84rem", color: "var(--text-2)" }}>
								{item.description}
							</p>
						)}
					</div>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							padding: "0.75rem 0",
							borderTop: "1px solid var(--border)",
							borderBottom: "1px solid var(--border)",
						}}>
						<span style={{ fontSize: "0.88rem", color: "var(--text-2)" }}>
							Cost
						</span>
						<span
							style={{
								fontFamily: "var(--font-mono)",
								fontWeight: 700,
								color: "var(--amber-mid)",
							}}>
							{item.price.toLocaleString()} pts
						</span>
					</div>
					<div style={{ display: "flex", justifyContent: "space-between" }}>
						<span style={{ fontSize: "0.88rem", color: "var(--text-2)" }}>
							Your balance
						</span>
						<span
							style={{
								fontFamily: "var(--font-mono)",
								fontWeight: 700,
								color: canAfford ? "var(--green-mid)" : "var(--red-mid)",
							}}>
							{userPoints.toLocaleString()} pts
						</span>
					</div>
					{!canAfford && (
						<div className="alert alert-error" style={{ fontSize: "0.84rem" }}>
							You need {(item.price - userPoints).toLocaleString()} more points.
						</div>
					)}
					<div
						style={{
							display: "flex",
							gap: "0.75rem",
							justifyContent: "flex-end",
						}}>
						<button className="btn btn-ghost" onClick={onClose}>
							Cancel
						</button>
						<button
							className="btn btn-amber"
							onClick={doPurchase}
							disabled={!canAfford || loading}>
							{loading ? (
								<>
									<div
										className="spinner"
										style={{ width: 14, height: 14, borderWidth: 2 }}
									/>{" "}
									Buying…
								</>
							) : (
								<>
									<RiShoppingCartLine /> Buy Now
								</>
							)}
						</button>
					</div>
				</div>
			</motion.div>
		</div>
	);
};

// ── Shop Page ─────────────────────────────────────────────────
export const ShopPage = () => {
	const { user, refreshProfile } = useAuth();
	const [items, setItems] = useState([]);
	const [purchases, setPurchases] = useState([]);
	const [tab, setTab] = useState("shop");
	const [loading, setLoading] = useState(true);
	const [catFilter, setCatFilter] = useState("all");
	const [search, setSearch] = useState("");
	const [showCreate, setShowCreate] = useState(false);
	const [confirmItem, setConfirm] = useState(null);

	const canManage = ADMIN_ORG.includes(user?.role);

	const loadData = async () => {
		setLoading(true);
		try {
			const [iRes, pRes] = await Promise.all([
				api.get("/api/shop/items"),
				api.get("/api/shop/purchases/me"),
			]);
			setItems(iRes.data?.data || []);
			setPurchases(pRes.data?.data || []);
		} catch {
			toast.error("Failed to load shop.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadData();
	}, []);

	const doPurchase = async (item) => {
		try {
			await api.post(`/api/shop/items/${item._id}/purchase`);
			toast.success(`Purchased "${item.name}"!`);
			await Promise.all([loadData(), refreshProfile()]);
		} catch (err) {
			toast.error(err?.response?.data?.message || "Purchase failed.");
		} finally {
			setConfirm(null);
		}
	};

	const visible = useMemo(
		() =>
			items.filter((i) => {
				const matchCat = catFilter === "all" || i.category === catFilter;
				const matchSearch =
					!search || i.name.toLowerCase().includes(search.toLowerCase());
				const matchActive = i.isActive !== false;
				return matchCat && matchSearch && matchActive;
			}),
		[items, catFilter, search],
	);

	if (loading)
		return (
			<div
				style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
				<div className="spinner spinner-lg" />
			</div>
		);

	return (
		<>
			{showCreate && (
				<CreateItemModal
					onClose={() => setShowCreate(false)}
					onCreated={() => {
						loadData();
						setShowCreate(false);
					}}
				/>
			)}
			{confirmItem && (
				<ConfirmModal
					item={confirmItem}
					userPoints={user?.points ?? 0}
					onClose={() => setConfirm(null)}
					onConfirm={() => doPurchase(confirmItem)}
				/>
			)}

			<div>
				{/* Header */}
				<div className="page-header">
					<div>
						<h1 className="page-title">Shop</h1>
						<p className="page-subtitle">
							Spend your points on exclusive rewards and perks
						</p>
					</div>
					<div
						style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
						<div
							className="topbar-points-pill"
							style={{ display: "inline-flex" }}>
							<RiCoinsLine />
							<span>{(user?.points ?? 0).toLocaleString()}</span>
							<span style={{ opacity: 0.6 }}>available</span>
						</div>
						{canManage && (
							<button
								className="btn btn-primary"
								onClick={() => setShowCreate(true)}>
								<RiAddLine /> Add Item
							</button>
						)}
					</div>
				</div>

				{/* Tab + filter row */}
				<div
					style={{
						display: "flex",
						gap: "1rem",
						flexWrap: "wrap",
						alignItems: "center",
						marginBottom: "1.25rem",
					}}>
					<div className="tab-bar" style={{ maxWidth: 280 }}>
						<button
							className={`tab-btn${tab === "shop" ? " active" : ""}`}
							onClick={() => setTab("shop")}>
							<RiStore2Line /> Catalog
						</button>
						<button
							className={`tab-btn${tab === "hist" ? " active" : ""}`}
							onClick={() => setTab("hist")}>
							<RiHistoryLine /> Purchases
						</button>
					</div>

					{tab === "shop" && (
						<div style={{ position: "relative", flex: "0 0 200px" }}>
							<RiSearchLine
								style={{
									position: "absolute",
									left: "0.75rem",
									top: "50%",
									transform: "translateY(-50%)",
									color: "var(--text-3)",
								}}
							/>
							<input
								className="form-input"
								placeholder="Search items…"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								style={{ paddingLeft: "2.25rem" }}
							/>
						</div>
					)}
				</div>

				{tab === "shop" && (
					<>
						{/* Category filter */}
						<div
							style={{
								display: "flex",
								gap: "0.35rem",
								flexWrap: "wrap",
								marginBottom: "1.25rem",
							}}>
							{CATEGORIES.map((c) => (
								<button
									key={c}
									className={`btn btn-sm ${catFilter === c ? "btn-primary" : "btn-ghost"}`}
									onClick={() => setCatFilter(c)}
									style={{ textTransform: "capitalize" }}>
									{c !== "all" && catIcon[c] ? catIcon[c] + " " : ""}
									{c}
								</button>
							))}
						</div>

						{visible.length === 0 ? (
							<div className="card">
								<div className="empty-state">
									<div className="empty-state-icon">
										<RiStore2Line />
									</div>
									<h3>No items found</h3>
									<p>
										{search || catFilter !== "all"
											? "Try adjusting filters."
											: "The shop is empty."}
									</p>
								</div>
							</div>
						) : (
							<motion.div
								className="shop-grid"
								variants={stagger}
								initial="hidden"
								animate="show">
								{visible.map((item) => {
									const canBuy = (user?.points ?? 0) >= item.price;
									return (
										<motion.div
											key={item._id}
											className="shop-card"
											variants={fade}>
											{item.isFeatured && (
												<div
													style={{
														background:
															"linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.05))",
														borderBottom: "1px solid rgba(245,158,11,0.2)",
														padding: "0.4rem 1.25rem",
														fontSize: "0.72rem",
														fontWeight: 700,
														color: "var(--amber-mid)",
														display: "flex",
														alignItems: "center",
														gap: "0.3rem",
													}}>
													<RiStarLine /> Featured
												</div>
											)}
											<div className="shop-card-body">
												<div
													style={{
														display: "flex",
														alignItems: "flex-start",
														gap: "0.75rem",
														marginBottom: "0.625rem",
													}}>
													<div
														style={{
															width: 40,
															height: 40,
															borderRadius: "var(--r-md)",
															flexShrink: 0,
															background: catBg[item.category] || "var(--bg-3)",
															display: "flex",
															alignItems: "center",
															justifyContent: "center",
															fontSize: "1.2rem",
														}}>
														{catIcon[item.category] || "📦"}
													</div>
													<div style={{ flex: 1, minWidth: 0 }}>
														<h3
															style={{
																fontWeight: 700,
																fontSize: "0.95rem",
																marginBottom: "0.2rem",
																overflow: "hidden",
																textOverflow: "ellipsis",
																whiteSpace: "nowrap",
															}}>
															{item.name}
														</h3>
														<span
															style={{
																background:
																	catBg[item.category] || "var(--bg-3)",
																color:
																	catColor[item.category] || "var(--text-2)",
																border: `1px solid ${(catBg[item.category] || "var(--bg-3)").replace("0.12", "0.3")}`,
																borderRadius: "9999px",
																padding: "0.15rem 0.5rem",
																fontSize: "0.68rem",
																fontWeight: 700,
																textTransform: "capitalize",
															}}>
															{item.category}
														</span>
													</div>
												</div>
												{item.description && (
													<p
														style={{
															fontSize: "0.82rem",
															color: "var(--text-2)",
															lineHeight: 1.6,
															marginBottom: "0.625rem",
														}}>
														{item.description.length > 100
															? item.description.slice(0, 100) + "…"
															: item.description}
													</p>
												)}
												{item.stock !== -1 && (
													<p
														style={{
															fontSize: "0.74rem",
															color: "var(--text-3)",
														}}>
														{item.stock - (item.soldCount ?? 0)} remaining
													</p>
												)}
											</div>
											<div className="shop-card-footer">
												<span
													style={{
														fontFamily: "var(--font-mono)",
														fontWeight: 700,
														fontSize: "0.95rem",
														color: "var(--amber-mid)",
														display: "flex",
														alignItems: "center",
														gap: "0.3rem",
													}}>
													<RiCoinsLine /> {item.price.toLocaleString()}
												</span>
												<button
													className={`btn btn-sm ${canBuy ? "btn-amber" : "btn-ghost"}`}
													onClick={() => canBuy && setConfirm(item)}
													disabled={!canBuy}
													title={!canBuy ? "Not enough points" : ""}>
													<RiShoppingCartLine /> {canBuy ? "Buy" : "Need pts"}
												</button>
											</div>
										</motion.div>
									);
								})}
							</motion.div>
						)}
					</>
				)}

				{tab === "hist" && (
					<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
						{purchases.length === 0 ? (
							<div className="card">
								<div className="empty-state">
									<div className="empty-state-icon">
										<RiGiftLine />
									</div>
									<h3>No purchases yet</h3>
									<p>Items you purchase will appear here.</p>
								</div>
							</div>
						) : (
							<div className="card" style={{ padding: 0, overflow: "hidden" }}>
								<table className="data-table">
									<thead>
										<tr>
											<th>Item</th>
											<th>Category</th>
											<th>Points Spent</th>
											<th>Date</th>
											<th>Status</th>
										</tr>
									</thead>
									<tbody>
										{purchases.map((p) => (
											<tr key={p._id}>
												<td style={{ fontWeight: 600, color: "var(--text-1)" }}>
													{p.item?.name || "Item"}
												</td>
												<td style={{ textTransform: "capitalize" }}>
													{p.item?.category || "–"}
												</td>
												<td>
													<span
														style={{
															fontFamily: "var(--font-mono)",
															color: "var(--amber-mid)",
															fontWeight: 700,
														}}>
														{p.pointsSpent.toLocaleString()}
													</span>
												</td>
												<td>{prettyDate(p.purchasedAt)}</td>
												<td>
													<span
														className={`status-badge-${p.status}`}
														style={{ textTransform: "capitalize" }}>
														{p.status}
													</span>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</motion.div>
				)}
			</div>
		</>
	);
};
