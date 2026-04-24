"use client";

import { Coffee } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { MONETIZATION_CONFIG } from "@/lib/monetization-config";
import { track } from "@/lib/analytics";

const MESSAGES = [
  {
    title: "Te ha sido util este articulo?",
    body: "Si lo que lees aqui te aporta claridad, puedes invitarme a un cafe. Cada aportacion mantiene el blog sin publicidad invasiva.",
  },
  {
    title: "Psicologia accesible, tambien gratuita.",
    body: "Escribo cada semana contenido basado en evidencia. Tu aporte me permite dedicarle tiempo.",
  },
  {
    title: "Seguimos sin muros de pago.",
    body: "Todo lo que publico es libre. Si te apetece, puedes agradecerlo con un cafe.",
  },
  {
    title: "Gracias por leer hasta aqui.",
    body: "Si este contenido te acompana, puedes sostenerlo con una pequena aportacion.",
  },
];

const STORAGE_KEY = "egoera:articles-read";
const SHOW_EVERY = 3;

interface Props {
  alwaysShow?: boolean;
  countRead?: boolean;
  source?: string;
}

export function BuyMeCoffee({
  alwaysShow = false,
  countRead = false,
  source = "article",
}: Props) {
  const [visible, setVisible] = useState(alwaysShow);
  const message = useMemo(
    () => MESSAGES[Math.floor(Math.random() * MESSAGES.length)],
    []
  );

  useEffect(() => {
    if (alwaysShow) {
      setVisible(true);
      return;
    }
    if (typeof window === "undefined") return;
    if (!countRead) return;

    try {
      const prev = Number(localStorage.getItem(STORAGE_KEY) ?? 0);
      const next = prev + 1;
      localStorage.setItem(STORAGE_KEY, String(next));
      if (next % SHOW_EVERY === 0) {
        setVisible(true);
      }
    } catch {
      // ignore
    }
  }, [alwaysShow, countRead]);

  if (!visible) return null;

  return (
    <div
      className="my-10 rounded-sm border p-8 text-center"
      style={{
        borderColor: "rgba(243,146,55,0.25)",
        background:
          "linear-gradient(135deg, rgba(243,146,55,0.08), rgba(247,201,74,0.04))",
      }}
    >
      <Coffee
        className="mx-auto mb-4 h-8 w-8"
        style={{ color: "var(--gb-orange)" }}
      />
      <h3
        className="mb-3 tracking-[-0.01em]"
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: 22,
          fontWeight: 400,
          color: "var(--ink)",
        }}
      >
        {message.title}
      </h3>
      <p
        className="mx-auto mb-6 max-w-md leading-[1.6]"
        style={{
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          fontSize: 15,
          color: "var(--ink-dim)",
        }}
      >
        {message.body}
      </p>
      <a
        href={MONETIZATION_CONFIG.buyMeCoffee.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("buy_me_coffee_click", { source })}
        className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[13px] font-medium"
        style={{
          background: "var(--gb-orange)",
          color: "var(--bg)",
          fontFamily: "var(--font-sans)",
        }}
      >
        <Coffee className="h-4 w-4" />
        Invitame a un cafe
      </a>
    </div>
  );
}
