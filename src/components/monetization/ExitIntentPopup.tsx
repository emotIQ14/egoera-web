"use client";

import { useEffect, useState, useCallback } from "react";
import { CheckCircle, Loader2, Mail, X } from "lucide-react";
import { track } from "@/lib/analytics";

const STORAGE_KEY = "egoera:newsletter-popup-shown";
const DELAY_MS = 120_000; // 2 min en desktop, 4 min en movil (ver abajo)

type State = "idle" | "loading" | "success" | "error";

export function ExitIntentPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");

  const markShown = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
  }, []);

  const dismiss = useCallback(() => {
    setOpen(false);
    markShown();
    track("exit_intent_dismissed", {});
  }, [markShown]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let alreadyShown = false;
    try {
      alreadyShown = localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      // ignore
    }
    if (alreadyShown) return;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const delay = isMobile ? 240_000 : DELAY_MS; // 4 min movil, 2 min desktop

    const show = () => {
      if (alreadyShown) return;
      alreadyShown = true;
      setOpen(true);
      markShown();
      track("exit_intent_shown", {});
    };

    const timer = window.setTimeout(show, delay);

    // Solo detectar exit intent por mouse en desktop (mouseleave no tiene sentido en movil)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) show();
    };
    if (!isMobile) {
      document.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      window.clearTimeout(timer);
      if (!isMobile) document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [markShown]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setState("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "exit-intent-popup" }),
      });
      const data = await res.json();
      if (data.success) {
        setState("success");
        setMessage(data.message ?? "Listo. Gracias por suscribirte.");
        track("newsletter_subscribe", { source: "exit-intent-popup" });
      } else {
        setState("error");
        setMessage(data.message ?? "No hemos podido completar la suscripcion.");
      }
    } catch {
      setState("error");
      setMessage("Error de conexion. Intentalo de nuevo.");
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm"
      style={{ background: "rgba(0,0,0,0.6)" }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-intent-title"
      onClick={dismiss}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-sm border shadow-2xl"
        style={{
          background: "var(--bg)",
          borderColor: "var(--rule)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={dismiss}
          aria-label="Cerrar"
          className="absolute right-4 top-4 rounded-full p-1.5 transition-colors"
          style={{ color: "var(--ink-dim)" }}
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-8 pt-10">
          <div
            className="mb-5 flex h-12 w-12 items-center justify-center rounded-full"
            style={{
              background: "rgba(168,194,182,0.1)",
              border: "1px solid var(--rule)",
            }}
          >
            <Mail className="h-6 w-6" style={{ color: "var(--accent)" }} />
          </div>
          <h2
            id="exit-intent-title"
            className="tracking-[-0.02em]"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 32,
              fontWeight: 400,
              color: "var(--ink)",
            }}
          >
            Antes de irte
          </h2>
          <p
            className="mt-3 leading-[1.55]"
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: 16,
              color: "var(--ink-dim)",
            }}
          >
            Suscribete gratis y recibe una entrada cada jueves, con una
            pregunta breve para llevarte la semana.
          </p>

          {state === "success" ? (
            <div
              className="mt-6 flex items-center gap-2"
              style={{ color: "var(--accent)" }}
            >
              <CheckCircle className="h-5 w-5" />
              <span
                className="text-[14px] font-medium"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {message}
              </span>
            </div>
          ) : (
            <form className="mt-6 flex flex-col gap-3" onSubmit={submit}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="rounded-full border px-5 py-3 text-[14px] outline-none focus:ring-2"
                style={{
                  borderColor: "var(--rule)",
                  color: "var(--ink)",
                  background: "var(--bg-2)",
                  fontFamily: "var(--font-sans)",
                }}
              />
              <button
                type="submit"
                disabled={state === "loading"}
                className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[13px] font-medium disabled:opacity-60"
                style={{
                  background: "var(--ink)",
                  color: "var(--bg)",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {state === "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Enviando...
                  </>
                ) : (
                  "Suscribirme gratis"
                )}
              </button>
              {state === "error" && (
                <p className="text-[12px]" style={{ color: "#ef4444" }}>
                  {message}
                </p>
              )}
              <button
                type="button"
                onClick={dismiss}
                className="mt-1 text-[12px] underline-offset-2 hover:underline"
                style={{ color: "var(--ink-faint)" }}
              >
                No, gracias
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
