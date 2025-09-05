import express from "express";
import rateLimit from "express-rate-limit";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

// Login rate limiter - stricter limits for login attempts
const loginLimiter = rateLimit({
  windowMs: parseInt(process.env.AUTH_LOGIN_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes default
  max: parseInt(process.env.AUTH_LOGIN_MAX) || 10, // 10 attempts per window
  message: {
    success: false,
    message: "Too many login attempts. Try again later."
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Registration rate limiter - prevent account creation abuse
const registerLimiter = rateLimit({
  windowMs: parseInt(process.env.AUTH_REGISTER_WINDOW_MS) || 60 * 60 * 1000, // 1 hour default
  max: parseInt(process.env.AUTH_REGISTER_MAX) || 5, // 5 registrations per hour
  message: {
    success: false,
    message: "Too many registration attempts. Try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiters to specific routes
router.post("/register", registerLimiter, register);
router.post("/login", loginLimiter, login);

export default router;
