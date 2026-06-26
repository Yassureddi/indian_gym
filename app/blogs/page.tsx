import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import FadeIn from "@/components/animations/FadeIn";
import GlassCard from "@/components/ui/GlassCard";
import { fetchBlogs } from "@/lib/api/content";
import { formatDate } from "@/lib/utils";
import { createMetadata } from "@/lib/metadata";
import styles from "./page.module.css";

export const metadata: Metadata = createMetadata(
  "Blogs",
  "Fitness tips, nutrition advice, and wellness insights from KN Raju Fitness experts.",
  "/blogs"
);

function isRemoteSrc(src: string) {
  return src.startsWith("http");
}

export default async function BlogsPage() {
  const blogs = await fetchBlogs();

  return (
    <>
      <PageHero
        title="Fitness Blog"
        subtitle="Expert insights to fuel your fitness journey"
        breadcrumb="Articles"
      />

      <section className="section">
        <div className="container">
          {blogs.length === 0 ? (
            <p className={styles.empty}>No blog posts published yet. Check back soon.</p>
          ) : (
            <div className={styles.grid}>
              {blogs.map((blog, i) => (
                <FadeIn key={blog.id} delay={i * 0.1}>
                  <article>
                    <GlassCard className={styles.card} padding="sm">
                      <div className={styles.imageWrapper}>
                        <Image
                          src={blog.image}
                          alt={blog.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className={styles.image}
                          unoptimized={!isRemoteSrc(blog.image)}
                        />
                        <span className={styles.category}>{blog.category}</span>
                      </div>
                      <div className={styles.content}>
                        <div className={styles.meta}>
                          <time dateTime={blog.date}>{formatDate(blog.date)}</time>
                          <span>{blog.readTime} read</span>
                        </div>
                        <h2 className={styles.title}>
                          <Link href={`/blogs/${blog.id}`}>{blog.title}</Link>
                        </h2>
                        <p className={styles.excerpt}>{blog.excerpt}</p>
                        <Link href={`/blogs/${blog.id}`} className={styles.readMore}>
                          Read More →
                        </Link>
                      </div>
                    </GlassCard>
                  </article>
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
