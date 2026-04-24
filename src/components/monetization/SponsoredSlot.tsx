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
 * Espacio para colaboraciones patrocinadas.
 * Requiere `SPONSORED_ENABLED=true` en entorno; si no, no renderiza nada.
 * Siempre queda etiquetado como "Colaboracion" para cumplir con buenas
 * practicas de transparencia publicitaria.
 */
export function SponsoredSlot({ content, source = "article" }: Props) {
  if (!MONETIZATION_CONFIG.sponsored.enabled || !content) return null;

  return (
    <aside className="my-10 overflow-hidden rounded-2xl border border-border bg-white">
      <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-1.5">
        <span className="text-[10px] font-medium uppercase tracking-wider text-grey-text">
          Colaboracion
        </span>
        <span className="text-[10px] text-grey-text/70">con {content.brand}</span>
      </div>
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
        {content.logo && (
          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
            <Image
              src={content.logo}
              alt={content.brand}
              fill
              sizes="64px"
              className="object-contain"
              unoptimized
            />
          </div>
        )}
        <div className="flex-1">
          <h4 className="font-[family-name:var(--font-heading)] text-base font-semibold text-dark-text">
            {content.headline}
          </h4>
          <p className="mt-1 text-sm text-grey-text">{content.description}</p>
        </div>
        <a
          href={content.url}
          target="_blank"
          rel="noopener sponsored"
          onClick={() =>
            track("sponsored_click", { brand: content.brand, source })
          }
          className="inline-flex items-center gap-1 rounded-full bg-teal px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal/90"
        >
          {content.ctaLabel} <span aria-hidden>→</span>
        </a>
      </div>
    </aside>
  );
}
