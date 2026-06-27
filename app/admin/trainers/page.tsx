"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AddTrainerModal from "@/components/admin/AddTrainerModal";
import Button from "@/components/ui/Button";
import type { Trainer } from "@/lib/trainers";
import shared from "@/components/admin/admin-shared.module.css";
import styles from "./page.module.css";

function isOptimizableSrc(src: string) {
  return src.startsWith("http") && !src.startsWith("data:");
}

function formatDob(dob?: string) {
  if (!dob) return "—";
  return new Date(dob).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminTrainersPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  const load = () =>
    fetch("/api/admin/trainers")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setTrainers(d.trainers ?? []);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load trainers"))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const handleSuccess = (msg: string) => {
    setMessage(msg);
    setError("");
    setLoading(true);
    load();
  };

  return (
    <div>
      <AdminPageHeader
        title="Trainers"
        description={`Manage trainer profiles displayed on the website. ${trainers.length} trainer${trainers.length === 1 ? "" : "s"} in the database.`}
        action={
          <div className={styles.headerActions}>
            <Link href="/trainers" target="_blank" rel="noopener noreferrer" className={styles.viewLink}>
              See All Trainers →
            </Link>
            <Button type="button" variant="primary" onClick={() => setAddOpen(true)}>
              Add Trainer
            </Button>
          </div>
        }
      />

      {message && <p className={`${shared.alert} ${shared.alertSuccess}`}>{message}</p>}
      {error && <p className={`${shared.alert} ${shared.alertError}`}>{error}</p>}

      <div className={styles.listHeader}>
        <h3 className={styles.panelTitle}>All Trainers</h3>
        <Link href="/trainers" target="_blank" rel="noopener noreferrer" className={styles.viewLink}>
          View on website →
        </Link>
      </div>

      {loading ? (
        <p className={styles.empty}>Loading trainers...</p>
      ) : trainers.length === 0 ? (
        <p className={styles.empty}>No trainers yet. Click Add Trainer to create one.</p>
      ) : (
        <div className={shared.cardGrid}>
          {trainers.map((trainer) => (
            <div key={trainer.id} className={`${shared.panel} ${styles.card}`}>
              <div className={styles.imageWrap}>
                <Image
                  src={trainer.image}
                  alt={trainer.name}
                  fill
                  sizes="300px"
                  className={styles.image}
                  unoptimized={!isOptimizableSrc(trainer.image)}
                />
                <span className={styles.liveBadge}>Live</span>
              </div>
              <div className={styles.body}>
                <h3>{trainer.name}</h3>
                <p className={styles.role}>{trainer.purpose || trainer.role}</p>
                <div className={styles.metaGrid}>
                  <span>
                    <strong>Age:</strong> {trainer.age ?? "—"}
                  </span>
                  <span>
                    <strong>DOB:</strong> {formatDob(trainer.dob)}
                  </span>
                </div>
                <p className={styles.spec}>
                  {trainer.specialty} · {trainer.experience}
                </p>
                <p className={styles.bio}>{trainer.bio}</p>
                <div className={styles.certs}>
                  {trainer.certificates.slice(0, 2).map((c) => (
                    <span key={c}>{c}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddTrainerModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
