"use client";

import { useEffect, useState } from "react";
import MemberOnboardingWizard from "@/components/admin/MemberOnboardingWizard";
import styles from "./CreateMemberModal.module.css";

interface CreateMemberModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export default function CreateMemberModal({
  open,
  onClose,
  onSuccess,
}: CreateMemberModalProps) {
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      setError("");
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

  const handleSuccess = (message: string) => {
    setError("");
    onSuccess(message);
    onClose();
  };

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="create-member-title"
        aria-modal="true"
      >
        <div className={styles.accentBar} aria-hidden="true" />

        <div className={styles.modalBody}>
          <div className={styles.header}>
            <div>
              <h2 id="create-member-title" className={styles.title}>
                New Member Registration
              </h2>
              <p className={styles.subtitle}>
                Add member details, select a plan, and confirm payment.
              </p>
            </div>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <MemberOnboardingWizard
            onSuccess={handleSuccess}
            onError={setError}
          />
        </div>
      </div>
    </div>
  );
}
