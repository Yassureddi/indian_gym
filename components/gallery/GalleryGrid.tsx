"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  GALLERY_FILTERS,
  CATEGORY_LABELS,
  type GalleryCategory,
  type GalleryItem,
} from "@/lib/gallery";
import styles from "./GalleryGrid.module.css";

function isRemoteSrc(src: string) {
  return src.startsWith("http");
}

export default function GalleryGrid() {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<GalleryCategory | "all">("all");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.items) && data.items.length > 0) {
          setImages(data.items);
        }
      })
      .catch(() => setImages([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    filter === "all" ? images : images.filter((img) => img.category === filter);

  const selectedImage = selectedIndex !== null ? filtered[selectedIndex] : null;

  const openLightbox = (index: number) => setSelectedIndex(index);

  const closeLightbox = () => setSelectedIndex(null);

  const goNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % filtered.length);
  }, [selectedIndex, filtered.length]);

  const goPrev = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex - 1 + filtered.length) % filtered.length);
  }, [selectedIndex, filtered.length]);

  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [selectedIndex, goNext, goPrev]);

  useEffect(() => {
    setSelectedIndex(null);
  }, [filter]);

  if (loading) {
    return <p className={styles.empty}>Loading gallery...</p>;
  }

  return (
    <>
      <div className={styles.filters} role="tablist" aria-label="Gallery filters">
        {GALLERY_FILTERS.map((f) => (
          <button
            key={f.id}
            role="tab"
            aria-selected={filter === f.id}
            className={`${styles.filterBtn} ${filter === f.id ? styles.filterActive : ""}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <motion.div
        className={styles.masonry}
        layout
        key={filter}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((image, index) => (
            <GalleryItemCard
              key={image.id}
              image={image}
              index={index}
              onOpen={() => openLightbox(index)}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <p className={styles.empty}>No images in this category yet.</p>
      )}

      <AnimatePresence>
        {selectedImage && selectedIndex !== null && (
          <Lightbox
            image={selectedImage}
            index={selectedIndex}
            total={filtered.length}
            onClose={closeLightbox}
            onNext={goNext}
            onPrev={goPrev}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function GalleryItemCard({
  image,
  index,
  onOpen,
}: {
  image: GalleryItem;
  index: number;
  onOpen: () => void;
}) {
  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.45, delay: index * 0.04 }}
      className={`${styles.item} ${image.tall ? styles.tall : ""}`}
      onClick={onOpen}
      aria-label={`View ${image.alt}`}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        loading="lazy"
        sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className={styles.image}
        unoptimized={!isRemoteSrc(image.src)}
      />
      <div className={styles.overlay}>
        <span className={styles.category}>{CATEGORY_LABELS[image.category]}</span>
        <span className={styles.caption}>{image.alt}</span>
        <span className={styles.zoomIcon} aria-hidden="true">
          <ZoomIcon />
        </span>
      </div>
    </motion.button>
  );
}

function Lightbox({
  image,
  index,
  total,
  onClose,
  onNext,
  onPrev,
}: {
  image: GalleryItem;
  index: number;
  total: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <motion.div
      className={styles.lightbox}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={styles.lightboxInner}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          &times;
        </button>

        {total > 1 && (
          <>
            <button className={`${styles.navBtn} ${styles.navPrev}`} onClick={onPrev} aria-label="Previous">
              ‹
            </button>
            <button className={`${styles.navBtn} ${styles.navNext}`} onClick={onNext} aria-label="Next">
              ›
            </button>
          </>
        )}

        <div className={styles.lightboxImageWrap}>
          <Image
            src={image.src}
            alt={image.alt}
            width={1200}
            height={800}
            className={styles.lightboxImage}
            priority
            unoptimized={!isRemoteSrc(image.src)}
          />
        </div>

        <div className={styles.lightboxMeta}>
          <span className={styles.lightboxCategory}>{CATEGORY_LABELS[image.category]}</span>
          <p className={styles.lightboxCaption}>{image.alt}</p>
          <span className={styles.lightboxCounter}>
            {index + 1} / {total}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ZoomIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
    </svg>
  );
}
