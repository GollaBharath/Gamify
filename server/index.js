import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import pointsRouter from "./routes/pointsRoutes.js";
import newsletterRoutes from "./routes/newsletter.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import mongoose from "mongoose"; // For DB status in health check

// ✅ Connect to DB
connectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(helmet()); // Security headers
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
  })
);

// Request logging
app.use(morgan("dev"));

// Configurable CORS
const allowedOrigins = process.env.CORS_ORIGINS?.split(",") || ["http://localhost:5173"];
app.use(
  cors({

    credentials: true,
  })
);

// Routes
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    time: new Date().toISOString(),
    uptime: process.uptime(),
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/points", pointsRouter);
app.use("/api/newsletter", newsletterRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
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

const PORT = process.env.PORT || 5000;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`JWT expires in: ${JWT_EXPIRES_IN}`);
});
