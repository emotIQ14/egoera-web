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
