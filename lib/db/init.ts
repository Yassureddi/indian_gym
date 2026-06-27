import { ensureDb } from "./mongo-helpers";
import { isBuildPhase } from "./build-guard";
import { ensureSeedUsers } from "./users";
import { ensureSeedMemberships } from "./memberships";
import { ensureSeedWorkoutPlans } from "./workout-plans";
import { ensureSeedDietPlans } from "./diet-plans";
import { ensureSeedPayments } from "./payments";
import { ensureSeedActivity } from "./activity";
import { ensureSeedGallery } from "./gallery";
import { ensureSeedTrainers } from "./trainers";
import { ensureSeedBlogs } from "./blogs";
import { ensureSeedSupplements } from "./supplements";
import { ensureSeedSupplementOrders } from "./supplement-orders";
import { ensureSeedStoreSales } from "./store-sales";
import { ensureSeedNotifications } from "./notifications";

let initialized = false;
let initPromise: Promise<void> | null = null;

async function runSeed(): Promise<void> {
  await ensureDb();
  await ensureSeedUsers();
  await ensureSeedMemberships();
  await ensureSeedWorkoutPlans();
  await ensureSeedDietPlans();
  await ensureSeedPayments();
  await ensureSeedActivity();
  await ensureSeedGallery();
  await ensureSeedTrainers();
  await ensureSeedBlogs();
  await ensureSeedSupplements();
  await ensureSeedSupplementOrders();
  await ensureSeedStoreSales();
  await ensureSeedNotifications();
  initialized = true;
}

/**
 * Seed demo data once per serverless instance.
 * Uses a shared promise so parallel API calls (overview, notifications, etc.)
 * do not race duplicate inserts on cold start.
 */
export async function initializeDatabase() {
  if (initialized || isBuildPhase()) return;

  if (!initPromise) {
    initPromise = runSeed().catch((error) => {
      initPromise = null;
      throw error;
    });
  }

  await initPromise;
}
