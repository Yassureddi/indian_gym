import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { handleAuthError, jsonError } from "@/lib/auth/api";
import { initializeDatabase } from "@/lib/db/init";
import { createTrainer, getTrainers } from "@/lib/db/trainers";
import { mapTrainer } from "@/lib/api/mappers";
import { fileToTrainerImagePath } from "@/lib/trainer-storage";

export async function GET() {
  try {
    await requireAdmin();
    await initializeDatabase();
    const trainers = await getTrainers();
    return NextResponse.json({ trainers: trainers.map(mapTrainer) });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    await initializeDatabase();

    const formData = await request.formData();
    const file = formData.get("image");
    const name = String(formData.get("name") ?? "").trim();
    const ageRaw = String(formData.get("age") ?? "").trim();
    const purpose = String(formData.get("purpose") ?? "").trim();
    const dob = String(formData.get("dob") ?? "").trim();

    if (!file || !(file instanceof File)) {
      return jsonError("Trainer image is required", 400);
    }
    if (!name) {
      return jsonError("Trainer name is required", 400);
    }
    if (!purpose) {
      return jsonError("Trainer purpose is required", 400);
    }
    if (!dob) {
      return jsonError("Date of birth is required", 400);
    }

    const age = Number(ageRaw);
    if (!Number.isFinite(age) || age < 16 || age > 80) {
      return jsonError("Enter a valid age between 16 and 80", 400);
    }

    const saved = await fileToTrainerImagePath(file);
    if ("error" in saved) {
      return jsonError(saved.error, 400);
    }

    const trainer = await createTrainer({
      name,
      age,
      purpose,
      dob,
      image: saved.path,
      isActive: true,
    });

    return NextResponse.json({ trainer: mapTrainer(trainer) }, { status: 201 });
  } catch (error) {
    return handleAuthError(error);
  }
}
