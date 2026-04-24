/**
 * Central monetization configuration.
 * All revenue channels — affiliates, ads, donations, newsletter — read from here.
 * Activate channels via environment variables (see README).
 */

export const MONETIZATION_CONFIG = {
  // Amazon Afiliados
  amazon: {
    tag: "abc01f7-21",
    baseUrl: "https://www.amazon.es/dp",
    coverUrl: "https://images-na.ssl-images-amazon.com/images/P",
  },

  // Audible (audiobooks)
  audible: {
    baseUrl: "https://www.audible.es/?source_code=ESORORWS072615007B",
  },

  // Booking.com (retiros de psicologia)
  booking: {
    baseUrl: "https://www.booking.com/index.es.html?aid=egoera",
  },

  // Patreon (contenido premium)
  patreon: {
    url: "https://patreon.com/egoera",
  },

  // Buy Me a Coffee (donaciones)
  buyMeCoffee: {
    url: "https://buymeacoffee.com/egoerapsikologia",
  },

  // Google AdSense
  adsense: {
    clientId: process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "",
    enabled: Boolean(process.env.NEXT_PUBLIC_ADSENSE_CLIENT),
  },

  // Brevo (email marketing)
  brevo: {
    apiKey: process.env.BREVO_API_KEY ?? "",
    listId: 2,
    enabled: Boolean(process.env.BREVO_API_KEY),
  },

  // Contenido patrocinado
  sponsored: {
    enabled: process.env.SPONSORED_ENABLED === "true",
  },

  // Telegram bot
  telegram: {
    username: "egoerabot",
    url: "https://t.me/egoerabot",
  },
} as const;

export type MonetizationConfig = typeof MONETIZATION_CONFIG;

// Helpers
export function amazonAffiliateUrl(asin: string): string {
  return `${MONETIZATION_CONFIG.amazon.baseUrl}/${asin}?tag=${MONETIZATION_CONFIG.amazon.tag}`;
}

export function amazonCoverUrl(asin: string): string {
  return `${MONETIZATION_CONFIG.amazon.coverUrl}/${asin}.jpg`;
}
