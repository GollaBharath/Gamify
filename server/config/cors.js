/**
 * Hardened CORS configuration.
 * Dynamically validates origins against a whitelist and restricts non-browser/empty origins in production.
 */
export const corsOptions = {
  origin: (origin, callback) => {
    const isProduction = process.env.NODE_ENV === "production";
    const allowedOrigins = process.env.CORS_ORIGINS?.split(",").map((o) => o.trim()) || [];

    // Allow requests with no origin (like mobile apps, curl, or postman) ONLY in development
    if (!origin) {
      if (isProduction) {
        return callback(new Error("CORS policy: requests without origin are blocked in production"), false);
      }
      return callback(null, true);
    }

    // Check if origin is allowed
    const isAllowed = allowedOrigins.includes(origin) || 
      (!isProduction && (
        origin.startsWith("http://localhost:") || 
        origin.startsWith("http://127.0.0.1:")
      ));

    if (isAllowed) {
      return callback(null, true);
    }

    return callback(new Error(`CORS policy: Origin ${origin} not allowed`), false);
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
