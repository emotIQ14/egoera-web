"use client";

import { useMemo } from "react";
import { useDiaryStore, FEELINGS, getFeeling } from "@/lib/diary-store";
import { WeeklyChart } from "@/components/diary/cobalt/WeeklyChart";

export default function SemanalPage() {
  const { hydrated, entries, settings } = useDiaryStore();

  const weeklyStats = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 6);
    const recent = entries.filter((e) => new Date(e.date) >= weekAgo);
    const byFeel = new Map<string, number>();
    for (const e of recent) byFeel.set(e.feelingId, (byFeel.get(e.feelingId) ?? 0) + 1);
    const dominant = [...byFeel.entries()].sort((a, b) => b[1] - a[1])[0];
    const avgIntensity =
      recent.length > 0 ? recent.reduce((s, e) => s + e.intensity, 0) / recent.length : 0;
    const target = settings.checkInsPerDay * 7;
    return {
      total: recent.length,
      target,
      dominant: dominant ? getFeeling(dominant[0] as never) : null,
      dominantCount: dominant?.[1] ?? 0,
      avgIntensity,
    };
  }, [entries, settings.checkInsPerDay]);

  if (!hydrated) return <p className="serif" style={{ padding: 30 }}>Cargando…</p>;

  // Generate insight text
  let insight = "Necesitas más entradas para detectar patrones.";
  if (weeklyStats.total >= 3 && weeklyStats.dominant) {
    const f = weeklyStats.dominant;
    const pct = Math.round((weeklyStats.dominantCount / weeklyStats.total) * 100);
    insight = `${pct}% de tus check-ins de la semana han sido sobre ${f.name}. ${weeklyStats.avgIntensity > 7 ? "Has estado intensx." : weeklyStats.avgIntensity < 4 ? "Esta semana has bajado el volumen." : "Has estado en intensidad media."}`;
  }

  return (
    <>
      <header className="diario-greet">
        <div className="diario-eyebrow">Revisión semanal</div>
        <h1 className="diario-h2">
          Tu <em>semana</em>,<br/>despacio.
        </h1>
        <p className="serif" style={{ fontSize: 14, lineHeight: 1.5, marginTop: 6 }}>
          {weeklyStats.total} {weeklyStats.total === 1 ? "registro" : "registros"} de los últimos 7 días.
          Sin juicio. Solo lo que pasó.
        </p>
      </header>

      <div className="d-card">
        <div className="d-card-eyebrow">Mood semanal</div>
        <h2 className="d-card-title">
          Lo que ha <em>pesado</em>.
        </h2>
        <WeeklyChart entries={entries} days={7} />
        <p className="serif" style={{ fontSize: 14, lineHeight: 1.5, margin: 0 }}>
          {insight}
        </p>
      </div>

      <div className="d-card invert">
        <div className="d-card-eyebrow">Distribución</div>
        <h2 className="d-card-title">
          Tus <em>sentimientos</em>.
        </h2>
        <div style={{ marginTop: 12 }}>
          {FEELINGS.map((f) => {
            const count = entries
              .filter((e) => {
                const d = new Date(e.date);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 6);
                return e.feelingId === f.id && d >= weekAgo;
              }).length;
            const pct = weeklyStats.total > 0 ? (count / weeklyStats.total) * 100 : 0;
            if (count === 0) return null;
            return (
              <div key={f.id} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                  <span style={{ fontFamily: "var(--font-display), Caveat", fontSize: 22 }}>
                    <em>{f.name}</em>.
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, opacity: 0.8, alignSelf: "end" }}>
                    {count} · {Math.round(pct)}%
                  </span>
                </div>
                <div style={{ height: 4, background: "rgba(241,234,216,0.2)", borderRadius: 999, overflow: "hidden" }}>
                  <div style={{ height: "100%", background: "var(--cream)", width: `${pct}%`, borderRadius: 999, transition: "width .4s" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="d-card">
        <div className="d-card-eyebrow">Intención · próxima semana</div>
        <h2 className="d-card-title">
          ¿Qué te <em>llevas</em>?
        </h2>
        <p className="serif" style={{ fontSize: 14, lineHeight: 1.6, margin: "6px 0 14px" }}>
          Una pregunta, una práctica, una persona a la que escribir. Lo que sea que cierre la semana.
        </p>
        <textarea
          className="d-textarea"
          placeholder="Esta semana me llevo…"
          rows={4}
          defaultValue=""
        />
        <p className="diario-greet-meta" style={{ marginTop: 8 }}>
          (Esta nota es solo para ti.)
        </p>
      </div>
    </>
  );
}
