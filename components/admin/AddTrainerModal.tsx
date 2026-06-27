"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import shared from "@/components/admin/admin-shared.module.css";
import modalStyles from "./CreateMemberModal.module.css";
import formStyles from "./AddTrainerModal.module.css";

interface AddTrainerModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export default function AddTrainerModal({
  open,
  onClose,
  onSuccess,
}: AddTrainerModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (!open) {
      setError("");
      setPreview("");
      setCreating(false);
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setPreview("");
      return;
    }
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreating(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const file = formData.get("image");

    if (!file || !(file instanceof File) || file.size === 0) {
      setError("Please choose a trainer photo");
      setCreating(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/trainers", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create trainer");

      form.reset();
      setPreview("");
      if (inputRef.current) inputRef.current.value = "";
      onSuccess(`Trainer "${data.trainer.name}" created and published on the website.`);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create trainer");
    } finally {
      setCreating(false);
    }
  };

  if (!open) return null;

  return (
    <div className={modalStyles.overlay} onClick={onClose} role="presentation">
      <div
        className={`${modalStyles.modal} ${formStyles.modal}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="add-trainer-title"
        aria-modal="true"
      >
        <div className={modalStyles.accentBar} aria-hidden="true" />

        <div className={modalStyles.modalBody}>
          <div className={modalStyles.header}>
            <div>
              <h2 id="add-trainer-title" className={modalStyles.title}>
                Add New Trainer
              </h2>
              <p className={modalStyles.subtitle}>
                New trainers appear on the homepage and trainers page.
              </p>
            </div>
            <button
              type="button"
              className={modalStyles.closeBtn}
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {error && <p className={modalStyles.error}>{error}</p>}

          <form onSubmit={handleSubmit} className={shared.formGrid}>
            <div className={`${shared.field} ${shared.fullWidth}`}>
              <label htmlFor="trainer-image">Trainer Image</label>
              <input
                ref={inputRef}
                id="trainer-image"
                name="image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                required
                onChange={onFileChange}
              />
            </div>

            {preview && (
              <div className={`${shared.fullWidth} ${formStyles.previewWrap}`}>
                <Image
                  src={preview}
                  alt="Trainer preview"
                  width={240}
                  height={300}
                  className={formStyles.preview}
                  unoptimized
                />
              </div>
            )}

            <div className={shared.field}>
              <label htmlFor="trainer-name">Name</label>
              <input
                id="trainer-name"
                name="name"
                required
                placeholder="e.g. K N Raju"
              />
            </div>

            <div className={shared.field}>
              <label htmlFor="trainer-age">Age</label>
              <input
                id="trainer-age"
                name="age"
                type="number"
                min={16}
                max={80}
                required
                placeholder="e.g. 32"
              />
            </div>

            <div className={`${shared.field} ${shared.fullWidth}`}>
              <label htmlFor="trainer-purpose">Purpose / Specialization</label>
              <input
                id="trainer-purpose"
                name="purpose"
                required
                placeholder="e.g. Strength Training & Bodybuilding"
              />
            </div>

            <div className={shared.field}>
              <label htmlFor="trainer-dob">Date of Birth</label>
              <input id="trainer-dob" name="dob" type="date" required />
            </div>

            <div className={`${shared.fullWidth} ${formStyles.formActions}`}>
              <Button type="submit" variant="primary" disabled={creating}>
                {creating ? "Creating..." : "Create Trainer"}
              </Button>
              <Link
                href="/trainers"
                target="_blank"
                rel="noopener noreferrer"
                className={formStyles.secondaryLink}
              >
                See All Trainers on Website
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
