/**
 * middleware.ts (raíz del proyecto)
 * --------------------------------------------------------------------------
 * Middleware de detección de locale para egoera.es.
 *
 * Estrategia (cookie-based, sin cambio de URL):
 *   1. Si la request trae cookie `NEXT_LOCALE` válida → la respeta.
 *      Inyecta header `x-egoera-locale` para que el server pueda leerlo.
 *   2. Si no, negocia con `Accept-Language`:
 *        - busca el primer match contra `locales` ("es" | "eu" | "en")
 *        - usa `defaultLocale` si nada coincide.
 *      El locale negociado se inyecta como header (no se persiste cookie
 *      sin acción explícita del usuario, para no contaminar caches CDN).
 *
 * IMPORTANTE: este middleware NO redirige ni reescribe rutas. Sólo expone
 * el locale negociado al server vía header. Si en el futuro se promociona
 * el sitio a sub-path routing (`/es/...`, `/eu/...`, `/en/...`), aquí es
 * donde irían los `NextResponse.rewrite()` correspondientes.
 *
 * Excluimos rutas técnicas (api, _next, archivos estáticos) del matcher.
 * --------------------------------------------------------------------------
 */

import { NextResponse, type NextRequest } from "next/server";

import {
  defaultLocale,
  isLocale,
  locales,
  NEXT_LOCALE_COOKIE,
  type Locale,
} from "@/i18n/locales";

const LOCALE_HEADER = "x-egoera-locale";

/**
 * Parser ligero de Accept-Language. Devuelve el primer locale soportado o
 * `defaultLocale`. No usamos @formatjs/intl-localematcher para evitar
 * añadir dependencias en este scaffold.
 */
function negotiateFromAcceptLanguage(header: string | null): Locale {
  if (!header) return defaultLocale;

  // Lista ordenada por q-value descendente.
  const candidates = header
    .split(",")
    .map((part) => {
      const [tagRaw, qRaw] = part.trim().split(";");
      const tag = (tagRaw || "").toLowerCase();
      const q = qRaw && qRaw.startsWith("q=") ? Number(qRaw.slice(2)) : 1;
      return { tag, q: Number.isFinite(q) ? q : 1 };
    })
    .filter((c) => c.tag.length > 0)
    .sort((a, b) => b.q - a.q);

  for (const { tag } of candidates) {
    // Matches exactos: "es", "eu", "en"
    if ((locales as readonly string[]).includes(tag)) {
      return tag as Locale;
    }
    // Matches por prefijo: "es-ES" → "es", "en-US" → "en", "eu-ES" → "eu"
    const prefix = tag.split("-")[0];
    if ((locales as readonly string[]).includes(prefix)) {
      return prefix as Locale;
    }
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const cookieValue = request.cookies.get(NEXT_LOCALE_COOKIE)?.value;

  let locale: Locale;
  if (cookieValue && isLocale(cookieValue)) {
    locale = cookieValue;
  } else {
    locale = negotiateFromAcceptLanguage(request.headers.get("accept-language"));
  }

  // Reescribimos los headers de la request entrante con el locale negociado
  // para que `headers()` lo vea desde Server Components.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LOCALE_HEADER, locale);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // Vary por Accept-Language y Cookie para que la CDN no sirva el mismo
  // HTML a usuarios con preferencias distintas.
  response.headers.set("Vary", "Accept-Language, Cookie");

  return response;
}

/**
 * Matcher: aplica a todo excepto rutas internas y assets.
 * - api/* y trpc/* tienen su propio manejo de locale si lo necesitan.
 * - _next/* (estáticos, imágenes, datos de Next).
 * - Archivos con extensión (.png, .ico, .xml, .txt, .webp, etc.).
 */
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|_next/data|favicon.ico|robots.txt|sitemap.xml|manifest.json|icons|images|fonts|.*\\..*).*)",
  ],
};
