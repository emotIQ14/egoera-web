/**
 * src/i18n/getDictionary.ts
 * --------------------------------------------------------------------------
 * Loader server-side de diccionarios. Sólo se debe llamar desde Server
 * Components (page.tsx, layout.tsx). Para clientes, pasa la sub-sección
 * que necesites como prop.
 *
 * Uso típico:
 *
 *   import { getDictionary } from "@/i18n/getDictionary";
 *   import { getCurrentLocale } from "@/i18n/getCurrentLocale";
 *
 *   export default async function Page() {
 *     const locale = await getCurrentLocale();
 *     const dict = await getDictionary(locale);
 *     return <h1>{dict.boletin.title}</h1>;
 *   }
 *
 * Cae a `es` si el locale es desconocido.
 * --------------------------------------------------------------------------
 */

import "server-only";

import { defaultLocale, isLocale, type Locale } from "./locales";
import esDict from "./dictionaries/es.json";
import euDict from "./dictionaries/eu.json";
import enDict from "./dictionaries/en.json";

/**
 * El diccionario base (es) define la forma de las claves "consumibles".
 * `_meta` es metadata interna (notas, TODOs por locale) y se excluye
 * intencionadamente del tipo público — su shape varía por locale.
 *
 * El resto de claves DEBE cumplir la forma de `es.json`; TS lo verifica
 * en tiempo de compilación gracias a `Record<Locale, Dictionary>`.
 */
type EsDict = typeof esDict;
export type Dictionary = Omit<EsDict, "_meta">;

/**
 * Quita `_meta` antes de exponer el diccionario al consumidor. Hacerlo
 * por desestructuración da validación estructural completa: si una clave
 * falta o cambia de tipo en eu.json / en.json, TS lo detecta aquí.
 */
function strip(d: { _meta: unknown } & Dictionary): Dictionary {
  const { _meta, ...rest } = d;
  void _meta;
  return rest;
}

const dictionaries: Record<Locale, Dictionary> = {
  es: strip(esDict),
  eu: strip(euDict),
  en: strip(enDict),
};

/**
 * Carga el diccionario para un locale concreto.
 * - Acepta cualquier string (defensa para query params, headers); si no
 *   coincide, devuelve el diccionario por defecto.
 * - Es async para no romper si en el futuro cargamos los JSON dinámicamente
 *   por code-splitting.
 */
export async function getDictionary(locale: string | Locale): Promise<Dictionary> {
  const safe: Locale = isLocale(locale) ? locale : defaultLocale;
  return dictionaries[safe];
}

/**
 * Devuelve el diccionario base (es). Útil para pruebas y para el
 * fallback en componentes que necesiten claves estáticas.
 */
export function getBaseDictionary(): Dictionary {
  return dictionaries.es;
}
