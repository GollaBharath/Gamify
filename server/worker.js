import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
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
import "./config/passport.js";
import morgan from "morgan";
import mongoose from "mongoose";

// Connect to DB - Only when running in actual server mode (not worker mode)
if (typeof process.env.CONNECT_DB !== "undefined" || typeof process.env.MONGO_URI !== "undefined") {
  connectDB();
}

const app = express();

// Trust proxy for accurate IP detection behind load balancers
app.set("trust proxy", true);

// Middlewares
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === "production" ? undefined : false,
  crossOriginEmbedderPolicy: process.env.NODE_ENV === "production" ? undefined : false,
}));

// CORS configuration
const allowedOrigins = process.env.CORS_ORIGINS?.split(",") || [
  "http://localhost:5173",
  "http://localhost:5000",
  "http://localhost:5001",
  "https://gamify.pages.dev",
  "https://*.pages.dev",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

// Rate limiting - adjusted for Cloudflare Workers free tier limits
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Reduced from 100 to stay within free tier limits (50 subrequests)
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again later.",
});

app.use(limiter);

// Request logging
app.use(morgan("dev"));

// Session configuration - uses memory store for development
// Note: For production on Workers, consider using Durable Objects or external session store
let sessionConfig: any = {
  secret: process.env.SESSION_SECRET || "supersecret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
};

app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "Gamify API Server",
    version: "1.0.0",
    status: "running",
    environment: process.env.NODE_ENV || "development",
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
    db: mongoose.connection?.readyState === 1 ? "connected" : "disconnected",
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
  res.status(404).json({ success: false, message: "Route not found" });
});

// Improved error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error("Unhandled error:", err);
  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// For local development with Node.js
if (process.env.LOCAL_DEV) {
  const PORT = process.env.PORT || 5173;
  const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`JWT expires in: ${JWT_EXPIRES_IN}`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  });
}

// Export for Cloudflare Workers
export default app;