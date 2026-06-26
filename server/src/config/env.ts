import dotenv from "dotenv";

dotenv.config();

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "5000", 10),
  mongoUri: required("MONGODB_URI", process.env.MONGODB_URI),
  jwtSecret: required("JWT_SECRET", process.env.JWT_SECRET),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  jwtRememberExpiresIn: process.env.JWT_REMEMBER_EXPIRES_IN || "30d",
  corsOrigins: (process.env.CORS_ORIGINS || "http://localhost:3000")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || "200", 10),
  isProduction: process.env.NODE_ENV === "production",
};
