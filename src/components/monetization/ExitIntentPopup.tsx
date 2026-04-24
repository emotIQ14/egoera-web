"use client";

import { useEffect, useState, useCallback } from "react";
import { CheckCircle, Loader2, Mail, X } from "lucide-react";
import { track } from "@/lib/analytics";

const STORAGE_KEY = "egoera:newsletter-popup-shown";
const DELAY_MS = 60_000; // 60 segundos

type State = "idle" | "loading" | "success" | "error";

/**
 * Popup gentil que aparece una vez por sesion:
 * - Tras 60s en la pagina, o
 * - Cuando el raton sale por el borde superior (exit intent, solo desktop).
 * Se desactiva permanentemente tras ser mostrado/cerrado.
 */
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

    const show = () => {
      if (alreadyShown) return;
      alreadyShown = true;
      setOpen(true);
      markShown();
      track("exit_intent_shown", {});
    };

    const timer = window.setTimeout(show, DELAY_MS);

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) show();
    };
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
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
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-intent-title"
      onClick={dismiss}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={dismiss}
          aria-label="Cerrar"
          className="absolute right-3 top-3 rounded-full p-1.5 text-grey-text transition-colors hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="newsletter-watercolor p-7 pt-10">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal/15">
            <Mail className="h-6 w-6 text-teal" />
          </div>
          <h2
            id="exit-intent-title"
            className="font-[family-name:var(--font-heading)] text-2xl font-semibold text-dark-text"
          >
            Antes de irte
          </h2>
          <p className="mt-2 text-sm text-grey-text">
            Suscribete gratis y recibe un articulo semanal de psicologia
            accionable. Sin spam, solo contenido util.
          </p>

          {state === "success" ? (
            <div className="mt-5 flex items-center gap-2 text-sage">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">{message}</span>
            </div>
          ) : (
            <form className="mt-5 flex flex-col gap-2" onSubmit={submit}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="rounded-full border border-teal/20 bg-white/80 px-4 py-3 text-sm text-dark-text placeholder:text-grey-text/60 focus:outline-none focus:ring-2 focus:ring-teal/40"
              />
              <button
                type="submit"
                disabled={state === "loading"}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-teal px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-teal/90 disabled:opacity-60"
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
                <p className="text-xs text-red-500">{message}</p>
              )}
              <button
                type="button"
                onClick={dismiss}
                className="mt-1 text-xs text-grey-text/70 underline-offset-2 hover:underline"
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
