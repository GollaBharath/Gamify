import express from "express";

import rateLimit from "express-rate-limit";

import passport from "passport";
import jwt from "jsonwebtoken";

import { register, login } from "../controllers/authController.js";

const router = express.Router();

// Shared rate-limit handler that preserves CORS headers already set by
// the global cors() middleware and returns a JSON error body.
const rateLimitHandler = (req, res) => {
	// CORS headers are set by the global cors() middleware earlier in the
	// stack, but express-rate-limit may send the response before they are
	// flushed in some configurations – mirror the origin explicitly here.
	const origin = req.headers.origin;
	if (origin) {
		res.setHeader("Access-Control-Allow-Origin", origin);
		res.setHeader("Access-Control-Allow-Credentials", "true");
		res.setHeader("Vary", "Origin");
	}
	res.status(429).json({
		success: false,
		message: "Too many requests. Please try again later.",
	});
};

// Login rate limiter - stricter limits for login attempts
const loginLimiter = rateLimit({
  windowMs: parseInt(process.env.AUTH_LOGIN_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes default
  max: parseInt(process.env.AUTH_LOGIN_MAX) || 30, // 30 attempts per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: rateLimitHandler,
});

// Registration rate limiter - prevent account creation abuse
const registerLimiter = rateLimit({
  windowMs: parseInt(process.env.AUTH_REGISTER_WINDOW_MS) || 60 * 60 * 1000, // 1 hour default
  max: parseInt(process.env.AUTH_REGISTER_MAX) || 20, // 20 registrations per hour
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

// Apply rate limiters to specific routes
router.post("/register", registerLimiter, register);
router.post("/login", loginLimiter, login);
router.post('/refresh', async (req, res) => {
  // Add refresh token logic here
});
router.get("/google", passport.authenticate("google",{ scope: ["profile", "email"] }))

router.get("/google/callback",
    passport.authenticate("google", {failureRedirect: "http://localhost:5000/auth" }),
    (req, res) => {
      
        const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || "7d",
        })
        // redirect back to frontend with token in query
        res.redirect(`http://localhost:5173/app?token=${token}`)
    }
)

export default router;
