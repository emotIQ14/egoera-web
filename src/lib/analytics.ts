/**
 * Analytics ligero de cliente. Sin dependencias externas.
 * Envia eventos a /api/track que registra en fichero de log.
 */

export type EventName =
  | "affiliate_click"
  | "newsletter_subscribe"
  | "lead_magnet_download"
  | "buy_me_coffee_click"
  | "patreon_click"
  | "ad_impression"
  | "exit_intent_shown"
  | "exit_intent_dismissed"
  | "sponsored_click";

export interface EventPayload {
  [key: string]: string | number | boolean | undefined;
}

export function track(event: EventName, payload: EventPayload = {}): void {
  if (typeof window === "undefined") return;

  const body = {
    event,
    payload,
    url: window.location.pathname,
    referrer: document.referrer || null,
    ts: Date.now(),
  };

  // navigator.sendBeacon garantiza entrega incluso al navegar/cerrar
  const data = JSON.stringify(body);
  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    const blob = new Blob([data], { type: "application/json" });
    navigator.sendBeacon("/api/track", blob);
    return;
  }

  // Fallback fetch no bloqueante
  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: data,
    keepalive: true,
  }).catch(() => {
    // swallow: no bloqueamos UX por fallo de tracking
  });
}
