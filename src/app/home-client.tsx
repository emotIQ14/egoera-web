"use client";

import Link from "next/link";
import Image from "next/image";
import { GameBoySelector } from "@/components/gameboy/GameBoySelector";
import { BrainMap } from "@/components/brain/BrainMap";
import { BRAIN_REGIONS, WP_TO_REGION } from "@/lib/egoera-data";
import type { BlogPost } from "@/lib/blog";

interface Props {
  posts: BlogPost[];
}

/**
 * Asocia cada post al color de su region; si no encuentra una, cae en
 * el verde agua por defecto.
 */
function regionFor(post: BlogPost) {
  const id = WP_TO_REGION[post.categorySlug];
  return BRAIN_REGIONS.find((r) => r.id === id);
}

const CARD_GLYPHS = ["◌", "◐", "✦", "❋", "◈", "◯", "◉", "◎"];

export default function HomeClient({ posts }: Props) {
  const latest = posts.slice(0, 6);
  const feature = latest[0];

  return (
    <>
      {/* ───────── HERO ───────── */}
      <section
        id="hero"
        className="relative flex min-h-screen flex-col justify-center overflow-hidden px-5 pt-32 pb-24 md:px-12 md:pt-36 md:pb-28"
      >
        {/* Overlay gradient */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 70% 40%, rgba(168,194,182,0.08), transparent 60%), linear-gradient(to bottom, rgba(15,19,17,0.6), rgba(15,19,17,0.92))",
          }}
        />

        {/* Logo watercolor backdrop */}
        <div
          aria-hidden
          className="absolute -right-20 top-24 opacity-[0.04] blur-2xl"
          style={{ width: 720, height: 720 }}
        >
          <Image
            src="/egoera-logo.png"
            alt=""
            fill
            className="object-contain"
            priority
          />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1400px]">
          <div className="max-w-[900px]">
            <div className="kicker mb-10">El vlog de Egoera</div>
            <h1
              className="mb-8 leading-[0.92] tracking-[-0.035em]"
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: 300,
                fontSize: "clamp(56px, 10vw, 148px)",
              }}
            >
              Psicologia,
              <br />
              <em
                className="italic"
                style={{ color: "var(--accent)", fontWeight: 300 }}
              >
                despacio.
              </em>
            </h1>
            <p
              className="mb-12 max-w-[520px] leading-[1.55]"
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontSize: "clamp(16px, 1.5vw, 20px)",
                color: "var(--ink-dim)",
              }}
            >
              Un vlog para detenerse, mirar hacia dentro y volver a la semana
              con otras preguntas.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="#sentimientos"
                className="inline-flex items-center gap-3 rounded-full py-4 pl-3 pr-7 text-sm font-medium transition-transform hover:-translate-y-0.5"
                style={{
                  background: "var(--ink)",
                  color: "var(--bg)",
                  fontFamily: "var(--font-sans)",
                }}
              >
                <span
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full"
                  style={{ background: "var(--bg)", color: "var(--ink)" }}
                >
                  ▸
                </span>
                Elegir un sentimiento
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center rounded-full border px-7 py-4 text-sm transition-colors"
                style={{
                  borderColor: "var(--rule)",
                  color: "var(--ink)",
                  fontFamily: "var(--font-sans)",
                }}
              >
                Explorar el archivo
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="absolute bottom-8 left-5 right-5 flex flex-col items-start gap-3 border-t pt-5 text-[12px] md:left-12 md:right-12 md:flex-row md:items-center md:justify-between"
          style={{
            borderColor: "var(--rule)",
            color: "var(--ink-faint)",
            letterSpacing: "0.08em",
            fontFamily: "var(--font-mono)",
          }}
        >
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full pulse-dot"
              style={{ background: "var(--accent)" }}
            />
            <span>
              <strong style={{ color: "var(--ink)", fontWeight: 500 }}>
                Ultima entrada
              </strong>{" "}
              {feature ? feature.title : "Cargando..."}
            </span>
          </div>
          <div className="flex flex-wrap gap-5 uppercase">
            <span>◉ Nueva entrada cada jueves</span>
            <span>{posts.length} articulos</span>
            <span>2026</span>
          </div>
        </div>
      </section>

      {/* ───────── CONSOLA ───────── */}
      <section
        id="sentimientos"
        className="relative overflow-hidden px-5 py-28 md:px-12 md:py-36"
        style={{
          background:
            "linear-gradient(180deg, var(--bg) 0%, #1a2420 60%, var(--bg) 100%)",
        }}
      >
        <div
          aria-hidden
          className="absolute -right-[5%] top-[5%] -z-0 blur-[60px]"
          style={{
            width: 900,
            height: 900,
            background:
              "radial-gradient(circle at 40% 40%, rgba(59,111,212,0.22), transparent 50%), radial-gradient(circle at 60% 60%, rgba(58,163,114,0.2), transparent 55%)",
          }}
        />
        <div
          aria-hidden
          className="absolute -left-[10%] bottom-[10%] -z-0 blur-[80px]"
          style={{
            width: 700,
            height: 700,
            background:
              "radial-gradient(circle at 50% 50%, rgba(243,168,196,0.14), transparent 60%)",
          }}
        />

        <div className="relative z-10 mx-auto mb-20 max-w-[720px] text-center">
          <div className="kicker-center mb-5">Mapa emocional</div>
          <h2
            className="mb-6 leading-none tracking-[-0.03em]"
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 300,
              fontSize: "clamp(44px, 6vw, 80px)",
            }}
          >
            ¿Que estas{" "}
            <em className="italic" style={{ color: "var(--accent)" }}>
              sintiendo
            </em>
            ?
          </h2>
          <p
            className="mx-auto max-w-[560px] leading-[1.6]"
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: "18px",
              color: "var(--ink-dim)",
            }}
          >
            Selecciona un estado y abre un archivo de articulos, practicas y
            episodios para acompanarte en el. Sin prisa.
          </p>
        </div>

        <div className="relative z-10">
          <GameBoySelector />
        </div>
      </section>

      {/* ───────── BRAIN MAP ───────── */}
      <section id="cerebro" className="px-5 py-28 md:px-12 md:py-32">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-14 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
            <div>
              <div className="kicker mb-4">Cerebro · Regiones</div>
              <h2
                className="leading-none tracking-[-0.03em]"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontWeight: 300,
                  fontSize: "clamp(40px, 5vw, 72px)",
                }}
              >
                Seis regiones,
                <br />
                <em className="italic" style={{ color: "var(--accent)" }}>
                  una misma cabeza.
                </em>
              </h2>
            </div>
            <p
              className="max-w-md leading-[1.6]"
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontSize: "18px",
                color: "var(--ink-dim)",
              }}
            >
              Cada area del cerebro concentra un tipo de experiencia emocional.
              Pasa el cursor sobre el mapa para saber mas, o entra directamente
              en la que te llame.
            </p>
          </div>

          <BrainMap />
        </div>
      </section>

      {/* ───────── RECENT ARTICLES ───────── */}
      <section
        id="recientes"
        className="px-5 py-28 md:px-12 md:py-32"
        style={{ background: "var(--bg-2)" }}
      >
        <div className="mx-auto max-w-[1400px]">
          <div
            className="mb-16 grid gap-10 border-b pb-8 lg:grid-cols-[1.2fr_1fr] lg:items-end"
            style={{ borderColor: "var(--rule)" }}
          >
            <div>
              <div className="kicker mb-4">Archivo</div>
              <h2
                className="leading-none tracking-[-0.03em]"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontWeight: 300,
                  fontSize: "clamp(40px, 5vw, 72px)",
                }}
              >
                Lo ultimo
                <br />
                del{" "}
                <em className="italic" style={{ color: "var(--accent)" }}>
                  blog.
                </em>
              </h2>
            </div>
            <p
              className="max-w-sm leading-[1.6]"
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontSize: "18px",
                color: "var(--ink-dim)",
              }}
            >
              Articulos, practicas y reflexiones que Ander publica cada jueves.
              Archivo en expansion.
            </p>
          </div>

          {latest.length === 0 ? (
            <p
              className="py-16 text-center"
              style={{
                color: "var(--ink-faint)",
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
              }}
            >
              Pronto publicaremos mas.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {latest.map((post, i) => {
                const r = regionFor(post);
                const c1 = r?.color ?? "#a8c2b6";
                const c2 = r?.c2 ?? "#5a7a6e";
                return (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col gap-5 no-underline"
                  >
                    {/* Media */}
                    <div
                      className="relative aspect-[4/5] overflow-hidden rounded-sm border"
                      style={{
                        borderColor: "var(--rule)",
                        background: "#1a211e",
                      }}
                    >
                      {post.coverImage ? (
                        <Image
                          src={post.coverImage}
                          alt={post.coverAlt || post.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                          style={{ filter: "brightness(0.75)" }}
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
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(to bottom, transparent 40%, rgba(15,19,17,0.6))",
                        }}
                      />
                      <div
                        className="absolute inset-0 flex items-center justify-center text-[160px]"
                        style={{
                          fontFamily: "var(--font-serif)",
                          fontStyle: "italic",
                          fontWeight: 300,
                          color: "rgba(244,239,230,0.10)",
                        }}
                      >
                        {CARD_GLYPHS[i % CARD_GLYPHS.length]}
                      </div>
                      {post.category && (
                        <span
                          className="absolute left-4 top-4 rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] backdrop-blur"
                          style={{
                            background: "rgba(15,19,17,0.75)",
                            color: "var(--accent)",
                            fontFamily: "var(--font-mono)",
                          }}
                        >
                          {post.category}
                        </span>
                      )}
                      <span
                        className="absolute bottom-4 right-4 text-[10px] uppercase tracking-[0.18em]"
                        style={{
                          color: "var(--ink-faint)",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        № {String(posts.length - i).padStart(3, "0")}
                      </span>
                    </div>

                    <div>
                      <h3
                        className="mb-2.5 leading-[1.15] tracking-[-0.02em] transition-colors group-hover:text-[color:var(--accent)]"
                        style={{
                          fontFamily: "var(--font-serif)",
                          fontSize: "26px",
                          fontWeight: 400,
                        }}
                      >
                        {post.title}
                      </h3>
                      <div
                        className="flex gap-3 text-[11px] uppercase tracking-[0.12em]"
                        style={{
                          color: "var(--ink-faint)",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        <span>{post.date}</span>
                        <span>·</span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="mt-14 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center rounded-full border px-7 py-4 text-sm"
              style={{
                borderColor: "var(--rule)",
                color: "var(--ink)",
                fontFamily: "var(--font-sans)",
              }}
            >
              Ver todos los articulos →
            </Link>
          </div>
        </div>
      </section>

      {/* ───────── ABOUT ANDER ───────── */}
      <section
        id="sobre"
        className="relative overflow-hidden px-5 py-28 md:px-12 md:py-32"
        style={{ background: "var(--bg-2)" }}
      >
        <div className="mx-auto grid max-w-[1200px] items-center gap-20 lg:grid-cols-2">
          <div>
            <div className="kicker mb-4">Sobre Egoera</div>
            <h2
              className="mb-6 leading-none tracking-[-0.03em]"
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: 300,
                fontSize: "clamp(40px, 5vw, 64px)",
              }}
            >
              Un espacio para{" "}
              <em className="italic" style={{ color: "var(--accent)" }}>
                habitarse.
              </em>
            </h2>
            <p
              className="mb-5 max-w-[480px] leading-[1.7]"
              style={{
                color: "var(--ink-dim)",
                fontFamily: "var(--font-sans)",
              }}
            >
              Egoera nace como proyecto de psicologia en Donostia que cree en
              las conversaciones pausadas, en el cuidado de los estados que
              atravesamos y en hacer del contenido un lugar de encuentro —no de
              diagnostico.
            </p>
            <p
              className="max-w-[480px] leading-[1.7]"
              style={{
                color: "var(--ink-dim)",
                fontFamily: "var(--font-sans)",
              }}
            >
              Este blog es una extension de esa idea: reflexiones, practicas y
              entrevistas para acompanarte entre semanas. Lo escribo yo, Ander
              Bilbao, desde casa.
            </p>

            <div className="mt-8 flex flex-wrap gap-2.5">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-full border px-4 py-2.5 text-[13px] transition-colors hover:border-[color:var(--accent)]"
                  style={{
                    borderColor: "var(--rule)",
                    color: "var(--ink)",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  <span style={{ color: "var(--accent)" }}>◉</span>
                  <span>{s.label}</span>
                  <span style={{ color: "var(--ink-faint)", fontSize: 12 }}>
                    {s.handle}
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div className="relative flex h-[420px] items-center justify-center">
            <div
              aria-hidden
              className="absolute inset-0 opacity-40 blur-xl"
            >
              <Image
                src="/egoera-logo.png"
                alt=""
                fill
                className="object-contain"
              />
            </div>
            <div
              className="relative z-10 rounded-sm border p-8"
              style={{
                borderColor: "var(--rule)",
                background: "rgba(26,33,30,0.7)",
                backdropFilter: "blur(10px)",
                maxWidth: 320,
              }}
            >
              <div
                className="mb-2 text-[11px] uppercase tracking-[0.22em]"
                style={{
                  color: "var(--accent)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                Consulta presencial
              </div>
              <div
                className="mb-1.5 text-[22px] leading-tight"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Donostia — San Sebastian
              </div>
              <div
                className="text-[12px]"
                style={{
                  color: "var(--ink-faint)",
                  letterSpacing: "0.06em",
                }}
              >
                Psicologia clinica · Adultos · Adolescentes
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── NEWSLETTER ───────── */}
      <section className="mx-auto max-w-[900px] px-5 py-28 text-center md:px-12">
        <h2
          className="mb-5 leading-[1.05] tracking-[-0.03em]"
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 300,
            fontSize: "clamp(40px, 5vw, 64px)",
          }}
        >
          Un jueves, una{" "}
          <em className="italic" style={{ color: "var(--accent)" }}>
            pregunta
          </em>{" "}
          nueva.
        </h2>
        <p
          className="mx-auto mb-10 max-w-[540px]"
          style={{
            color: "var(--ink-dim)",
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: 18,
          }}
        >
          Suscribete y recibe cada entrada directa en tu correo, con una
          reflexion breve para llevarte la semana.
        </p>
        <NewsletterInlineForm />
      </section>
    </>
  );
}

const SOCIALS = [
  {
    label: "Instagram",
    handle: "@egoera.psikologia",
    href: "https://www.instagram.com/egoera.psikologia/",
  },
  {
    label: "TikTok",
    handle: "@egoera.psikologia",
    href: "https://www.tiktok.com/@egoera.psikologia",
  },
  {
    label: "YouTube",
    handle: "Canal",
    href: "https://www.youtube.com/@egoera.psikologia",
  },
  {
    label: "Spotify",
    handle: "Podcast",
    href: "https://open.spotify.com/search/egoera%20psikologia",
  },
];

function NewsletterInlineForm() {
  return (
    <form
      className="mx-auto flex max-w-[480px] items-center rounded-full border p-1.5"
      style={{
        borderColor: "var(--rule)",
        background: "rgba(244,239,230,0.03)",
      }}
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const emailInput = form.querySelector<HTMLInputElement>(
          "input[type='email']"
        );
        const button = form.querySelector<HTMLButtonElement>("button");
        if (!emailInput || !button) return;
        button.disabled = true;
        button.textContent = "Enviando...";
        try {
          const res = await fetch("/api/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: emailInput.value,
              source: "home-inline",
            }),
          });
          if (res.ok) {
            button.textContent = "Te esperamos ✓";
          } else {
            button.textContent = "Error";
            button.disabled = false;
          }
        } catch {
          button.textContent = "Error";
          button.disabled = false;
        }
      }}
    >
      <input
        required
        type="email"
        placeholder="tu@correo.com"
        className="flex-1 bg-transparent px-5 py-3 text-sm outline-none"
        style={{
          color: "var(--ink)",
          fontFamily: "var(--font-sans)",
        }}
      />
      <button
        type="submit"
        className="rounded-full px-6 py-3 text-sm font-medium"
        style={{
          background: "var(--ink)",
          color: "var(--bg)",
          fontFamily: "var(--font-sans)",
        }}
      >
        Suscribirme
      </button>
    </form>
  );
}
