import { readJson, writeJson, createId } from "./store";
import type { Trainer } from "@/lib/trainers";

const FILE = "trainers.json";

export async function getTrainers(): Promise<Trainer[]> {
  const items = await readJson<Trainer[]>(FILE, []);
  return items.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

export async function getActiveTrainers(): Promise<Trainer[]> {
  return (await getTrainers()).filter((t) => t.isActive !== false);
}

export async function getTrainerById(id: string): Promise<Trainer | null> {
  return (await getTrainers()).find((t) => t.id === id) ?? null;
}

export async function saveTrainer(trainer: Trainer) {
  const items = await getTrainers();
  const index = items.findIndex((t) => t.id === trainer.id);
  if (index >= 0) items[index] = trainer;
  else items.push(trainer);
  await writeJson(FILE, items);
}

const TRAINER_SEED: Omit<Trainer, "id">[] = [
  {
    name: "K N Raju",
    role: "Head Trainer & Founder",
    specialty: "Strength & Conditioning, Bodybuilding & Transformation",
    experience: "12+ years",
    image: "/trainers/kn-raju.png",
    bio: "Founder of INDIAN GYM K N RAJU FITNESS with over 12 years of guiding members through strength, bodybuilding, and life-changing transformations.",
    certificates: [
      "Strength & Conditioning Expert",
      "Bodybuilding Specialist",
      "Transformation Expert",
    ],
    social: { instagram: "indian_gym23" },
    isActive: true,
    sortOrder: 1,
  },
  {
    name: "Priya Sharma",
    role: "Certified Fitness Trainer",
    specialty: "Women's Fitness, Strength Training & Weight Loss",
    experience: "6+ years",
    image: "/trainers/priya-sharma.png",
    bio: "Women's fitness expert specializing in strength training and sustainable weight loss with personalized coaching.",
    certificates: [
      "Women's Fitness Expert",
      "Strength Training Specialist",
      "Weight Loss Expert",
    ],
    social: {},
    isActive: true,
    sortOrder: 2,
  },
  {
    name: "Arjun Reddy",
    role: "Fitness Coach",
    specialty: "Powerlifting & Strength Training",
    experience: "10+ years",
    image: "/trainers/arjun-reddy.png",
    bio: "Dedicated fitness coach focused on powerlifting, strength development, and helping members build lasting results.",
    certificates: [
      "Powerlifting Coach",
      "Strength Training Specialist",
      "Functional Fitness Expert",
    ],
    social: {},
    isActive: true,
    sortOrder: 3,
  },
];

export async function ensureSeedTrainers() {
  const items = await getTrainers();
  if (items.length > 0) return;
  for (const seed of TRAINER_SEED) {
    await saveTrainer({ ...seed, id: createId("trainer") });
  }
}
