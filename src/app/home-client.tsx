"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import type { BlogPost } from "@/lib/blog";
import styles from "./home.module.css";

// EgoeraNav y EgoeraFooter (server components async) los renderiza el
// page.tsx envolviendo HomeClient. No se importan aquí porque este archivo
// es "use client" y los client components no pueden importar server components.

interface Props {
  posts: BlogPost[];
}

/* ---------------------------------------------------------------------------
 * Edición fija para el masthead (n.º + fecha) — replica del mockup
 * "n.º 18 · 9 nov 2026" pero con número 020 y la fecha de hoy.
 * ------------------------------------------------------------------------- */
const EDITION_NO = "n.º 020";
const TODAY_HUMAN = "10 may 2026";

export default function HomeClient({ posts }: Props) {
  const latest = posts[0];

  return (
    <div className={styles.page}>
      {/* ============ COSMIC HERO ============ */}
      <CosmicHero />

      {/* ============ CUATRO FRENTES ============ */}
      <FrentesSection />

      {/* ============ ÚLTIMA ENTRADA ============ */}
      <LatestSection latest={latest} totalCount={posts.length} />

      {/* ============ DIARIO PREVIEW ============ */}
      <DiarioSection />

      {/* ============ ANDER MINI ============ */}
      <AnderSection />

      {/* ============ CONNECT ============ */}
      <ConnectSection />
    </div>
  );
}

/* =========================================================================
 * COSMIC HERO — fondo radial profundo, estrellas CSS, partículas canvas
 * y la chica mascota (SVG copiado tal cual del mockup).
 * ===================================================================== */
function CosmicHero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let stopped = false;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const parent = c.parentElement;
      if (!parent) return;
      const r = parent.getBoundingClientRect();
      w = r.width;
      h = r.height;
      c.width = w * dpr;
      c.height = h * dpr;
      c.style.width = `${w}px`;
      c.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      life: number;
      max: number;
      col: string;
      tw: number;
    }

    const ps: Particle[] = [];
    const COL = ["#f5e6b6", "#d6bd7f", "#b48b3a", "#fff7e0", "#e7c87a", "#f1ead8"];

    const spawn = () => {
      const cx = w / 2;
      const cy = h - h * 0.18;
      const sp = Math.min(w * 0.06, 90);
      ps.push({
        x: cx + (Math.random() - 0.5) * sp,
        y: cy + (Math.random() - 0.3) * 30,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -0.4 - Math.random() * 1.6,
        r: 0.6 + Math.random() * 1.8,
        life: 0,
        max: 200 + Math.random() * 260,
        col: COL[(Math.random() * COL.length) | 0],
        tw: Math.random() * Math.PI * 2,
      });
    };

    const loop = () => {
      if (stopped) return;
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < 5; i++) spawn();
      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i];
        p.life++;
        p.x += p.vx + Math.sin((p.life + p.tw) * 0.04) * 0.4;
        p.y += p.vy;
        p.vy *= 0.998;
        const t = p.life / p.max;
        const fi = Math.min(1, t * 4);
        const fo = 1 - Math.pow(Math.max(0, t - 0.4) / 0.6, 1.4);
        const a = Math.max(0, fi * fo);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.col;
        ctx.globalAlpha = a * 0.95;
        ctx.shadowColor = p.col;
        ctx.shadowBlur = 10;
        ctx.fill();
        if (p.life > p.max || p.y < -20) ps.splice(i, 1);
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section className={styles.hero}>
      <div className={styles.stars} />
      <div className={styles.cosmos}>
        <canvas ref={canvasRef} />
      </div>

      <div className={styles.cosmicTop}>
        <span className={styles.left}>
          <span className={styles.dot} /> Bilbao · psicología, despacio
        </span>
        <span>
          {EDITION_NO} · {TODAY_HUMAN}
        </span>
      </div>

      <div className={styles.cosmicStage}>
        <span className={styles.cosmicEye}>
          — un cuaderno sobre lo que sentimos —
        </span>
        <h1 className={styles.cosmicH}>
          Hold on, <em>we&apos;re</em> here.
        </h1>

        <form
          className={styles.cosmicForm}
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const emailInput = form.querySelector<HTMLInputElement>(
              "input[type='email']"
            );
            const button = form.querySelector<HTMLButtonElement>("button");
            if (!emailInput || !button) return;
            button.disabled = true;
            const original = button.innerHTML;
            button.textContent = "…";
            try {
              const res = await fetch("/api/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  email: emailInput.value,
                  source: "home-cosmic",
                }),
              });
              if (res.ok) {
                button.textContent = "✓";
              } else {
                button.innerHTML = original;
                button.disabled = false;
              }
            } catch {
              button.innerHTML = original;
              button.disabled = false;
            }
          }}
        >
          <input
            type="email"
            required
            placeholder="Tu correo, sin prisa…"
            aria-label="Correo electrónico"
          />
          <button type="submit" aria-label="Suscribirse">
            →
          </button>
        </form>

        <p className={styles.cosmicSub}>
          Una carta cada domingo sobre tristeza, ansiedad, apego y todo lo demás.
          Sin titulares. Sin atajos.
        </p>

        <Link href="/manifiesto" className={styles.cosmicCta}>
          Manifiesto →
        </Link>

        <CosmicMascot />
      </div>

      <div className={styles.cosmicScroll}>
        <span>scroll</span>
        <span className={styles.line} />
      </div>
    </section>
  );
}

/* SVG copiado LITERALMENTE del mockup Egoera Home.html (líneas ~715-757)
   — la chica inclinada mirando hacia arriba. NO simplificar. */
function CosmicMascot() {
  return (
    <div className={styles.cosmicMascot}>
      <svg
        viewBox="0 0 400 560"
        fill="none"
        stroke="#f1ead8"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        {/* pelo (volumen detrás de la cabeza) */}
        <path
          d="M 130 215 C 110 175, 120 110, 175 88 C 230 70, 290 95, 295 165 C 300 215, 285 250, 270 268"
          fill="rgba(241,234,216,.06)"
        />
        {/* cara (perfil 3/4 mirando arriba) */}
        <path
          d="M 175 200
             C 168 175, 178 145, 200 138
             C 230 130, 258 148, 262 178
             C 264 200, 256 220, 245 232
             C 240 240, 235 250, 240 258
             C 246 268, 244 278, 232 282
             L 200 285
             C 185 282, 175 270, 173 252
             C 172 240, 175 225, 175 200 Z"
        />
        {/* ojo (cerrado, mirando arriba) */}
        <path d="M 210 198 Q 222 192, 234 200" strokeWidth="2.5" />
        {/* ceja sutil */}
        <path d="M 212 188 Q 224 182, 236 188" strokeWidth="2" />
        {/* nariz */}
        <path d="M 240 218 Q 248 232, 244 244" strokeWidth="2" />
        {/* labios */}
        <path d="M 218 258 Q 228 262, 238 258" strokeWidth="2.5" />
        {/* mandíbula a cuello */}
        <path d="M 200 285 L 195 320 L 188 360" />
        <path d="M 232 282 L 240 320 L 248 360" />
        {/* hombros / cazadora */}
        <path
          d="M 188 360
             C 150 372, 100 400, 80 460
             L 80 560"
        />
        <path
          d="M 248 360
             C 290 372, 340 400, 360 460
             L 360 560"
        />
        {/* cuello camisa */}
        <path d="M 188 360 L 220 380 L 248 360" />
        <path d="M 220 380 L 220 440" />
        {/* detalle cazadora · solapa */}
        <path d="M 178 392 L 168 460" strokeWidth="2" />
        <path d="M 258 392 L 268 460" strokeWidth="2" />
        {/* cremallera bolsillo */}
        <path d="M 130 460 L 170 460" strokeWidth="2" strokeDasharray="2 4" />
        <path d="M 270 460 L 310 460" strokeWidth="2" strokeDasharray="2 4" />
      </svg>
    </div>
  );
}

/* =========================================================================
 * CUATRO FRENTES — grid 2x2 de entradas editoriales
 * ===================================================================== */
function FrentesSection() {
  const frentes = [
    {
      n: "01",
      tag: "vlog · blog editorial",
      h: (
        <>
          blog <em>editorial</em>
        </>
      ),
      p: "Artículos basados en evidencia. Sin titulares, sin clickbait. Una nueva entrada cada domingo.",
      href: "/blog",
    },
    {
      n: "02",
      tag: "app · diario",
      h: (
        <>
          diario <em>emocional</em>
        </>
      ),
      p: "Tres minutos al día. Sin gamificación, sin métricas raras. Sólo tú escuchándote — desde el navegador, iOS o Android.",
      href: "/diario",
    },
    {
      n: "03",
      tag: "boletín · domingos",
      h: (
        <>
          el <em>boletín</em>
        </>
      ),
      p: "Una carta cada domingo en tu correo. Reflexiones largas, lecturas guiadas y la entrada de la semana.",
      href: "/boletin",
    },
    {
      n: "04",
      tag: "manifiesto · por qué",
      h: (
        <>
          el <em>manifiesto</em>
        </>
      ),
      p: "Por qué Egoera existe. Leer despacio, dudar en serio, huir del clickbait. La carta abierta de Ander.",
      href: "/manifiesto",
    },
  ];

  return (
    <section className={styles.frentes}>
      <div className={styles.wrap}>
        <div className={styles.frentesHead}>
          <h2>
            cuatro <em>frentes</em>,
            <br />
            un mismo cuidado.
          </h2>
          <p>
            Egoera vive en cuatro lugares — uno largo, uno cotidiano, uno semanal,
            uno fundacional. Todos llevan al mismo sitio: a entender un poco mejor
            lo que sientes.
          </p>
        </div>

        <div className={styles.frentesGrid}>
          {frentes.map((f) => (
            <Link key={f.n} href={f.href} className={styles.frente}>
              <span className={styles.fNum}>{f.n}</span>
              <div className={styles.fBody}>
                <span className={styles.fTag}>{f.tag}</span>
                <h3 className={styles.fH}>{f.h}</h3>
                <p>{f.p}</p>
              </div>
              <span className={styles.fArr}>→</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
 * ÚLTIMA ENTRADA — última publicada del blog (de los posts pasados desde
 * page.tsx). Si no hay posts, fallback al texto del mockup.
 * ===================================================================== */
function LatestSection({
  latest,
  totalCount,
}: {
  latest?: BlogPost;
  totalCount: number;
}) {
  const numStr = totalCount > 0 ? String(totalCount).padStart(2, "0") : "01";
  const wordNum = totalCount > 0 ? `n.º ${numStr}` : "n.º uno";

  return (
    <section className={styles.latest}>
      <div className={styles.wrap}>
        <div className={styles.latestGrid}>
          <div className={styles.latestIllu}>
            <div className={styles.glow} />
            <span className={styles.num}>{numStr}</span>
            <div className={styles.meta}>
              última entrada · domingo
              <strong>{wordNum}</strong>
            </div>
          </div>

          <div className={styles.latestBody}>
            <span className={styles.eyebrow}>
              {latest
                ? `vlog · ${latest.date} · ${latest.readTime}`
                : "vlog · próximamente"}
            </span>
            <h3>
              {latest ? (
                latest.title
              ) : (
                <>
                  Lo que <em>pasa dentro</em>,<br />
                  contado fuera.
                </>
              )}
            </h3>
            {latest?.excerpt ? (
              <p className={styles.ex}>{latest.excerpt}</p>
            ) : (
              <p className={styles.ex}>
                Hoy quería escribirte sobre los días en los que{" "}
                <em>no estás bien</em>, pero tampoco mal. Esos en los que no pasa
                nada y, sin embargo, algo no encaja. Llevo años llamándolos{" "}
                <em>egoera</em>: el estado que no es estado.
              </p>
            )}

            <div className={styles.latestMeta}>
              <span>
                etiqueta ·{" "}
                <strong>{latest?.category?.toLowerCase() ?? "tiempo"}</strong>
              </span>
              <span>
                autor ·{" "}
                <strong>
                  {latest?.author?.toLowerCase() ?? "ander b. castejón"}
                </strong>
              </span>
              <span>
                edición · <strong>{wordNum} / 2026</strong>
              </span>
            </div>

            <div className={styles.latestActions}>
              <Link
                href={latest ? `/blog/${latest.slug}` : "/blog"}
                className={styles.btnBlue}
              >
                Leer la entrada →
              </Link>
              <Link href="/blog" className={styles.btnOutline}>
                Ver índice completo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
 * DIARIO PREVIEW — 3 móviles del diario emocional. Markup estático.
 * ===================================================================== */
function DiarioSection() {
  return (
    <section className={styles.diario} id="diario">
      <div className={styles.wrap}>
        <div className={styles.diarioHead}>
          <div>
            <span className={styles.eyebrow}>app · diario</span>
            <h2 style={{ marginTop: 18 }}>
              Tu diario emocional, <em>despacio</em>.
            </h2>
          </div>
          <div className={styles.metaSide}>
            <span className={styles.pill}>7 pantallas · una idea</span>
            <p>
              Sin gamificación. Sin métricas raras. Sin atajos. Sólo tú
              escuchándote — desde el navegador, iOS o Android.
            </p>
          </div>
        </div>

        <div className={styles.phones}>
          {/* phone 1: portada */}
          <div className={`${styles.phone} ${styles.phone1}`}>
            <div className={styles.top}>— egoera diario —</div>
            <div
              className={styles.mid}
              style={{
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <h4>
                Diario
                <br />
                emocional
                <br />
                <em>despacio.</em>
              </h4>
              <p
                style={{
                  fontFamily: "var(--font-sans), Inter, sans-serif",
                  fontSize: 11,
                  color: "rgba(29,43,219,.78)",
                  marginTop: 14,
                  lineHeight: 1.5,
                }}
              >
                Sin gamificación.
                <br />
                Sin métricas raras.
                <br />
                Sin atajos.
                <br />
                Sólo tú escuchándote.
              </p>
            </div>
            <div style={{ textAlign: "center", paddingBottom: 8 }}>
              <svg
                className={styles.phoneBrandSvg}
                viewBox="0 0 80 80"
                width="56"
                height="56"
                fill="none"
                stroke="#1d2bdb"
                strokeWidth="1.5"
                aria-hidden
              >
                <path d="M 40 70 L 40 30" />
                <path d="M 40 30 Q 30 25, 25 15" />
                <path d="M 40 30 Q 50 25, 55 15" />
                <path d="M 40 45 Q 28 42, 22 32" />
                <path d="M 40 45 Q 52 42, 58 32" />
              </svg>
            </div>
          </div>

          {/* phone 2: registro */}
          <div className={`${styles.phone} ${styles.phone2}`}>
            <div className={styles.top}>— 02 · diario —</div>
            <div className={styles.mid}>
              <h4>
                ¿Cómo lo
                <br />
                estás <em>llevando?</em>
              </h4>
              <div className={styles.numBig}>7</div>
              <div
                style={{
                  textAlign: "center",
                  fontFamily:
                    "var(--font-mono), 'JetBrains Mono', monospace",
                  fontSize: 9,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(29,43,219,.78)",
                }}
              >
                — de 10 —
              </div>
              <div className={styles.scale} style={{ marginTop: 14 }} />
              <div className={styles.scaleLbl}>
                <span>mal</span>
                <span>regular</span>
              </div>

              <div
                style={{
                  fontFamily:
                    "var(--font-mono), 'JetBrains Mono', monospace",
                  fontSize: 9,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(29,43,219,.78)",
                  marginTop: 4,
                }}
              >
                — ¿qué se siente? —
              </div>
              <div className={styles.feels}>
                <span>cansancio</span>
                <span>calma</span>
                <span className={styles.on}>ansiedad</span>
                <span>tristeza</span>
                <span>esperanza</span>
                <span>rabia</span>
                <span>miedo</span>
                <span>alegría</span>
                <span>culpa</span>
              </div>

              <div className={styles.input}>cuéntalo si quieres…</div>
            </div>
            <div className={styles.voice}>
              voz · 2 min
              <strong>«cuéntalo en alto»</strong>
            </div>
          </div>

          {/* phone 3: conversa */}
          <div className={`${styles.phone} ${styles.phone3}`}>
            <div className={styles.top}>— 03 · conversa —</div>
            <div className={styles.mid}>
              <h4>
                Hoy hablamos
                <br />
                de <em>la calma</em>.
              </h4>
              <span className={styles.session}>— sesión 1 —</span>
              <span className={styles.labelEg}>egoera</span>
              <div className={styles.bubble}>
                Hola Ander. ¿Cómo estás llegando aquí hoy?
              </div>
            </div>
            <div className={styles.homeBar} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
 * ANDER MINI — retrato y bio breve
 * ===================================================================== */
function AnderSection() {
  return (
    <section className={styles.ander}>
      <div className={styles.wrap}>
        <div className={styles.anderGrid}>
          <div className={styles.portrait}>
            <div className={styles.ph}>
              <span>retrato · ander</span>
            </div>
            <div className={styles.frame} />
          </div>
          <div className={styles.anderBody}>
            <span className={styles.eyebrow}>hola · soy ander</span>
            <h2>
              la persona <em>detrás</em> de egoera.
            </h2>
            <p>
              Soy <em>Ander Bilbao Castejón</em>, psicólogo y fundador de
              Egoera Psikologia. Nací y vivo en Bilbao, en el corazón de
              Euskadi. Mi misión es hacer la psicología accesible para todos —
              sin jerga, basada en ciencia, práctica y humana.
            </p>
            <p>
              Siempre me ha movido una pregunta:{" "}
              <em>¿por qué sentimos lo que sentimos?</em>. Esa curiosidad me
              llevó a estudiar psicología y a formarme como Experto en
              Psicología Positiva Aplicada por el Instituto Europeo de
              Psicología Positiva (IEPP).
            </p>
            <div className={styles.anderCreds}>
              <span>
                colegiado · <strong>B-04122</strong>
              </span>
              <span>
                univ. · <strong>upv-ehu</strong>
              </span>
              <span>
                experto · <strong>iepp · psic. positiva</strong>
              </span>
              <span>
                idiomas · <strong>es · eu</strong>
              </span>
            </div>
            <div className={styles.anderActions}>
              <Link href="/sobre-nosotros" className={styles.btnBlue}>
                Leer mi historia →
              </Link>
              <Link href="/contacto" className={styles.btnOutline}>
                Escribirme
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
 * CONNECT — 4 canales (Instagram, TikTok, X, YouTube)
 * ===================================================================== */
function ConnectSection() {
  const channels = [
    {
      label: "instagram",
      handle: "@egoera.psikologia",
      blurb: "Carrouseles y micro-historias sobre lo que sentimos.",
      meta: "4.2k seguidores",
      href: "https://www.instagram.com/egoera.psikologia/",
    },
    {
      label: "tiktok",
      handle: "@egoera.psikologia",
      blurb: "Vídeos cortos. Una idea por minuto, sin gritar.",
      meta: "1.8k seguidores",
      href: "https://www.tiktok.com/@egoera.psikologia",
    },
    {
      label: "x · twitter",
      handle: "@egoerapsikolog",
      blurb: "Pensamientos sueltos y enlaces a entradas nuevas.",
      meta: "2.1k seguidores",
      href: "https://x.com/egoerapsikolog",
    },
    {
      label: "youtube",
      handle: "@egoera.psikologia",
      blurb: "Conversaciones largas y lecturas guiadas del vlog.",
      meta: "620 suscritos",
      href: "https://www.youtube.com/@egoera.psikologia",
    },
  ];

  return (
    <section className={styles.connect} id="redes">
      <div className={styles.wrap}>
        <span className={styles.eyebrowAlt}>redes · cuatro sitios</span>
        <h2>
          Conecta con <em>nosotros</em>.
        </h2>
        <p className={styles.sub}>
          Cuatro sitios donde Egoera vive. Elige el tuyo. La carta del domingo
          está en el blog; lo demás, aquí.
        </p>

        <div className={styles.channels}>
          {channels.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ch}
            >
              <span className={styles.chLbl}>{c.label}</span>
              <span className={styles.chH}>{c.handle}</span>
              <p>{c.blurb}</p>
              <span className={styles.chMeta}>
                <span>{c.meta}</span>
                <span className={styles.arr}>→</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

