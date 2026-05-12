import type { Metadata } from "next";

import { EgoeraNav } from "@/components/egoera/EgoeraNav";
import { EgoeraFooter } from "@/components/egoera/EgoeraFooter";
import { getAllPosts } from "@/lib/blog";
import { WP_TO_REGION, BRAIN_REGIONS, type BrainRegion } from "@/lib/egoera-data";
import { getCurrentLocale } from "@/i18n/getCurrentLocale";
import { getDictionary } from "@/i18n/getDictionary";
import { buildHreflangAlternates, SITE_ORIGIN } from "@/i18n/hreflang";

import { SentirClient, type PostByRegion } from "./SentirClient";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getCurrentLocale();
  const dict = await getDictionary(locale);
  const alternates = buildHreflangAlternates("/sentir");
  return {
    title: dict.sentir.metaTitle,
    description: dict.sentir.metaDescription,
    keywords: [
      "brújula emocional",
      "test emocional",
      "cómo me siento",
      "psicología online",
      "emociones",
      "diario emocional",
      "ansiedad",
      "tristeza",
      "autoconocimiento",
      "Egoera",
      "psicólogo Bilbao",
    ],
    alternates,
    openGraph: {
      title: dict.sentir.metaTitle,
      description: dict.sentir.metaDescription,
      url: `${SITE_ORIGIN}/sentir`,
      siteName: "Egoera",
      type: "website",
      locale: locale === "eu" ? "eu_ES" : locale === "en" ? "en" : "es_ES",
    },
    twitter: {
      card: "summary_large_image",
      title: dict.sentir.metaTitle,
      description: dict.sentir.metaDescription,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

/**
 * /sentir — Brújula Emocional.
 *
 * Server component que precarga el artículo más reciente de cada
 * región cerebral (uno por categoría WP), de forma que el cliente
 * pueda mostrar la recomendación final sin un fetch extra. Esto
 * además permite que la página sea estática-revalidada (1h),
 * coherente con el resto del vlog.
 */
export default async function SentirPage() {
  const locale = await getCurrentLocale();
  const dict = await getDictionary(locale);

  const allPosts = await getAllPosts();
  const postsByRegion: PostByRegion = {
    amygdala: undefined,
    prefrontal: undefined,
    hippocampus: undefined,
    insula: undefined,
    accumbens: undefined,
    cerebellum: undefined,
  };

  for (const region of BRAIN_REGIONS) {
    const regionPost = allPosts.find(
      (p) => WP_TO_REGION[p.categorySlug] === region.id
    );
    if (regionPost) {
      postsByRegion[region.id as BrainRegion["id"]] = {
        slug: regionPost.slug,
        title: regionPost.title,
        excerpt: regionPost.excerpt,
        readTime: regionPost.readTime,
        coverImage: regionPost.coverImage ?? null,
      };
    }
  }

  /**
   * Multi-schema JSON-LD: declaramos la app, un HowTo (3 pasos) y un
   * BreadcrumbList. Los tres ayudan a Google a entender el contenido y
   * a mostrar mejores rich snippets.
   */
  const webApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Brújula Emocional · Egoera",
    applicationCategory: "HealthApplication",
    description: dict.sentir.metaDescription,
    operatingSystem: "Web",
    url: `${SITE_ORIGIN}/sentir`,
    inLanguage: locale,
    isAccessibleForFree: true,
    publisher: {
      "@type": "Organization",
      name: "Egoera Psikología",
      url: SITE_ORIGIN,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
  };

  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: dict.sentir.heroTitle,
    description: dict.sentir.heroLeadFirst,
    totalTime: "PT4M",
    inLanguage: locale,
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: dict.sentir.introStep1Title,
        text: dict.sentir.introStep1Body,
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: dict.sentir.introStep2Title,
        text: dict.sentir.introStep2Body,
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: dict.sentir.introStep3Title,
        text: dict.sentir.introStep3Body,
      },
    ],
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: dict.nav.home,
        item: SITE_ORIGIN,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: dict.sentir.kicker,
        item: `${SITE_ORIGIN}/sentir`,
      },
    ],
  };

  return (
    <>
      <EgoeraNav active="sentir" />
      <SentirClient postsByRegion={postsByRegion} dict={dict.sentir} />
      <EgoeraFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApp) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </>
  );
}
