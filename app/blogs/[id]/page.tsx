import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import PageHero from "@/components/ui/PageHero";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import JsonLd from "@/components/seo/JsonLd";
import { BLOGS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { createMetadata } from "@/lib/metadata";
import { articleSchema, breadcrumbSchema } from "@/lib/seo/schema";
import styles from "./page.module.css";

interface BlogPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return BLOGS.map((blog) => ({ id: blog.id }));
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { id } = await params;
  const blog = BLOGS.find((b) => b.id === id);
  if (!blog) return createMetadata({ title: "Blog", noIndex: true });
  return createMetadata({
    title: blog.title,
    description: blog.excerpt,
    path: `/blogs/${id}`,
    ogImage: blog.image,
    ogType: "article",
    publishedTime: blog.date,
    keywords: [blog.category, "fitness blog", "gym tips Visakhapatnam"],
  });
}

export default async function BlogDetailPage({ params }: BlogPageProps) {
  const { id } = await params;
  const blog = BLOGS.find((b) => b.id === id);

  if (!blog) notFound();

  return (
    <>
      <JsonLd
        data={[
          articleSchema(blog),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blogs", path: "/blogs" },
            { name: blog.title, path: `/blogs/${id}` },
          ]),
        ]}
      />
      <PageHero title={blog.title} subtitle={blog.category} breadcrumb="Blog" />

      <section className="section">
        <div className="container">
          <article className={styles.article}>
            <GlassCard hover={false} padding="lg">
              <div className={styles.imageWrapper}>
                <Image
                  src={blog.image}
                  alt={blog.title}
                  width={900}
                  height={450}
                  sizes="(max-width: 768px) 100vw, 900px"
                  className={styles.image}
                  priority
                />
              </div>
              <div className={styles.meta}>
                <time dateTime={blog.date}>{formatDate(blog.date)}</time>
                <span>{blog.readTime} read</span>
              </div>
              <div className={styles.content}>
                <p>{blog.excerpt}</p>
                <p>
                  At INDIAN GYM K N RAJU FITNESS, we believe knowledge is power.
                  Our expert trainers share insights to help you make informed
                  decisions about your fitness journey. Whether you&apos;re just
                  starting out or looking to break through a plateau, the right
                  information can make all the difference.
                </p>
                <p>
                  Visit our gym for personalized guidance from certified
                  professionals who understand your unique goals and challenges.
                  Every member receives the support they need to succeed.
                </p>
              </div>
              <div className={styles.footer}>
                <Button href="/blogs" variant="outline">
                  ← Back to Blogs
                </Button>
                <Button href="/free-trial" variant="primary">
                  Start Free Trial
                </Button>
              </div>
            </GlassCard>
          </article>
        </div>
      </section>
    </>
  );
}
