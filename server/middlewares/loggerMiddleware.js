/**
 * Request Logging Middleware.
 * Intercepts requests and logs details like method, path, response status, 
 * response duration, client IP, and User Agent.
 */
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toISOString();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const method = req.method;
    const url = req.originalUrl || req.url;
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || req.ip;
    const userAgent = req.headers["user-agent"] || "unknown";

    // Format console output
    const statusEmoji = status >= 500 ? "❌" : status >= 400 ? "⚠️" : "✅";
    console.log(
      `[${timestamp}] ${statusEmoji} ${method} ${url} - Status: ${status} - Time: ${duration}ms - IP: ${ip} - UA: ${userAgent}`
    );
  });

  next();
};
