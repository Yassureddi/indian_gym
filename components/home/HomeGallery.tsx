"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import type { GalleryItem } from "@/lib/gallery";
import styles from "./HomeGallery.module.css";

function isRemoteSrc(src: string) {
  return src.startsWith("http");
}

export default function HomeGallery() {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.items)) {
          setImages(data.items.slice(0, 6));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section" id="gallery">
      <div className="container">
        <SectionHeading
          subtitle="Our Facility"
          title="Gallery"
          description="Step inside our world-class training environment."
        />
        {loading ? (
          <p className={styles.empty}>Loading gallery...</p>
        ) : images.length === 0 ? (
          <p className={styles.empty}>Gallery images will appear here once uploaded in admin.</p>
        ) : (
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
                  unoptimized={!isRemoteSrc(img.src)}
                />
                <div className={styles.overlay}>
                  <span>{img.alt}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        <div className={styles.cta}>
          <Button href="/gallery" variant="outline" size="lg">
            View Full Gallery
          </Button>
        </div>
      </div>
    </section>
  );
}
