"use client";

/**
 * CinematicHero — versión "Velorah". Hero con la imagen real de la
 * mujer leyendo en el campo de flores al atardecer (cropped del GIF
 * de motionsites.ai / Velorah) como fondo, y el texto editorial de
 * Egoera por encima.
 *
 * Diferencia con la versión previa:
 *  - Antes había una composición SVG dibujada (nubes, mujer, flores,
 *    pétalos, polen). Ahora usamos UNA imagen como fondo y dejamos que
 *    object-position muestre sólo la mitad inferior (chica + flores +
 *    cielo bajo). El "Focus in a Distracted World" de la imagen
 *    original queda fuera del viewport gracias al recorte CSS.
 *  - Sólo conservamos las motas de polen flotando como adorno animado.
 *  - Mantenemos `prefers-reduced-motion`, hydration-safe, deterministic.
 */

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import Link from "next/link";

// ───────────────────────────────────────────────────────────────────────
// Pseudo-random determinista — mulberry32 (sin Math.sin para evitar
// hydration mismatch en SSR vs cliente).
// ───────────────────────────────────────────────────────────────────────
function pseudoRandom(seed: number, salt = 0): number {
  let a = (seed * 374761393 + salt * 668265263) >>> 0;
  a = Math.imul(a ^ (a >>> 13), 1274126177) >>> 0;
  a ^= a >>> 16;
  return (a >>> 0) / 4294967296;
}

// ───────────────────────────────────────────────────────────────────────
// Polen — motas que flotan hacia arriba sobre la imagen
// ───────────────────────────────────────────────────────────────────────
type Pollen = {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
};

function makePollen(count = 14): Pollen[] {
  const palette = [
    "rgba(255,255,255,0.85)",
    "rgba(255,232,200,0.75)",
    "rgba(245,185,136,0.7)",
    "rgba(232,168,158,0.65)",
  ];
  const arr: Pollen[] = [];
  for (let i = 0; i < count; i++) {
    arr.push({
      id: i,
      left: pseudoRandom(i, 1) * 100,
      size: 1.5 + pseudoRandom(i, 2) * 3.5,
      duration: 18 + pseudoRandom(i, 3) * 14,
      delay: -pseudoRandom(i, 4) * 28,
      color: palette[i % palette.length],
    });
  }
  return arr;
}

// ───────────────────────────────────────────────────────────────────────
// COMPONENTE
// ───────────────────────────────────────────────────────────────────────
export function CinematicHero() {
  const prefersReduced = useReducedMotion();
  const [pollen] = useState(() => makePollen(14));
  const [mounted, setMounted] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => setMounted(true), []);

  // Algunos navegadores (Chromium headless, Safari móvil estricto)
  // ignoran el atributo autoPlay aun con muted. Forzamos play() al
  // montar; si el navegador lo rechaza, el poster (imagen estática)
  // queda como fondo aceptable.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const tryPlay = async () => {
      try {
        await v.play();
      } catch {
        /* fallback: el poster se mantiene */
      }
    };
    tryPlay();
  }, []);

  return (
    <section className="ch-hero" aria-label="Egoera — Hero">
      <style jsx global>{`
        .ch-hero {
          position: relative;
          width: 100%;
          height: 100vh;
          min-height: 600px;
          overflow: hidden;
          background: #0b0e2e;
          color: #f7efdc;
          font-family: var(--font-sans, "Inter", system-ui);
          isolation: isolate;
        }

        /* Video bg: cover, anclado un poco arriba de la base
           (object-position 50% 80%) para que la chica quede en el
           tercio inferior, totalmente visible, no recortada. Filter
           de contraste+saturación leve para realzar la silueta. */
        .ch-hero-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: 50% 80%;
          z-index: 1;
          filter: contrast(1.08) saturate(1.1) brightness(1.04);
        }

        /* ── Capa nubes drift — translación horizontal infinita ──
           SVG translúcido sobre la banda del cielo. */
        .ch-sky-drift {
          position: absolute;
          top: 0;
          left: -20%;
          width: 140%;
          height: 55%;
          z-index: 2;
          pointer-events: none;
          opacity: 0.55;
          animation: chCloudDrift 90s linear infinite;
          mix-blend-mode: screen;
        }
        @keyframes chCloudDrift {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-14%, 0, 0); }
        }

        /* ── Capa césped sway — la hierba se mece suavemente ──
           SVG en la franja inferior con animación skew sutil. */
        .ch-grass-sway {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 36%;
          z-index: 2;
          pointer-events: none;
          animation: chGrassSway 7s ease-in-out infinite alternate;
          transform-origin: 50% 100%;
        }
        @keyframes chGrassSway {
          0% { transform: skewX(-0.4deg) translateY(0); }
          50% { transform: skewX(0.5deg) translateY(-0.4%); }
          100% { transform: skewX(-0.3deg) translateY(0.2%); }
        }

        @media (prefers-reduced-motion: reduce) {
          .ch-hero-pan,
          .ch-sky-drift,
          .ch-grass-sway {
            animation: none !important;
          }
        }

        /* Overlay gradient cobalto suave para dar contraste al texto. */
        /* Overlay mínimo — sólo lo justo para que el texto sea
           legible, sin tocar la zona donde está la chica. */
        .ch-overlay {
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
          background:
            /* Vignette INVERSO — luz cálida suave alrededor del
               centro derecha donde está sentada la chica.
               Mix-blend screen para AÑADIR luz, no oscurecer. */
            radial-gradient(
              ellipse 50% 45% at 55% 62%,
              rgba(255, 220, 180, 0.18) 0%,
              rgba(255, 220, 180, 0) 70%
            ),
            /* Banda superior para el h1, MUY suave */
            linear-gradient(
              180deg,
              rgba(10, 14, 46, 0.32) 0%,
              rgba(10, 14, 46, 0.08) 18%,
              rgba(10, 14, 46, 0) 35%,
              rgba(10, 14, 46, 0) 70%,
              rgba(10, 14, 46, 0.12) 100%
            );
        }

        /* Polen */
        .ch-pollen {
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
        }
        .ch-pollen span {
          position: absolute;
          bottom: -6%;
          border-radius: 50%;
          filter: blur(0.5px);
          animation: chPollenRise var(--dur, 22s) linear var(--delay, 0s) infinite;
        }
        @keyframes chPollenRise {
          0% { transform: translate3d(0, 0, 0) scale(0.7); opacity: 0; }
          12% { opacity: 1; }
          85% { opacity: 0.7; }
          100% { transform: translate3d(40px, -120vh, 0) scale(1.1); opacity: 0; }
        }

        /* Scanlines muy sutiles — no oscurecen la chica.
           Opacidad bajísima 0.05, sólo dan textura "vintage" sin
           dominar la imagen. */
        .ch-scanlines {
          position: absolute;
          inset: 0;
          z-index: 4;
          pointer-events: none;
          background-image: repeating-linear-gradient(
            180deg,
            rgba(0, 0, 0, 0) 0px,
            rgba(0, 0, 0, 0) 2px,
            rgba(0, 0, 0, 0.05) 2px,
            rgba(0, 0, 0, 0.05) 3px
          );
          mix-blend-mode: multiply;
        }

        /* ════════════════════════════════════════════════════════
         * ANIMACIÓN CORRECTA (según análisis del .mov):
         *  La chica está estática. El movimiento viene de:
         *    1. Niebla rastrera en el tercio INFERIOR (drift lento)
         *    2. Film grain animado a 0.15s (hormigueo)
         *    3. Color grading lavanda/naranja (overlay)
         * ════════════════════════════════════════════════════════ */

        /* 1 · NIEBLA RASTRERA — banda de niebla blanca azulada que
              se mueve por el tercio inferior (donde están las flores
              y la hierba). Mix-blend screen + opacity baja 12% para
              que sólo se vea como "neblina viva" sobre el suelo. */
        .ch-fog {
          position: absolute;
          left: -30%;
          right: -30%;
          bottom: -5%;
          height: 42%;
          z-index: 2;
          pointer-events: none;
          mix-blend-mode: screen;
          opacity: 0.55;
          background:
            radial-gradient(
              ellipse at 20% 65%,
              rgba(220, 215, 240, 0.65) 0%,
              rgba(220, 215, 240, 0) 38%
            ),
            radial-gradient(
              ellipse at 55% 80%,
              rgba(245, 215, 220, 0.55) 0%,
              rgba(245, 215, 220, 0) 42%
            ),
            radial-gradient(
              ellipse at 85% 60%,
              rgba(220, 220, 245, 0.5) 0%,
              rgba(220, 220, 245, 0) 38%
            );
          animation: chFogCreep 38s linear infinite;
          will-change: transform;
        }
        @keyframes chFogCreep {
          0%   { transform: translate3d(0%, 0, 0); }
          50%  { transform: translate3d(-14%, 0, 0); }
          100% { transform: translate3d(0%, 0, 0); }
        }

        /* 2 · FILM GRAIN ANIMADO — el "hormigueo" que distingue
              video cinemático de imagen estática. La textura SVG
              de noise se desplaza a posiciones pseudo-aleatorias
              cada 0.15 s (con steps() para corte abrupto, no
              interpolación suave). Esto es lo que NUNCA tenía. */
        .ch-grain {
          position: absolute;
          inset: -5%;
          z-index: 6;
          pointer-events: none;
          opacity: 0.16;
          mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='2.2' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
          background-size: 200px 200px;
          animation: chGrainShake 0.18s steps(6) infinite;
        }
        @keyframes chGrainShake {
          0%   { background-position:    0px   0px; }
          16%  { background-position:  -45px  20px; }
          33%  { background-position:   38px  -30px; }
          50%  { background-position:  -82px  55px; }
          66%  { background-position:   95px  -22px; }
          83%  { background-position:  -28px  72px; }
          100% { background-position:   60px   45px; }
        }

        /* 3 · COLOR GRADING — capa de tinte lavanda en sombras
              + naranja en altas luces. Soft-light blend para que
              afecte tonos sin alterar luminosidad. */
        .ch-grade {
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
          mix-blend-mode: soft-light;
          opacity: 0.55;
          background:
            linear-gradient(
              180deg,
              rgba(120, 80, 180, 0.35) 0%,
              rgba(120, 80, 180, 0.12) 30%,
              rgba(255, 140, 90, 0.08) 65%,
              rgba(255, 160, 100, 0.22) 100%
            );
        }

        @media (prefers-reduced-motion: reduce) {
          .ch-fog,
          .ch-grain { animation: none !important; }
        }

        /* Edition meta arriba a las esquinas */
        .ch-meta {
          position: absolute;
          top: 24px;
          left: 32px;
          right: 32px;
          z-index: 10;
          display: flex;
          justify-content: space-between;
          font-family: var(--font-mono, "JetBrains Mono", monospace);
          font-size: 10.5px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: rgba(254, 250, 235, 0.62);
        }
        @media (max-width: 600px) {
          .ch-meta {
            left: 18px;
            right: 18px;
            font-size: 9.5px;
            letter-spacing: 0.16em;
            top: 16px;
          }
        }

        /* Contenido editorial centrado */
        .ch-content {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding: clamp(96px, 16vh, 180px) 24px 0;
          text-align: center;
          color: #fefaeb;
          max-width: 920px;
          margin: 0 auto;
          height: 100%;
        }

        .ch-kicker {
          font-family: var(--font-mono, "JetBrains Mono", monospace);
          font-size: 11px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(254, 250, 235, 0.85);
          margin: 0 0 28px;
          display: inline-flex;
          align-items: center;
          gap: 14px;
          text-shadow: 0 1px 8px rgba(11, 14, 46, 0.7);
        }
        .ch-kicker::before,
        .ch-kicker::after {
          content: "";
          width: 38px;
          height: 1px;
          background: currentColor;
          opacity: 0.5;
        }

        .ch-h1 {
          font-family: var(--font-serif, "Fraunces", Georgia, serif);
          font-weight: 350;
          font-size: clamp(48px, 8.4vw, 130px);
          line-height: 0.96;
          letter-spacing: -0.025em;
          margin: 0;
          color: #fefaeb;
          text-shadow:
            0 2px 28px rgba(11, 14, 46, 0.7),
            0 1px 6px rgba(58, 35, 66, 0.6);
          text-wrap: balance;
        }
        .ch-h1 em {
          font-style: italic;
          font-family: var(--font-display, "Caveat"), cursive;
          font-weight: 600;
          color: #ffd9a8;
          letter-spacing: 0;
        }

        .ch-lead {
          margin: 28px auto 0;
          max-width: 580px;
          font-family: var(--font-serif, "Fraunces", Georgia, serif);
          font-style: italic;
          font-size: clamp(15px, 1.7vw, 19px);
          line-height: 1.55;
          color: rgba(254, 250, 235, 0.96);
          text-wrap: pretty;
          text-shadow: 0 1px 12px rgba(11, 14, 46, 0.7);
        }

        .ch-cta {
          margin-top: 36px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 28px;
          background: rgba(254, 250, 235, 0.12);
          border: 1px solid rgba(254, 250, 235, 0.55);
          color: #fefaeb;
          border-radius: 999px;
          font-family: var(--font-sans, "Inter", system-ui);
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.04em;
          text-decoration: none;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          transition: background 0.25s ease, border-color 0.25s ease,
            transform 0.25s ease;
        }
        .ch-cta:hover {
          background: rgba(254, 250, 235, 0.22);
          border-color: rgba(254, 250, 235, 0.9);
          transform: translateY(-1px);
        }
        .ch-cta:focus-visible {
          outline: 2px solid #fefaeb;
          outline-offset: 4px;
        }
        .ch-cta-arrow {
          display: inline-block;
          transition: transform 0.25s ease;
        }
        .ch-cta:hover .ch-cta-arrow {
          transform: translateX(4px);
        }

        .ch-skip {
          margin-top: 18px;
          font-family: var(--font-mono, "JetBrains Mono", monospace);
          font-size: 10.5px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(254, 250, 235, 0.7);
          text-decoration: none;
          padding-bottom: 4px;
          border-bottom: 1px dashed rgba(254, 250, 235, 0.4);
        }
        .ch-skip:hover {
          color: #fefaeb;
          border-color: #fefaeb;
        }

        /* ════════════════════════════════════════════════════════
         * MOBILE FIX — la chica del .webm no cabe bien en 9:16 con
         * object-position: 50% 80% (anclado al pie). En móvil se
         * recorta la cabeza. Cambiamos a 50% 35% para subir el foco,
         * usamos 100dvh para evitar saltos por la URL bar de iOS,
         * y bajamos el padding-top del contenido para que el texto
         * no tape la figura.
         * ════════════════════════════════════════════════════════ */
        @media (max-width: 760px) {
          .ch-hero {
            min-height: 100dvh;
            height: 100dvh;
          }
          .ch-hero-img {
            /* recentrar a la chica · ligeramente a la izquierda del
               centro horizontal y más arriba vertical para que su
               cabeza no salga del frame */
            object-position: 46% 38%;
          }
          /* atenuar las capas decorativas para que la chica sea la
             protagonista, no la niebla */
          .ch-fog { opacity: 0.42; }
          .ch-grain { opacity: 0.10; }
          .ch-scanlines { opacity: 0.5; }
          /* overlay un poco más fuerte en la parte superior para
             dar legibilidad al h1 sin oscurecer la figura */
          .ch-overlay {
            background:
              radial-gradient(
                ellipse 60% 50% at 50% 70%,
                rgba(255, 220, 180, 0.16) 0%,
                rgba(255, 220, 180, 0) 70%
              ),
              linear-gradient(
                180deg,
                rgba(10, 14, 46, 0.55) 0%,
                rgba(10, 14, 46, 0.18) 24%,
                rgba(10, 14, 46, 0) 45%,
                rgba(10, 14, 46, 0) 65%,
                rgba(10, 14, 46, 0.32) 100%
              );
          }
        }

        @media (max-width: 540px) {
          /* Mobile: kicker + h1 ARRIBA (sobre el cielo), CTA ABAJO
             (sobre el campo). La chica queda en el centro vertical
             como protagonista visual sin texto encima. */
          .ch-content {
            padding: 52px 22px 28px;
            justify-content: flex-start;
          }
          /* Empujar el CTA y el skip al fondo del hero */
          .ch-content .ch-cta { margin-top: auto !important; }
          .ch-h1 {
            line-height: 1;
            font-size: clamp(40px, 11vw, 56px);
          }
          .ch-kicker {
            font-size: 9.5px;
            letter-spacing: 0.18em;
            margin-bottom: 16px;
          }
          /* Ocultar lead en mobile pequeño — la chica + h1 ya
             comunican lo suficiente; el sub satura. Se puede leer
             tras hacer scroll. */
          .ch-lead {
            display: none;
          }
          .ch-cta {
            margin-top: 0;
            padding: 14px 26px;
            font-size: 13px;
            background: rgba(254, 250, 235, 0.18);
            border-color: rgba(254, 250, 235, 0.7);
          }
          .ch-skip {
            margin-top: 14px;
            font-size: 9.5px;
          }
          .ch-hero-img {
            /* móvil estrecho: subir el foco a la cabeza/torso */
            object-position: 50% 28%;
          }
        }

        @media (max-width: 380px) {
          /* iPhone SE — viewport más pequeño aún */
          .ch-hero-img { object-position: 50% 24%; }
          .ch-content { padding: 44px 18px 24px; }
          .ch-h1 { font-size: 38px; }
        }
      `}</style>

      {/* ── 1. VIDEO LOOP DE FONDO ─────────────────────────────────
          El propio .mov de Velorah, procesado para quitar el texto
          "Focus in a Distracted World" y el cursor del mouse, sirve
          como fondo cinemático. Trae INTRÍNSECAMENTE: la niebla, el
          grain, las scanlines, el color grading y el drift. No hace
          falta simular nada con CSS.

          Peso final: mp4 449 KB + webm 272 KB · loop 8 s a 18.5 fps.
          Reproducción autoplay muted loop playsInline para iOS.

          Fallback poster: la imagen estática v4 (mientras carga el
          video o si está prefers-reduced-motion). */}
      <video
        ref={videoRef}
        className="ch-hero-img"
        autoPlay
        muted
        loop
        playsInline
        webkit-playsinline="true"
        preload="auto"
        poster="/cinematic/hero-velorah-v4.jpg"
        aria-hidden
        controls={false}
        disablePictureInPicture
        disableRemotePlayback
      >
        {/* IMPORTANTE: mp4 PRIMERO. iOS Safari no decodifica webm —
            si pones webm antes, se queda colgado y no cae al mp4.
            Chrome/Firefox saltan el mp4 si webm matchea, así que
            tampoco hay penalidad de ancho de banda en Android. */}
        <source src="/cinematic/hero-velorah.mp4" type="video/mp4" />
        <source src="/cinematic/hero-velorah.webm" type="video/webm" />
      </video>

      {/* ── 2. Overlay gradient para contraste del texto ── */}
      <div className="ch-overlay" aria-hidden />

      {/* ── 3. Polen flotando (sólo cliente, sin reduced-motion) ── */}
      {mounted && !prefersReduced && (
        <div className="ch-pollen" aria-hidden>
          {pollen.map((p) => (
            <span
              key={p.id}
              style={
                {
                  left: `${p.left}%`,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  background: p.color,
                  "--dur": `${p.duration}s`,
                  "--delay": `${p.delay}s`,
                  boxShadow: `0 0 ${p.size * 1.5}px ${p.color}`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      )}

      {/* Capas extra eliminadas — el video ya trae fog, grain,
          scanlines y color grading nativo del .mov original. */}

      {/* ── 5. Metadata top-corners ── */}
      <div className="ch-meta">
        <span>edición n.º 020 · 12 may 2026</span>
        <span>bilbao · psicología, despacio</span>
      </div>

      {/* ── 6. Contenido editorial (sobreimpreso a la imagen) ── */}
      <div className="ch-content">
        <span className="ch-kicker">egoera · psicología, despacio</span>
        <h1 className="ch-h1">
          Mírate sin <em>prisa</em>.
        </h1>
        <p className="ch-lead">
          Un sitio para pensarte lento, sentir despacio y volver a tu cuerpo.
          Cartas semanales, un diario emocional y una brújula de preguntas
          para los días en los que no sabes por dónde.
        </p>
        <Link href="/sentir" className="ch-cta">
          Empezar el viaje
          <span className="ch-cta-arrow" aria-hidden>
            →
          </span>
        </Link>
        <Link href="/boletin" className="ch-skip">
          o suscríbete al boletín
        </Link>
      </div>
    </section>
  );
}

export default CinematicHero;
