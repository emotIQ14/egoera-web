import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import { BRAIN_REGIONS, getRegionById, WP_TO_REGION } from "@/lib/egoera-data";

interface Props {
  params: Promise<{ id: string }>;
}

export const revalidate = 3600;

export function generateStaticParams() {
  return BRAIN_REGIONS.map((r) => ({ id: r.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const region = getRegionById(id);
  if (!region) return {};
  return {
    title: `${region.name} — ${region.cat}`,
    description: region.desc,
    openGraph: {
      title: `Egoera — ${region.name}`,
      description: region.desc,
    },
  };
}

const CARD_GLYPHS = ["◌", "◐", "✦", "❋", "◈", "◯", "◉", "◎"];

export default async function CategoriaPage({ params }: Props) {
  const { id } = await params;
  const region = getRegionById(id);
  if (!region) notFound();

  const allPosts = await getAllPosts();
  const posts = allPosts.filter(
    (p) => WP_TO_REGION[p.categorySlug] === region.id
  );
  const featured = posts[0];
  const rest = posts.slice(1);

  const c1 = region.color;
  const c2 = region.c2;

  return (
    <main
      className="pt-24 pb-24"
      style={
        {
          "--region-c": region.color,
          "--region-c2": region.c2,
        } as React.CSSProperties
      }
    >
      {/* Hero */}
      <section className="relative mx-auto max-w-[1400px] px-5 pt-20 md:px-12 md:pt-28">
        <Link
          href="/#cerebro"
          className="mb-12 inline-flex items-center gap-2.5 text-[13px] transition-colors hover:text-[color:var(--ink)]"
          style={{
            color: "var(--ink-faint)",
            letterSpacing: "0.04em",
            fontFamily: "var(--font-mono)",
          }}
        >
          <span>◀</span> Volver al mapa emocional
        </Link>

        <div
          className="grid items-end gap-14 border-b pb-14 lg:grid-cols-[1.4fr_1fr]"
          style={{ borderColor: "var(--rule)" }}
        >
          <div>
            <div className="kicker mb-7" style={{ color: region.color }}>
              {region.cat}
            </div>
            <h1
              className="leading-[0.95] tracking-[-0.025em]"
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: 300,
                fontSize: "clamp(56px, 7.5vw, 112px)",
              }}
            >
              {region.name.split("&")[0].trim()}{" "}
              <em className="italic" style={{ color: region.color }}>
                &
              </em>{" "}
              {region.name.split("&")[1]?.trim()}
            </h1>
          </div>
          <div className="flex flex-col gap-5">
            <p
              className="leading-[1.5]"
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontSize: 18,
                color: "var(--ink-dim)",
              }}
            >
              {region.desc}
            </p>
            <div
              className="flex gap-8 border-t pt-5 text-[11px] uppercase tracking-[0.18em]"
              style={{
                borderColor: "var(--rule)",
                color: "var(--ink-faint)",
              }}
            >
              <div>
                <strong
                  className="mb-1 block italic"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: 28,
                    color: "var(--ink)",
                    fontWeight: 300,
                  }}
                >
                  {posts.length}
                </strong>
                Articulos
              </div>
              <div>
                <strong
                  className="mb-1 block italic"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: 28,
                    color: "var(--ink)",
                    fontWeight: 300,
                  }}
                >
                  {Math.max(0, Math.floor(posts.length / 3))}
                </strong>
                Episodios
              </div>
              <div>
                <strong
                  className="mb-1 block italic"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: 28,
                    color: "var(--ink)",
                    fontWeight: 300,
                  }}
                >
                  2026
                </strong>
                Temporada
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured */}
      {featured && (
        <section className="mx-auto max-w-[1400px] px-5 pt-12 pb-20 md:px-12">
          <Link
            href={`/blog/${featured.slug}`}
            className="group grid gap-14 rounded-sm border p-10 no-underline lg:grid-cols-[1.2fr_1fr]"
            style={{
              borderColor: "var(--rule)",
              background:
                "linear-gradient(135deg, rgba(168,194,182,0.04) 0%, transparent 60%)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <span
              aria-hidden
              className="absolute left-0 top-0 bottom-0 w-[3px]"
              style={{ background: region.color }}
            />
            <div
              className="relative aspect-[16/10] overflow-hidden rounded-sm"
              style={{ background: "#111" }}
            >
              {featured.coverImage ? (
                <Image
                  src={featured.coverImage}
                  alt={featured.coverAlt || featured.title}
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-[1.04]"
                  style={{ filter: "brightness(0.9)" }}
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  unoptimized
                />
              ) : (
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${c1}, ${c2})`,
                  }}
                />
              )}
            </div>
            <div>
              <div
                className="mb-4 text-[11px] uppercase tracking-[0.22em]"
                style={{
                  color: region.color,
                  fontFamily: "var(--font-mono)",
                }}
              >
                Destacado en esta region
              </div>
              <h2
                className="mb-5 leading-[1.15] tracking-[-0.015em]"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(28px, 2.5vw, 40px)",
                  fontWeight: 300,
                }}
              >
                {featured.title}
              </h2>
              {featured.excerpt && (
                <p
                  className="mb-6 leading-[1.7]"
                  style={{
                    color: "var(--ink-dim)",
                    fontSize: 15,
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  {featured.excerpt}
                </p>
              )}
              <div
                className="flex gap-4 border-t pt-5 text-[12px]"
                style={{
                  borderColor: "var(--rule)",
                  color: "var(--ink-faint)",
                  letterSpacing: "0.06em",
                  fontFamily: "var(--font-mono)",
                }}
              >
                <span>{featured.date}</span>
                <span>·</span>
                <span>{featured.readTime}</span>
                <span>·</span>
                <span>{featured.author}</span>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Grid */}
      <section className="mx-auto max-w-[1400px] px-5 pb-28 md:px-12">
        <div
          className="mb-12 flex items-baseline justify-between border-b pb-5"
          style={{ borderColor: "var(--rule)" }}
        >
          <h3
            className="tracking-[-0.02em]"
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 300,
              fontSize: 32,
            }}
          >
            Todos los{" "}
            <em className="italic" style={{ color: region.color }}>
              contenidos
            </em>
          </h3>
          <span
            className="text-[12px] uppercase tracking-[0.2em]"
            style={{
              color: "var(--ink-faint)",
              fontFamily: "var(--font-mono)",
            }}
          >
            {posts.length} entradas
          </span>
        </div>

        {rest.length === 0 && !featured ? (
          <p
            className="py-16 text-center"
            style={{
              color: "var(--ink-faint)",
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
            }}
          >
            Esta region esta en construccion. Pronto publicaremos aqui.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((post, i) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col gap-4 no-underline"
              >
                <div
                  className="relative aspect-[4/3] overflow-hidden rounded-sm"
                  style={{ background: "#151a18" }}
                >
                  {post.coverImage ? (
                    <Image
                      src={post.coverImage}
                      alt={post.coverAlt || post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-all duration-700 group-hover:scale-[1.05]"
                      style={{ filter: "brightness(0.85)" }}
                      unoptimized
                    />
                  ) : (
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(135deg, ${c1}, ${c2})`,
                      }}
                    />
                  )}
                  <div
                    className="absolute inset-0 flex items-center justify-center text-[120px]"
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontStyle: "italic",
                      color: "rgba(244,239,230,0.10)",
                    }}
                  >
                    {CARD_GLYPHS[i % CARD_GLYPHS.length]}
                  </div>
                  <span
                    className="absolute bottom-3.5 right-3.5 rounded-sm px-2.5 py-1 text-[11px] backdrop-blur"
                    style={{
                      background: "rgba(10,13,12,0.8)",
                      color: "var(--ink)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {post.readTime}
                  </span>
                </div>
                <div
                  className="text-[11px] uppercase tracking-[0.2em]"
                  style={{
                    color: region.color,
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {region.cat}
                </div>
                <h4
                  className="leading-[1.25] transition-colors group-hover:text-[color:var(--accent)]"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: 22,
                    fontWeight: 400,
                  }}
                >
                  {post.title}
                </h4>
                {post.excerpt && (
                  <p
                    className="line-clamp-3 leading-[1.55]"
                    style={{
                      color: "var(--ink-dim)",
                      fontSize: "13.5px",
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    {post.excerpt}
                  </p>
                )}
                <div
                  className="flex gap-3 text-[11px]"
                  style={{
                    color: "var(--ink-faint)",
                    letterSpacing: "0.06em",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  <span>{post.date}</span>
                  <span>·</span>
                  <span>{post.readTime}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Related regions */}
      <section
        className="border-t px-5 py-24 md:px-12"
        style={{
          borderColor: "var(--rule)",
          background: "var(--bg-2)",
        }}
      >
        <div className="mx-auto max-w-[1400px]">
          <h4
            className="mb-10 tracking-[-0.02em]"
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 300,
              fontSize: 32,
            }}
          >
            Explora otras{" "}
            <em className="italic" style={{ color: "var(--accent)" }}>
              regiones
            </em>{" "}
            del mapa
          </h4>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {BRAIN_REGIONS.filter((r) => r.id !== region.id).map((r) => (
              <Link
                key={r.id}
                href={`/categoria/${r.id}`}
                className="rounded-sm border p-6 transition-all hover:-translate-y-1"
                style={{
                  borderColor: "var(--rule)",
                  background: "rgba(244,239,230,0.02)",
                }}
              >
                <span
                  className="mb-4 block h-2 w-2 rounded-full"
                  style={{
                    background: r.color,
                    boxShadow: `0 0 14px ${r.color}`,
                  }}
                />
                <div
                  className="mb-1.5 leading-[1.2]"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: 17,
                  }}
                >
                  {r.name}
                </div>
                <div
                  className="text-[11px] uppercase tracking-[0.14em]"
                  style={{
                    color: "var(--ink-faint)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {r.cat}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
