/**
 * src/i18n/getCurrentLocale.ts
 * --------------------------------------------------------------------------
 * Helper server-side para conocer el locale activo del request actual.
 *
 * Lee, por orden de preferencia:
 *   1. Cookie `NEXT_LOCALE` (escrita por el LangSwitcher / middleware)
 *   2. Header `x-egoera-locale` (escrito por middleware tras negociar
 *      Accept-Language).
 *   3. defaultLocale ("es").
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

export async function getCurrentLocale(): Promise<Locale> {
  // 1. Cookie (decisión explícita del usuario)
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(NEXT_LOCALE_COOKIE)?.value;
  if (cookieValue && isLocale(cookieValue)) {
    return cookieValue;
  }

  // 2. Header inyectado por el middleware (negociación Accept-Language)
  const hdrs = await headers();
  const headerValue = hdrs.get(LOCALE_HEADER);
  if (headerValue && isLocale(headerValue)) {
    return headerValue;
  }

  // 3. Fallback duro al locale por defecto
  return defaultLocale;
}
