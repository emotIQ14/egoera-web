"use client";

import { Coffee } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { MONETIZATION_CONFIG } from "@/lib/monetization-config";
import { track } from "@/lib/analytics";

const MESSAGES = [
  {
    title: "Te ha sido util este articulo?",
    body: "Si lo que lees aqui te aporta claridad, puedes invitarnos a un cafe. Cada aportacion mantiene el blog sin publicidad invasiva.",
  },
  {
    title: "Psicologia accesible, tambien gratuita.",
    body: "Escribimos cada semana contenido basado en evidencia. Tu aporte nos permite dedicarle tiempo.",
  },
  {
    title: "Seguimos sin muros de pago.",
    body: "Todo lo que publicamos es libre. Si te apetece, puedes agradecerlo con un cafe.",
  },
  {
    title: "Gracias por leer hasta aqui.",
    body: "Si este contenido te acompana, puedes sostenerlo con una pequena aportacion.",
  },
];

const STORAGE_KEY = "egoera:articles-read";
const SHOW_EVERY = 3;

interface Props {
  /** Si es true, fuerza mostrarlo siempre (usar en pagina /apoya). */
  alwaysShow?: boolean;
  /** Cuenta la lectura actual (solo pasar en blog post). */
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

      // Se muestra cada 3 articulos
      if (next % SHOW_EVERY === 0) {
        setVisible(true);
      }
    } catch {
      // si localStorage falla, no mostramos
    }
  }, [alwaysShow, countRead]);

  if (!visible) return null;

  return (
    <div className="my-8 rounded-xl border border-amber-200/50 bg-gradient-to-r from-amber-50 to-orange-50 p-6 text-center">
      <Coffee className="mx-auto mb-3 h-8 w-8 text-amber-600" />
      <h3 className="mb-2 font-[family-name:var(--font-heading)] text-lg font-semibold text-dark-text">
        {message.title}
      </h3>
      <p className="mx-auto mb-4 max-w-md text-sm text-grey-text">
        {message.body}
      </p>
      <a
        href={MONETIZATION_CONFIG.buyMeCoffee.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("buy_me_coffee_click", { source })}
        className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-amber-600"
      >
        <Coffee className="h-4 w-4" />
        Invitanos a un cafe
      </a>
    </div>
  );
}
