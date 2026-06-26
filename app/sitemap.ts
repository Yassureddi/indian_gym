import type { MetadataRoute } from "next";
import { fetchBlogs } from "@/lib/api/content";
import { SITE_URL } from "@/lib/seo/config";

const PUBLIC_ROUTES: {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"];
}[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/about", priority: 0.85, changeFrequency: "monthly" },
  { path: "/services", priority: 0.85, changeFrequency: "monthly" },
  { path: "/membership", priority: 0.9, changeFrequency: "weekly" },
  { path: "/trainers", priority: 0.8, changeFrequency: "monthly" },
  { path: "/gallery", priority: 0.75, changeFrequency: "weekly" },
  { path: "/transformation", priority: 0.8, changeFrequency: "weekly" },
  { path: "/bmi-calculator", priority: 0.7, changeFrequency: "monthly" },
  { path: "/blogs", priority: 0.8, changeFrequency: "weekly" },
  { path: "/faqs", priority: 0.7, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.85, changeFrequency: "monthly" },
  { path: "/free-trial", priority: 0.9, changeFrequency: "weekly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const blogs = await fetchBlogs();

  const staticPages = PUBLIC_ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    lastModified,
    changeFrequency,
    priority,
  }));

  const blogPages = blogs.map((blog) => ({
    url: `${SITE_URL}/blogs/${blog.id}`,
    lastModified: new Date(blog.date),
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  return [...staticPages, ...blogPages];
}
