import TrainerModel from "@/models/Trainer";
import { ensureDb, toPlain, toPlainList } from "./mongo-helpers";
import { createId } from "./store";
import type { Trainer } from "@/lib/trainers";

export async function getTrainers(): Promise<Trainer[]> {
  await ensureDb();
  const docs = await TrainerModel.find().sort({ sortOrder: 1 }).lean();
  return toPlainList<Trainer>(docs);
}

export async function getActiveTrainers(): Promise<Trainer[]> {
  return (await getTrainers()).filter((t) => t.isActive !== false);
}

export async function getTrainerById(id: string): Promise<Trainer | null> {
  await ensureDb();
  const doc = await TrainerModel.findOne({ id }).lean();
  return toPlain<Trainer>(doc);
}

export async function saveTrainer(trainer: Trainer) {
  await ensureDb();
  await TrainerModel.findOneAndUpdate({ id: trainer.id }, trainer, {
    upsert: true,
    new: true,
  });
}

export async function createTrainer(data: {
  name: string;
  age: number;
  purpose: string;
  dob: string;
  image: string;
  isActive?: boolean;
}): Promise<Trainer> {
  const items = await getTrainers();
  const maxOrder = items.reduce((max, t) => Math.max(max, t.sortOrder ?? 0), 0);
  const name = data.name.trim();
  const purpose = data.purpose.trim();

  const trainer: Trainer = {
    id: createId("trainer"),
    name,
    age: data.age,
    dob: data.dob,
    purpose,
    role: purpose,
    specialty: purpose,
    experience: "Certified Coach",
    image: data.image,
    bio: `${name} is a dedicated fitness trainer specializing in ${purpose}.`,
    certificates: ["Certified Fitness Trainer"],
    social: {},
    isActive: data.isActive !== false,
    sortOrder: maxOrder + 1,
  };

  await saveTrainer(trainer);
  return trainer;
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
  await ensureDb();
  const count = await TrainerModel.countDocuments();
  if (count > 0) return;
  for (const seed of TRAINER_SEED) {
    await saveTrainer({ ...seed, id: createId("trainer") });
  }
}
