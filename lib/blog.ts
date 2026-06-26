export interface BlogItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  category: string;
  image: string;
  readTime: string;
  date: string;
  isPublished?: boolean;
}
