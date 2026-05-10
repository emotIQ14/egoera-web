/**
 * Sitemap dinámico de egoera.es.
 *
 * Estrategia:
 *  1. Rutas estáticas (cobalto + legacy + legales) con prioridad calibrada.
 *  2. Posts de WordPress vía getAllPosts().
 *  3. Categorías editoriales (CATEGORIES de @/lib/blog).
 *  4. Regiones cerebrales y sentimientos (rutas reales del UI).
 *  5. Cada entrada incluye `alternates.languages` con stubs hreflang
 *     (es / eu / en / x-default). Hoy las versiones eu/en aún no existen
 *     pero declararlas en el sitemap deja el grafo preparado para la
 *     fase de i18n sin penalización SEO.
 *
 * Revalida cada hora para reflejar nuevos posts publicados desde
 * WordPress sin requerir un redeploy.
 */

import type { MetadataRoute } from "next";
import { getAllPosts, CATEGORIES } from "@/lib/blog";
import { BRAIN_REGIONS, FEELINGS } from "@/lib/egoera-data";

export const revalidate = 3600;

const SITE_URL = "https://egoera.es";

type ChangeFreq = NonNullable<
  MetadataRoute.Sitemap[number]["changeFrequency"]
>;

/**
 * Construye el bloque `alternates.languages` con hreflang stubs.
 * Cuando la i18n esté en producción, las URLs de eu/en serán reales.
 */
function alternatesFor(path: string): { languages: Record<string, string> } {
  const cleanPath = path === "/" ? "" : path.replace(/\/$/, "");
  return {
    languages: {
      es: `${SITE_URL}${cleanPath || "/"}`,
      eu: `${SITE_URL}/eu${cleanPath}`,
      en: `${SITE_URL}/en${cleanPath}`,
      "x-default": `${SITE_URL}${cleanPath || "/"}`,
    },
  };
}

/** Tipo de entrada extendida que admite `alternates`. */
type SitemapEntry = MetadataRoute.Sitemap[number] & {
  alternates?: { languages?: Record<string, string> };
};

interface StaticRoute {
  path: string;
  priority: number;
  changeFrequency: ChangeFreq;
}

/**
 * Rutas estáticas catalogadas.
 *  - Home: 1.0, weekly
 *  - Cobalto (sobre, manifiesto, boletín, etc.): 0.8, monthly/weekly
 *  - Diario público: 0.8 (las subrutas privadas se excluyen vía robots)
 *  - Legales: 0.3, yearly
 *  - Otras secciones (cursos, tienda, sentimiento): visibles → bajas
 */
const STATIC_ROUTES: StaticRoute[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/blog", priority: 0.9, changeFrequency: "daily" },
  { path: "/sobre-nosotros", priority: 0.8, changeFrequency: "monthly" },
  { path: "/manifiesto", priority: 0.8, changeFrequency: "monthly" },
  { path: "/boletin", priority: 0.8, changeFrequency: "monthly" },
  { path: "/diario", priority: 0.8, changeFrequency: "weekly" },
  { path: "/apoya", priority: 0.8, changeFrequency: "monthly" },
  { path: "/contacto", priority: 0.7, changeFrequency: "monthly" },
  { path: "/descargas", priority: 0.7, changeFrequency: "monthly" },
  { path: "/descargas/diario-gratis", priority: 0.7, changeFrequency: "monthly" },
  { path: "/descargas/meditacion-ansiedad", priority: 0.7, changeFrequency: "monthly" },
  { path: "/descargas/test-apego", priority: 0.7, changeFrequency: "monthly" },
  { path: "/recursos", priority: 0.7, changeFrequency: "monthly" },
  { path: "/servicios", priority: 0.8, changeFrequency: "monthly" },
  { path: "/aviso-legal", priority: 0.3, changeFrequency: "yearly" },
  { path: "/privacidad", priority: 0.3, changeFrequency: "yearly" },
  { path: "/cookies", priority: 0.3, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Estáticas
  const now = new Date();
  const staticEntries: SitemapEntry[] = STATIC_ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
    alternates: alternatesFor(r.path),
  }));

  // 2. Posts dinámicos del WordPress
  let postEntries: SitemapEntry[] = [];
  try {
    const posts = await getAllPosts();
    postEntries = posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.dateISO ? new Date(post.dateISO) : now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: alternatesFor(`/blog/${post.slug}`),
    }));
  } catch {
    // Si WordPress falla, no rompemos el sitemap: emitimos las estáticas.
    postEntries = [];
  }

  // 3. Categorías editoriales (CATEGORIES de @/lib/blog)
  const categoryEntries: SitemapEntry[] = Object.values(CATEGORIES).map(
    (cat) => ({
      url: `${SITE_URL}/categoria/${cat.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
      alternates: alternatesFor(`/categoria/${cat.slug}`),
    })
  );

  // 4. Regiones cerebrales (UI) — mantienen su ruta /categoria/<id>
  //    Algunas pueden coincidir con CATEGORIES; deduplicamos por URL al final.
  const regionEntries: SitemapEntry[] = BRAIN_REGIONS.map((r) => ({
    url: `${SITE_URL}/categoria/${r.id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.65,
    alternates: alternatesFor(`/categoria/${r.id}`),
  }));

  // 5. Sentimientos (UI)
  const feelingEntries: SitemapEntry[] = FEELINGS.map((f) => ({
    url: `${SITE_URL}/sentimiento/${f.id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
    alternates: alternatesFor(`/sentimiento/${f.id}`),
  }));

  // Dedupe por URL (algunas categorías y regiones comparten slug).
  const all: SitemapEntry[] = [
    ...staticEntries,
    ...postEntries,
    ...categoryEntries,
    ...regionEntries,
    ...feelingEntries,
  ];

  const seen = new Set<string>();
  const unique: SitemapEntry[] = [];
  for (const entry of all) {
    if (seen.has(entry.url)) continue;
    seen.add(entry.url);
    unique.push(entry);
  }

  return unique;
}
