/**
 * robots.txt — política de rastreo de egoera.es.
 *
 *  - Permitir rastreo general (incluye los prefijos de locale `/es/`,
 *    `/eu/`, `/en/` que el sitemap emite para indexación separada).
 *  - Bloquear endpoints internos (/api/) y zonas privadas del Diario
 *    emocional (datos de usuario, sin valor SEO). Bloqueamos también
 *    las variantes con prefijo de locale para evitar que el crawler
 *    descubra contenido privado por `/eu/diario/check-in`, etc.
 *  - Bloquear /wp-admin/ por higiene aunque WordPress lo declare aparte.
 *  - Apuntar a los dos sitemaps disponibles: el dinámico generado por
 *    Next y el de WordPress (que cubre páginas/posts del backend).
 *  - Declarar host canónico para evitar duplicados http/https/www.
 */

import type { MetadataRoute } from "next";

const SITE_URL = "https://egoera.es";

/** Sub-rutas privadas del Diario, siempre disallow. */
const PRIVATE_DIARY_PATHS = [
  "/diario/check-in",
  "/diario/historial",
  "/diario/ajustes",
];

/** Genera la lista completa de disallow incluyendo los 3 prefijos de locale. */
function diaryDisallowList(): string[] {
  const localePrefixes = ["", "/es", "/eu", "/en"];
  const out: string[] = [];
  for (const prefix of localePrefixes) {
    for (const p of PRIVATE_DIARY_PATHS) {
      out.push(`${prefix}${p}`);
    }
  }
  return out;
}

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          ...diaryDisallowList(),
          "/wp-admin/",
        ],
      },
    ],
    sitemap: [
      `${SITE_URL}/sitemap.xml`,
      `${SITE_URL}/wp-sitemap.xml`,
    ],
    host: SITE_URL,
  };
}
