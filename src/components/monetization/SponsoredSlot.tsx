"use client";

import Image from "next/image";
import { MONETIZATION_CONFIG } from "@/lib/monetization-config";
import { track } from "@/lib/analytics";

export interface SponsoredContent {
  brand: string;
  headline: string;
  description: string;
  ctaLabel: string;
  url: string;
  logo?: string;
}

interface Props {
  content?: SponsoredContent;
  source?: string;
}

/**
 * Espacio para colaboraciones patrocinadas. Fondo oscuro editorial.
 */
export function SponsoredSlot({ content, source = "article" }: Props) {
  if (!MONETIZATION_CONFIG.sponsored.enabled || !content) return null;

  return (
    <aside
      className="my-10 overflow-hidden rounded-sm border"
      style={{
        borderColor: "var(--rule)",
        background: "var(--bg-2)",
      }}
    >
      <div
        className="flex items-center justify-between border-b px-5 py-2"
        style={{ borderColor: "var(--rule)" }}
      >
        <span
          className="text-[10px] uppercase tracking-[0.22em]"
          style={{
            color: "var(--ink-faint)",
            fontFamily: "var(--font-mono)",
          }}
        >
          Colaboracion
        </span>
        <span
          className="text-[10px]"
          style={{
            color: "var(--ink-faint)",
            fontFamily: "var(--font-mono)",
          }}
        >
          con {content.brand}
        </span>
      </div>
      <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
        {content.logo && (
          <div
            className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-sm"
            style={{
              background: "rgba(168,194,182,0.08)",
              border: "1px solid var(--rule)",
            }}
          >
            <Image
              src={content.logo}
              alt={content.brand}
              fill
              sizes="64px"
              className="object-contain p-2"
              unoptimized
            />
          </div>
        )}
        <div className="flex-1">
          <h4
            className="tracking-[-0.01em]"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 20,
              fontWeight: 400,
              color: "var(--ink)",
            }}
          >
            {content.headline}
          </h4>
          <p
            className="mt-1.5 leading-[1.55]"
            style={{
              color: "var(--ink-dim)",
              fontSize: 14,
              fontFamily: "var(--font-sans)",
            }}
          >
            {content.description}
          </p>
        </div>
        <a
          href={content.url}
          target="_blank"
          rel="noopener sponsored"
          onClick={() =>
            track("sponsored_click", { brand: content.brand, source })
          }
          className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-[13px] font-medium"
          style={{
            background: "var(--ink)",
            color: "var(--bg)",
            fontFamily: "var(--font-sans)",
          }}
        >
          {content.ctaLabel} <span>→</span>
        </a>
      </div>
    </aside>
  );
}
