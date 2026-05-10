import type { BlogPost } from "@/lib/blog";

interface FaqItem {
  q: string;
  a: string;
}

interface Props {
  post: BlogPost;
  /** URL canónica completa, p.ej. "https://egoera.es/blog/<slug>". */
  canonicalUrl: string;
  /** Lista de preguntas frecuentes ya extraídas del contenido (puede
   *  ser vacío). Si llega vacío, no se renderiza el JSON-LD FAQPage. */
  faqs: FaqItem[];
  /** Word count calculado en server (texto plano del contenido). */
  wordCount: number;
}

const SITE_URL = "https://egoera.es";
const PUBLISHER_NAME = "Egoera";
const PUBLISHER_LOGO =
  "https://egoera.es/wp-content/uploads/2026/04/egoera-logo-brain-tree.png";
const AUTHOR_NAME = "Ander Bilbao Castejón";
const AUTHOR_URL = "https://egoera.es/sobre-nosotros";

/**
 * V5Schema · paquete completo de SEO estructurado para artículos.
 *
 * Renderiza:
 *  - JSON-LD Article (con Person + Organization anidados)
 *  - JSON-LD BreadcrumbList (Home → Cuaderno → Categoría → Post)
 *  - JSON-LD Person standalone (autor) — útil para knowledge panel
 *  - JSON-LD FAQPage solo si faqs.length > 0
 *  - <link rel="canonical">
 *  - hreflang stubs (es / eu / en / x-default) — el agente de i18n
 *    los reescribirá cuando existan las URLs traducidas.
 *
 * Las metas de OpenGraph/Twitter ya las añade `generateMetadata` del
 * page.tsx vía Next.js — aquí no se duplican.
 */
export function V5Schema({ post, canonicalUrl, faqs, wordCount }: Props) {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage ? [post.coverImage] : undefined,
    datePublished: post.dateISO,
    dateModified: post.dateISO,
    inLanguage: "es-ES",
    articleSection: post.category || "Cuaderno",
    wordCount,
    keywords:
      post.tags && post.tags.length > 0
        ? post.tags.join(", ")
        : (post.category ? [post.category, "psicología", "egoera"].join(", ") : "psicología, egoera"),
    author: {
      "@type": "Person",
      name: AUTHOR_NAME,
      url: AUTHOR_URL,
    },
    publisher: {
      "@type": "Organization",
      name: PUBLISHER_NAME,
      logo: {
        "@type": "ImageObject",
        url: PUBLISHER_LOGO,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Cuaderno",
        item: `${SITE_URL}/blog`,
      },
      ...(post.categorySlug && post.category
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: post.category,
              item: `${SITE_URL}/categoria/${post.categorySlug}`,
            },
          ]
        : []),
      {
        "@type": "ListItem",
        position: post.categorySlug && post.category ? 4 : 3,
        name: post.title,
        item: canonicalUrl,
      },
    ],
  };

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: AUTHOR_NAME,
    url: AUTHOR_URL,
    jobTitle: "Psicólogo",
    worksFor: {
      "@type": "Organization",
      name: PUBLISHER_NAME,
      url: SITE_URL,
    },
    sameAs: [
      "https://www.instagram.com/egoera.psikologia/",
      "https://www.linkedin.com/in/anderbilbaoc/",
    ],
  };

  const faqSchema =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: f.a,
            },
          })),
        }
      : null;

  return (
    <>
      {/* canonical + hreflang stubs (eu/en apuntan al mismo es por
          ahora; el agente de i18n los reescribe cuando haya traducción). */}
      <link rel="canonical" href={canonicalUrl} />
      <link rel="alternate" hrefLang="es" href={canonicalUrl} />
      <link rel="alternate" hrefLang="eu" href={canonicalUrl} />
      <link rel="alternate" hrefLang="en" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </>
  );
}

export default V5Schema;
