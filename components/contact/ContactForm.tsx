"use client";

import { FormEvent } from "react";
import GlassCard from "@/components/ui/GlassCard";
import { CONTACT } from "@/lib/constants";
import styles from "./ContactForm.module.css";

const GOAL_OPTIONS = [
  "Weight Loss",
  "Muscle Gain",
  "General Fitness",
  "Free Trial",
  "Personal Training",
  "Membership Inquiry",
  "Other",
];

function buildWhatsAppMessage(data: {
  name: string;
  phone: string;
  goal: string;
  message: string;
}) {
  return [
    "Hello INDIAN GYM K N RAJU FITNESS! 👋",
    "",
    "I'd like to get in touch:",
    "",
    `*Name:* ${data.name}`,
    `*Phone:* ${data.phone}`,
    `*Goal:* ${data.goal}`,
    `*Message:* ${data.message}`,
  ].join("\n");
}

export default function ContactForm() {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = (formData.get("name") as string).trim();
    const phone = (formData.get("phone") as string).trim();
    const goal = (formData.get("goal") as string).trim();
    const message = (formData.get("message") as string).trim();

    const text = buildWhatsAppMessage({ name, phone, goal, message });
    const whatsappUrl = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <GlassCard hover={false} padding="lg" className={styles.formCard}>
      <h2 className={styles.formTitle}>Send Us a Message</h2>
      <p className={styles.formSubtitle}>
        Fill in your details and we&apos;ll open WhatsApp with your message ready to send.
      </p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="contact-name">Name</label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            placeholder="Your full name"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="contact-phone">Phone</label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            required
            placeholder="e.g. 8142113631"
            pattern="[0-9+\s-]{10,15}"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="contact-goal">Goal</label>
          <select id="contact-goal" name="goal" required defaultValue="">
            <option value="" disabled>
              Select your fitness goal
            </option>
            {GOAL_OPTIONS.map((goal) => (
              <option key={goal} value={goal}>
                {goal}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="contact-message">Message</label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            required
            placeholder="Tell us how we can help you..."
          />
        </div>

        <button type="submit" className={styles.whatsappBtn}>
          <WhatsAppIcon />
          Send via WhatsApp
        </button>

        <p className={styles.note}>
          You&apos;ll be redirected to WhatsApp with your message pre-filled.
        </p>
      </form>
    </GlassCard>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
