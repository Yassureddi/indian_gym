import type { Metadata } from "next";
import SupplementDetailClient from "@/components/supplements/SupplementDetailClient";
import { initializeDatabase } from "@/lib/db/init";
import { getSupplementById } from "@/lib/db/supplements";
import { isBuildPhase } from "@/lib/db/build-guard";
import { createMetadata } from "@/lib/metadata";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  if (isBuildPhase()) {
    return createMetadata("Supplement", "Fitness supplement details.", "/supplements");
  }

  try {
    await initializeDatabase();
    const { id } = await params;
    const supplement = await getSupplementById(id);

    if (!supplement || !supplement.isActive) {
      return createMetadata("Supplement Not Found", "Product not found.", "/supplements");
    }

    return createMetadata(
      supplement.name,
      supplement.description.slice(0, 155),
      `/supplements/${id}`
    );
  } catch {
    return createMetadata("Supplement", "Fitness supplement details.", "/supplements");
  }
}

export default async function SupplementDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <SupplementDetailClient id={id} />
      </div>
    </section>
  );
}
