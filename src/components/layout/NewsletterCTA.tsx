"use client";

import { useState } from "react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { CheckCircle, Loader2 } from "lucide-react";

export function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setState("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "newsletter-cta" }),
      });
      const data = await res.json();
      if (data.success) {
        setState("success");
        setMessage(data.message);
      } else {
        setState("error");
        setMessage(data.message);
      }
    } catch {
      setState("error");
      setMessage("Error de conexion. Intentalo de nuevo.");
    }
  };

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-dark-text">
      <ScrollReveal>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-heading)] text-white mb-4">
            Psicologia en tu bandeja de entrada
          </h2>
          <p className="text-white/60 text-lg mb-8">
            Cada semana, un articulo nuevo con herramientas practicas para tu bienestar emocional.
            Sin spam, solo contenido que importa.
          </p>

          {state === "success" ? (
            <div className="flex items-center justify-center gap-2 text-teal">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">{message}</span>
            </div>
          ) : (
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={handleSubmit}>
              <input
                type="email"
                required
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-5 py-3.5 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-teal text-sm"
              />
              <button
                type="submit"
                disabled={state === "loading"}
                className="px-8 py-3.5 bg-teal text-white rounded-full font-medium hover:bg-teal/90 transition-colors text-sm whitespace-nowrap disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {state === "loading" ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</>
                ) : (
                  "Suscribirme"
                )}
              </button>
            </form>
          )}

          {state === "error" && (
            <p className="text-red-400 text-sm mt-3">{message}</p>
          )}

          <p className="text-white/30 text-xs mt-4">
            Puedes darte de baja en cualquier momento.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
