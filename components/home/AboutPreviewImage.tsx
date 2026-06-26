"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { DEFAULT_ABOUT_PREVIEW_IMAGE } from "@/lib/site-content.constants";
import styles from "./AboutPreview.module.css";

export default function AboutPreviewImage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState(DEFAULT_ABOUT_PREVIEW_IMAGE);
  const [isAdmin, setIsAdmin] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadImage = useCallback(async () => {
    try {
      const res = await fetch("/api/site/about-image");
      if (res.ok) {
        const data = await res.json();
        if (data.url) setImageSrc(data.url);
      }
    } catch {
      setImageSrc(DEFAULT_ABOUT_PREVIEW_IMAGE);
    }
  }, []);

  useEffect(() => {
    loadImage();
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setIsAdmin(data?.user?.role === "admin"))
      .catch(() => setIsAdmin(false));
  }, [loadImage]);

  async function handleUpload(file: File) {
    setError("");
    setSuccess("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/admin/about-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Upload failed");
        return;
      }

      setImageSrc(data.url);
      setSuccess("Image updated successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) void handleUpload(file);
  }

  const isRemote = imageSrc.startsWith("http");

  return (
    <div className={styles.imageStack}>
      <div className={`${styles.imageFrame} ${isAdmin ? styles.adminMode : ""}`}>
        <Image
          src={imageSrc}
          alt="INDIAN GYM K N RAJU FITNESS interior — training floor and equipment"
          width={520}
          height={650}
          className={styles.mainImage}
          unoptimized={!isRemote}
          onError={() => setImageSrc(DEFAULT_ABOUT_PREVIEW_IMAGE)}
        />

        {isAdmin && (
          <div className={styles.uploadOverlay}>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className={styles.fileInput}
              onChange={onFileChange}
              disabled={uploading}
              aria-label="Upload about section image"
            />
            <button
              type="button"
              className={styles.uploadBtn}
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload Image"}
            </button>
          </div>
        )}
      </div>

      {error && <p className={styles.uploadMessageError}>{error}</p>}
      {success && <p className={styles.uploadMessageSuccess}>{success}</p>}

      <div className={`${styles.floatingCard} premium-float`}>
        <span className={styles.cardValue}>15+</span>
        <span className={styles.cardLabel}>Years of Excellence</span>
      </div>
    </div>
  );
}
