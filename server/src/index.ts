import app from "./app.js";
import { env } from "./config/env.js";
import { connectDatabase } from "./config/db.js";

async function start() {
  await connectDatabase();

  const server = app.listen(env.port, () => {
    console.log(`API server running on port ${env.port} [${env.nodeEnv}]`);
  });

  const shutdown = async (signal: string) => {
    console.log(`${signal} received. Shutting down gracefully...`);
    server.close(() => process.exit(0));
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
