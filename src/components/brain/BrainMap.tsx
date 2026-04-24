"use client";

import Link from "next/link";
import { useState } from "react";
import { BRAIN_REGIONS } from "@/lib/egoera-data";

/**
 * Mapa emocional del cerebro — version editorial (2D con hotspots sobre
 * silueta SVG). No usa Three.js: es ligero, accesible, funciona sin JS
 * si se quita el hover.
 */
export function BrainMap() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const hovered = BRAIN_REGIONS.find((r) => r.id === hoveredId);

  return (
    <div className="relative mx-auto grid w-full max-w-[1200px] items-center gap-12 lg:grid-cols-[1.3fr_1fr]">
      {/* Stage */}
      <div
        className="relative aspect-[4/3] w-full overflow-hidden rounded-sm border"
        style={{
          borderColor: "var(--rule)",
          background:
            "radial-gradient(ellipse at 35% 45%, rgba(168,194,182,0.08), transparent 60%), var(--bg-2)",
        }}
      >
        {/* Brain silhouette (stylized) */}
        <svg
          viewBox="0 0 400 300"
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 h-full w-full"
          aria-hidden
        >
          <defs>
            <radialGradient id="brain-fill" cx="50%" cy="45%" r="55%">
              <stop offset="0%" stopColor="rgba(168,194,182,0.18)" />
              <stop offset="100%" stopColor="rgba(168,194,182,0.02)" />
            </radialGradient>
            <filter id="brain-blur">
              <feGaussianBlur stdDeviation="2" />
            </filter>
          </defs>
          <path
            d="M 90 140 C 60 110, 70 60, 140 55 C 170 30, 230 30, 260 55 C 330 60, 340 110, 310 140 C 340 160, 330 210, 270 230 C 240 260, 180 265, 150 240 C 90 235, 60 190, 90 140 Z"
            fill="url(#brain-fill)"
            stroke="rgba(168,194,182,0.3)"
            strokeWidth="1"
            filter="url(#brain-blur)"
          />
          {/* Central fissure */}
          <path
            d="M 200 50 Q 195 140 200 240"
            stroke="rgba(168,194,182,0.2)"
            strokeWidth="1"
            fill="none"
            strokeDasharray="2 4"
          />
        </svg>

        {/* Hotspots */}
        {BRAIN_REGIONS.map((r) => {
          const active = hoveredId === r.id;
          return (
            <Link
              key={r.id}
              href={`/categoria/${r.id}`}
              className="brain-region group absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${r.x}%`,
                top: `${r.y}%`,
              }}
              onMouseEnter={() => setHoveredId(r.id)}
              onMouseLeave={() => setHoveredId(null)}
              onFocus={() => setHoveredId(r.id)}
              onBlur={() => setHoveredId(null)}
              aria-label={`${r.name} — ${r.cat}`}
            >
              <span
                className="absolute inset-0 -z-10 rounded-full"
                style={{
                  width: active ? 48 : 36,
                  height: active ? 48 : 36,
                  background: `radial-gradient(circle, ${r.color}66, transparent 70%)`,
                  transform: "translate(-50%, -50%)",
                  left: "50%",
                  top: "50%",
                  transition: "width 0.2s, height 0.2s",
                }}
              />
              <span
                className="block rounded-full border-2"
                style={{
                  width: active ? 16 : 12,
                  height: active ? 16 : 12,
                  background: r.color,
                  borderColor: "var(--bg)",
                  boxShadow: active
                    ? `0 0 20px ${r.color}`
                    : `0 0 8px ${r.color}88`,
                  transition: "all 0.2s",
                }}
              />
            </Link>
          );
        })}

        {/* Floating tooltip */}
        {hovered && (
          <div
            className="pointer-events-none absolute z-10 w-[260px] -translate-x-1/2 -translate-y-[120%] rounded-sm border p-4"
            style={{
              left: `${hovered.x}%`,
              top: `${hovered.y}%`,
              background: "rgba(11,14,13,0.96)",
              borderColor: hovered.color,
              backdropFilter: "blur(10px)",
            }}
          >
            <div
              className="mb-1 text-[10px] uppercase tracking-[0.22em]"
              style={{
                color: hovered.color,
                fontFamily: "var(--font-mono)",
              }}
            >
              {hovered.cat}
            </div>
            <div
              className="mb-1.5 text-[20px] leading-tight"
              style={{
                fontFamily: "var(--font-serif)",
                color: "var(--ink)",
              }}
            >
              {hovered.name}
            </div>
            <div
              className="mb-2 text-[13px] leading-[1.45]"
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                color: "var(--ink-dim)",
              }}
            >
              {hovered.desc}
            </div>
            <div
              className="text-[11px] tracking-[0.12em]"
              style={{
                fontFamily: "var(--font-mono)",
                color: hovered.color,
              }}
            >
              Ver articulos →
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div>
        <div
          className="mb-5 text-[11px] uppercase tracking-[0.22em]"
          style={{
            color: "var(--accent)",
            fontFamily: "var(--font-mono)",
          }}
        >
          Regiones
        </div>
        <ul className="space-y-px">
          {BRAIN_REGIONS.map((r) => {
            const active = hoveredId === r.id;
            return (
              <li key={r.id}>
                <Link
                  href={`/categoria/${r.id}`}
                  onMouseEnter={() => setHoveredId(r.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="flex items-center gap-4 border-l-2 px-4 py-3 transition-all"
                  style={{
                    borderLeftColor: active ? r.color : "transparent",
                    background: active
                      ? "rgba(168,194,182,0.04)"
                      : "transparent",
                  }}
                >
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{
                      background: r.color,
                      boxShadow: `0 0 10px ${r.color}88`,
                    }}
                  />
                  <span
                    className="flex-1 text-[17px]"
                    style={{
                      fontFamily: "var(--font-serif)",
                      color: active ? "var(--ink)" : "var(--ink-dim)",
                    }}
                  >
                    {r.name}
                  </span>
                  <span
                    className="text-[11px] uppercase tracking-[0.18em]"
                    style={{
                      fontFamily: "var(--font-mono)",
                      color: "var(--ink-faint)",
                    }}
                  >
                    {r.cat}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
