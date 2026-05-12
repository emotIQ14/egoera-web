"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { BlogPost } from "@/lib/blog";
import { levelFor, liveStreak, loadState, type SentirState } from "@/lib/sentir-streak";
import { CinematicHero } from "@/components/home/cinematic/CinematicHero";
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
      {/* ============ CINEMATIC HERO (Velorah-style sunset) ============ */}
      <CinematicHero />

      {/* ============ BRÚJULA EMOCIONAL (CTA) ============ */}
      <BrujulaSection />

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
 * CUATRO FRENTES — grid 2x2 de entradas editoriales
 * ===================================================================== */
/* =========================================================================
 * BRÚJULA EMOCIONAL — banda CTA hacia /sentir. Una mini-pila de cartas
 * decorativas a la derecha + título grande a la izquierda. Cobalto
 * profundo sobre crema para destacar dentro del flujo home.
 * ===================================================================== */
function BrujulaSection() {
  // Racha viva (cliente). Se hidrata después del mount, así evitamos
  // mismatches de SSR.
  const [state, setState] = useState<SentirState | null>(null);
  useEffect(() => {
    setState(loadState());
  }, []);
  const streakDays = state ? liveStreak(state) : 0;
  const level = state ? levelFor(state.points).current : null;
  const showChip = !!state && state.totalSessions > 0;

  return (
    <section className={styles.brujula}>
      <div className={styles.wrap}>
        <div className={styles.brujulaWrap}>
          <div>
            <span className={styles.brujulaEyebrow}>brújula emocional · nuevo</span>
            <h2 className={styles.brujulaH}>
              antes de leer, <em>mírate</em>.
            </h2>
            <p className={styles.brujulaLead}>
              Catorce cartas para preguntarte cómo estás, sin diagnósticos.
              Al terminar te ofrecemos un artículo, un ejercicio y un
              sentimiento al que volver. Tres minutos contigo.
            </p>
            {showChip && state && level && (
              <div className={styles.streakChip}>
                <span className={styles.streakChipFlame} aria-hidden>↑</span>
                <span className={styles.streakChipNum}>{streakDays}</span>
                <span className={styles.streakChipLabel}>
                  {streakDays === 1 ? "día contigo" : "días contigo"}
                </span>
                <span className={styles.streakChipDot} aria-hidden>·</span>
                <span className={styles.streakChipLevel}>
                  <em>{level.glyph}</em> {level.name}
                </span>
                <span className={styles.streakChipDot} aria-hidden>·</span>
                <span className={styles.streakChipPts}>{state.points} pts</span>
              </div>
            )}
            <div className={styles.brujulaCtas}>
              <Link href="/sentir" className={styles.brujulaPrimary}>
                {showChip ? "Volver al mazo" : "Empezar el mazo"}
                <span aria-hidden>→</span>
              </Link>
              <Link href="/diario" className={styles.brujulaSecondary}>
                ir al diario
              </Link>
            </div>
          </div>

          <div className={styles.brujulaDeck} aria-hidden>
            <div className={`${styles.brujulaCard} ${styles.brujulaCard1}`}>
              <div className={styles.brujulaCardCorner}>
                <span>vinculo</span>
                <span>❋</span>
              </div>
              <div>
                <div className={styles.brujulaCardGlyph}>❋</div>
                <p className={styles.brujulaCardPrompt}>
                  Vuelvo a la misma persona aunque no me hace bien.
                </p>
              </div>
              <div className={styles.brujulaCardFoot}>
                <span>n. accumbens</span>
                <span>egoera</span>
              </div>
            </div>
            <div className={`${styles.brujulaCard} ${styles.brujulaCard2}`}>
              <div className={styles.brujulaCardCorner}>
                <span>alerta</span>
                <span>◌</span>
              </div>
              <div>
                <div className={styles.brujulaCardGlyph}>◌</div>
                <p className={styles.brujulaCardPrompt}>
                  El pecho se cierra antes de que entienda por qué.
                </p>
              </div>
              <div className={styles.brujulaCardFoot}>
                <span>amígdala</span>
                <span>egoera</span>
              </div>
            </div>
            <div className={`${styles.brujulaCard} ${styles.brujulaCard3}`}>
              <div className={styles.brujulaCardCorner}>
                <span>identidad</span>
                <span>◈</span>
              </div>
              <div>
                <div className={styles.brujulaCardGlyph}>◈</div>
                <p className={styles.brujulaCardPrompt}>
                  Me siento un fraude la mayoría de las veces.
                </p>
              </div>
              <div className={styles.brujulaCardFoot}>
                <span>c. prefrontal</span>
                <span>egoera</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

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

