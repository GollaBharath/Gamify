const defaultOrigins = [
  "http://localhost:5173",
  "http://localhost:5000",
  "http://localhost:5001"
];

export const getCorsOptions = () => {
  const allowedOrigins = process.env.CORS_ORIGINS?.split(",") || defaultOrigins;
  
  return {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS policy"));
      }
    },
    credentials: true,
  };
};
