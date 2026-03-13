import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { resolveOrganizationId } from "../services/organizationService.js";

const JWT_SECRET = process.env.JWT_SECRET || "changeme-super-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
const BOOTSTRAP_ADMIN_EMAILS = (process.env.BOOTSTRAP_ADMIN_EMAILS || "")
	.split(",")
	.map((value) => value.trim().toLowerCase())
	.filter(Boolean);

// Utility to sign JWT
const signToken = (id) =>
	jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

// Utility to normalize string inputs
const normalizeInput = (str, lower = false) => {
	if (!str) return null;
	const value = str.toString().trim();
	return lower ? value.toLowerCase() : value;
};

// Helper to build response structure
const buildUserResponse = (user, token) => ({
	success: true,
	token,
	user: {
		id: user._id,
		username: user.username,
		email: user.email,
		role: user.role,
	},
});

// Register controller
export const register = async (req, res) => {
	try {
		const { username: rawUsername, email: rawEmail, password } = req.body;

		const username = normalizeInput(rawUsername);
		const email = normalizeInput(rawEmail, true);

		if (!username || !email || !password) {
			return res
				.status(400)
				.json({ success: false, message: "All fields are required" });
		}

		const existingUser = await User.findOne({ $or: [{ email }, { username }] });
		if (existingUser) {
			return res
				.status(400)
				.json({ success: false, message: "User already exists" });
		}

		const hashedPassword = await bcrypt.hash(password, 12);
		const organizationId = await resolveOrganizationId();

		const user = await User.create({
			username,
			email,
			password: hashedPassword,
			organization: organizationId,
			role: BOOTSTRAP_ADMIN_EMAILS.includes(email) ? "Admin" : "Member",
		});

		const token = signToken(user._id);
		return res.status(201).json(buildUserResponse(user, token));
	} catch (error) {
		console.error("Registration error:", error);
		return res
			.status(500)
			.json({ success: false, message: "Server error during registration" });
	}
};

// Login controller
export const login = async (req, res) => {
	try {
		const { email: rawEmail, password } = req.body;
		const email = normalizeInput(rawEmail, true);

		if (!email || !password) {
			return res
				.status(400)
				.json({ success: false, message: "Email and password are required" });
		}

		const user = await User.findOne({ email });
		if (!user) {
			return res
				.status(401)
				.json({ success: false, message: "Invalid credentials" });
		}

		if (!user.password) {
			return res.status(400).json({
				success: false,
				message: "This account uses social login. Use Google sign-in.",
			});
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res
				.status(401)
				.json({ success: false, message: "Invalid credentials" });
		}

		const token = signToken(user._id);
		return res.json(buildUserResponse(user, token));
	} catch (error) {
		console.error("Login error:", error);
		return res
			.status(500)
			.json({ success: false, message: "Server error during login" });
	}
};
