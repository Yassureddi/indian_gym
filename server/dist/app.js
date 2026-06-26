import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import { env } from "./config/env.js";
import routes from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware.js";
const app = express();
app.set("trust proxy", 1);
app.use(helmet());
app.use(cors({
    origin: env.corsOrigins,
    credentials: true,
}));
app.use(compression());
app.use(morgan(env.isProduction ? "combined" : "dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(mongoSanitize());
const limiter = rateLimit({
    windowMs: env.rateLimitWindowMs,
    max: env.rateLimitMax,
    message: { success: false, message: "Too many requests. Please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use("/api", limiter);
app.use("/api/v1", routes);
app.use(notFoundHandler);
app.use(errorHandler);
export default app;
