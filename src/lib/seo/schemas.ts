/**
 * Esquemas Schema.org (JSON-LD) reutilizables para egoera.es.
 *
 * Cada helper devuelve un objeto serializable que el componente
 * <JsonLd /> incrustará en la página correspondiente. Todos los
 * helpers son funciones puras: no hacen fetch, no leen estado y no
 * dependen del DOM. El consumidor proporciona los datos.
 *
 * Rationale SEO:
 *  - Article + Person + Organization refuerzan E-E-A-T.
 *  - BreadcrumbList habilita las migas en SERP.
 *  - WebSite con SearchAction habilita el sitelinks search box.
 *  - FAQPage activa los rich results de preguntas frecuentes.
 *
 * Las constantes de marca se centralizan abajo para evitar magic
 * strings dispersas por la app.
 */

// ── Constantes de marca ─────────────────────────────────────────────────────

export const SITE_URL = "https://egoera.es" as const;
export const SITE_NAME = "Egoera" as const;
export const SITE_TAGLINE = "El vlog de psicología de Ander Bilbao" as const;
export const DEFAULT_LOCALE = "es_ES" as const;
export const DEFAULT_LOGO =
  "https://egoera.es/wp-content/uploads/2026/04/egoera-logo-brain-tree.png" as const;
export const DEFAULT_OG_IMAGE = `${SITE_URL}/icons/logo-brain-tree-512.png` as const;

export const AUTHOR = {
  name: "Ander Bilbao Castejón",
  jobTitle: "Psicólogo colegiado",
  url: `${SITE_URL}/sobre-nosotros`,
  image: `${SITE_URL}/icons/ander-avatar.png`,
  email: "hola@egoera.es",
  affiliation: "Egoera Psicología",
  affiliationUrl: SITE_URL,
  sameAs: [
    "https://www.linkedin.com/in/anderbilbaoc/",
    "https://www.instagram.com/egoera.psikologia/",
  ],
} as const;

export const ORG_SAME_AS = [
  "https://www.instagram.com/egoera.psikologia/",
  "https://www.tiktok.com/@egoera.psikologia",
  "https://x.com/egoerapsikolog",
  "https://www.youtube.com/@egoerapsikologia",
  "https://www.linkedin.com/in/anderbilbaoc/",
] as const;

// ── Tipos ────────────────────────────────────────────────────────────────────

/** Objeto JSON-LD genérico con la propiedad @context obligatoria. */
export interface JsonLdObject {
  "@context": "https://schema.org";
  "@type": string;
  [key: string]: unknown;
}

export interface ArticleSchemaInput {
  /** Título del artículo (sin marca). */
  title: string;
  /** Meta-descripción / extracto en texto plano. */
  description: string;
  /** Slug del post (sin barras). Se usa para construir la URL canónica. */
  slug: string;
  /** Nombre del autor; por defecto el autor del sitio. */
  author?: string;
  /** Fecha de publicación en ISO 8601. */
  datePublished: string;
  /** Fecha de última modificación en ISO 8601. Si falta, usa datePublished. */
  dateModified?: string;
  /** URL absoluta de la imagen destacada. Si falta, usa el OG por defecto. */
  image?: string;
  /** Nombre legible de la categoría / sección editorial. */
  category?: string;
  /** Conteo aproximado de palabras del cuerpo. */
  wordCount?: number;
  /** Lista de palabras clave para `keywords`. */
  keywords?: string[];
  /** Override de la URL canónica. Por defecto: SITE_URL/blog/<slug>. */
  url?: string;
}

export interface BreadcrumbItem {
  /** Texto visible (ej. "Inicio", "Cuaderno"). */
  name: string;
  /** Ruta absoluta o relativa. Las rutas relativas se prefijan con SITE_URL. */
  url: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface WebPageSchemaInput {
  title: string;
  description: string;
  url: string;
  /** Tipo más específico si aplica (AboutPage, ContactPage, CollectionPage…). */
  pageType?:
    | "WebPage"
    | "AboutPage"
    | "ContactPage"
    | "CollectionPage"
    | "ProfilePage"
    | "FAQPage";
  /** Imagen representativa para esta página concreta. */
  image?: string;
  /** Fecha ISO 8601 de última actualización. */
  dateModified?: string;
  /** Cadena de migas para empotrar dentro de la página. */
  breadcrumb?: ReturnType<typeof breadcrumbSchema>;
}

// ── Helpers internos ────────────────────────────────────────────────────────

/** Convierte una ruta relativa en absoluta usando SITE_URL como base. */
function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  if (!pathOrUrl.startsWith("/")) return `${SITE_URL}/${pathOrUrl}`;
  return `${SITE_URL}${pathOrUrl}`;
}

// ── Schemas públicos ────────────────────────────────────────────────────────

/**
 * Person schema canónico para Ander Bilbao Castejón.
 * Refuerza autoría y E-E-A-T en cualquier página donde se incruste.
 */
export function personSchema(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person-ander`,
    name: AUTHOR.name,
    jobTitle: AUTHOR.jobTitle,
    url: AUTHOR.url,
    image: AUTHOR.image,
    email: AUTHOR.email,
    affiliation: {
      "@type": "Organization",
      name: AUTHOR.affiliation,
      url: AUTHOR.affiliationUrl,
    },
    sameAs: [...AUTHOR.sameAs],
  };
}

/**
 * Organization schema canónico para Egoera.
 * Se incrusta una sola vez (idealmente en layout o home) y se referencia
 * desde otros nodos con `@id`.
 */
export function organizationSchema(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: "Egoera Psicología",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: DEFAULT_LOGO,
      width: 512,
      height: 512,
    },
    founder: {
      "@type": "Person",
      name: AUTHOR.name,
      url: AUTHOR.url,
    },
    sameAs: [...ORG_SAME_AS],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Donostia",
      addressRegion: "Gipuzkoa",
      addressCountry: "ES",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: AUTHOR.email,
      availableLanguage: ["es", "eu", "en"],
    },
  };
}

/**
 * WebSite schema con SearchAction. Habilita la "sitelinks search box"
 * en Google si Google decide mostrarla.
 */
export function websiteSchema(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    alternateName: SITE_TAGLINE,
    url: SITE_URL,
    inLanguage: ["es-ES", "eu-ES", "en"],
    publisher: { "@id": `${SITE_URL}/#organization` },
    potentialAction: searchActionSchema(),
  };
}

/**
 * SearchAction parcial — se compone dentro de websiteSchema, pero también
 * se exporta por si una página necesita anidarlo en otro nodo.
 */
export function searchActionSchema(): Record<string, unknown> {
  return {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/blog?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  };
}

/**
 * Article / BlogPosting schema completo. Pensado para artículos del vlog.
 */
export function articleSchema(input: ArticleSchemaInput): JsonLdObject {
  const url = input.url ?? `${SITE_URL}/blog/${input.slug}`;
  const image = input.image ? absoluteUrl(input.image) : DEFAULT_OG_IMAGE;
  const dateModified = input.dateModified ?? input.datePublished;
  const authorName = input.author ?? AUTHOR.name;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    headline: input.title,
    description: input.description,
    url,
    datePublished: input.datePublished,
    dateModified,
    image: {
      "@type": "ImageObject",
      url: image,
    },
    author: {
      "@type": "Person",
      "@id": `${SITE_URL}/#person-ander`,
      name: authorName,
      url: AUTHOR.url,
    },
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "es-ES",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    ...(input.category ? { articleSection: input.category } : {}),
    ...(input.wordCount ? { wordCount: input.wordCount } : {}),
    ...(input.keywords && input.keywords.length > 0
      ? { keywords: input.keywords.join(", ") }
      : {}),
  };
}

/**
 * BreadcrumbList — ordena los items pasados y resuelve URLs relativas.
 */
export function breadcrumbSchema(items: BreadcrumbItem[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}

/**
 * FAQPage — para secciones de preguntas frecuentes.
 * Importante: cada respuesta debe ser texto plano o HTML simple sin scripts.
 */
export function faqPageSchema(items: FaqItem[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/**
 * WebPage genérico para páginas no-artículo (sobre, manifiesto, contacto…).
 * Acepta `pageType` para usar subclases más específicas (AboutPage, etc.).
 */
export function webPageSchema(input: WebPageSchemaInput): JsonLdObject {
  const url = absoluteUrl(input.url);
  return {
    "@context": "https://schema.org",
    "@type": input.pageType ?? "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: input.title,
    description: input.description,
    inLanguage: "es-ES",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    ...(input.image ? { primaryImageOfPage: { "@type": "ImageObject", url: absoluteUrl(input.image) } } : {}),
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
    ...(input.breadcrumb ? { breadcrumb: input.breadcrumb } : {}),
  };
}
