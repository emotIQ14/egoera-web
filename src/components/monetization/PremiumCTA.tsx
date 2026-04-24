"use client";

import { Sparkles, Lock } from "lucide-react";
import { MONETIZATION_CONFIG } from "@/lib/monetization-config";
import { track } from "@/lib/analytics";

interface Props {
  title?: string;
  description?: string;
  source?: string;
}

/**
 * CTA suave hacia Patreon, restilizada para fondo oscuro editorial.
 */
export function PremiumCTA({
  title = "Version ampliada para suscriptores",
  description = "Ejercicios guiados, material descargable y sesiones en audio, directamente desde Patreon.",
  source = "article",
}: Props) {
  return (
    <div
      className="relative my-12 overflow-hidden rounded-sm border p-8 md:p-10"
      style={{
        borderColor: "var(--rule)",
        background:
          "linear-gradient(135deg, rgba(168,194,182,0.06), rgba(168,194,182,0.02))",
      }}
    >
      <div
        aria-hidden
        className="absolute -top-16 -right-16 h-56 w-56 rounded-full blur-3xl"
        style={{ background: "rgba(168,194,182,0.12)" }}
      />
      <div
        aria-hidden
        className="absolute -bottom-20 -left-12 h-60 w-60 rounded-full blur-3xl"
        style={{ background: "rgba(59,111,212,0.08)" }}
      />

      <div className="flex items-start gap-5">
        <div
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border"
          style={{
            borderColor: "var(--rule)",
            background: "rgba(168,194,182,0.1)",
          }}
        >
          <Sparkles className="h-5 w-5" style={{ color: "var(--accent)" }} />
        </div>
        <div className="flex-1">
          <div
            className="mb-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.22em]"
            style={{
              borderColor: "var(--rule)",
              color: "var(--accent)",
              fontFamily: "var(--font-mono)",
            }}
          >
            <Lock className="h-3 w-3" /> Suscriptores
          </div>
          <h3
            className="tracking-[-0.015em]"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 24,
              fontWeight: 400,
              color: "var(--ink)",
            }}
          >
            {title}
          </h3>
          <p
            className="mt-2 leading-[1.6]"
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: 16,
              color: "var(--ink-dim)",
            }}
          >
            {description}
          </p>
          <a
            href={MONETIZATION_CONFIG.patreon.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("patreon_click", { source })}
            className="mt-5 inline-flex items-center gap-2 rounded-full px-6 py-3 text-[13px] font-medium"
            style={{
              background: "var(--ink)",
              color: "var(--bg)",
              fontFamily: "var(--font-sans)",
            }}
          >
            Descubrir en Patreon <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </div>
  );
}
