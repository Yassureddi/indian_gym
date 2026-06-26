"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import type { Trainer } from "@/lib/trainers";
import shared from "@/components/admin/admin-shared.module.css";
import styles from "./page.module.css";

function isRemoteSrc(src: string) {
  return src.startsWith("http");
}

export default function AdminTrainersPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/trainers")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setTrainers(d.trainers ?? []);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load trainers"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <AdminPageHeader
        title="Trainers"
        description={`Manage trainer profiles displayed on the website. ${trainers.length} trainer${trainers.length === 1 ? "" : "s"} in the database.`}
      />
      {error && <p className={`${shared.alert} ${shared.alertError}`}>{error}</p>}
      {loading ? (
        <p className={styles.empty}>Loading trainers...</p>
      ) : trainers.length === 0 ? (
        <p className={styles.empty}>No trainers in the database. Run the API seed or add trainers via the API.</p>
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
                  unoptimized={!isRemoteSrc(trainer.image)}
                />
              </div>
              <div className={styles.body}>
                <h3>{trainer.name}</h3>
                <p className={styles.role}>{trainer.role}</p>
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
    </div>
  );
}
