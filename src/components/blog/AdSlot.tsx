"use client";

import Script from "next/script";
import { Coffee } from "lucide-react";
import { useEffect } from "react";
import { MONETIZATION_CONFIG } from "@/lib/monetization-config";
import { track } from "@/lib/analytics";

export type AdDisplay = "banner" | "sidebar" | "in-article" | "native";
export type AdFormat =
  | "auto"
  | "horizontal"
  | "vertical"
  | "rectangle"
  | "fluid";

interface AdSlotProps {
  slot: string;
  format?: AdFormat;
  display?: AdDisplay;
  className?: string;
}

/**
 * AdSense compatible (dark editorial restyle).
 * Si NEXT_PUBLIC_ADSENSE_CLIENT no esta configurado, cae en un placeholder
 * elegante que lleva a Buy Me a Coffee.
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
      <div className={`my-10 ${layoutClass} ${className}`}>
        <a
          href={buyMeCoffee.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            track("buy_me_coffee_click", { source: `adslot:${display}` })
          }
          className="group flex items-center gap-4 rounded-sm border p-5 transition-colors"
          style={{
            borderColor: "rgba(243,146,55,0.2)",
            background:
              "linear-gradient(90deg, rgba(243,146,55,0.04), rgba(247,201,74,0.02))",
          }}
        >
          <Coffee
            className="h-7 w-7 flex-shrink-0"
            style={{ color: "var(--gb-orange)" }}
          />
          <div className="flex-1">
            <p
              className="text-[14px] font-medium"
              style={{
                color: "var(--ink)",
                fontFamily: "var(--font-sans)",
              }}
            >
              Egoera sin publicidad invasiva
            </p>
            <p
              className="mt-0.5 text-[12px]"
              style={{
                color: "var(--ink-dim)",
                fontFamily: "var(--font-sans)",
              }}
            >
              Si te gusta el contenido, invitame a un cafe y sigue siendo
              gratuito.
            </p>
          </div>
          <span
            className="text-[12px] font-medium transition-transform group-hover:translate-x-0.5"
            style={{ color: "var(--gb-orange)" }}
          >
            Apoyar →
          </span>
        </a>
      </div>
    );
  }

  return (
    <div className={`ad-slot my-10 ${layoutClass} ${className}`}>
      <p
        className="mb-2 text-center text-[10px] uppercase tracking-[0.22em]"
        style={{
          color: "var(--ink-faint)",
          fontFamily: "var(--font-mono)",
        }}
      >
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
