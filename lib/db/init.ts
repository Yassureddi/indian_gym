import { ensureSeedUsers } from "./users";
import { ensureSeedMemberships } from "./memberships";
import { ensureSeedAttendance } from "./attendance";
import { ensureSeedWorkoutPlans } from "./workout-plans";
import { ensureSeedDietPlans } from "./diet-plans";
import { ensureSeedPayments } from "./payments";
import { ensureSeedNotifications } from "./notifications";
import { ensureSeedActivity } from "./activity";

let initialized = false;

export async function initializeDatabase() {
  if (initialized) return;
  await ensureSeedUsers();
  await ensureSeedMemberships();
  await ensureSeedAttendance();
  await ensureSeedWorkoutPlans();
  await ensureSeedDietPlans();
  await ensureSeedPayments();
  await ensureSeedNotifications();
  await ensureSeedActivity();
  initialized = true;
}
