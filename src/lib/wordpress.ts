/**
 * WordPress REST API client for egoera.es (headless CMS).
 *
 * - Uses ISR (revalidate: 3600s) for all reads.
 * - Fails gracefully: on network/DNS errors returns empty data so builds
 *   don't crash when the site is unreachable from the build host.
 * - Optional local-dev fallback: set WP_FALLBACK_IP to hit the origin by IP
 *   with a Host header when DNS is misconfigured locally.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

const DEFAULT_API = "https://egoera.es";
const API_BASE = (process.env.WP_API_URL ?? DEFAULT_API).replace(/\/$/, "");
const FALLBACK_IP = process.env.WP_FALLBACK_IP; // e.g. "217.160.0.3"
const REVALIDATE_SECONDS = 3600;

// ── Types ────────────────────────────────────────────────────────────────────

export interface WPRendered {
  rendered: string;
  protected?: boolean;
}

export interface WPTerm {
  id: number;
  slug: string;
  name: string;
  taxonomy?: string;
}

export interface WPAuthor {
  id: number;
  name: string;
  slug?: string;
}

export interface WPFeaturedMedia {
  id: number;
  source_url: string;
  alt_text?: string;
  media_details?: {
    width?: number;
    height?: number;
  };
}

export interface WPEmbedded {
  author?: WPAuthor[];
  "wp:term"?: WPTerm[][];
  "wp:featuredmedia"?: WPFeaturedMedia[];
}

export interface WPPost {
  id: number;
  slug: string;
  date: string;
  modified?: string;
  link?: string;
  title: WPRendered;
  excerpt: WPRendered;
  content: WPRendered;
  author: number;
  categories: number[];
  tags?: number[];
  featured_media?: number;
  sticky?: boolean;
  _embedded?: WPEmbedded;
}

export interface WPCategory {
  id: number;
  slug: string;
  name: string;
  description?: string;
  count?: number;
  parent?: number;
}

export interface GetAllPostsOptions {
  page?: number;
  perPage?: number;
  category?: string; // category slug
  search?: string;
}

// ── Internal fetch with optional IP fallback ─────────────────────────────────

async function wpFetch<T>(path: string): Promise<T | null> {
  const url = `${API_BASE}/wp-json/wp/v2${path}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      console.warn(`[wordpress] ${res.status} on ${url}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    // DNS or network error. Try IP fallback if configured (local dev).
    if (FALLBACK_IP) {
      try {
        const host = new URL(API_BASE).host;
        const ipUrl = url.replace(host, FALLBACK_IP);
        const res = await fetch(ipUrl, {
          next: { revalidate: REVALIDATE_SECONDS },
          headers: { Accept: "application/json", Host: host },
        });
        if (res.ok) return (await res.json()) as T;
        console.warn(`[wordpress] IP fallback ${res.status} on ${ipUrl}`);
      } catch (fallbackErr) {
        console.warn(
          `[wordpress] IP fallback failed for ${url}:`,
          fallbackErr instanceof Error ? fallbackErr.message : fallbackErr
        );
      }
    }
    console.warn(
      `[wordpress] fetch failed for ${url}:`,
      err instanceof Error ? err.message : err
    );
    return null;
  }
}

// ── Public API ───────────────────────────────────────────────────────────────

export async function getAllPosts(
  opts: GetAllPostsOptions = {}
): Promise<WPPost[]> {
  const { page = 1, perPage = 100, category, search } = opts;

  const params = new URLSearchParams({
    _embed: "1",
    per_page: String(perPage),
    page: String(page),
    orderby: "date",
    order: "desc",
  });

  if (search) params.set("search", search);

  if (category) {
    const cat = await getCategoryBySlug(category);
    if (!cat) return [];
    params.set("categories", String(cat.id));
  }

  const posts = await wpFetch<WPPost[]>(`/posts?${params.toString()}`);
  return posts ?? [];
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  const params = new URLSearchParams({ slug, _embed: "1" });
  const posts = await wpFetch<WPPost[]>(`/posts?${params.toString()}`);
  return posts?.[0] ?? null;
}

export async function getCategories(): Promise<WPCategory[]> {
  const params = new URLSearchParams({
    per_page: "100",
    hide_empty: "false",
  });
  const cats = await wpFetch<WPCategory[]>(`/categories?${params.toString()}`);
  return cats ?? [];
}

export async function getCategoryBySlug(
  slug: string
): Promise<WPCategory | null> {
  const params = new URLSearchParams({ slug, per_page: "1" });
  const cats = await wpFetch<WPCategory[]>(`/categories?${params.toString()}`);
  return cats?.[0] ?? null;
}

export async function getPostsByCategory(
  categorySlug: string,
  perPage = 100
): Promise<WPPost[]> {
  return getAllPosts({ category: categorySlug, perPage });
}

// ── Helpers for consumers ────────────────────────────────────────────────────

/** Strip HTML tags, decode common entities. Useful for meta description / excerpt. */
export function stripHtml(html: string): string {
  if (!html) return "";
  return decodeEntities(html.replace(/<[^>]*>/g, "")).trim();
}

/** Decode a subset of HTML entities that WordPress emits in `rendered` fields. */
export function decodeEntities(input: string): string {
  if (!input) return "";
  return input
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, n) =>
      String.fromCodePoint(parseInt(n, 16))
    )
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&hellip;/g, "\u2026")
    .replace(/&mdash;/g, "\u2014")
    .replace(/&ndash;/g, "\u2013")
    .replace(/&laquo;/g, "\u00AB")
    .replace(/&raquo;/g, "\u00BB");
}

/** First category term from _embedded, or null. */
export function getPrimaryTerm(post: WPPost): WPTerm | null {
  const groups = post._embedded?.["wp:term"] ?? [];
  for (const group of groups) {
    const cat = group?.find?.((t) => t.taxonomy === "category" || !t.taxonomy);
    if (cat) return cat;
  }
  return null;
}

export function getFeaturedImage(post: WPPost): WPFeaturedMedia | null {
  return post._embedded?.["wp:featuredmedia"]?.[0] ?? null;
}

export function getAuthorName(post: WPPost): string {
  return post._embedded?.author?.[0]?.name ?? "Egoera Psikologia";
}
