"use client";

import Image from "next/image";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { GALLERY_IMAGES, GALLERY_FILTERS } from "@/lib/gallery";
import shared from "@/components/admin/admin-shared.module.css";
import styles from "./page.module.css";

export default function AdminGalleryPage() {
  return (
    <div>
      <AdminPageHeader
        title="Gallery"
        description={`${GALLERY_IMAGES.length} images across ${GALLERY_FILTERS.length - 1} categories.`}
      />
      <div className={shared.cardGrid}>
        {GALLERY_IMAGES.map((img) => (
          <div key={img.id} className={`${shared.panel} ${styles.card}`}>
            <div className={styles.imageWrap}>
              <Image src={img.src} alt={img.alt} fill sizes="300px" className={styles.image} />
            </div>
            <div className={styles.meta}>
              <p className={styles.alt}>{img.alt}</p>
              <span className={styles.cat}>{img.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
