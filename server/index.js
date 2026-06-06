import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { corsOptions } from "./config/cors.js";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import pointsRouter from "./routes/pointsRoutes.js";
import newsletterRoutes from "./routes/newsletter.js";
import eventRoutes from "./routes/eventRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import shopRoutes from "./routes/shopRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import discordRoutes from "./routes/discordRoutes.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import session from "express-session";
import passport from "passport";
import "./config/passport.js"; // load Google OAuth strategy
import morgan from "morgan";
import mongoose from "mongoose"; // For DB status in health check

const requiredEnv = ["MONGO_URI", "JWT_SECRET", "SESSION_SECRET"];
const missingEnv = requiredEnv.filter((name) => !process.env[name]);
if (missingEnv.length) {
  console.error(
    "❌ Missing required environment variables:",
    missingEnv.join(", "),
  );
  process.exit(1);
}

// Connect to DB - Only in local/dev mode
if (process.env.LOCAL_DEV) {
  connectDB();
}

const app = express();

// Trust proxy for accurate IP detection behind load balancers
app.set("trust proxy", 1);

// Middlewares
app.use(express.json());
app.use(helmet()); // Security headers

// CORS must be registered before rate limiting so that 429 responses
// still include the Access-Control-Allow-Origin header.
app.use(cors(corsOptions));

app.use(
	rateLimit({
		windowMs: 15 * 60 * 1000, // 15 minutes
		max: 100, // Limit each IP to 100 requests per window
	}),
);

// Request logging
app.use(morgan("dev"));

const isProduction = process.env.NODE_ENV === "production";

app.use(
	session({
		secret: process.env.SESSION_SECRET || "supersecret",
		resave: false,
		saveUninitialized: false,
		proxy: isProduction,
		cookie: {
			secure: isProduction,
			sameSite: "lax",
		},
	}),
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get("/", (req, res) => {
	res.json({
		message: "Gamify API Server",
		version: "1.0.0",
		documentation: "Refer to README.md for API usage details",
		status: "running",
		endpoints: {
			health: "/api/health",
			auth: "/api/auth/*",
			users: "/api/users/*",
			points: "/api/points/*",
			events: "/api/events/*",
			tasks: "/api/tasks/*",
			shop: "/api/shop/*",
			leaderboard: "/api/leaderboard/*",
			newsletter: "/api/newsletter/*",
			discord: "/api/discord/*",
		},
	});
});

app.get("/api/health", (req, res) => {
	res.json({
		ok: true,
		time: new Date().toISOString(),
		uptime: process.uptime(),
		environment: process.env.NODE_ENV || "development",
		db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
	});
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/points", pointsRouter);
app.use("/api/events", eventRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/discord", discordRoutes);

// 404 handler
app.use((req, res) => {
	res.status(404).json({ success: false, message: "Requested API route was not found" });
});

// Improved error handler
app.use((err, req, res, next) => {
	console.error("Unhandled error:", err);
	const status = err.statusCode || 500;
	res.status(status).json({
		success: false,
		message: err.message || "Internal server error",
	});
});

const PORT = process.env.PORT || 5173;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
	console.log(`JWT expires in: ${JWT_EXPIRES_IN}`);
});
