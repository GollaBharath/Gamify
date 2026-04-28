/**
 * Cloudflare Workers Entry Point for Express App
 * 
 * This file properly exports the Express app for Cloudflare Workers
 * using Node.js compatibility mode.
 */

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import session from "express-session";
import passport from "passport";
import morgan from "morgan";

// Routes - Import the actual routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import pointsRouter from "./routes/pointsRoutes.js";
import newsletterRoutes from "./routes/newsletter.js";
import eventRoutes from "./routes/eventRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import shopRoutes from "./routes/shopRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import discordRoutes from "./routes/discordRoutes.js";

// Initialize app
const app = express();

// Middlewares
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(helmet({ contentSecurityPolicy: false }));

// CORS
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

// Rate limiting (reduced for free tier)
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    standardHeaders: true,
  }),
);

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  }),
);

app.use(passport.initialize());
app.use(passport.session());
app.use(morgan("dev"));

// Root
app.get("/", (req, res) => {
  res.json({
    message: "Gamify API Server",
    version: "1.0.0",
    status: "running",
    platform: "cloudflare-workers",
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    time: new Date().toISOString(),
    platform: "cloudflare-workers",
  });
});

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/points", pointsRouter);
app.use("/api/events", eventRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/discord", discordRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// Export for Workers (Node.js compat mode)
export default app;
