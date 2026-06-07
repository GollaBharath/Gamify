import session from "express-session";

export const getSessionConfig = (isProduction) => {
  return {
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    proxy: isProduction,
    cookie: {
      secure: isProduction,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  };
};
