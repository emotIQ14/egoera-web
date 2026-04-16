"use client";

import { useMemo } from "react";

interface Splash {
  id: number;
  cx: string;
  cy: string;
  size: number;
  color: string;
  pulseDelay: number;
  pulseDuration: number;
  driftX: number;
  driftY: number;
  driftDuration: number;
}

const COLORS = [
  "rgba(107,163,190,0.12)", // teal
  "rgba(127,181,160,0.12)", // sage
  "rgba(168,213,200,0.12)", // mint
  "rgba(184,169,201,0.12)", // lavender
  "rgba(232,168,124,0.12)", // peach
];

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

export function PaintSplashes() {
  const splashes = useMemo<Splash[]>(() => {
    const count = 18;
    return Array.from({ length: count }, (_, i) => {
      const r = seededRandom;
      return {
        id: i,
        cx: `${r(i * 7 + 1) * 100}%`,
        cy: `${r(i * 13 + 3) * 100}%`,
        size: 60 + r(i * 17 + 5) * 250,
        color: COLORS[Math.floor(r(i * 23 + 7) * COLORS.length)],
        pulseDelay: r(i * 29 + 11) * 8,
        pulseDuration: 6 + r(i * 31 + 13) * 8,
        driftX: (r(i * 37 + 17) - 0.5) * 40,
        driftY: (r(i * 41 + 19) - 0.5) * 30,
        driftDuration: 18 + r(i * 43 + 23) * 20,
      };
    });
  }, []);

  return (
    <div
      className="paint-splashes-container"
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <svg
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="paint-splash-filter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015"
              numOctaves="4"
              seed="42"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="25"
              xChannelSelector="R"
              yChannelSelector="G"
            />
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>

        {splashes.map((s) => (
          <circle
            key={s.id}
            cx={s.cx}
            cy={s.cy}
            r={s.size / 2}
            fill={s.color}
            filter="url(#paint-splash-filter)"
            style={{
              animation: `
                paint-splash-pulse ${s.pulseDuration}s ease-in-out ${s.pulseDelay}s infinite,
                paint-splash-drift ${s.driftDuration}s ease-in-out ${s.pulseDelay * 0.5}s infinite alternate
              `,
              transformOrigin: `${s.cx} ${s.cy}`,
              ["--drift-x" as string]: `${s.driftX}px`,
              ["--drift-y" as string]: `${s.driftY}px`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}
