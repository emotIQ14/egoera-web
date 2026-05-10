/**
 * robots.txt — política de rastreo de egoera.es.
 *
 *  - Permitir rastreo general.
 *  - Bloquear endpoints internos (/api/) y zonas privadas del Diario
 *    emocional (datos de usuario, sin valor SEO).
 *  - Bloquear /wp-admin/ por higiene aunque WordPress lo declare aparte.
 *  - Apuntar a los dos sitemaps disponibles: el dinámico generado por
 *    Next y el de WordPress (que cubre páginas/posts del backend).
 *  - Declarar host canónico para evitar duplicados http/https/www.
 */

import type { MetadataRoute } from "next";

const SITE_URL = "https://egoera.es";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/diario/check-in",
          "/diario/historial",
          "/diario/ajustes",
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
