"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { GALLERY_IMAGES } from "@/lib/gallery";
import styles from "./HomeGallery.module.css";

export default function HomeGallery() {
  const images = GALLERY_IMAGES.slice(0, 6);

  return (
    <section className="section" id="gallery">
      <div className="container">
        <SectionHeading
          subtitle="Our Facility"
          title="Gallery"
          description="Step inside our world-class training environment."
        />
        <div className={styles.grid}>
          {images.map((img, i) => (
            <motion.div
              key={img.id}
              className={styles.item}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className={styles.image}
              />
              <div className={styles.overlay}>
                <span>{img.alt}</span>
              </div>
            </motion.div>
          ))}
        </div>
        <div className={styles.cta}>
          <Button href="/gallery" variant="outline" size="lg">
            View Full Gallery
          </Button>
        </div>
      </div>
    </section>
  );
}
