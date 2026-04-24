import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getAllPosts,
  getPostBySlug,
  getPostsByCategory,
} from "@/lib/blog";
import { BRAIN_REGIONS, WP_TO_REGION } from "@/lib/egoera-data";
import { ReadingProgress } from "@/components/editorial/ReadingProgress";
import { AdSlot } from "@/components/blog/AdSlot";
import { BuyMeCoffee } from "@/components/blog/BuyMeCoffee";
import { AffiliateBooks } from "@/components/blog/AffiliateBooks";
import { PremiumCTA } from "@/components/monetization/PremiumCTA";
import { SponsoredSlot } from "@/components/monetization/SponsoredSlot";
import { splitContentForAds } from "@/lib/content-inject";

interface Props {
  params: Promise<{ slug: string }>;
}

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

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const regionId = WP_TO_REGION[post.categorySlug];
  const region = BRAIN_REGIONS.find((r) => r.id === regionId);
  const c1 = region?.color ?? "#a8c2b6";
  const c2 = region?.c2 ?? "#5a7a6e";
  const accent = region?.color ?? "var(--accent)";

  const allRelated = post.categorySlug
    ? await getPostsByCategory(post.categorySlug)
    : [];
  const related = allRelated.filter((p) => p.slug !== post.slug).slice(0, 2);

  const { intro, middle, end } = splitContentForAds(post.content);

  const glyph = "◌";
  const archiveNum = "N\u00BA " + post.slug.length.toString().padStart(3, "0");

  return (
    <>
      <ReadingProgress />

      <article
        className="pb-24 pt-20"
        style={
          {
            "--region-c": accent,
          } as React.CSSProperties
        }
      >
        {/* Header */}
        <header className="relative mx-auto max-w-[880px] px-5 pt-16 pb-8 md:px-12">
          <div
            className="mb-10 flex flex-wrap gap-2.5 text-[11px] uppercase tracking-[0.18em]"
            style={{
              color: "var(--ink-faint)",
              fontFamily: "var(--font-mono)",
            }}
          >
            <Link
              href="/"
              className="hover:text-[color:var(--accent)]"
              style={{ color: "var(--ink-dim)" }}
            >
              vlog
            </Link>
            <span style={{ color: "var(--accent-dim)" }}>/</span>
            {region ? (
              <Link
                href={`/categoria/${region.id}`}
                className="hover:text-[color:var(--accent)]"
                style={{ color: "var(--ink-dim)" }}
              >
                {region.name.toLowerCase()}
              </Link>
            ) : (
              <Link
                href="/blog"
                className="hover:text-[color:var(--accent)]"
                style={{ color: "var(--ink-dim)" }}
              >
                archivo
              </Link>
            )}
            <span style={{ color: "var(--accent-dim)" }}>/</span>
            <span className="truncate max-w-[50vw]">{post.title}</span>
          </div>

          {post.category && (
            <span
              className="mb-7 inline-flex items-center gap-2.5 rounded-full border px-3.5 py-2 text-[11px] uppercase tracking-[0.22em]"
              style={{
                borderColor: `${accent}55`,
                color: accent,
                background: `${accent}10`,
                fontFamily: "var(--font-mono)",
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  background: accent,
                  boxShadow: `0 0 6px ${accent}`,
                }}
              />
              {post.category}
              {region ? ` · ${region.meta}` : ""}
            </span>
          )}

          <h1
            className="mb-7 leading-none tracking-[-0.035em]"
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 300,
              fontSize: "clamp(44px, 6vw, 84px)",
            }}
          >
            {post.title}
          </h1>

          {post.excerpt && (
            <p
              className="mb-14 max-w-[720px] leading-[1.5]"
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontSize: "clamp(18px, 2vw, 24px)",
                color: "var(--ink-dim)",
              }}
            >
              {post.excerpt}
            </p>
          )}

          <div
            className="flex flex-wrap items-center gap-8 border-y py-7"
            style={{ borderColor: "var(--rule)" }}
          >
            <div className="flex min-w-[240px] flex-1 items-center gap-3.5">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full"
                style={{
                  background: `radial-gradient(circle at 35% 30%, #d6e4dc, var(--accent-dim))`,
                  color: "var(--bg)",
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  fontSize: 20,
                }}
              >
                A
              </div>
              <div>
                <div
                  className="text-[14px] font-medium"
                  style={{ color: "var(--ink)" }}
                >
                  {post.author || "Ander Bilbao Castejon"}
                </div>
                <div
                  className="mt-0.5 text-[12px]"
                  style={{ color: "var(--ink-faint)" }}
                >
                  Psicologo · Egoera
                </div>
              </div>
            </div>
            <MetaCol label="Publicado" value={post.date} />
            <MetaCol label="Lectura" value={post.readTime} />
            <MetaCol label="Archivo" value={archiveNum} />
          </div>
        </header>

        {/* Cover */}
        <section className="mx-auto mb-16 max-w-[1200px] px-5 md:px-12">
          <div
            className="relative aspect-[16/9] overflow-hidden rounded-sm"
            style={{
              background: `linear-gradient(135deg, ${c1}, ${c2})`,
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, transparent 40%, rgba(15,19,17,0.5))",
              }}
            />
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none"
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontWeight: 300,
                fontSize: "clamp(240px, 40vw, 520px)",
                color: "rgba(244,239,230,0.08)",
                lineHeight: 0.7,
              }}
            >
              {glyph}
            </div>
            <div
              className="absolute right-6 top-5 inline-flex items-center gap-2.5 rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] backdrop-blur"
              style={{
                borderColor: "rgba(244,239,230,0.3)",
                color: "rgba(244,239,230,0.7)",
                fontFamily: "var(--font-mono)",
              }}
            >
              Egoera · {archiveNum}
            </div>
            <div
              className="absolute bottom-5 left-6 text-[10px] uppercase tracking-[0.18em]"
              style={{
                color: "rgba(244,239,230,0.7)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {post.category} — {region?.name ?? ""}
            </div>
          </div>
        </section>

        {/* Body */}
        <div className="mx-auto max-w-[720px] px-5 md:px-12">
          {intro && (
            <div
              className="prose-egoera"
              dangerouslySetInnerHTML={{ __html: intro }}
            />
          )}

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

          {middle && end && <PremiumCTA source={`post:${post.slug}`} />}

          {end && (
            <div
              className="prose-egoera"
              dangerouslySetInnerHTML={{ __html: end }}
            />
          )}

          {/* End signature */}
          <div
            className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t pt-10"
            style={{ borderColor: "var(--rule)" }}
          >
            <div
              className="italic"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 32,
                color: "var(--accent)",
              }}
            >
              ◎
            </div>
            <div
              className="max-w-[360px] text-right text-[11px] leading-[1.7]"
              style={{
                color: "var(--ink-faint)",
                letterSpacing: "0.08em",
                fontFamily: "var(--font-mono)",
              }}
            >
              Texto publicado en Egoera, el vlog personal de Ander Bilbao desde
              Donostia. Psicologia, despacio.
            </div>
          </div>
        </div>

        {/* End-of-article monetization stack */}
        <div className="mx-auto mt-10 max-w-[720px] px-5 md:px-12">
          <AdSlot slot="2222222222" display="native" />
          <AffiliateBooks
            categorySlug={post.categorySlug}
            source={`post:${post.slug}`}
          />
          <SponsoredSlot source={`post:${post.slug}`} />
          <BuyMeCoffee countRead source={`post:${post.slug}`} />
        </div>

        {/* Next section */}
        {related.length > 0 && (
          <section
            className="mx-auto mt-20 max-w-[1200px] border-t px-5 pb-20 pt-16 md:px-12"
            style={{ borderColor: "var(--rule)" }}
          >
            <div
              className="mb-6 text-[11px] uppercase tracking-[0.22em]"
              style={{
                color: accent,
                fontFamily: "var(--font-mono)",
              }}
            >
              Seguir leyendo sobre {region?.name ?? "este tema"}
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              {related.map((n) => (
                <Link
                  key={n.slug}
                  href={`/blog/${n.slug}`}
                  className="relative flex flex-col gap-4 rounded-sm border p-8 transition-all hover:-translate-y-0.5"
                  style={{
                    borderColor: "var(--rule)",
                    background: "rgba(12,16,14,0.4)",
                  }}
                >
                  <div
                    className="text-[10px] uppercase tracking-[0.2em]"
                    style={{
                      color: accent,
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {n.category} · {n.readTime}
                  </div>
                  <h4
                    className="leading-[1.2] tracking-[-0.01em]"
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: 28,
                      fontWeight: 400,
                    }}
                  >
                    {n.title}
                  </h4>
                  {n.excerpt && (
                    <p
                      className="line-clamp-2"
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontStyle: "italic",
                        fontSize: 15,
                        color: "var(--ink-faint)",
                      }}
                    >
                      {n.excerpt}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

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
                "@type": "Person",
                name: "Ander Bilbao Castejon",
                url: "https://egoera.es",
              },
              publisher: {
                "@type": "Organization",
                name: "Egoera",
                logo: {
                  "@type": "ImageObject",
                  url: "https://egoera.es/egoera-logo.png",
                },
              },
              datePublished: post.dateISO,
              mainEntityOfPage: `https://egoera.es/blog/${post.slug}`,
            }),
          }}
        />
      </article>
    </>
  );
}

function MetaCol({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex flex-col"
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "var(--ink-faint)",
      }}
    >
      <span style={{ color: "var(--accent-dim)" }}>{label}</span>
      <span
        className="mt-1 text-[13px] normal-case"
        style={{
          color: "var(--ink)",
          letterSpacing: 0,
          fontFamily: "var(--font-sans)",
          fontWeight: 400,
        }}
      >
        {value}
      </span>
    </div>
  );
}
