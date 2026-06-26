"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/animations/FadeIn";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import type { BlogItem } from "@/lib/blog";
import { formatDate } from "@/lib/utils";
import styles from "./HomeBlogs.module.css";

function isRemoteSrc(src: string) {
  return src.startsWith("http");
}

export default function HomeBlogs() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blogs")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.blogs)) {
          setBlogs(data.blogs.slice(0, 3));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className={`section ${styles.section}`} id="blogs">
      <div className="container">
        <SectionHeading
          subtitle="Insights"
          title="Latest Blogs"
          description="Expert fitness tips, nutrition advice, and wellness insights."
        />
        {loading ? (
          <p className={styles.empty}>Loading blogs...</p>
        ) : blogs.length === 0 ? (
          <p className={styles.empty}>Blog posts will appear here once published in admin.</p>
        ) : (
          <div className={styles.grid}>
            {blogs.map((blog, i) => (
              <FadeIn key={blog.id} delay={i * 0.1}>
                <article>
                  <GlassCard className={styles.card} padding="sm">
                    <Link href={`/blogs/${blog.id}`} className={styles.imageLink}>
                      <div className={styles.imageWrap}>
                        <Image
                          src={blog.image}
                          alt={blog.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className={styles.image}
                          unoptimized={!isRemoteSrc(blog.image)}
                        />
                        <span className={styles.category}>{blog.category}</span>
                      </div>
                    </Link>
                    <div className={styles.content}>
                      <div className={styles.meta}>
                        <time dateTime={blog.date}>{formatDate(blog.date)}</time>
                        <span>{blog.readTime}</span>
                      </div>
                      <h3 className={styles.title}>
                        <Link href={`/blogs/${blog.id}`}>{blog.title}</Link>
                      </h3>
                      <p className={styles.excerpt}>{blog.excerpt}</p>
                      <Link href={`/blogs/${blog.id}`} className={styles.readMore}>
                        Read Article →
                      </Link>
                    </div>
                  </GlassCard>
                </article>
              </FadeIn>
            ))}
          </div>
        )}
        <div className={styles.cta}>
          <Button href="/blogs" variant="outline" size="lg">
            View All Blogs
          </Button>
        </div>
      </div>
    </section>
  );
}
