import { Hono } from "hono";
import { serveStatic } from "hono/cloudflare-workers";
import { logger } from "hono/logger";

// Create a simple API documentation endpoint
const app = new Hono();

app.get("/", (c) => {
  return c.json({
    message: "Gamify API Server (Cloudflare Workers)",
    version: "1.0.0",
    status: "running",
    environment: c.env?.NODE_ENV || "production",
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

app.get("/api/health", (c) => {
  return c.json({
    ok: true,
    time: new Date().toISOString(),
    uptime: process.uptime(),
    environment: c.env?.NODE_ENV || "production",
    platform: "cloudflare-workers",
  });
});

// Note: For a full Express app deployment to Cloudflare Workers,
// you would need to either:
// 1. Use the Node.js compatibility mode with wrangler.jsonc (as configured)
// 2. Rewrite endpoints using Hono (recommended for Workers)
// 3. Use a framework adapter like `@hono/node-server` for Express
//
// The current wrangler.jsonc configuration uses Node.js compat mode
// which allows running the Express app with some limitations.
//
// For production, consider migrating to Hono for better performance
// and full Workers feature support.

export default app;