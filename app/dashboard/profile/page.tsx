"use client";

import { FormEvent, useEffect, useState } from "react";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import type { SessionUser } from "@/lib/auth/types";
import PasswordInput from "@/components/ui/PasswordInput";
import styles from "./page.module.css";

const GOALS = [
  "Weight Loss",
  "Muscle Gain",
  "General Fitness",
  "Strength Training",
  "Other",
];

export default function ProfilePage() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setUser(data.user));
  }, []);

  const handleProfileSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const formData = new FormData(e.currentTarget);
    const body = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      goal: formData.get("goal"),
    };

    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUser(data.user);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setLoading(true);
    setMessage("");
    setError("");

    const formData = new FormData(form);
    const body = {
      currentPassword: formData.get("currentPassword"),
      newPassword: formData.get("newPassword"),
    };

    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage("Password changed successfully.");
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Password change failed");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p className={styles.loading}>Loading profile...</p>;

  return (
    <div className={styles.page}>
      <h2 className="text-h3">My Profile</h2>
      <p className={styles.subtitle}>Manage your account details and password.</p>

      {message && <p className={styles.success}>{message}</p>}
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.grid}>
        <GlassCard hover={false} padding="lg">
          <h3>Personal Information</h3>
          <form onSubmit={handleProfileSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="name">Full Name</label>
              <input id="name" name="name" defaultValue={user.name} required />
            </div>
            <div className={styles.field}>
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" defaultValue={user.email} required />
            </div>
            <div className={styles.field}>
              <label htmlFor="phone">Phone</label>
              <input id="phone" name="phone" type="tel" defaultValue={user.phone} required />
            </div>
            <div className={styles.field}>
              <label htmlFor="goal">Fitness Goal</label>
              <select id="goal" name="goal" defaultValue={user.goal ?? ""}>
                <option value="">Select goal</option>
                {GOALS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <Button type="submit" variant="primary" disabled={loading}>
              Save Changes
            </Button>
          </form>
        </GlassCard>

        <GlassCard hover={false} padding="lg">
          <h3>Change Password</h3>
          <form onSubmit={handlePasswordSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="currentPassword">Current Password</label>
              <PasswordInput id="currentPassword" name="currentPassword" required />
            </div>
            <div className={styles.field}>
              <label htmlFor="newPassword">New Password</label>
              <PasswordInput id="newPassword" name="newPassword" minLength={6} required />
            </div>
            <Button type="submit" variant="outline" disabled={loading}>
              Update Password
            </Button>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}
