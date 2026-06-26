"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import type { BlogItem } from "@/lib/blog";
import shared from "@/components/admin/admin-shared.module.css";
import styles from "./page.module.css";

function isRemoteSrc(src: string) {
  return src.startsWith("http");
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/blogs")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setBlogs(d.blogs ?? []);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load blogs"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <AdminPageHeader
        title="Blogs"
        description={`Manage fitness articles published on the website. ${blogs.length} post${blogs.length === 1 ? "" : "s"} in the database.`}
      />
      {error && <p className={`${shared.alert} ${shared.alertError}`}>{error}</p>}
      {loading ? (
        <p className={styles.empty}>Loading blogs...</p>
      ) : blogs.length === 0 ? (
        <p className={styles.empty}>No blog posts in the database. Run the API seed or add posts via the API.</p>
      ) : (
        <div className={shared.cardGrid}>
          {blogs.map((blog) => (
            <article key={blog.id} className={`${shared.panel} ${styles.card}`}>
              <div className={styles.imageWrap}>
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  sizes="400px"
                  className={styles.image}
                  unoptimized={!isRemoteSrc(blog.image)}
                />
              </div>
              <div className={styles.body}>
                <span className={styles.cat}>{blog.category}</span>
                <h3>{blog.title}</h3>
                <p>{blog.excerpt}</p>
                <div className={styles.footer}>
                  <time>{blog.date}</time>
                  <span>{blog.readTime}</span>
                  <span className={blog.isPublished === false ? styles.hidden : styles.live}>
                    {blog.isPublished === false ? "Hidden" : "Live"}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
