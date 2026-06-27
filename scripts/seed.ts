import { initializeDatabase } from "../lib/db/init";

initializeDatabase()
  .then(() => {
    console.log("Database seeded successfully (MongoDB Atlas)");
  })
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
