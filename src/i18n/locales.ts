/**
 * src/i18n/locales.ts
 * --------------------------------------------------------------------------
 * Lista canónica de locales soportados por egoera.es y sus etiquetas.
 *
 * - `es` — castellano (default, fallback)
 * - `eu` — euskara
 * - `en` — inglés
 *
 * Cualquier nuevo idioma se añade aquí y al diccionario correspondiente
 * en `src/i18n/dictionaries/<code>.json`. El resto del sistema (middleware,
 * loader, switcher) lee de aquí.
 * --------------------------------------------------------------------------
 */

export const locales = ["es", "eu", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "es";

/**
 * Etiqueta corta (para botones del switcher).
 */
export const localeShortLabels: Record<Locale, string> = {
  es: "ES",
  eu: "EU",
  en: "EN",
};

/**
 * Etiqueta nativa (para menús accesibles, hreflang lang attribute).
 */
export const localeNativeLabels: Record<Locale, string> = {
  es: "Castellano",
  eu: "Euskara",
  en: "English",
};

/**
 * Código BCP47 para `lang` HTML y `hreflang`.
 */
export const localeBcp47: Record<Locale, string> = {
  es: "es-ES",
  eu: "eu-ES",
  en: "en",
};

export const NEXT_LOCALE_COOKIE = "NEXT_LOCALE";

/**
 * Type-guard útil para validar valores recibidos por header / cookie.
 */
export function isLocale(value: unknown): value is Locale {
  return (
    typeof value === "string" && (locales as readonly string[]).includes(value)
  );
}

/**
 * Resultado del parser de prefijo de locale en una URL.
 *  - `locale`: el locale detectado en el primer segmento del path, o `null`.
 *  - `rest`: el path sin el prefijo (siempre empieza por "/").
 *
 * Para indexar ES y EU como páginas distintas, el sitemap emite URLs con
 * prefijo (`/es/blog/...`, `/eu/blog/...`) y el middleware las reescribe
 * internamente al path sin prefijo + setea el header de locale forzado.
 * Esto permite a Google ver dos URLs distintas con contenido distinto sin
 * migrar toda la app a sub-path routing.
 */
export function parseLocaleFromPath(pathname: string): {
  locale: Locale | null;
  rest: string;
} {
  if (!pathname || pathname === "/") return { locale: null, rest: "/" };
  const match = pathname.match(/^\/([a-z]{2})(\/.*)?$/);
  if (!match) return { locale: null, rest: pathname };
  const candidate = match[1];
  if (!isLocale(candidate)) return { locale: null, rest: pathname };
  const rest = match[2] || "/";
  return { locale: candidate, rest };
}
