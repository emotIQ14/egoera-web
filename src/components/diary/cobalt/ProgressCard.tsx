"use client";

interface ProgressCardProps {
  streak: number;
  habitsDone: number;
  habitsTotal: number;
  weeklyDone: number;
  weeklyTotal: number;
}

export function ProgressCard({
  streak,
  habitsDone,
  habitsTotal,
  weeklyDone,
  weeklyTotal,
}: ProgressCardProps) {
  const pct = weeklyTotal > 0 ? Math.round((weeklyDone / weeklyTotal) * 100) : 0;
  const r = 36;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;

  return (
    <div className="d-card invert" style={{ background: "var(--blue)" }}>
      <div className="d-card-eyebrow">Tu semana</div>
      <div className="d-card-title">
        Casi lo <em>tienes</em>.
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 8 }}>
        <div className="stat-row" style={{ flex: 1 }}>
          <div className="stat-chip">
            <div className="stat-chip-num">{streak}</div>
            <div className="stat-chip-lbl">Racha</div>
          </div>
          <div className="stat-chip">
            <div className="stat-chip-num">
              {habitsDone}<em>/{habitsTotal}</em>
            </div>
            <div className="stat-chip-lbl">Hábitos hoy</div>
          </div>
          <div className="stat-chip">
            <div className="stat-chip-num">
              {weeklyDone}<em>/{weeklyTotal}</em>
            </div>
            <div className="stat-chip-lbl">Check-ins</div>
          </div>
        </div>
        <div className="progress-ring" aria-label={`${pct}% completado esta semana`}>
          <svg viewBox="0 0 84 84">
            <circle className="progress-ring-bg" cx="42" cy="42" r={r} />
            <circle
              className="progress-ring-fg"
              cx="42"
              cy="42"
              r={r}
              strokeDasharray={c}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset .6s ease" }}
            />
          </svg>
          <div className="progress-ring-pct">{pct}%</div>
        </div>
      </div>
    </div>
  );
}
