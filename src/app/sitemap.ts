/**
 * Sitemap dinámico de egoera.es.
 *
 * Estrategia (indexación separada por idioma, mayo 2026):
 *  1. Cada ruta canónica (estática, post, categoría, región, sentimiento)
 *     se emite **una vez por locale soportado** (`es`, `eu`, `en`) con
 *     prefijo de locale en la URL (`/es/...`, `/eu/...`, `/en/...`).
 *  2. El middleware reescribe internamente esos paths al path "limpio"
 *     y fuerza el locale del request — así cada URL devuelve contenido
 *     en su idioma sin migrar la app a sub-path routing.
 *  3. Cada entrada incluye `alternates.languages` cruzando las 3 variantes
 *     + `x-default` apuntando al castellano. Esto le indica a Google que
 *     son traducciones de la misma página, no contenido duplicado.
 *
 * Resultado SEO: Googlebot rastrea `/es/blog/X` y `/eu/blog/X` como dos
 * páginas distintas, las indexa por separado, y el clúster hreflang las
 * une como variantes idiomáticas — exactamente lo que pide el dueño del
 * sitio.
 *
 * Revalida cada hora para reflejar nuevos posts publicados desde
 * WordPress sin requerir un redeploy.
 */

import type { MetadataRoute } from "next";
import { getAllPosts, CATEGORIES } from "@/lib/blog";
import { BRAIN_REGIONS, FEELINGS } from "@/lib/egoera-data";
import {
  defaultLocale,
  locales,
  localeBcp47,
  type Locale,
} from "@/i18n/locales";

export const revalidate = 3600;

const SITE_URL = "https://egoera.es";

type ChangeFreq = NonNullable<
  MetadataRoute.Sitemap[number]["changeFrequency"]
>;

/** Tipo de entrada extendida que admite `alternates`. */
type SitemapEntry = MetadataRoute.Sitemap[number] & {
  alternates?: { languages?: Record<string, string> };
};

/**
 * URL absoluta para un path canónico bajo un locale concreto.
 * Cada locale recibe su propio prefijo: `/es/...`, `/eu/...`, `/en/...`.
 * La home de cada locale es `/{locale}` (sin slash final).
 */
function localeUrl(path: string, locale: Locale): string {
  const clean = path === "/" ? "" : path.replace(/\/$/, "");
  return clean === "" ? `${SITE_URL}/${locale}` : `${SITE_URL}/${locale}${clean}`;
}

/**
 * Construye el bloque `alternates.languages` para una ruta canónica.
 * Cruza los 3 locales + `x-default` (apuntando al `defaultLocale`).
 */
function alternatesFor(path: string): { languages: Record<string, string> } {
  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[localeBcp47[l]] = localeUrl(path, l);
  }
  languages["x-default"] = localeUrl(path, defaultLocale);
  return { languages };
}

/**
 * Emite una entrada de sitemap por cada locale soportado para un mismo
 * path canónico. Mantiene `lastModified`, `changeFrequency` y `priority`
 * idénticos entre variantes — el contenido cambia pero la cadencia editorial
 * y la importancia SEO no.
 */
function expandByLocale(
  path: string,
  options: {
    lastModified: Date;
    changeFrequency: ChangeFreq;
    priority: number;
  },
): SitemapEntry[] {
  const alts = alternatesFor(path);
  return locales.map((l) => ({
    url: localeUrl(path, l),
    lastModified: options.lastModified,
    changeFrequency: options.changeFrequency,
    priority: options.priority,
    alternates: alts,
  }));
}

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
  { path: "/sentir", priority: 0.85, changeFrequency: "weekly" },
  { path: "/apoya", priority: 0.8, changeFrequency: "monthly" },
  { path: "/contacto", priority: 0.7, changeFrequency: "monthly" },
  { path: "/descargas", priority: 0.7, changeFrequency: "monthly" },
  { path: "/descargas/diario-gratis", priority: 0.7, changeFrequency: "monthly" },
  { path: "/descargas/meditacion-ansiedad", priority: 0.7, changeFrequency: "monthly" },
  { path: "/descargas/test-apego", priority: 0.7, changeFrequency: "monthly" },
  { path: "/recursos", priority: 0.7, changeFrequency: "monthly" },
  // /servicios eliminado: Egoera ya no ofrece consulta presencial.
  // El redirect 308 lo manda a /. Mantenerlo en el sitemap haría
  // que Googlebot rastree la URL sólo para encontrar la redirección.
  { path: "/aviso-legal", priority: 0.3, changeFrequency: "yearly" },
  { path: "/privacidad", priority: 0.3, changeFrequency: "yearly" },
  { path: "/cookies", priority: 0.3, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // 1. Estáticas — una entrada por locale.
  const staticEntries: SitemapEntry[] = STATIC_ROUTES.flatMap((r) =>
    expandByLocale(r.path, {
      lastModified: now,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    }),
  );

  // 2. Posts dinámicos del WordPress — una entrada por locale.
  //
  // Prioridad calibrada por SEO:
  //  - 0.55  → posts con slug "automatizado" del tipo <tema>-2026-w<NN>
  //            (versiones semanales editoriales que comparten cluster
  //            con la pieza "siempre verde" — evitan canibalización
  //            propia bajando su peso en el sitemap).
  //  - 0.75  → posts con slug semántico (long-tail clínico).
  //  - 0.80  → posts en las categorías destacadas del cuaderno
  //            (autoconocimiento, regulación emocional). Son los
  //            silos de mayor intención clínica y mejor CTR histórico.
  const PREMIUM_CATEGORIES = new Set([
    "autoconocimiento",
    "regulacion-emocional",
  ]);
  const isWeeklyAutomated = (slug: string): boolean =>
    /-2026-w\d{1,2}$/i.test(slug);

  let postEntries: SitemapEntry[] = [];
  try {
    const posts = await getAllPosts();
    postEntries = posts.flatMap((post) => {
      let priority = 0.75;
      if (isWeeklyAutomated(post.slug)) {
        priority = 0.55;
      } else if (
        post.categorySlug &&
        PREMIUM_CATEGORIES.has(post.categorySlug)
      ) {
        priority = 0.8;
      }
      return expandByLocale(`/blog/${post.slug}`, {
        lastModified: post.dateISO ? new Date(post.dateISO) : now,
        changeFrequency: "monthly",
        priority,
      });
    });
  } catch {
    // Si WordPress falla, no rompemos el sitemap: emitimos las estáticas.
    postEntries = [];
  }

  // 3. Categorías editoriales — una entrada por locale.
  const categoryEntries: SitemapEntry[] = Object.values(CATEGORIES).flatMap(
    (cat) =>
      expandByLocale(`/categoria/${cat.slug}`, {
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.6,
      }),
  );

  // 4. Regiones cerebrales (UI) — una entrada por locale.
  //    Algunas pueden coincidir con CATEGORIES; deduplicamos por URL al final.
  const regionEntries: SitemapEntry[] = BRAIN_REGIONS.flatMap((r) =>
    expandByLocale(`/categoria/${r.id}`, {
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.65,
    }),
  );

  // 5. Sentimientos (UI) — una entrada por locale.
  const feelingEntries: SitemapEntry[] = FEELINGS.flatMap((f) =>
    expandByLocale(`/sentimiento/${f.id}`, {
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    }),
  );

  // Dedupe por URL (algunas categorías y regiones comparten slug, lo que
  // tras la expansión por locale genera 3 colisiones, no 1).
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
