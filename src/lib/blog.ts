/**
 * Blog data layer. Thin adapter over the WordPress REST client that keeps
 * the BlogPost shape stable for existing UI components.
 */
import {
  decodeEntities,
  getAllPosts as wpGetAllPosts,
  getAuthorName,
  getFeaturedImage,
  getPostBySlug as wpGetPostBySlug,
  getPostsByCategory as wpGetPostsByCategory,
  getPrimaryTerm,
  stripHtml,
  type WPPost,
} from "./wordpress";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categorySlug: string;
  date: string; // formatted for display
  dateISO: string; // original ISO
  author: string;
  readTime: string;
  tags: string[];
  content: string; // WordPress-rendered HTML
  featured?: boolean;
  coverImage?: string | null;
  coverAlt?: string;
}

export interface CategoryInfo {
  slug: string;
  name: string;
  color: string;
}

export const CATEGORIES: Record<string, CategoryInfo> = {
  "regulacion-emocional": {
    slug: "regulacion-emocional",
    name: "Regulacion Emocional",
    color: "#6BA3BE",
  },
  "relaciones-apego": {
    slug: "relaciones-apego",
    name: "Relaciones y Apego",
    color: "#7FB5A0",
  },
  autoconocimiento: {
    slug: "autoconocimiento",
    name: "Autoconocimiento",
    color: "#A8D5C8",
  },
  "limites-asertividad": {
    slug: "limites-asertividad",
    name: "Limites y Asertividad",
    color: "#B8A9C9",
  },
  desmitificacion: {
    slug: "desmitificacion",
    name: "Desmitificacion",
    color: "#E8A87C",
  },
  "psicologia-cotidiana": {
    slug: "psicologia-cotidiana",
    name: "Psicologia Cotidiana",
    color: "#F4B8C1",
  },
};

// ── Internal helpers ─────────────────────────────────────────────────────────

const MONTHS_ES = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];

function formatDateEs(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getDate()} ${MONTHS_ES[d.getMonth()]} ${d.getFullYear()}`;
}

/** Rough reading time: ~220 words per minute over plain text. */
function estimateReadTime(html: string): string {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
  const mins = Math.max(1, Math.round(words / 220));
  return `${mins} min`;
}

function mapPost(post: WPPost): BlogPost {
  const primary = getPrimaryTerm(post);
  const rawCategorySlug = primary?.slug ?? "";
  const known = CATEGORIES[rawCategorySlug];

  const featuredMedia = getFeaturedImage(post);

  return {
    slug: post.slug,
    title: decodeEntities(post.title?.rendered ?? ""),
    excerpt: stripHtml(post.excerpt?.rendered ?? ""),
    category: known?.name ?? (primary?.name ? decodeEntities(primary.name) : ""),
    categorySlug: known?.slug ?? rawCategorySlug,
    date: formatDateEs(post.date),
    dateISO: post.date,
    author: getAuthorName(post),
    readTime: estimateReadTime(post.content?.rendered ?? ""),
    tags: [],
    content: post.content?.rendered ?? "",
    featured: Boolean(post.sticky),
    coverImage: featuredMedia?.source_url ?? null,
    coverAlt: featuredMedia?.alt_text ?? "",
  };
}

// ── Public API ───────────────────────────────────────────────────────────────

export async function getAllPosts(): Promise<BlogPost[]> {
  const posts = await wpGetAllPosts({ perPage: 100 });
  return posts.map(mapPost);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const post = await wpGetPostBySlug(slug);
  return post ? mapPost(post) : undefined;
}

export async function getPostsByCategory(
  categorySlug: string
): Promise<BlogPost[]> {
  const posts = await wpGetPostsByCategory(categorySlug);
  return posts.map(mapPost);
}

export async function getFeaturedPosts(limit = 6): Promise<BlogPost[]> {
  const posts = await wpGetAllPosts({ perPage: limit });
  return posts.map(mapPost);
}
