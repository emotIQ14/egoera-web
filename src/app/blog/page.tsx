import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import { BRAIN_REGIONS, WP_TO_REGION } from "@/lib/egoera-data";

export const metadata: Metadata = {
  title: "Archivo — Todos los articulos",
  description:
    "Archivo completo del vlog de Egoera. Articulos sobre ansiedad, autoconocimiento, duelo, vinculos, cuerpo y ritmo, publicados cada jueves por Ander Bilbao desde Donostia.",
  openGraph: {
    title: "Archivo — Egoera",
    description:
      "Todas las entradas del vlog de Egoera por Ander Bilbao.",
  },
};

export const revalidate = 3600;

const CARD_GLYPHS = ["◌", "◐", "✦", "❋", "◈", "◯", "◉", "◎"];

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <main className="pt-28 pb-24">
      <header className="mx-auto max-w-[1400px] px-5 pt-16 md:px-12 md:pt-24">
        <div className="kicker mb-8">Archivo · 2026</div>
        <h1
          className="mb-6 leading-[0.95] tracking-[-0.03em]"
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 300,
            fontSize: "clamp(52px, 7vw, 112px)",
          }}
        >
          Todos los{" "}
          <em className="italic" style={{ color: "var(--accent)" }}>
            articulos.
          </em>
        </h1>
        <p
          className="max-w-[620px] leading-[1.6]"
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: 20,
            color: "var(--ink-dim)",
          }}
        >
          {posts.length} entradas publicadas. Filtra por region emocional o
          navega en orden cronologico.
        </p>
      </header>

      {/* Regions filter strip */}
      <nav
        className="mx-auto mt-14 flex max-w-[1400px] flex-wrap gap-2.5 border-y px-5 py-6 md:px-12"
        style={{ borderColor: "var(--rule)" }}
        aria-label="Regiones"
      >
        <span
          className="mr-3 self-center text-[11px] uppercase tracking-[0.22em]"
          style={{
            color: "var(--ink-faint)",
            fontFamily: "var(--font-mono)",
          }}
        >
          Regiones
        </span>
        {BRAIN_REGIONS.map((r) => (
          <Link
            key={r.id}
            href={`/categoria/${r.id}`}
            className="rounded-full border px-4 py-2 text-[13px] transition-all hover:border-[color:var(--accent)] hover:text-[color:var(--ink)]"
            style={{
              borderColor: "var(--rule)",
              color: "var(--ink-dim)",
              fontFamily: "var(--font-sans)",
            }}
          >
            {r.name}
          </Link>
        ))}
      </nav>

      {/* Grid */}
      <section className="mx-auto max-w-[1400px] px-5 py-16 md:px-12">
        {posts.length === 0 ? (
          <p
            className="py-24 text-center"
            style={{
              color: "var(--ink-faint)",
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
            }}
          >
            No hay articulos todavia. Vuelve pronto.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => {
              const region = BRAIN_REGIONS.find(
                (r) => r.id === WP_TO_REGION[post.categorySlug]
              );
              const c1 = region?.color ?? "#a8c2b6";
              const c2 = region?.c2 ?? "#5a7a6e";
              return (
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
                      className="absolute inset-0 flex items-center justify-center text-[140px]"
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontStyle: "italic",
                        color: "rgba(244,239,230,0.10)",
                      }}
                    >
                      {CARD_GLYPHS[i % CARD_GLYPHS.length]}
                    </div>
                    <span
                      className="absolute left-3.5 top-3.5 rounded-sm px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] backdrop-blur"
                      style={{
                        background: "rgba(10,13,12,0.85)",
                        color: "var(--ink)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      Articulo
                    </span>
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

                  {region && (
                    <div
                      className="text-[11px] uppercase tracking-[0.2em]"
                      style={{
                        color: region.color,
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {region.cat}
                    </div>
                  )}
                  <h3
                    className="leading-[1.25] tracking-[-0.005em] transition-colors group-hover:text-[color:var(--accent)]"
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: 22,
                      fontWeight: 400,
                    }}
                  >
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p
                      className="leading-[1.55] line-clamp-3"
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
                    className="flex gap-3.5 text-[11px]"
                    style={{
                      color: "var(--ink-faint)",
                      letterSpacing: "0.06em",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    <span>{post.date}</span>
                    <span>·</span>
                    <span>{post.author}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
