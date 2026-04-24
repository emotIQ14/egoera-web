import { notFound } from "next/navigation";
import {
  getAllPosts,
  getPostBySlug,
  getPostsByCategory,
  CATEGORIES,
} from "@/lib/blog";
import Link from "next/link";
import { Clock, ArrowLeft, Share2 } from "lucide-react";
import { AdSlot } from "@/components/blog/AdSlot";
import { BuyMeCoffee } from "@/components/blog/BuyMeCoffee";
import { AffiliateBooks } from "@/components/blog/AffiliateBooks";
import { PremiumCTA } from "@/components/monetization/PremiumCTA";
import { SponsoredSlot } from "@/components/monetization/SponsoredSlot";
import { splitContentForAds } from "@/lib/content-inject";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

// Regenerate post pages hourly.
export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.dateISO,
      authors: [post.author],
      tags: post.tags,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const catInfo = CATEGORIES[post.categorySlug];
  const allRelated = post.categorySlug
    ? await getPostsByCategory(post.categorySlug)
    : [];
  const relatedPosts = allRelated.filter((p) => p.slug !== post.slug).slice(0, 3);

  // Divide el HTML del articulo para intercalar slots
  const { intro, middle, end } = splitContentForAds(post.content);

  return (
    <article className="pt-24 pb-20">
      {/* Header */}
      <header className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto mb-12">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-grey-text hover:text-teal transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al blog
        </Link>

        <div className="flex items-center gap-3 mb-4">
          {post.category && (
            <span
              className="px-3 py-1 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: catInfo?.color ?? "#6BA3BE" }}
            >
              {post.category}
            </span>
          )}
          <span className="text-sm text-grey-text">{post.date}</span>
          <span className="flex items-center gap-1 text-sm text-grey-text">
            <Clock className="w-3.5 h-3.5" />
            {post.readTime}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-[family-name:var(--font-heading)] text-dark-text leading-tight">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="text-lg text-grey-text mt-4 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center">
              <span className="text-teal font-bold text-sm">EP</span>
            </div>
            <div>
              <p className="text-sm font-medium text-dark-text">{post.author}</p>
              <p className="text-xs text-grey-text">Equipo Egoera</p>
            </div>
          </div>
          <button
            className="p-2 rounded-lg hover:bg-muted transition-colors text-grey-text hover:text-teal"
            aria-label="Compartir"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Content with interleaved monetization slots */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        {intro && (
          <div
            className="prose-egoera"
            dangerouslySetInnerHTML={{ __html: intro }}
          />
        )}

        {/* After intro: in-article ad + native affiliate */}
        {intro && middle && (
          <>
            <AdSlot slot="1111111111" display="in-article" />
            <AffiliateBooks
              categorySlug={post.categorySlug}
              source={`post:${post.slug}`}
              variant="native"
            />
          </>
        )}

        {middle && (
          <div
            className="prose-egoera"
            dangerouslySetInnerHTML={{ __html: middle }}
          />
        )}

        {/* Mid-article: premium CTA between h2s */}
        {middle && end && (
          <PremiumCTA source={`post:${post.slug}`} />
        )}

        {end && (
          <div
            className="prose-egoera"
            dangerouslySetInnerHTML={{ __html: end }}
          />
        )}
      </div>

      {/* End-of-article monetization stack */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <AdSlot slot="2222222222" display="native" />
        <AffiliateBooks
          categorySlug={post.categorySlug}
          source={`post:${post.slug}`}
        />
        <SponsoredSlot source={`post:${post.slug}`} />
        <BuyMeCoffee countRead source={`post:${post.slug}`} />
      </div>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto mt-12 pt-8 border-t border-border">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-muted text-xs text-grey-text"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <div className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto mt-16">
          <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-dark-text mb-6">
            Tambien te puede interesar
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedPosts.map((rp) => (
              <Link
                key={rp.slug}
                href={`/blog/${rp.slug}`}
                className="p-4 bg-muted rounded-xl hover:bg-teal/5 transition-colors group"
              >
                <h3 className="text-sm font-semibold text-dark-text group-hover:text-teal transition-colors line-clamp-2">
                  {rp.title}
                </h3>
                <p className="text-xs text-grey-text mt-2 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {rp.readTime}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto mt-16">
        <div className="bg-gradient-to-br from-teal/5 to-mint/10 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold font-[family-name:var(--font-heading)] text-dark-text mb-3">
            Registra como te sientes hoy
          </h3>
          <p className="text-sm text-grey-text mb-5">
            Usa nuestro Diario Emocional para llevar un registro de tu estado de animo.
          </p>
          <Link
            href="/diario"
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal text-white rounded-full text-sm font-medium hover:bg-teal/90 transition-colors"
          >
            Abrir Diario Emocional
          </Link>
        </div>
      </div>

      {/* Schema.org Article markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.excerpt,
            image: post.coverImage ? [post.coverImage] : undefined,
            author: {
              "@type": "Organization",
              name: "Egoera Psikologia",
              url: "https://egoera.es",
            },
            publisher: {
              "@type": "Organization",
              name: "Egoera Psikologia",
            },
            datePublished: post.dateISO,
            mainEntityOfPage: `https://egoera.es/blog/${post.slug}`,
            keywords: post.tags.join(", "),
          }),
        }}
      />
    </article>
  );
}
