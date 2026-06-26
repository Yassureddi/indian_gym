"use client";

import Image from "next/image";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { TRAINERS } from "@/lib/trainers";
import shared from "@/components/admin/admin-shared.module.css";
import styles from "./page.module.css";

export default function AdminTrainersPage() {
  return (
    <div>
      <AdminPageHeader
        title="Trainers"
        description="Manage trainer profiles displayed on the website."
      />
      <div className={shared.cardGrid}>
        {TRAINERS.map((trainer) => (
          <div key={trainer.id} className={`${shared.panel} ${styles.card}`}>
            <div className={styles.imageWrap}>
              <Image src={trainer.image} alt={trainer.name} fill sizes="300px" className={styles.image} />
            </div>
            <div className={styles.body}>
              <h3>{trainer.name}</h3>
              <p className={styles.role}>{trainer.role}</p>
              <p className={styles.spec}>{trainer.specialty} · {trainer.experience}</p>
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
    </div>
  );
}
