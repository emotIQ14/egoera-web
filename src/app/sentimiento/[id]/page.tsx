import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import {
  FEELINGS,
  getFeelingById,
  getRegionById,
  WP_TO_REGION,
} from "@/lib/egoera-data";

interface Props {
  params: Promise<{ id: string }>;
}

export const revalidate = 3600;

export function generateStaticParams() {
  return FEELINGS.map((f) => ({ id: f.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const feeling = getFeelingById(id);
  if (!feeling) return {};
  return {
    title: `${feeling.name} — Estado`,
    description: feeling.desc,
    openGraph: {
      title: `Egoera — ${feeling.name}`,
      description: feeling.desc,
    },
  };
}

export default async function SentimientoPage({ params }: Props) {
  const { id } = await params;
  const feeling = getFeelingById(id);
  if (!feeling) notFound();

  const region = getRegionById(feeling.region);

  const allPosts = await getAllPosts();
  const regionPosts = region
    ? allPosts.filter((p) => WP_TO_REGION[p.categorySlug] === region.id)
    : allPosts;

  return (
    <main
      className="pt-20 pb-24"
      style={
        {
          "--c1": feeling.c1,
          "--c2": feeling.c2,
        } as React.CSSProperties
      }
    >
      {/* Feeling hero */}
      <section className="relative overflow-hidden border-b pt-16 pb-12 md:pb-16">
        <div
          aria-hidden
          className="absolute inset-0 opacity-35"
          style={{
            background: `radial-gradient(ellipse at 70% 30%, ${feeling.c2}, transparent 55%), radial-gradient(ellipse at 20% 80%, ${feeling.c1}, transparent 60%)`,
          }}
        />
        <div className="relative mx-auto grid max-w-[1400px] items-end gap-14 px-5 md:px-12 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <div
              className="mb-8 text-[11px] uppercase tracking-[0.18em]"
              style={{
                color: "var(--ink-faint)",
                fontFamily: "var(--font-mono)",
              }}
            >
              <Link
                href="/"
                style={{ color: "var(--ink-dim)" }}
                className="hover:text-[color:var(--accent)]"
              >
                vlog
              </Link>
              <span className="mx-3" style={{ color: "var(--accent-dim)" }}>
                /
              </span>
              <Link
                href="/#sentimientos"
                style={{ color: "var(--ink-dim)" }}
                className="hover:text-[color:var(--accent)]"
              >
                sentimientos
              </Link>
              <span className="mx-3" style={{ color: "var(--accent-dim)" }}>
                /
              </span>
              <span>{feeling.name}</span>
            </div>
            <div
              className="kicker mb-4"
              style={{ color: "var(--accent)" }}
            >
              estado · {feeling.meta}
            </div>
            <h1
              className="mb-5 leading-[0.85] tracking-[-0.04em]"
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: 300,
                fontSize: "clamp(80px, 14vw, 220px)",
              }}
            >
              <em className="italic" style={{ color: "var(--accent)" }}>
                {feeling.name}
              </em>
              .
            </h1>
            <p
              className="max-w-[520px] leading-[1.5]"
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontSize: 20,
                color: "var(--ink-dim)",
              }}
            >
              {feeling.desc}
            </p>
          </div>

          <div>
            <div
              className="grid grid-cols-3 gap-6 rounded-sm border p-6 backdrop-blur"
              style={{
                borderColor: "var(--rule)",
                background: "rgba(12,16,14,0.7)",
              }}
            >
              <Stat
                num={String(regionPosts.length).padStart(2, "0")}
                label="Articulos"
              />
              <Stat
                num={String(Math.max(0, Math.floor(regionPosts.length / 3))).padStart(
                  2,
                  "0"
                )}
                label="Episodios"
              />
              <Stat num="2026" label="Temporada" />
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {feeling.related.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border px-3 py-1.5 text-[12px]"
                  style={{
                    borderColor: "var(--rule)",
                    color: "var(--ink-dim)",
                    background: "rgba(244,239,230,0.03)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
            {region && (
              <Link
                href={`/categoria/${region.id}`}
                className="mt-6 inline-flex items-center gap-2 text-[13px] underline decoration-[color:var(--accent)]/40 underline-offset-4 hover:decoration-[color:var(--accent)]"
                style={{
                  color: "var(--accent)",
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.1em",
                }}
              >
                Region: {region.cat} →
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Article list */}
      <section className="mx-auto max-w-[1400px] px-5 py-20 md:px-12">
        <div
          className="mb-8 flex items-end justify-between border-b pb-5"
          style={{ borderColor: "var(--rule)", borderStyle: "dashed" }}
        >
          <h3
            className="tracking-[-0.02em]"
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 300,
              fontSize: 32,
            }}
          >
            Articulos para{" "}
            <em className="italic" style={{ color: "var(--accent)" }}>
              acompañarte
            </em>
          </h3>
          <span
            className="text-[11px] uppercase tracking-[0.18em]"
            style={{
              color: "var(--ink-faint)",
              fontFamily: "var(--font-mono)",
            }}
          >
            {regionPosts.length} archivados · {feeling.name}
          </span>
        </div>

        {regionPosts.length === 0 ? (
          <p
            className="py-20 text-center"
            style={{
              color: "var(--ink-faint)",
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
            }}
          >
            Aun no hay articulos archivados en este estado. Vuelve pronto.
          </p>
        ) : (
          <div
            className="grid grid-cols-1 gap-0 border-t"
            style={{ borderColor: "var(--rule)" }}
          >
            {regionPosts.map((post, i) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group grid items-center gap-6 border-b py-6 transition-all hover:pl-5 md:grid-cols-[60px_1fr_140px_120px_80px]"
                style={{
                  borderColor: "var(--rule)",
                  borderLeft: "2px solid transparent",
                }}
              >
                <div
                  className="text-[11px] tracking-[0.12em]"
                  style={{
                    color: "var(--accent-dim)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {String(i + 1).padStart(3, "0")}
                </div>
                <div className="flex flex-col gap-1.5">
                  <div
                    className="leading-[1.2] tracking-[-0.01em]"
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: 22,
                      fontWeight: 400,
                    }}
                  >
                    {post.title}
                  </div>
                  {post.excerpt && (
                    <div
                      className="line-clamp-1 leading-[1.4]"
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontStyle: "italic",
                        fontSize: 14,
                        color: "var(--ink-faint)",
                      }}
                    >
                      {post.excerpt}
                    </div>
                  )}
                </div>
                <div
                  className="hidden text-[10px] uppercase tracking-[0.18em] md:block"
                  style={{
                    color: "var(--accent)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {post.category}
                </div>
                <div
                  className="hidden text-[11px] uppercase tracking-[0.1em] md:block"
                  style={{
                    color: "var(--ink-faint)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {post.date}
                </div>
                <div
                  className="hidden text-right text-[11px] md:block"
                  style={{
                    color: "var(--ink-dim)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {post.readTime}{" "}
                  <span
                    className="ml-2 inline-block transition-transform group-hover:translate-x-1"
                    style={{ color: "var(--accent)" }}
                  >
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Related feelings */}
      <section
        className="border-t px-5 py-20 md:px-12"
        style={{ borderColor: "var(--rule)" }}
      >
        <div className="mx-auto max-w-[1400px]">
          <h3
            className="mb-8 tracking-[-0.02em]"
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 300,
              fontSize: 40,
            }}
          >
            Otros{" "}
            <em className="italic" style={{ color: "var(--accent)" }}>
              estados
            </em>{" "}
            cercanos
          </h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {FEELINGS.filter((f) => f.id !== feeling.id)
              .slice(0, 4)
              .map((f) => (
                <Link
                  key={f.id}
                  href={`/sentimiento/${f.id}`}
                  className="relative overflow-hidden rounded-sm border p-8 transition-all hover:-translate-y-1"
                  style={{
                    borderColor: "var(--rule)",
                    background: "rgba(12,16,14,0.3)",
                  }}
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 opacity-[0.08]"
                    style={{
                      background: `linear-gradient(135deg, ${f.c1}, ${f.c2})`,
                    }}
                  />
                  <div
                    className="relative mb-2 italic"
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: 28,
                      fontWeight: 300,
                      color: "var(--accent)",
                    }}
                  >
                    {f.name}
                  </div>
                  <div
                    className="relative text-[10px] uppercase tracking-[0.18em]"
                    style={{
                      color: "var(--ink-faint)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {f.count} articulos
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function Stat({ num, label }: { num: string; label: string }) {
  return (
    <div>
      <div
        className="leading-none"
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: 36,
          fontWeight: 300,
          color: "var(--accent)",
        }}
      >
        {num}
      </div>
      <div
        className="mt-1.5 text-[10px] uppercase tracking-[0.18em]"
        style={{
          color: "var(--ink-faint)",
          fontFamily: "var(--font-mono)",
        }}
      >
        {label}
      </div>
    </div>
  );
}
