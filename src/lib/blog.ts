import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const CONTENT_DIR = path.join(process.cwd(), "src/content/blog");

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categorySlug: string;
  date: string;
  author: string;
  readTime: string;
  tags: string[];
  content: string;
  featured?: boolean;
}

export interface CategoryInfo {
  slug: string;
  name: string;
  color: string;
}

export const CATEGORIES: Record<string, CategoryInfo> = {
  "regulacion-emocional": { slug: "regulacion-emocional", name: "Regulacion Emocional", color: "#6BA3BE" },
  "relaciones-apego": { slug: "relaciones-apego", name: "Relaciones y Apego", color: "#7FB5A0" },
  "autoconocimiento": { slug: "autoconocimiento", name: "Autoconocimiento", color: "#A8D5C8" },
  "limites-asertividad": { slug: "limites-asertividad", name: "Limites y Asertividad", color: "#B8A9C9" },
  "desmitificacion": { slug: "desmitificacion", name: "Desmitificacion", color: "#E8A87C" },
  "psicologia-cotidiana": { slug: "psicologia-cotidiana", name: "Psicologia Cotidiana", color: "#F4B8C1" },
};

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((file) => {
    const slug = file.replace(".mdx", "");
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8");
    const { data, content } = matter(raw);
    const stats = readingTime(content);

    return {
      slug,
      title: data.title ?? slug,
      excerpt: data.excerpt ?? "",
      category: CATEGORIES[data.category]?.name ?? data.category ?? "",
      categorySlug: data.category ?? "",
      date: data.date ?? "",
      author: data.author ?? "Egoera Psikologia",
      readTime: stats.text.replace(" read", ""),
      tags: data.tags ?? [],
      content,
      featured: data.featured ?? false,
    } satisfies BlogPost;
  });

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function getPostsByCategory(categorySlug: string): BlogPost[] {
  return getAllPosts().filter((p) => p.categorySlug === categorySlug);
}
