"use client";

import { useState } from "react";
import { CheckCircle, Loader2, Download } from "lucide-react";
import { track } from "@/lib/analytics";

interface Props {
  /** Identificador del lead magnet (diario-gratis, test-apego, meditacion-ansiedad...). */
  leadMagnet: string;
  /** URL de descarga/acceso que se muestra tras suscribirse. */
  deliveryUrl: string;
  /** Texto del boton (opcional). */
  ctaLabel?: string;
  /** Etiqueta del recurso en la confirmacion. */
  resourceLabel?: string;
}

type State = "idle" | "loading" | "success" | "error";

export function LeadMagnetForm({
  leadMagnet,
  deliveryUrl,
  ctaLabel = "Enviarme el recurso",
  resourceLabel = "el recurso",
}: Props) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setState("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: `lead-magnet:${leadMagnet}`,
          leadMagnet,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setState("success");
        setMessage(data.message ?? "Perfecto, ya estas dentro.");
        track("lead_magnet_download", { leadMagnet });
        track("newsletter_subscribe", { source: `lead-magnet:${leadMagnet}` });
      } else {
        setState("error");
        setMessage(data.message ?? "No hemos podido completarlo.");
      }
    } catch {
      setState("error");
      setMessage("Error de conexion. Intentalo de nuevo.");
    }
  };

  if (state === "success") {
    return (
      <div className="rounded-2xl border border-sage/20 bg-sage/5 p-6 text-center">
        <CheckCircle className="mx-auto mb-3 h-10 w-10 text-sage" />
        <h3 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-dark-text">
          {message}
        </h3>
        <p className="mt-2 text-sm text-grey-text">
          Hemos enviado el enlace a tu correo y lo tienes tambien aqui para descargar ahora mismo:
        </p>
        <a
          href={deliveryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-teal px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-teal/90"
        >
          <Download className="h-4 w-4" />
          Acceder a {resourceLabel}
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <label className="sr-only" htmlFor={`lm-${leadMagnet}`}>
        Email
      </label>
      <input
        id={`lm-${leadMagnet}`}
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tu@email.com"
        className="rounded-full border border-teal/20 bg-white/80 px-5 py-3.5 text-sm text-dark-text placeholder:text-grey-text/60 focus:outline-none focus:ring-2 focus:ring-teal/40"
      />
      <button
        type="submit"
        disabled={state === "loading"}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-teal px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-teal/90 disabled:opacity-60"
      >
        {state === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Enviando...
          </>
        ) : (
          <>
            <Download className="h-4 w-4" /> {ctaLabel}
          </>
        )}
      </button>
      {state === "error" && (
        <p className="text-center text-xs text-red-500">{message}</p>
      )}
      <p className="text-center text-[11px] text-grey-text/70">
        Te suscribes a nuestra newsletter gratuita. Puedes darte de baja cuando quieras.
      </p>
    </form>
  );
}
