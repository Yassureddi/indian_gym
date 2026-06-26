"use client";

import Image from "next/image";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { BLOGS } from "@/lib/constants";
import shared from "@/components/admin/admin-shared.module.css";
import styles from "./page.module.css";

export default function AdminBlogsPage() {
  return (
    <div>
      <AdminPageHeader
        title="Blogs"
        description="Manage fitness articles and content published on the website."
      />
      <div className={shared.cardGrid}>
        {BLOGS.map((blog) => (
          <article key={blog.id} className={`${shared.panel} ${styles.card}`}>
            <div className={styles.imageWrap}>
              <Image src={blog.image} alt={blog.title} fill sizes="400px" className={styles.image} />
            </div>
            <div className={styles.body}>
              <span className={styles.cat}>{blog.category}</span>
              <h3>{blog.title}</h3>
              <p>{blog.excerpt}</p>
              <div className={styles.footer}>
                <time>{blog.date}</time>
                <span>{blog.readTime}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
