"use client";

import { Sparkles, Lock } from "lucide-react";
import { MONETIZATION_CONFIG } from "@/lib/monetization-config";
import { track } from "@/lib/analytics";

interface Props {
  /** Titulo de la version ampliada (opcional). */
  title?: string;
  /** Descripcion corta del valor extra. */
  description?: string;
  source?: string;
}

/**
 * CTA suave hacia Patreon. Muestra que existe version ampliada/exclusiva
 * para suscriptores, sin bloquear el contenido gratuito.
 */
export function PremiumCTA({
  title = "Version ampliada para suscriptores",
  description = "Ejercicios guiados, material descargable y sesiones en audio, directamente desde Patreon.",
  source = "article",
}: Props) {
  return (
    <div className="relative my-10 overflow-hidden rounded-2xl border border-teal/20 p-6 sm:p-8">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-br from-teal/10 via-mint/10 to-sage/10"
      />
      <div
        aria-hidden
        className="absolute -top-12 -right-12 -z-10 h-48 w-48 rounded-full bg-teal/15 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-16 -left-10 -z-10 h-56 w-56 rounded-full bg-sage/15 blur-3xl"
      />

      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-white/70 backdrop-blur">
          <Sparkles className="h-5 w-5 text-teal" />
        </div>
        <div className="flex-1">
          <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-white/60 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-teal backdrop-blur">
            <Lock className="h-3 w-3" /> Suscriptores
          </div>
          <h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-dark-text sm:text-xl">
            {title}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-grey-text">
            {description}
          </p>
          <a
            href={MONETIZATION_CONFIG.patreon.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("patreon_click", { source })}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-teal px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal/90"
          >
            Descubrir en Patreon
            <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </div>
  );
}
