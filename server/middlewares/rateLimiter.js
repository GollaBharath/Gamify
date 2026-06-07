import rateLimit from "express-rate-limit";

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 requests per window on authentication endpoints
  message: {
    success: false,
    message: "Too many authentication requests, please try again after 15 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false,
});
