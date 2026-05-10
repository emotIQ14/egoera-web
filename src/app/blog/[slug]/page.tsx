import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllPosts,
  getPostBySlug,
  getPostsByCategory,
} from "@/lib/blog";
import { V5ArticleShell } from "@/components/article";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

const SITE_URL = "https://egoera.es";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url,
      publishedTime: post.dateISO,
      authors: [post.author || "Ander Bilbao Castejón"],
      section: post.category,
      tags: post.tags,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  // 1. Limpiar overlays V3 y V4 inyectados en el HTML del WP.
  const cleanedHtml = stripLegacyOverlays(post.content);

  // 2. Asegurar que cada <h2> tiene un id estable para el TOC y el
  //    scroll-spy. Si ya tiene uno, lo respetamos.
  const { html: bodyHtml, toc } = injectHeadingIdsAndCollectToc(cleanedHtml);

  // 3. Extraer FAQ pairs si el artículo tiene una sección
  //    "Preguntas frecuentes".
  const faqs = extractFaqs(bodyHtml);

  // 4. Word count del texto plano (para Schema.org Article).
  const wordCount = bodyHtml
    .replace(/<[^>]+>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  // 5. Posts relacionados (mismo categorySlug, sin el actual).
  const allRelated = post.categorySlug
    ? await getPostsByCategory(post.categorySlug)
    : [];
  const related = allRelated
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      category: p.category,
      readTime: p.readTime,
      date: p.date,
    }));

  return (
    <V5ArticleShell
      post={post}
      related={related}
      bodyHtml={bodyHtml}
      faqs={faqs}
      toc={toc}
      wordCount={wordCount}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Helpers de limpieza y extracción
// ─────────────────────────────────────────────────────────────────────────

/**
 * Elimina los bloques de overlays V3 y V4 que se inyectaron como HTML
 * en el contenido del post desde WordPress. Ahora esa UI la provee
 * V5ArticleShell con componentes React reales.
 *
 * Marcadores soportados:
 *   <!-- EGOERA-VLOG-OVERLAY-V3 ... /EGOERA-VLOG-OVERLAY-V3 -->
 *   <!-- EGOERA-VLOG-OVERLAY-V4 ... /EGOERA-VLOG-OVERLAY-V4 GAMIFIED -->
 *   <!-- SEO-OPTIMIZED-... ... /SEO-OPTIMIZED-... -->  (bloque SEO duplicado)
 */
function stripLegacyOverlays(html: string): string {
  if (!html) return "";
  let cleaned = html;

  // V3 overlay (con o sin sufijo)
  cleaned = cleaned.replace(
    /<!--\s*EGOERA-VLOG-OVERLAY-V3[\s\S]*?\/EGOERA-VLOG-OVERLAY-V3\s*-->/gi,
    ""
  );

  // V4 overlay GAMIFIED
  cleaned = cleaned.replace(
    /<!--\s*=*\s*EGOERA-VLOG-OVERLAY-V4[\s\S]*?\/EGOERA-VLOG-OVERLAY-V4[^>]*-->/gi,
    ""
  );

  // Bloque SEO inyectado: ahora V5Schema lo regenera. Quitamos el
  // bloque entero entre los marcadores SEO-OPTIMIZED-<fecha>.
  cleaned = cleaned.replace(
    /<!--\s*SEO-OPTIMIZED-[\d-]+\s*-->[\s\S]*?<!--\s*\/SEO-OPTIMIZED-[\d-]+\s*-->/gi,
    ""
  );

  return cleaned.trim();
}

/**
 * Recorre los <h2> del HTML, asegura que cada uno tiene un id slug
 * estable y devuelve la lista de entradas del TOC.
 *
 * Mantiene la robustez ante <h2 class="foo"> o <h2 id="bar">. Si el
 * h2 ya tiene id, se respeta.
 */
function injectHeadingIdsAndCollectToc(html: string): {
  html: string;
  toc: { id: string; label: string }[];
} {
  if (!html) return { html: "", toc: [] };

  const toc: { id: string; label: string }[] = [];
  const seen = new Set<string>();
  const h2Re = /<h2(\s[^>]*)?>([\s\S]*?)<\/h2>/gi;

  const next = html.replace(h2Re, (_match, attrs, inner) => {
    const text = inner.replace(/<[^>]+>/g, "").trim();
    const idMatch = (attrs || "").match(/\bid=["']([^"']+)["']/i);
    let id = idMatch?.[1];
    if (!id) id = makeUniqueSlug(text || `seccion-${toc.length + 1}`, seen);
    else seen.add(id);

    toc.push({ id, label: text });
    const attrsClean = (attrs || "").replace(/\s*id=["'][^"']+["']/i, "");
    return `<h2${attrsClean} id="${id}">${inner}</h2>`;
  });

  return { html: next, toc };
}

/** Slugify suave en es: minúsculas, quita tildes, sustituye espacios. */
function makeUniqueSlug(text: string, seen: Set<string>): string {
  const base =
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "") // diacríticos combinantes
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 60) || "seccion";
  let candidate = base;
  let n = 2;
  while (seen.has(candidate)) {
    candidate = `${base}-${n}`;
    n++;
  }
  seen.add(candidate);
  return candidate;
}

/**
 * Extrae FAQs si el artículo contiene una sección titulada
 * "Preguntas frecuentes" (variantes con/sin tilde, mayúsculas) y
 * dentro de ella tiene <h3>pregunta</h3><p>respuesta</p>.
 *
 * Si no encuentra la sección o las preguntas, devuelve []. El
 * V5Schema usa este array para decidir si emite o no FAQPage JSON-LD.
 */
function extractFaqs(html: string): { q: string; a: string }[] {
  if (!html) return [];

  // Localizamos el h2 de "Preguntas frecuentes" / "FAQ".
  const sectionRe =
    /<h2[^>]*>\s*(?:Preguntas\s+frecuentes|Preguntas\s+m[áa]s\s+frecuentes|FAQ|FAQs)\s*<\/h2>([\s\S]*?)(?=<h2[^>]*>|$)/i;
  const sectionMatch = html.match(sectionRe);
  if (!sectionMatch) return [];

  const section = sectionMatch[1];
  const pairs: { q: string; a: string }[] = [];
  const pairRe = /<h3[^>]*>([\s\S]*?)<\/h3>\s*([\s\S]*?)(?=<h3[^>]*>|$)/gi;
  let m: RegExpExecArray | null;
  while ((m = pairRe.exec(section)) !== null) {
    const q = m[1].replace(/<[^>]+>/g, " ").trim();
    const a = m[2].replace(/<[^>]+>/g, " ").trim();
    if (q && a) pairs.push({ q, a });
  }
  return pairs;
}
