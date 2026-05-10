"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDiaryStore, type FeelingId } from "@/lib/diary-store";
import { MoodBlob } from "@/components/diary/cobalt/MoodBlob";
import { FeelingPicker } from "@/components/diary/cobalt/FeelingPicker";
import { IntensitySlider } from "@/components/diary/cobalt/IntensitySlider";

const TAGS = [
  "trabajo", "familia", "pareja", "amigos", "soledad",
  "ejercicio", "sueño", "comida", "dinero", "salud",
  "ocio", "estudio", "viaje", "recuerdo",
];

const PLACES = [
  { id: "casa", label: "Casa" },
  { id: "trabajo", label: "Trabajo" },
  { id: "ciudad", label: "Calle" },
  { id: "naturaleza", label: "Naturaleza" },
  { id: "transito", label: "Tránsito" },
] as const;

export default function CheckInPage() {
  const router = useRouter();
  const { addEntry } = useDiaryStore();
  const [step, setStep] = useState<"feel" | "intensity" | "context" | "note">("feel");
  const [feelingId, setFeelingId] = useState<FeelingId | undefined>();
  const [intensity, setIntensity] = useState(5);
  const [tags, setTags] = useState<string[]>([]);
  const [place, setPlace] = useState<typeof PLACES[number]["id"] | undefined>();
  const [note, setNote] = useState("");

  const toggleTag = (t: string) =>
    setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const submit = () => {
    if (!feelingId) return;
    addEntry({
      date: new Date().toISOString(),
      feelingId,
      intensity,
      note: note.trim(),
      tags,
      place,
    });
    router.push("/diario");
  };

  return (
    <>
      <header className="diario-greet">
        <div className="diario-eyebrow">Check-in · {step === "feel" ? 1 : step === "intensity" ? 2 : step === "context" ? 3 : 4}/4</div>
        <h1 className="diario-h2">
          {step === "feel" && <>¿Qué sientes <em>ahora</em>?</>}
          {step === "intensity" && <>¿Con cuánta <em>fuerza</em>?</>}
          {step === "context" && <>¿Y el <em>contexto</em>?</>}
          {step === "note" && <>Nómbralo <em>despacio</em>.</>}
        </h1>
      </header>

      {step === "feel" && (
        <>
          <div style={{ textAlign: "center", marginTop: 8 }}>
            <MoodBlob size={200} />
          </div>
          <FeelingPicker selectedId={feelingId} onSelect={setFeelingId} />
          <div style={{ marginTop: 22 }}>
            <button
              className="d-btn d-btn-blue d-btn-block d-btn-lg"
              disabled={!feelingId}
              onClick={() => setStep("intensity")}
              style={{ opacity: feelingId ? 1 : 0.5 }}
            >
              Continuar →
            </button>
          </div>
        </>
      )}

      {step === "intensity" && (
        <div className="d-card">
          <div className="d-card-eyebrow">Intensidad de la sensación</div>
          <p className="serif" style={{ fontSize: 15, lineHeight: 1.5, margin: "6px 0 14px" }}>
            ¿Lo notas como un susurro o como un grito? No hay respuesta correcta.
          </p>
          <IntensitySlider value={intensity} onChange={setIntensity} />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button className="d-btn d-btn-outline" onClick={() => setStep("feel")}>← Atrás</button>
            <button className="d-btn d-btn-blue" style={{ flex: 1 }} onClick={() => setStep("context")}>
              Continuar →
            </button>
          </div>
        </div>
      )}

      {step === "context" && (
        <>
          <div className="d-card">
            <div className="d-card-eyebrow">Dónde estás</div>
            <div className="tag-grid" style={{ marginTop: 8 }}>
              {PLACES.map((p) => (
                <button
                  key={p.id}
                  className={`tag-chip ${place === p.id ? "selected" : ""}`}
                  onClick={() => setPlace(place === p.id ? undefined : p.id)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div className="d-card">
            <div className="d-card-eyebrow">¿De qué va?</div>
            <p className="serif" style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>
              Toca lo que suene. Puedes saltarlo.
            </p>
            <div className="tag-grid">
              {TAGS.map((t) => (
                <button
                  key={t}
                  className={`tag-chip ${tags.includes(t) ? "selected" : ""}`}
                  onClick={() => toggleTag(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
            <button className="d-btn d-btn-outline" onClick={() => setStep("intensity")}>← Atrás</button>
            <button className="d-btn d-btn-blue" style={{ flex: 1 }} onClick={() => setStep("note")}>
              Continuar →
            </button>
          </div>
        </>
      )}

      {step === "note" && (
        <>
          <div className="d-card">
            <div className="d-card-eyebrow">Cuéntate qué pasa</div>
            <p className="serif" style={{ fontSize: 14, marginTop: 4, marginBottom: 12 }}>
              Sin filtros, sin estructura. Solo tú escribiéndote.
            </p>
            <textarea
              className="d-textarea"
              placeholder="Hoy he…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={6}
              autoFocus
            />
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
            <button className="d-btn d-btn-outline" onClick={() => setStep("context")}>← Atrás</button>
            <button className="d-btn d-btn-blue" style={{ flex: 1 }} onClick={submit}>
              Guardar entrada ✓
            </button>
          </div>
        </>
      )}
    </>
  );
}
