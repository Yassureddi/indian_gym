import { ensureSeedUsers } from "./users";
import { ensureSeedMemberships } from "./memberships";
import { ensureSeedWorkoutPlans } from "./workout-plans";import { ensureSeedDietPlans } from "./diet-plans";
import { ensureSeedPayments } from "./payments";
import { ensureSeedActivity } from "./activity";
import { ensureSeedGallery } from "./gallery";
import { ensureSeedTrainers } from "./trainers";
import { ensureSeedBlogs } from "./blogs";

let initialized = false;

export async function initializeDatabase() {
  if (initialized) return;
  await ensureSeedUsers();
  await ensureSeedMemberships();
  await ensureSeedWorkoutPlans();  await ensureSeedDietPlans();
  await ensureSeedPayments();
  await ensureSeedActivity();
  await ensureSeedGallery();
  await ensureSeedTrainers();
  await ensureSeedBlogs();
  initialized = true;
}
