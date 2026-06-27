import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

/** In-memory fallback for read-only environments (e.g. Vercel serverless). */
const memoryStore = new Map<string, unknown>();

let diskWritable: boolean | null = null;

async function canWriteToDisk(): Promise<boolean> {
  if (diskWritable !== null) return diskWritable;

  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const probe = path.join(DATA_DIR, ".write-probe");
    await fs.writeFile(probe, "ok", "utf-8");
    await fs.unlink(probe);
    diskWritable = true;
  } catch {
    diskWritable = false;
  }

  return diskWritable;
}

export async function ensureDataDir() {
  if (!(await canWriteToDisk())) return;
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readJson<T>(filename: string, fallback: T): Promise<T> {
  if (memoryStore.has(filename)) {
    return memoryStore.get(filename) as T;
  }

  try {
    const content = await fs.readFile(path.join(DATA_DIR, filename), "utf-8");
    const data = JSON.parse(content) as T;
    memoryStore.set(filename, data);
    return data;
  } catch {
    return fallback;
  }
}

export async function writeJson<T>(filename: string, data: T): Promise<void> {
  memoryStore.set(filename, data);

  if (!(await canWriteToDisk())) return;

  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(
      path.join(DATA_DIR, filename),
      JSON.stringify(data, null, 2),
      "utf-8"
    );
  } catch {
    diskWritable = false;
  }
}

export function createId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
