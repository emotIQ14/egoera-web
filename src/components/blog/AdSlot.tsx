"use client";

import Script from "next/script";
import { Coffee } from "lucide-react";
import { useEffect } from "react";
import { MONETIZATION_CONFIG } from "@/lib/monetization-config";
import { track } from "@/lib/analytics";

export type AdDisplay = "banner" | "sidebar" | "in-article" | "native";
export type AdFormat = "auto" | "horizontal" | "vertical" | "rectangle" | "fluid";

interface AdSlotProps {
  /** Slot ID de AdSense (numerico, entregado por Google). */
  slot: string;
  /** Formato del bloque. */
  format?: AdFormat;
  /** Tipo de ubicacion para estilo y layout. */
  display?: AdDisplay;
  className?: string;
}

/**
 * Slot compatible con Google AdSense.
 * - Cuando NEXT_PUBLIC_ADSENSE_CLIENT esta configurado, renderiza el anuncio real.
 * - Cuando no lo esta, muestra un placeholder discreto que promociona Buy Me a Coffee.
 */
export function AdSlot({
  slot,
  format = "auto",
  display = "in-article",
  className = "",
}: AdSlotProps) {
  const { adsense, buyMeCoffee } = MONETIZATION_CONFIG;

  useEffect(() => {
    if (!adsense.enabled) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).adsbygoogle.push({});
      track("ad_impression", { slot, display });
    } catch {
      // ignore
    }
  }, [adsense.enabled, slot, display]);

  const layoutClass =
    display === "sidebar"
      ? "max-w-xs"
      : display === "banner"
        ? "w-full"
        : display === "native"
          ? "max-w-2xl mx-auto"
          : "max-w-3xl mx-auto";

  if (!adsense.enabled) {
    return (
      <div className={`my-8 ${layoutClass} ${className}`}>
        <a
          href={buyMeCoffee.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("buy_me_coffee_click", { source: `adslot:${display}` })}
          className="group flex items-center gap-4 rounded-xl border border-amber-200/40 bg-gradient-to-r from-amber-50/70 to-orange-50/70 p-5 transition-all hover:border-amber-300 hover:shadow-md"
        >
          <Coffee className="h-7 w-7 flex-shrink-0 text-amber-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-dark-text">
              Egoera sin publicidad invasiva
            </p>
            <p className="text-xs text-grey-text">
              Si te gusta el contenido, invitanos a un cafe y sigue siendo gratuito.
            </p>
          </div>
          <span className="text-xs font-medium text-amber-600 group-hover:translate-x-0.5 transition-transform">
            Apoyar →
          </span>
        </a>
      </div>
    );
  }

  return (
    <div className={`ad-slot my-8 ${layoutClass} ${className}`}>
      <p className="mb-1 text-center text-[10px] uppercase tracking-wider text-grey-text/70">
        Publicidad
      </p>
      <Script
        id={`adsense-${slot}`}
        strategy="afterInteractive"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsense.clientId}`}
        crossOrigin="anonymous"
      />
      <ins
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={adsense.clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
