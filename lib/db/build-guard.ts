/** True while `next build` is generating static pages (no DB available). */
export function isBuildPhase(): boolean {
  return process.env.NEXT_PHASE === "phase-production-build";
}

/**
 * Run a DB-backed content fetch. Skips during build and returns fallback on error
 * so production deploys do not fail when Atlas is unreachable at build time.
 */
export async function withDbContent<T>(
  fn: () => Promise<T>,
  fallback: T
): Promise<T> {
  if (isBuildPhase()) return fallback;

  try {
    return await fn();
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[db] Content fetch failed, using fallback:", error);
    }
    return fallback;
  }
}
