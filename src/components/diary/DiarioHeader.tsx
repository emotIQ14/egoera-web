"use client";

import { ArrowLeft } from "lucide-react";

interface Props {
  view: string;
  onBack: () => void;
}

const titles: Record<string, string> = {
  home: "Diario Emocional",
  new: "Nuevo Registro",
  stats: "Tu Progreso",
};

export function DiarioHeader({ view, onBack }: Props) {
  return (
    <header className="sticky top-0 z-40 bg-warm-bg/80 backdrop-blur-lg border-b border-border/50">
      <div className="max-w-lg mx-auto flex items-center gap-3 px-4 py-4">
        {view !== "home" && (
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors text-dark-text"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-teal flex items-center justify-center">
            <span className="text-white font-bold text-sm font-[family-name:var(--font-heading)]">
              E
            </span>
          </div>
          <h1 className="text-lg font-semibold text-dark-text">
            {titles[view] ?? "Egoera"}
          </h1>
        </div>
      </div>
    </header>
  );
}
