"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useDiaryStore, FEELINGS, type FeelingId } from "@/lib/diary-store";
import { EntryCard } from "@/components/diary/cobalt/EntryCard";

export default function HistorialPage() {
  const { hydrated, entries, removeEntry } = useDiaryStore();
  const [filter, setFilter] = useState<FeelingId | "all">("all");

  const filtered = useMemo(() => {
    if (filter === "all") return entries;
    return entries.filter((e) => e.feelingId === filter);
  }, [entries, filter]);

  // Group by month
  const groups = useMemo(() => {
    const map = new Map<string, typeof entries>();
    for (const e of filtered) {
      const d = new Date(e.date);
      const key = d.toLocaleDateString("es-ES", { month: "long", year: "numeric" }).toUpperCase();
      const arr = map.get(key) ?? [];
      arr.push(e);
      map.set(key, arr);
    }
    return Array.from(map.entries());
  }, [filtered]);

  if (!hydrated) return <p className="serif" style={{ padding: 30 }}>Cargando…</p>;

  return (
    <>
      <header className="diario-greet">
        <div className="diario-eyebrow">Archivo personal</div>
        <h1 className="diario-h2">
          Tu <em>historial</em>.
        </h1>
        <p className="serif" style={{ fontSize: 14, lineHeight: 1.5, marginTop: 6 }}>
          {entries.length} {entries.length === 1 ? "entrada guardada" : "entradas guardadas"}.
          Tu archivo es solo tuyo y vive en este dispositivo.
        </p>
      </header>

      <div className="d-card">
        <div className="d-card-eyebrow">Filtrar por sentimiento</div>
        <div className="tag-grid" style={{ marginTop: 8 }}>
          <button
            className={`tag-chip ${filter === "all" ? "selected" : ""}`}
            onClick={() => setFilter("all")}
          >
            todos
          </button>
          {FEELINGS.map((f) => (
            <button
              key={f.id}
              className={`tag-chip ${filter === f.id ? "selected" : ""}`}
              onClick={() => setFilter(f.id)}
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <h3 className="display" style={{ fontSize: 36, margin: 0 }}>
            Aún <em>vacío</em>.
          </h3>
          <p className="serif" style={{ fontSize: 15, lineHeight: 1.5, margin: "8px auto 18px", maxWidth: 280 }}>
            {filter === "all"
              ? "Empieza con tu primer check-in. Tres minutos bastan."
              : `Aún no has registrado ${filter}.`}
          </p>
          <Link href="/diario/check-in" className="d-btn d-btn-blue">
            Hacer un check-in →
          </Link>
        </div>
      ) : (
        groups.map(([month, items]) => (
          <section key={month} style={{ marginTop: 18 }}>
            <div
              className="diario-eyebrow"
              style={{ marginBottom: 8 }}
            >
              {month}
            </div>
            {items.map((e) => (
              <EntryCard key={e.id} entry={e} onDelete={removeEntry} />
            ))}
          </section>
        ))
      )}
    </>
  );
}
