"use client";

import { useMemo, type ReactElement } from "react";
import { type DiaryEntry, FEELINGS } from "@/lib/diary-store";

interface WeeklyChartProps {
  entries: DiaryEntry[];
  /** Number of days to look back (default 7) */
  days?: number;
}

/**
 * Stacked area mood evolution chart, hand-drawn style with Caveat day labels.
 * Each day shows average intensity per feeling (group of 8 stacked bars).
 */
export function WeeklyChart({ entries, days = 7 }: WeeklyChartProps) {
  const data = useMemo(() => {
    const today = new Date();
    const arr: { iso: string; label: string; entries: DiaryEntry[] }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const iso = d.toISOString().slice(0, 10);
      const dayEntries = entries.filter((e) => e.date.startsWith(iso));
      arr.push({
        iso,
        label: d.toLocaleDateString("es-ES", { weekday: "short" }).slice(0, 1).toUpperCase(),
        entries: dayEntries,
      });
    }
    return arr;
  }, [entries, days]);

  return (
    <div className="weekly-chart" aria-label={`Mood ultimos ${days} dias`}>
      <svg width="100%" height="100%" viewBox="0 0 280 132" preserveAspectRatio="none">
        {/* Baseline */}
        <line x1="0" y1="120" x2="280" y2="120" stroke="rgba(29,43,219,0.25)" strokeDasharray="2 4" />
        {data.map((day, i) => {
          const x = (i + 0.5) * (280 / data.length);
          const w = 280 / data.length - 6;
          // Group entries by feeling, get max intensity
          const byFeel = new Map<string, number>();
          for (const e of day.entries) {
            byFeel.set(e.feelingId, Math.max(byFeel.get(e.feelingId) ?? 0, e.intensity));
          }
          let yCursor = 120;
          const segments: ReactElement[] = [];
          let segIdx = 0;
          for (const f of FEELINGS) {
            const intensity = byFeel.get(f.id);
            if (!intensity) continue;
            const h = (intensity / 10) * 14;
            segments.push(
              <rect
                key={f.id}
                x={x - w / 2}
                y={yCursor - h}
                width={w}
                height={h}
                fill={f.color}
                opacity={0.85}
                rx={2}
              />
            );
            yCursor -= h + 1;
            segIdx++;
          }
          if (segments.length === 0) {
            segments.push(
              <circle key="empty" cx={x} cy={120} r={2} fill="rgba(29,43,219,0.3)" />
            );
          }
          return (
            <g key={day.iso}>
              {segments}
              <text
                x={x}
                y={130}
                textAnchor="middle"
                fontFamily="var(--font-mono), monospace"
                fontSize="9"
                fill="rgba(29,43,219,0.6)"
                letterSpacing="1.5"
              >
                {day.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
