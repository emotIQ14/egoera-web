"use client";

import { useState } from "react";
import { MoodBlob } from "./MoodBlob";

interface OnboardingProps {
  onContinue: (name: string) => void;
}

export function Onboarding({ onContinue }: OnboardingProps) {
  const [name, setName] = useState("");
  const [step, setStep] = useState<"intro" | "name">("intro");

  if (step === "intro") {
    return (
      <div className="onboarding">
        <MoodBlob size={260} />
        <h1>
          ¿Cómo te <em>sientes</em><br/>hoy?
        </h1>
        <p>
          Egoera es tu cuaderno emocional. Sin algoritmos, sin notificaciones agresivas,
          sin métricas raras. Solo tú, lo que sientes y el tiempo para nombrarlo.
        </p>
        <button className="d-btn d-btn-blue d-btn-lg" onClick={() => setStep("name")}>
          Empezar →
        </button>
      </div>
    );
  }

  return (
    <div className="onboarding">
      <MoodBlob size={180} />
      <h1>Hola, soy <em>Egoera</em>.</h1>
      <p>¿Cómo te llamas? Solo aparecerá en tu pantalla, nunca sale de aquí.</p>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="tu nombre"
        autoFocus
        style={{
          fontFamily: "var(--font-display), Caveat, cursive",
          fontSize: 32,
          fontWeight: 600,
          textAlign: "center",
          background: "transparent",
          border: "none",
          borderBottom: "2px solid var(--blue)",
          padding: "8px 16px",
          color: "var(--blue)",
          outline: "none",
          width: "min(280px, 80%)",
          marginBottom: 28,
        }}
      />
      <button
        className="d-btn d-btn-blue d-btn-lg"
        onClick={() => name.trim() && onContinue(name.trim())}
        disabled={!name.trim()}
        style={{ opacity: name.trim() ? 1 : 0.5 }}
      >
        Continuar →
      </button>
    </div>
  );
}
