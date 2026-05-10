/**
 * src/i18n/hreflang.ts
 * --------------------------------------------------------------------------
 * Helper para generar las URLs alternas (hreflang) de una ruta dada.
 *
 * Mientras seguimos en routing cookie-based (sin /es, /eu, /en en la URL),
 * stubbeamos las alternas con el mismo path bajo /es/, /eu/, /en/. Así el
 * marcado SEO ya está en su sitio para cuando se promocione la app a
 * sub-path routing (approach A) — bastará con que las URLs reales empiecen
 * a existir.
 *
 * Uso desde un Server Component:
 *
 *   import { buildHreflangAlternates } from "@/i18n/hreflang";
 *
 *   export const generateMetadata = (): Metadata => ({
 *     alternates: buildHreflangAlternates("/boletin"),
 *   });
 *
 * O directamente en el <head>:
 *
 *   <link rel="alternate" hrefLang="es-ES" href={alts.es} />
 *   <link rel="alternate" hrefLang="eu-ES" href={alts.eu} />
 *   <link rel="alternate" hrefLang="en"    href={alts.en} />
 *   <link rel="alternate" hrefLang="x-default" href={alts.es} />
 * --------------------------------------------------------------------------
 */

import { defaultLocale, locales, localeBcp47, type Locale } from "./locales";

export const SITE_ORIGIN = "https://egoera.es";

/**
 * Normaliza un pathname para que empiece por "/" y no termine en "/"
 * (excepto la home, que es exactamente "/").
 */
function normalizePath(pathname: string): string {
  if (!pathname || pathname === "/" || pathname === "") return "/";
  let p = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  return p;
}

/**
 * Construye la URL completa para un pathname dado bajo un locale.
 * En el modelo cookie-based, esta URL aún no existe físicamente, pero
 * mantenemos la convención `/es/...`, `/eu/...`, `/en/...` para
 * el día que se promocione a sub-path routing.
 *
 * Para el locale por defecto se devuelve también la URL "limpia"
 * (sin prefijo) — útil como `canonical`.
 */
export function buildLocalePath(pathname: string, locale: Locale): string {
  const path = normalizePath(pathname);
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

export function buildLocaleUrl(pathname: string, locale: Locale): string {
  return `${SITE_ORIGIN}${buildLocalePath(pathname, locale)}`;
}

/**
 * Devuelve un mapa de locale → URL absoluta para usar en `<link rel="alternate">`.
 */
export function buildHreflangMap(pathname: string): Record<Locale, string> {
  const out = {} as Record<Locale, string>;
  for (const l of locales) {
    out[l] = buildLocaleUrl(pathname, l);
  }
  return out;
}

/**
 * Versión adaptada a la API `Metadata.alternates` de Next.js (App Router).
 * Pone también `x-default` apuntando al locale por defecto y un `canonical`
 * con la URL "limpia" (sin prefijo de locale) — esto evita que Google
 * indexe duplicados durante la fase B (cookie-based).
 */
export function buildHreflangAlternates(pathname: string): {
  canonical: string;
  languages: Record<string, string>;
} {
  const path = normalizePath(pathname);
  const canonical = `${SITE_ORIGIN}${path}`;

  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[localeBcp47[l]] = buildLocaleUrl(path, l);
  }
  languages["x-default"] = buildLocaleUrl(path, defaultLocale);

  return { canonical, languages };
}

/**
 * Hook de extensión para el agente del template V5 de artículo.
 *
 * Cuando un artículo (slug) tenga traducciones reales en EU/EN, este
 * helper podrá ampliarse para devolver URLs distintas por slug. De
 * momento mantiene la misma forma — el agente del template debe
 * llamar a `buildHreflangAlternates(`/blog/${slug}`)` y emitir el
 * resultado en la metadata o como `<link rel="alternate">` en el head.
 */
export function buildArticleHreflang(slug: string): {
  canonical: string;
  languages: Record<string, string>;
} {
  return buildHreflangAlternates(`/blog/${slug}`);
}
