import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllPosts,
  getPostBySlug,
  getPostsByCategory,
} from "@/lib/blog";
import { V5ArticleShell } from "@/components/article";
import { getArticleSeo } from "@/lib/seo/article-keywords";
import {
  articleSchema,
  breadcrumbSchema,
  personSchema,
  organizationSchema,
} from "@/lib/seo/schemas";
import { buildBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { getCurrentLocale } from "@/i18n/getCurrentLocale";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

const SITE_URL = "https://egoera.es";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

/**
 * generateMetadata · página de artículo.
 *
 * Estrategia SEO por artículo:
 *  1. Título optimizado ≤ 60 caracteres, palabra clave principal al inicio.
 *  2. Description ≤ 158 caracteres con keyword + propuesta de valor.
 *  3. `keywords` array 8-15 términos (head + torso + long-tail) curado en
 *     `@/lib/seo/article-keywords.ts`. Si el slug aún no está curado, se
 *     genera un fallback razonable basado en categoría + título.
 *  4. OpenGraph artículo completo: title, description, type=article,
 *     publishedTime, modifiedTime, authors, tags, image cover.
 *  5. Twitter card summary_large_image.
 *  6. Canonical absoluta + alternates hreflang (es / eu / en / x-default).
 *
 * El JSON-LD (Article, Person, Organization, Breadcrumb, FAQ) se sigue
 * inyectando dentro de `<V5ArticleShell>` vía `V5Schema`, pero el page
 * también emite un BlogPosting enriquecido con los keywords curados.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const seo = getArticleSeo({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
  });

  const url = `${SITE_URL}/blog/${post.slug}`;
  const ogImage = post.coverImage ?? `${SITE_URL}/icons/logo-brain-tree-512.png`;

  return {
    title: seo.seoTitle,
    description: seo.seoDescription,
    keywords: seo.keywords,
    authors: [{ name: post.author || "Ander Bilbao Castejón" }],
    creator: post.author || "Ander Bilbao Castejón",
    publisher: "Egoera",
    alternates: {
      canonical: url,
      languages: {
        // Stubs hreflang — el agente i18n los reescribe cuando exista la
        // traducción real. Hoy los 3 idiomas apuntan al mismo es para no
        // perder el grafo en Search Console.
        es: url,
        eu: `${SITE_URL}/eu/blog/${post.slug}`,
        en: `${SITE_URL}/en/blog/${post.slug}`,
        "x-default": url,
      },
    },
    openGraph: {
      title: seo.seoTitle,
      description: seo.seoDescription,
      type: "article",
      url,
      siteName: "Egoera",
      locale: "es_ES",
      publishedTime: post.dateISO,
      modifiedTime: post.dateISO,
      authors: [post.author || "Ander Bilbao Castejón"],
      section: post.category,
      // OG `tags` = la lista de keywords. Facebook/LinkedIn/X las leen
      // como `article:tag` para mejorar la recomendación social.
      tags: seo.keywords,
      images: [
        {
          url: ogImage,
          alt: post.coverAlt || seo.seoTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@egoerapsikolog",
      creator: "@egoerapsikolog",
      title: seo.seoTitle,
      description: seo.seoDescription,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const [post, locale] = await Promise.all([
    getPostBySlug(slug),
    getCurrentLocale(),
  ]);
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
  //    Pasamos 3 al shell (internal linking SEO) — el componente decide
  //    si renderiza 2 o 3 según template.
  const allRelated = post.categorySlug
    ? await getPostsByCategory(post.categorySlug)
    : [];
  const related = allRelated
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      category: p.category,
      readTime: p.readTime,
      date: p.date,
    }));

  // 6. SEO curado para el JSON-LD enriquecido.
  const seo = getArticleSeo({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
  });

  // 7. JSON-LD BlogPosting + Person + Organization + Breadcrumb.
  //    Lo emitimos desde la página (server) en lugar de en V5Schema
  //    para usar los keywords curados y la categoría legible. V5Schema
  //    se mantiene como fallback histórico — Google deduplica nodos
  //    iguales por @id, así que ambos pueden coexistir sin riesgo.
  const breadcrumbs = buildBreadcrumbs(`/blog/${post.slug}`, { post });
  const breadcrumbJsonLd = breadcrumbSchema(breadcrumbs);
  const articleJsonLd = articleSchema({
    title: seo.seoTitle,
    description: seo.seoDescription,
    slug: post.slug,
    author: post.author,
    datePublished: post.dateISO,
    dateModified: post.dateISO,
    image: post.coverImage ?? undefined,
    category: post.category,
    wordCount,
    keywords: seo.keywords,
  });
  const personJsonLd = personSchema();
  const orgJsonLd = organizationSchema();

  return (
    <>
      {/* JSON-LD enriquecido emitido server-side. El @id de cada nodo
          deduplica con los que emite V5Schema (Article y Breadcrumb
          coinciden por url; Person/Organization por @id global). */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />

      <V5ArticleShell
        post={post}
        related={related}
        bodyHtml={bodyHtml}
        faqs={faqs}
        toc={toc}
        wordCount={wordCount}
        locale={locale}
      />
    </>
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
