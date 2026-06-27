import { readJson, writeJson, createId } from "./store";
import type { Supplement, SupplementCategory } from "@/lib/supplements";

const FILE = "supplements.json";

export async function getSupplements(): Promise<Supplement[]> {
  const items = await readJson<Supplement[]>(FILE, []);
  return items.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getActiveSupplements(): Promise<Supplement[]> {
  return (await getSupplements()).filter((s) => s.isActive);
}

export async function getPublishedSupplements(): Promise<Supplement[]> {
  return getActiveSupplements();
}

export async function getSupplementById(id: string): Promise<Supplement | null> {
  return (await getSupplements()).find((s) => s.id === id) ?? null;
}

async function saveSupplements(items: Supplement[]) {
  await writeJson(FILE, items);
}

export async function createSupplement(
  data: Omit<Supplement, "id" | "createdAt" | "updatedAt">
): Promise<Supplement> {
  const now = new Date().toISOString();
  const supplement: Supplement = {
    ...data,
    id: createId("supplement"),
    createdAt: now,
    updatedAt: now,
  };
  const items = await getSupplements();
  items.push(supplement);
  await saveSupplements(items);
  return supplement;
}

export async function updateSupplement(
  id: string,
  updates: Partial<
    Omit<Supplement, "id" | "createdAt" | "updatedAt">
  >
): Promise<Supplement | null> {
  const items = await getSupplements();
  const index = items.findIndex((s) => s.id === id);
  if (index === -1) return null;

  items[index] = {
    ...items[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await saveSupplements(items);
  return items[index];
}

export async function deleteSupplement(id: string): Promise<boolean> {
  const items = await getSupplements();
  const next = items.filter((s) => s.id !== id);
  if (next.length === items.length) return false;
  await saveSupplements(next);
  return true;
}

export async function reduceSupplementStock(
  id: string,
  quantity: number
): Promise<Supplement | null> {
  const items = await getSupplements();
  const index = items.findIndex((s) => s.id === id);
  if (index === -1) return null;

  const supplement = items[index];
  if (supplement.stockQuantity < quantity) return null;

  items[index] = {
    ...supplement,
    stockQuantity: supplement.stockQuantity - quantity,
    updatedAt: new Date().toISOString(),
  };
  await saveSupplements(items);
  return items[index];
}

const SEED: Omit<Supplement, "id" | "createdAt" | "updatedAt">[] = [
  {
    name: "Gold Standard Whey Protein",
    brand: "Optimum Nutrition",
    category: "protein",
    description:
      "Premium whey protein isolate blend designed to support muscle recovery, lean muscle growth, and daily protein intake for active lifestyles.",
    price: 5499,
    discountPrice: 4999,
    stockQuantity: 24,
    weight: "2 kg",
    flavor: "Double Rich Chocolate",
    benefits: [
      "24g protein per serving",
      "Supports muscle recovery",
      "Low sugar formula",
      "Fast absorption",
    ],
    ingredients:
      "Whey Protein Isolate, Whey Protein Concentrate, Cocoa, Natural & Artificial Flavors, Lecithin, Salt, Acesulfame Potassium, Sucralose.",
    usageInstructions:
      "Mix 1 scoop (30g) with 180–240 ml of water or milk. Consume post-workout or between meals.",
    expiryDate: "2027-06-30",
    image:
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&h=800&fit=crop",
    isActive: true,
  },
  {
    name: "Creatine Monohydrate",
    brand: "MuscleTech",
    category: "creatine",
    description:
      "Pure creatine monohydrate to enhance strength, power output, and high-intensity training performance.",
    price: 1299,
    discountPrice: 999,
    stockQuantity: 40,
    weight: "300 g",
    flavor: "Unflavoured",
    benefits: [
      "Increases strength & power",
      "Supports ATP regeneration",
      "Clinically studied formula",
      "Unflavoured for stacking",
    ],
    ingredients: "100% Creatine Monohydrate.",
    usageInstructions:
      "Mix 1 scoop (3g) with water or your protein shake daily. Loading phase optional.",
    expiryDate: "2027-03-15",
    image:
      "https://images.unsplash.com/photo-1579722821279-117789589a69?w=800&h=800&fit=crop",
    isActive: true,
  },
  {
    name: "Pre-Workout Ignite",
    brand: "KN Raju Fitness",
    category: "pre-workout",
    description:
      "Energizing pre-workout formula with caffeine, beta-alanine, and citrulline for explosive training sessions.",
    price: 1899,
    stockQuantity: 18,
    weight: "250 g",
    flavor: "Fruit Punch",
    benefits: [
      "Boosts energy & focus",
      "Enhances pump & endurance",
      "Delays muscle fatigue",
    ],
    ingredients:
      "Citrulline Malate, Beta-Alanine, Caffeine Anhydrous, L-Tyrosine, Natural Flavors, Sucralose.",
    usageInstructions:
      "Mix 1 scoop with 200 ml water 20–30 minutes before workout. Do not exceed 1 serving per day.",
    expiryDate: "2026-12-01",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=800&fit=crop",
    isActive: true,
  },
];

export async function ensureSeedSupplements() {
  const items = await getSupplements();
  if (items.length > 0) return;

  for (const seed of SEED) {
    await createSupplement(seed);
  }
}
