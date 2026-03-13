import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "changeme-super-secret";

export const protect = async (req, res, next) => {
	let token;
	const authHeader = req.headers.authorization;

	if (authHeader && authHeader.startsWith("Bearer")) {
		try {
			token = authHeader.split(" ")[1];
			const decoded = jwt.verify(token, JWT_SECRET);
			req.user = await User.findById(decoded.id).select("-password");
			if (!req.user) {
				return res
					.status(401)
					.json({ success: false, message: "Not authorized, user not found" });
			}

			return next();
		} catch (error) {
			return res
				.status(401)
				.json({ success: false, message: "Not authorized, token failed" });
		}
	}

	if (!token) {
		return res
			.status(401)
			.json({ success: false, message: "Not authorized, no token" });
	}
};

export const authorize = (...roles) => {
	return (req, res, next) => {
		if (!req.user || !roles.includes(req.user.role)) {
			return res.status(403).json({ success: false, message: "Forbidden" });
		}
		next();
	};
};

export const optionalProtect = async (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Bearer")) {
		return next();
	}

	try {
		const token = authHeader.split(" ")[1];
		const decoded = jwt.verify(token, JWT_SECRET);
		const user = await User.findById(decoded.id).select("-password");
		if (user) {
			req.user = user;
		}
	} catch (error) {
		// Optional auth should not block public access.
	}

	return next();
};
