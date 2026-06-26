import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import { createMetadata } from "@/lib/metadata";
import styles from "./page.module.css";

export const metadata: Metadata = createMetadata(
  "Gallery",
  "Explore INDIAN GYM K N RAJU FITNESS — gym photos, workouts, equipment, members, and events.",
  "/gallery"
);

export default function GalleryPage() {
  return (
    <>
      <PageHero
        title="Gallery"
        subtitle="A visual journey through our world-class facility, training, and community"
        breadcrumb="Facilities"
      />
      <section className={`section ${styles.section}`}>
        <div className="container">
          <GalleryGrid />
        </div>
      </section>
    </>
  );
}
