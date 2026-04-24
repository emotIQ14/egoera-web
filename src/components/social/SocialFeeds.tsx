"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

/**
 * Feeds de Instagram y TikTok de Egoera Psikologia.
 * Instagram: @egoera.psikologia — https://instagram.com/egoera.psikologia
 * TikTok:    @egoera.psikologia — https://tiktok.com/@egoera.psikologia
 * YouTube:   @egoerapsikologia — https://youtube.com/@egoerapsikologia
 *
 * No usamos embeds pesados (InstagramEmbed, TikTokEmbed) a nivel de pagina
 * porque penalizan Core Web Vitals. En su lugar mostramos una cuadricula de
 * previews que enlazan al perfil y cargamos los scripts de terceros unicamente
 * cuando el usuario los necesita.
 */

export const SOCIAL_ACCOUNTS = {
  instagram: "https://instagram.com/egoera.psikologia",
  tiktok: "https://tiktok.com/@egoera.psikologia",
  youtube: "https://youtube.com/@egoerapsikologia",
  twitter: "https://x.com/egoerapsikolog",
} as const;

// Posts destacados que queremos mostrar en el feed.
// Actualiza estas URLs cuando publiques contenido nuevo que quieras resaltar.
interface SocialPost { id: string; caption?: string }

const INSTAGRAM_POSTS: SocialPost[] = [
  // Reemplaza por IDs reales cuando haya posts publicados
  // { id: "ABCDEF123", caption: "Los 4 estilos de apego" },
];

const TIKTOK_POSTS: SocialPost[] = [
  // { id: "7123456789", caption: "Respiracion 4-7-8" },
];

// ─── Instagram ────────────────────────────────────────────────────────────────

export function InstagramFeed({ limit = 6 }: { limit?: number }) {
  const [loaded, setLoaded] = useState(false);
  const posts = INSTAGRAM_POSTS.slice(0, limit);

  useEffect(() => {
    if (posts.length === 0) return;
    // Trigger Instagram's re-process after mount
    const timer = setTimeout(() => {
      // @ts-expect-error Instagram embed API is not typed
      if (window.instgrm?.Embeds?.process) {
        // @ts-expect-error runtime-only
        window.instgrm.Embeds.process();
        setLoaded(true);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [posts]);

  // Sin posts configurados: mostrar CTA al perfil
  if (posts.length === 0) {
    return <SocialProfileCard network="instagram" />;
  }

  return (
    <>
      <Script src="https://www.instagram.com/embed.js" strategy="lazyOnload" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((p) => (
          <blockquote
            key={p.id}
            className="instagram-media"
            data-instgrm-captioned
            data-instgrm-permalink={`https://www.instagram.com/p/${p.id}/`}
            data-instgrm-version="14"
          >
            <a href={`https://www.instagram.com/p/${p.id}/`} />
          </blockquote>
        ))}
      </div>
      {!loaded && (
        <p className="text-xs text-grey-text/60 text-center mt-4">
          Cargando posts de Instagram...
        </p>
      )}
    </>
  );
}

// ─── TikTok ───────────────────────────────────────────────────────────────────

export function TikTokFeed({ limit = 3 }: { limit?: number }) {
  const posts = TIKTOK_POSTS.slice(0, limit);

  if (posts.length === 0) {
    return <SocialProfileCard network="tiktok" />;
  }

  return (
    <>
      <Script src="https://www.tiktok.com/embed.js" strategy="lazyOnload" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((p) => (
          <blockquote
            key={p.id}
            className="tiktok-embed"
            cite={`https://www.tiktok.com/@egoera.psikologia/video/${p.id}`}
            data-video-id={p.id}
            style={{ maxWidth: 605, minWidth: 325 }}
          >
            <section />
          </blockquote>
        ))}
      </div>
    </>
  );
}

// ─── Placeholder cuando aun no hay posts ──────────────────────────────────────

function SocialProfileCard({ network }: { network: "instagram" | "tiktok" }) {
  const config = {
    instagram: {
      label: "Instagram",
      handle: "@egoera.psikologia",
      url: SOCIAL_ACCOUNTS.instagram,
      gradient: "from-pink-500/10 via-amber-500/10 to-teal/10",
      border: "border-pink-300/30",
      color: "text-pink-700",
    },
    tiktok: {
      label: "TikTok",
      handle: "@egoera.psikologia",
      url: SOCIAL_ACCOUNTS.tiktok,
      gradient: "from-teal/10 via-dark-text/5 to-pink-500/10",
      border: "border-dark-text/20",
      color: "text-dark-text",
    },
  }[network];

  return (
    <a
      href={config.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group block rounded-2xl border ${config.border} bg-gradient-to-br ${config.gradient} p-8 text-center transition-all hover:shadow-lg`}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-grey-text">
        {config.label}
      </p>
      <p className={`mt-2 text-2xl font-[family-name:var(--font-heading)] ${config.color}`}>
        {config.handle}
      </p>
      <p className="mt-3 text-sm text-grey-text max-w-xs mx-auto">
        Psicologia accesible en video y carruseles. Siguenos para no perderte nada.
      </p>
      <span className={`mt-4 inline-flex items-center gap-1 text-sm font-medium ${config.color} group-hover:translate-x-0.5 transition-transform`}>
        Ir al perfil →
      </span>
    </a>
  );
}

// ─── Seccion combinada para home/footer ───────────────────────────────────────

export function SocialHub() {
  return (
    <section className="px-4 sm:px-8 lg:px-12 py-20 watercolor-section">
      <ScrollReveal>
        <div className="text-center mb-12">
          <span className="text-teal text-sm font-semibold uppercase tracking-widest">
            Siguenos
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold font-[family-name:var(--font-heading)] text-dark-text mt-3">
            Egoera en redes
          </h2>
          <p className="text-grey-text mt-4 max-w-2xl mx-auto">
            Contenido visual en Instagram y TikTok. Videos largos en YouTube.
            Reflexiones breves en X.
          </p>
        </div>
      </ScrollReveal>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        <ScrollReveal>
          <SocialProfileCard network="instagram" />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <SocialProfileCard network="tiktok" />
        </ScrollReveal>
      </div>
    </section>
  );
}
