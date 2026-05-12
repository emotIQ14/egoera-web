import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "egoera.es",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "images-na.ssl-images-amazon.com",
        pathname: "/images/P/**",
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
        pathname: "/images/**",
      },
    ],
  },

  async redirects() {
    // URLs heredadas de WordPress que deben caer en las nuevas rutas Next.js
    // para no perder enlaces externos ni señales SEO.
    //
    // Bloque 1: páginas WordPress sustituidas en Next.js
    // Bloque 2: artículos automatizados/duplicados del cuaderno que se
    //   redirigen a su versión semántica canónica o a la categoría
    //   correspondiente (decisión informada por auditoría del agente
    //   ContentMigration · ver memoria).
    return [
      // Bloque 0 — rutas eliminadas
      // /servicios: Egoera ya no ofrece consulta privada. La página
      // de "terapia individual / pareja / bono" queda redirigida a
      // la home, donde el visitante descubre las herramientas reales
      // (cuaderno, brújula, diario, boletín, manifiesto).
      { source: "/servicios", destination: "/", permanent: true },
      { source: "/servicios/", destination: "/", permanent: true },
      // Bloque 1 — páginas
      {
        source: "/ander-bilbao",
        destination: "/sobre-nosotros",
        permanent: true,
      },
      {
        source: "/ander-bilbao/",
        destination: "/sobre-nosotros",
        permanent: true,
      },
      // Bloque 2 — artículos viejos / duplicados
      {
        source: "/critico-interno-2026-w18",
        destination: "/categoria/autoconocimiento",
        permanent: true,
      },
      {
        source: "/critico-interno-2026-w19",
        destination: "/categoria/autoconocimiento",
        permanent: true,
      },
      {
        source: "/comunicacion-no-violenta-2026-w19",
        destination: "/blog/comunicacion-no-violenta-4-pasos",
        permanent: true,
      },
      {
        source: "/insomnio-ansiedad-2026-w18",
        destination: "/blog/insomnio-ansiedad-no-puedo-dormir",
        permanent: true,
      },
      {
        source: "/insomnio-ansiedad-2026-w19",
        destination: "/blog/insomnio-ansiedad-no-puedo-dormir",
        permanent: true,
      },
      {
        source: "/falsa-victima-2026-w18",
        destination: "/categoria/relaciones-apego",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
