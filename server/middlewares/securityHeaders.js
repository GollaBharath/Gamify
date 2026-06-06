/**
 * Security Headers Middleware.
 * Adds custom HTTP headers to secure the application against common web attacks.
 */
export const customSecurityHeaders = (req, res, next) => {
  // Prevent MIME type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Prevent clickjacking
  res.setHeader("X-Frame-Options", "DENY");

  // Enable XSS filtering in browsers
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // Control referrer information sent with requests
  res.setHeader("Referrer-Policy", "no-referrer-when-downgrade");

  // Permissions policy to restrict browser features
  res.setHeader(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=(), interest-cohort=()"
  );

  next();
};
