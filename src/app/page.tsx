"use client";

import { useRef, type MouseEvent } from "react";
import Link from "next/link";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { HeroSection } from "@/components/layout/HeroSection";
import { NewsletterCTA } from "@/components/layout/NewsletterCTA";
import { WatercolorBlob } from "@/components/animations/WatercolorBlob";
import { PaintSplashes } from "@/components/animations/PaintSplashes";
import { BrainCanvas } from "@/components/brain/BrainCanvas";
import { Clock, ArrowRight, PenLine } from "lucide-react";

/* ── Static data ── */

const posts = [
  {
    slug: "estilos-de-apego",
    title: "Los 4 estilos de apego: cual es el tuyo y como te afecta",
    excerpt: "Tu estilo de apego condiciona como te relacionas. Descubre cual es el tuyo y como impacta en tus vinculos afectivos.",
    category: "Relaciones y Apego",
    categoryColor: "#7FB5A0",
    readTime: 8,
    date: "10 Abr 2026",
  },
  {
    slug: "ventana-de-tolerancia",
    title: "Que es la ventana de tolerancia y por que deberias conocerla",
    excerpt: "Entender tu ventana de tolerancia es clave para regular tus emociones. Te explicamos este concepto fundamental de la psicologia.",
    category: "Regulacion Emocional",
    categoryColor: "#6BA3BE",
    readTime: 6,
    date: "7 Abr 2026",
  },
  {
    slug: "sesgos-cognitivos",
    title: "7 sesgos cognitivos que distorsionan tu realidad sin que lo sepas",
    excerpt: "Tu cerebro te engana mas de lo que crees. Estos sesgos cognitivos influyen en tus decisiones diarias.",
    category: "Autoconocimiento",
    categoryColor: "#A8D5C8",
    readTime: 10,
    date: "3 Abr 2026",
  },
  {
    slug: "poner-limites-sin-culpa",
    title: "Como poner limites sin sentir culpa: guia practica",
    excerpt: "Poner limites no es egoismo, es autocuidado. Aprende a establecer limites sanos en tus relaciones.",
    category: "Limites y Asertividad",
    categoryColor: "#B8A9C9",
    readTime: 7,
    date: "30 Mar 2026",
  },
  {
    slug: "mitos-ansiedad",
    title: "5 mitos sobre la ansiedad que debes dejar de creer",
    excerpt: "La ansiedad es una de las condiciones mas incomprendidas. Desmontamos los mitos mas comunes.",
    category: "Desmitificacion",
    categoryColor: "#E8A87C",
    readTime: 5,
    date: "26 Mar 2026",
  },
  {
    slug: "ciencia-habitos",
    title: "La ciencia detras de los habitos: por que cuesta tanto cambiar",
    excerpt: "Cambiar habitos es dificil porque tu cerebro esta programado para la eficiencia. Asi funciona.",
    category: "Psicologia Cotidiana",
    categoryColor: "#F4B8C1",
    readTime: 9,
    date: "22 Mar 2026",
  },
];

const diaryEmojis = [
  { emoji: "\u{1F60A}", label: "Feliz" },
  { emoji: "\u{1F614}", label: "Triste" },
  { emoji: "\u{1F620}", label: "Enfadado" },
  { emoji: "\u{1F630}", label: "Ansioso" },
  { emoji: "\u{1F60C}", label: "En calma" },
  { emoji: "\u{1F914}", label: "Reflexivo" },
];

/* ── Tilt Card component ── */

function TiltCard({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  };

  return (
    <div
      ref={cardRef}
      className={`tilt-card ${className}`}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}

/* ── Watercolor SVG divider ── */

function WatercolorStrokeDivider() {
  return (
    <div className="watercolor-divider" aria-hidden="true">
      <svg
        viewBox="0 0 1200 60"
        preserveAspectRatio="none"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="divider-paint">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" />
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>
        <path
          d="M0,30 Q150,10 300,28 T600,25 T900,32 T1200,20"
          stroke="rgba(107,163,190,0.2)"
          strokeWidth="4"
          fill="none"
          filter="url(#divider-paint)"
          strokeLinecap="round"
        />
        <path
          d="M0,35 Q200,50 400,32 T800,38 T1200,30"
          stroke="rgba(168,213,200,0.18)"
          strokeWidth="3"
          fill="none"
          filter="url(#divider-paint)"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/* ── Page ── */

export default function HomePage() {
  return (
    <>
      <PaintSplashes />
      <div className="floating-particles" aria-hidden="true" />
      <HeroSection />

      <WatercolorStrokeDivider />

      {/* 3D Brain Placeholder */}
      <section
        id="brain-3d-container"
        className="py-20 sm:py-28 px-4 sm:px-8 lg:px-12 watercolor-section"
      >
        <div className="relative z-10 w-full">
          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="text-teal text-sm font-semibold uppercase tracking-widest">
                Explora por temas
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold font-[family-name:var(--font-heading)] text-dark-text mt-3">
                Tu cerebro, tus temas
              </h2>
              <p className="text-grey-text mt-4 max-w-2xl mx-auto text-lg">
                Cada zona del cerebro conecta con un area de la psicologia.
                Interactua y descubre contenido relevante para ti.
              </p>
            </div>
          </ScrollReveal>
          <div className="w-full h-[450px] sm:h-[550px] lg:h-[600px] rounded-3xl overflow-hidden">
            <BrainCanvas />
          </div>
        </div>
      </section>

      <WatercolorStrokeDivider />

      {/* Articles — Full-width grid with glass cards */}
      <section className="py-20 sm:py-28 px-4 sm:px-8 lg:px-12 watercolor-section watercolor-deep paint-splatter">
        <WatercolorBlob color="#6BA3BE" size={400} top="10%" right="-5%" delay={1} />
        <WatercolorBlob color="#A8D5C8" size={350} bottom="15%" left="-3%" delay={3} />

        <div className="relative z-10 w-full">
          <ScrollReveal>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
              <div>
                <span className="text-teal text-sm font-semibold uppercase tracking-widest">
                  Ultimos articulos
                </span>
                <h2 className="text-4xl sm:text-5xl font-bold font-[family-name:var(--font-heading)] text-dark-text mt-3">
                  <span className="paint-stroke-highlight">Lee lo mas reciente</span>
                </h2>
              </div>
              <Link
                href="/blog"
                className="text-teal text-sm font-medium hover:underline flex items-center gap-1"
              >
                Ver todos los articulos <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>

          {/* Full-width responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <ScrollReveal key={post.slug} delay={i * 0.08}>
                <TiltCard
                  className="glass-card card-color-bar rounded-2xl overflow-hidden h-full"
                  style={{ "--bar-color": post.categoryColor } as React.CSSProperties}
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block p-6 sm:p-7 h-full group"
                  >
                    <span
                      className="inline-block px-3 py-1 rounded-full text-xs font-medium text-white mb-4"
                      style={{ backgroundColor: post.categoryColor }}
                    >
                      {post.category}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold font-[family-name:var(--font-heading)] text-dark-text mb-3 group-hover:text-teal transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-grey-text text-sm leading-relaxed mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-2">
                      <div className="flex items-center gap-3 text-xs text-grey-text">
                        <span>{post.date}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {post.readTime} min
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-teal opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <WatercolorStrokeDivider />

      {/* Diario Emocional CTA — Watercolor integrated */}
      <section className="py-20 sm:py-28 px-4 sm:px-8 lg:px-12 diary-cta-watercolor watercolor-section watercolor-deep">
        <div className="relative z-10 w-full max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="glass-card rounded-3xl p-8 sm:p-12 text-center">
              <div className="flex justify-center gap-3 mb-6">
                {diaryEmojis.map((item) => (
                  <span
                    key={item.label}
                    className="text-3xl sm:text-4xl"
                    title={item.label}
                  >
                    {item.emoji}
                  </span>
                ))}
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-heading)] text-dark-text mb-4">
                <span className="paint-stroke-highlight">Diario Emocional</span> Egoera
              </h2>
              <p className="text-grey-text text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
                Registra tu estado de animo diario, detecta patrones emocionales
                y entiende mejor como te sientes. Tu herramienta personal de bienestar,
                directamente desde el navegador.
              </p>
              <Link
                href="/diario"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-teal text-white rounded-full text-lg font-medium hover:bg-teal/90 transition-all hover:shadow-lg hover:shadow-teal/20"
              >
                <PenLine className="w-5 h-5" />
                Abrir Diario Emocional
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <WatercolorStrokeDivider />

      {/* Newsletter */}
      <NewsletterCTA />
    </>
  );
}
