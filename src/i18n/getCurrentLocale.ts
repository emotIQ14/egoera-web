/**
 * src/i18n/getCurrentLocale.ts
 * --------------------------------------------------------------------------
 * Helper server-side para conocer el locale activo del request actual.
 *
 * Lee, por orden de preferencia:
 *   1. Header `x-egoera-locale-forced` (lo escribe el middleware cuando la
 *      URL trae prefijo de locale `/es/`, `/eu/`, `/en/`). Tiene prioridad
 *      máxima porque es la decisión explícita de la URL, no del usuario.
 *      Sin esto, Googlebot no podría rastrear las variantes EU/EN si el
 *      crawler arrastra una cookie residual.
 *   2. Cookie `NEXT_LOCALE` (decisión explícita del usuario vía switcher).
 *   3. Header `x-egoera-locale` (escrito por middleware tras negociar
 *      Accept-Language).
 *   4. defaultLocale ("es").
 *
 * En App Router, `cookies()` y `headers()` son async — por eso el helper
 * lo es. Sólo válido en Server Components / Route Handlers / Server Actions.
 * --------------------------------------------------------------------------
 */

import "server-only";

import { cookies, headers } from "next/headers";

import {
  defaultLocale,
  isLocale,
  NEXT_LOCALE_COOKIE,
  type Locale,
} from "./locales";

export const LOCALE_HEADER = "x-egoera-locale";
export const LOCALE_FORCED_HEADER = "x-egoera-locale-forced";

export async function getCurrentLocale(): Promise<Locale> {
  const hdrs = await headers();

  // 1. Locale forzado por la URL (`/es/...`, `/eu/...`, `/en/...`).
  //    Prioridad máxima: garantiza que Google indexa cada variante con
  //    su contenido correcto independientemente de cookies de sesión.
  const forced = hdrs.get(LOCALE_FORCED_HEADER);
  if (forced && isLocale(forced)) {
    return forced;
  }

  // 2. Cookie (decisión explícita del usuario)
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(NEXT_LOCALE_COOKIE)?.value;
  if (cookieValue && isLocale(cookieValue)) {
    return cookieValue;
  }

  // 3. Header inyectado por el middleware (negociación Accept-Language)
  const headerValue = hdrs.get(LOCALE_HEADER);
  if (headerValue && isLocale(headerValue)) {
    return headerValue;
  }

  // 4. Fallback duro al locale por defecto
  return defaultLocale;
}
