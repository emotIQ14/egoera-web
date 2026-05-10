/**
 * Helper de metadatos para Next.js App Router.
 *
 * Un solo punto de entrada — `buildMetadata()` — que toma la configuración
 * mínima de la página y devuelve un objeto Metadata completo con:
 *   - title / description
 *   - canonical absoluta
 *   - alternates con stubs hreflang (es / eu / en / x-default)
 *   - OpenGraph en es_ES
 *   - Twitter card summary_large_image
 *   - robots con max-image-preview:large
 *
 * Los stubs hreflang apuntan a futuras rutas con prefijo de locale
 * (/eu/<path>, /en/<path>). Hoy esas rutas todavía no existen, pero
 * dejarlas declaradas en `<link rel="alternate">` no penaliza: cuando
 * el agente i18n las cree, los buscadores ya tendrán el grafo listo.
 */

import type { Metadata } from "next";
import {
  AUTHOR,
  DEFAULT_OG_IMAGE,
  DEFAULT_LOCALE,
  SITE_NAME,
  SITE_URL,
} from "./schemas";

/** Locales soportados (presentes o stub) por orden de prioridad. */
export const SUPPORTED_LOCALES = ["es", "eu", "en"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export type PageType = "website" | "article" | "profile";

export interface BuildMetadataInput {
  /** Título sin marca: el template de layout añadirá " | Egoera". */
  title: string;
  /** Meta-descripción en español. Recomendado 140-160 chars. */
  description: string;
  /** Ruta canónica relativa (ej. "/sobre-nosotros") o absoluta. */
  slug: string;
  /** URL absoluta o relativa de la imagen OG. Si falta, OG por defecto. */
  image?: string;
  /** Tipo OpenGraph. Por defecto "website". */
  type?: PageType;
  /** Override de keywords; si falta usa las globales del layout. */
  keywords?: string[];
  /** Idioma del contenido (afecta a OpenGraph locale). */
  locale?: SupportedLocale;
  /** Si false, emite robots noindex (útil para páginas privadas). */
  index?: boolean;
}

/** Resuelve una ruta relativa o absoluta contra SITE_URL. */
function toAbsolute(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  if (!pathOrUrl.startsWith("/")) return `${SITE_URL}/${pathOrUrl}`;
  return `${SITE_URL}${pathOrUrl}`;
}

/** Devuelve la ruta relativa sin host (mantiene leading slash). */
function toRelative(pathOrUrl: string): string {
  if (!/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  }
  try {
    const u = new URL(pathOrUrl);
    return u.pathname || "/";
  } catch {
    return "/";
  }
}

/**
 * Genera el grafo de alternates hreflang para una ruta dada.
 * Estructura prevista cuando exista i18n:
 *   /                    → es (default)
 *   /eu/<path>           → eu
 *   /en/<path>           → en
 *   x-default            → es (raíz)
 */
function buildHreflang(pathRelative: string): Record<string, string> {
  const cleanPath =
    pathRelative === "/" ? "" : pathRelative.replace(/\/$/, "");
  return {
    es: `${SITE_URL}${cleanPath || "/"}`,
    eu: `${SITE_URL}/eu${cleanPath}`,
    en: `${SITE_URL}/en${cleanPath}`,
    "x-default": `${SITE_URL}${cleanPath || "/"}`,
  };
}

/** Mapea SupportedLocale → código OG locale. */
function ogLocale(locale: SupportedLocale | undefined): string {
  switch (locale) {
    case "eu":
      return "eu_ES";
    case "en":
      return "en_US";
    case "es":
    default:
      return DEFAULT_LOCALE;
  }
}

/**
 * Construye el objeto Metadata para una página.
 * Pensado para usar dentro de `export const metadata` o de
 * `generateMetadata()` en cualquier route segment.
 */
export function buildMetadata(input: BuildMetadataInput): Metadata {
  const relative = toRelative(input.slug);
  const canonical = toAbsolute(relative);
  const image = input.image ? toAbsolute(input.image) : DEFAULT_OG_IMAGE;
  const locale = input.locale ?? "es";
  const indexable = input.index ?? true;

  return {
    title: input.title,
    description: input.description,
    ...(input.keywords && input.keywords.length > 0
      ? { keywords: input.keywords }
      : {}),
    authors: [{ name: AUTHOR.name, url: AUTHOR.url }],
    creator: AUTHOR.name,
    alternates: {
      canonical,
      languages: buildHreflang(relative),
    },
    openGraph: {
      type: input.type ?? "website",
      locale: ogLocale(locale),
      siteName: SITE_NAME,
      title: input.title,
      description: input.description,
      url: canonical,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@egoerapsikolog",
      creator: "@egoerapsikolog",
      title: input.title,
      description: input.description,
      images: [image],
    },
    robots: indexable
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        }
      : { index: false, follow: false },
  };
}
