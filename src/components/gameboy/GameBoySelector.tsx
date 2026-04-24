"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FEELINGS, type Feeling } from "@/lib/egoera-data";

/**
 * Game Boy Selector — corazon de la homepage.
 *
 * La pantalla CRT muestra la lista de sentimientos navegable con
 * cursor. El usuario puede:
 *  - Mover con ↑/↓ o flechas del d-pad
 *  - Abrir con Enter, A o click sobre un item
 *  - Volver con Escape o B (sin efecto por ahora; reservado)
 *
 * Al abrir, navega a /sentimiento/[id].
 */
export function GameBoySelector() {
  const router = useRouter();
  const [index, setIndex] = useState(0);

  const total = FEELINGS.length;
  const current: Feeling = FEELINGS[index];

  const move = useCallback((delta: number) => {
    setIndex((i) => (i + delta + total) % total);
  }, [total]);

  const open = useCallback(() => {
    router.push(`/sentimiento/${current.id}`);
  }, [current.id, router]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        move(1);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        move(-1);
      } else if (e.key === "Enter" || e.key.toLowerCase() === "a") {
        e.preventDefault();
        open();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [move, open]);

  const selectMeta = `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;

  return (
    <div className="gb-device mx-auto max-w-[720px]">
      {/* Top bar */}
      <div
        className="flex items-center justify-between pb-5 px-2"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "10px",
          letterSpacing: "0.2em",
          color: "rgba(0,0,0,0.55)",
        }}
      >
        <div>
          EGOERA <span style={{ color: "var(--gb-orange)" }}>·</span> ESTADO v01
        </div>
        <div className="flex gap-1.5">
          <span
            className="inline-block h-[7px] w-[7px] rounded-full"
            style={{
              background: "var(--gb-green)",
              boxShadow: "0 0 8px var(--gb-green)",
              animation: "gb-blink 2s ease-in-out infinite",
            }}
          />
          <span
            className="inline-block h-[7px] w-[7px] rounded-full"
            style={{
              background: "var(--gb-orange)",
              boxShadow: "0 0 4px rgba(243,146,55,0.5)",
            }}
          />
          <span
            className="inline-block h-[7px] w-[7px] rounded-full"
            style={{
              background: "rgba(0,0,0,0.2)",
              boxShadow: "inset 0 0 2px rgba(0,0,0,0.5)",
            }}
          />
        </div>
      </div>

      {/* Screen */}
      <div className="gb-screen">
        <div className="crt-scanlines" />
        <div className="crt-glow" />
        <div className="relative z-[3]">
          {/* Screen header */}
          <div
            className="flex items-center gap-3 pb-3.5 mb-5"
            style={{
              borderBottom: "1px dashed rgba(168,194,182,0.25)",
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              letterSpacing: "0.18em",
              color: "var(--accent)",
            }}
          >
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{
                background: "var(--accent)",
                boxShadow: "0 0 8px var(--accent)",
              }}
            />
            <span className="flex-1">SELECT.EMOTION ▸ /egoera/estado</span>
            <span style={{ color: "var(--accent-dim)" }}>{selectMeta}</span>
          </div>

          <div
            className="mb-4 flex items-center gap-2.5"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              color: "var(--accent-dim)",
            }}
          >
            <span
              style={{
                color: "var(--accent)",
                animation: "cursor-blink 1s step-end infinite",
              }}
            >
              ▸
            </span>
            <span>Usa las flechas / A para abrir / B para volver</span>
          </div>

          {/* Feeling list */}
          <div
            className="grid grid-cols-1 gap-[2px] sm:grid-cols-2"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {FEELINGS.map((f, i) => {
              const active = i === index;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    if (i === index) {
                      open();
                    } else {
                      setIndex(i);
                    }
                  }}
                  onMouseEnter={() => setIndex(i)}
                  className="flex items-center gap-3.5 border-l-2 px-3.5 py-2.5 text-left text-[13px] tracking-[0.04em]"
                  style={{
                    color: active
                      ? "var(--accent-glow)"
                      : "var(--ink-dim)",
                    background: active
                      ? "rgba(168,194,182,0.08)"
                      : "transparent",
                    borderLeftColor: active
                      ? "var(--accent)"
                      : "transparent",
                    textShadow: active
                      ? "0 0 8px rgba(168,194,182,0.5)"
                      : "none",
                    transition: "all 0.15s ease",
                  }}
                >
                  <span
                    className="min-w-[20px] text-[10px]"
                    style={{
                      color: active ? "var(--accent)" : "var(--accent-dim)",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 lowercase">{f.name}</span>
                  <span
                    className="text-[10px] tracking-[0.12em]"
                    style={{
                      color: active ? "var(--accent)" : "var(--accent-dim)",
                    }}
                  >
                    {f.meta}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Footer hints */}
          <div
            className="mt-7 flex flex-wrap gap-5 border-t pt-4"
            style={{
              borderColor: "rgba(168,194,182,0.15)",
              borderStyle: "dashed",
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              color: "var(--ink-faint)",
              letterSpacing: "0.1em",
            }}
          >
            <Kbd keyName="↑↓" label="Navegar" />
            <Kbd keyName="A" label="Abrir" />
            <Kbd keyName="B" label="Volver" />
            <span className="ml-auto" style={{ color: "var(--accent-dim)" }}>
              egoera://blog
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-2 pb-3 pt-12">
        {/* DPad */}
        <div
          className="relative h-[120px] w-[120px] rounded-full p-2.5"
          style={{
            background:
              "radial-gradient(circle at center, rgba(59,111,212,0.18) 0%, transparent 62%)",
          }}
        >
          <DPadBtn dir="up" onClick={() => move(-1)} className="top-2 left-[41px] rounded-t-lg" />
          <DPadBtn
            dir="left"
            onClick={() => move(-1)}
            className="top-[41px] left-2 rounded-l-lg"
          />
          <div
            className="absolute top-[41px] left-[41px] h-[38px] w-[38px]"
            style={{
              background: "#1a2a5a",
              border: "2px solid rgba(0,0,0,0.7)",
            }}
          />
          <DPadBtn
            dir="right"
            onClick={() => move(1)}
            className="top-[41px] right-2 rounded-r-lg"
          />
          <DPadBtn dir="down" onClick={() => move(1)} className="bottom-2 left-[41px] rounded-b-lg" />
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-4 -rotate-[20deg]">
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label="B — atras"
            className="relative flex h-[58px] w-[58px] items-center justify-center rounded-full border-2 text-[22px]"
            style={{
              borderColor: "rgba(0,0,0,0.7)",
              background:
                "radial-gradient(circle at 35% 35%, #f3a8c4, #b0547a)",
              color: "#3a0a20",
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontWeight: 600,
              boxShadow:
                "0 4px 0 rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,255,255,0.3), inset 0 -3px 0 rgba(0,0,0,0.15)",
            }}
          >
            B
          </button>
          <button
            type="button"
            onClick={open}
            aria-label="A — abrir sentimiento"
            className="relative flex h-[68px] w-[68px] items-center justify-center rounded-full border-2 text-[22px]"
            style={{
              borderColor: "rgba(0,0,0,0.7)",
              background:
                "radial-gradient(circle at 35% 35%, #fff, var(--gb-yellow) 60%, #c48a0a)",
              color: "#2a1e00",
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontWeight: 600,
              boxShadow:
                "0 4px 0 rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,255,255,0.3), inset 0 -3px 0 rgba(0,0,0,0.15)",
            }}
          >
            A
          </button>
        </div>
      </div>

      {/* Speaker + bottom meta */}
      <div className="mt-6 flex items-end justify-between px-2 pt-5">
        <div
          className="text-[9px] font-semibold tracking-[0.18em]"
          style={{
            fontFamily: "var(--font-mono)",
            color: "rgba(0,0,0,0.55)",
          }}
        >
          BAT ◼◼◼◼◻
        </div>
        <div className="flex -rotate-[20deg] flex-col items-end gap-1">
          {[0, 1, 2].map((row) => (
            <div key={row} className="flex gap-1">
              {[0, 1, 2, 3, 4].map((col) => (
                <span
                  key={col}
                  className="h-[5px] w-[5px] rounded-full"
                  style={{
                    background: "rgba(0,0,0,0.35)",
                    boxShadow: "inset 0 1px 1px rgba(0,0,0,0.5)",
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DPadBtn({
  onClick,
  className,
  dir,
}: {
  onClick: () => void;
  className: string;
  dir: "up" | "down" | "left" | "right";
}) {
  const label = { up: "▲", down: "▼", left: "◀", right: "▶" }[dir];
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Mover ${dir}`}
      className={`absolute flex h-[38px] w-[38px] items-center justify-center border-2 text-[11px] font-bold text-white/90 transition-[filter] active:scale-95 active:brightness-75 ${className}`}
      style={{
        background: "linear-gradient(145deg, var(--gb-blue), #2a4fa0)",
        borderColor: "rgba(0,0,0,0.7)",
        boxShadow: "0 2px 4px rgba(0,0,0,0.4)",
      }}
    >
      {label}
    </button>
  );
}

function Kbd({ keyName, label }: { keyName: string; label: string }) {
  return (
    <div className="flex items-center">
      <span
        className="mr-1.5 inline-block rounded px-1.5 py-0.5 text-[10px]"
        style={{
          background: "rgba(168,194,182,0.12)",
          border: "1px solid rgba(168,194,182,0.3)",
          color: "var(--accent)",
          fontFamily: "var(--font-mono)",
        }}
      >
        {keyName}
      </span>
      <span>{label}</span>
    </div>
  );
}
