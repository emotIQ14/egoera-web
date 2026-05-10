"use client";

import { type DiaryEntry, getFeeling } from "@/lib/diary-store";

interface EntryCardProps {
  entry: DiaryEntry;
  onDelete?: (id: string) => void;
}

export function EntryCard({ entry, onDelete }: EntryCardProps) {
  const f = getFeeling(entry.feelingId);
  const dt = new Date(entry.date);
  const time = dt.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
  const date = dt.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "short" }).toUpperCase();

  return (
    <article className="entry-card" aria-label={`Entrada de ${f.name}`}>
      <div className="entry-card-row">
        <div
          className="entry-card-mark"
          style={{ background: f.color }}
        />
        <div className="entry-card-body">
          <div className="entry-card-feel">
            <em>{f.name}</em>. <span style={{ fontSize: 16, opacity: 0.6, fontFamily: "var(--font-mono)" }}>· {entry.intensity}/10</span>
          </div>
          <div className="entry-card-time">{date} · {time}</div>
          {entry.note && <p className="entry-card-note">{entry.note}</p>}
          {entry.tags?.length > 0 && (
            <div className="entry-card-tags">
              {entry.tags.map((t) => (
                <span key={t} className="entry-card-tag">{t}</span>
              ))}
            </div>
          )}
        </div>
        {onDelete && (
          <button
            className="d-btn d-btn-ghost"
            style={{ padding: "4px 10px", fontSize: 18, alignSelf: "flex-start" }}
            onClick={() => onDelete(entry.id)}
            aria-label="Eliminar"
          >
            ×
          </button>
        )}
      </div>
    </article>
  );
}
