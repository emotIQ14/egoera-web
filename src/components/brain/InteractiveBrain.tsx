"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface BrainRegion {
  id: string;
  label: string;
  description: string;
  category: string;
  color: string;
  articles: { title: string; slug: string }[];
  path: string;
}

const regions: BrainRegion[] = [
  {
    id: "prefrontal",
    label: "Corteza Prefrontal",
    description: "Toma de decisiones, planificacion y regulacion emocional. Aqui se gestionan los impulsos y se construye la resiliencia.",
    category: "regulacion-emocional",
    color: "#6BA3BE",
    articles: [
      { title: "5 tecnicas para regular tus emociones", slug: "tecnicas-regulacion-emocional" },
      { title: "Que es la ventana de tolerancia", slug: "ventana-de-tolerancia" },
      { title: "Mindfulness para principiantes", slug: "mindfulness-principiantes" },
    ],
    path: "M 180 80 C 200 40, 280 30, 320 50 C 350 60, 370 80, 360 110 C 350 135, 310 145, 270 140 C 230 135, 190 120, 180 100 Z",
  },
  {
    id: "temporal",
    label: "Lobulo Temporal",
    description: "Memoria, lenguaje y procesamiento auditivo. Fundamental para entender las relaciones y los patrones de apego.",
    category: "relaciones-apego",
    color: "#7FB5A0",
    articles: [
      { title: "Los 4 estilos de apego explicados", slug: "estilos-de-apego" },
      { title: "Dependencia emocional: como identificarla", slug: "dependencia-emocional" },
      { title: "Comunicacion asertiva en pareja", slug: "comunicacion-asertiva-pareja" },
    ],
    path: "M 150 140 C 140 160, 130 200, 140 240 C 150 265, 175 275, 200 270 C 220 265, 235 245, 240 220 C 245 195, 235 165, 220 150 C 205 138, 170 130, 150 140 Z",
  },
  {
    id: "parietal",
    label: "Lobulo Parietal",
    description: "Percepcion sensorial e integracion. Conecta la experiencia corporal con la conciencia — clave para el autoconocimiento.",
    category: "autoconocimiento",
    color: "#A8D5C8",
    articles: [
      { title: "Sesgos cognitivos que distorsionan tu realidad", slug: "sesgos-cognitivos" },
      { title: "Que es la proyeccion psicologica", slug: "proyeccion-psicologica" },
      { title: "Autoestima real vs autoestima inflada", slug: "autoestima-real-vs-inflada" },
    ],
    path: "M 270 50 C 310 40, 360 50, 390 75 C 415 95, 425 130, 415 160 C 405 185, 380 195, 350 190 C 320 185, 290 165, 275 140 C 265 120, 265 70, 270 50 Z",
  },
  {
    id: "amigdala",
    label: "Amigdala",
    description: "Centro del miedo y las respuestas emocionales. Detecta amenazas y activa la respuesta de lucha o huida.",
    category: "desmitificacion",
    color: "#E8A87C",
    articles: [
      { title: "Mitos sobre la ansiedad que debes dejar de creer", slug: "mitos-ansiedad" },
      { title: "Tu amigdala no es tu enemiga", slug: "amigdala-no-enemiga" },
      { title: "Ir al psicologo no es de locos", slug: "ir-al-psicologo" },
    ],
    path: "M 250 180 C 260 170, 280 168, 290 175 C 300 182, 305 200, 298 215 C 291 228, 270 232, 258 222 C 246 212, 240 192, 250 180 Z",
  },
  {
    id: "frontal",
    label: "Area de Broca",
    description: "Produccion del habla y comunicacion. Esencial para expresar limites, decir no y la asertividad.",
    category: "limites-asertividad",
    color: "#B8A9C9",
    articles: [
      { title: "Como poner limites sin culpa", slug: "poner-limites-sin-culpa" },
      { title: "Decir no es cuidarte", slug: "decir-no-es-cuidarte" },
      { title: "Comunicacion no violenta: guia practica", slug: "comunicacion-no-violenta" },
    ],
    path: "M 160 100 C 155 120, 148 145, 155 170 C 160 185, 180 195, 200 190 C 215 186, 228 170, 235 155 C 240 140, 235 120, 220 110 C 205 100, 175 95, 160 100 Z",
  },
  {
    id: "cerebelo",
    label: "Cerebelo",
    description: "Habitos, rutinas y aprendizaje motor. Donde se automatizan los comportamientos del dia a dia.",
    category: "psicologia-cotidiana",
    color: "#F4B8C1",
    articles: [
      { title: "La ciencia detras de los habitos", slug: "ciencia-habitos" },
      { title: "Procrastinacion: por que la haces y como pararla", slug: "procrastinacion" },
      { title: "Rituales matutinos que cambian tu dia", slug: "rituales-matutinos" },
    ],
    path: "M 340 200 C 370 195, 410 205, 430 230 C 445 250, 440 280, 420 295 C 395 310, 360 305, 340 290 C 320 275, 315 245, 320 225 C 325 210, 330 203, 340 200 Z",
  },
];

export function InteractiveBrain() {
  const [active, setActive] = useState<BrainRegion | null>(null);

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Brain SVG */}
        <div className="relative">
          <svg
            viewBox="100 10 400 320"
            className="w-full h-auto max-w-lg mx-auto"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Brain outline */}
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="brain-base" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#e8f0f2" />
                <stop offset="100%" stopColor="#d4e6ec" />
              </linearGradient>
            </defs>

            {/* Brain silhouette background */}
            <path
              d="M 150 80 C 170 30, 280 15, 340 35 C 400 50, 440 90, 445 150 C 450 210, 430 270, 400 300 C 370 325, 300 320, 270 300 C 240 320, 190 310, 160 280 C 130 250, 120 190, 130 150 C 135 115, 140 95, 150 80 Z"
              fill="url(#brain-base)"
              stroke="#c4d8e0"
              strokeWidth="1.5"
              opacity="0.5"
            />

            {/* Clickable regions */}
            {regions.map((region) => (
              <g key={region.id}>
                <path
                  d={region.path}
                  fill={region.color}
                  opacity={active?.id === region.id ? 0.9 : 0.45}
                  className="brain-region"
                  onClick={() => setActive(active?.id === region.id ? null : region)}
                  onMouseEnter={(e) => {
                    if (!active) {
                      (e.target as SVGPathElement).style.opacity = "0.7";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (active?.id !== region.id) {
                      (e.target as SVGPathElement).style.opacity = "0.45";
                    }
                  }}
                  filter={active?.id === region.id ? "url(#glow)" : undefined}
                />
                {/* Region label */}
                {active?.id === region.id && (
                  <text
                    x={getCenter(region.path).x}
                    y={getCenter(region.path).y}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="600"
                    fill="#2D373C"
                    className="pointer-events-none select-none"
                  >
                    {region.label}
                  </text>
                )}
              </g>
            ))}

            {/* Neural connection lines */}
            <g opacity="0.15" stroke="#6BA3BE" strokeWidth="0.5" fill="none">
              <path d="M 270 100 Q 280 150 270 180" />
              <path d="M 300 130 Q 330 160 350 200" />
              <path d="M 200 150 Q 230 170 250 180" />
              <path d="M 290 180 Q 310 210 340 230" />
              <path d="M 200 200 Q 240 230 270 250" />
            </g>

            {/* Pulse dots */}
            {!active && (
              <g className="pulse-glow">
                {regions.map((r) => {
                  const center = getCenter(r.path);
                  return (
                    <circle
                      key={r.id}
                      cx={center.x}
                      cy={center.y}
                      r="4"
                      fill={r.color}
                      opacity="0.6"
                    />
                  );
                })}
              </g>
            )}
          </svg>

          {/* Mobile hint */}
          {!active && (
            <p className="text-center text-sm text-grey-text mt-4 animate-pulse">
              Toca una zona del cerebro para explorar
            </p>
          )}
        </div>

        {/* Content panel */}
        <AnimatePresence mode="wait">
          {active ? (
            <motion.div
              key={active.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-border"
            >
              <div
                className="w-12 h-1 rounded-full mb-4"
                style={{ backgroundColor: active.color }}
              />
              <h3 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-dark-text mb-2">
                {active.label}
              </h3>
              <p className="text-grey-text leading-relaxed mb-6">
                {active.description}
              </p>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-dark-text uppercase tracking-wider">
                  Articulos relacionados
                </h4>
                {active.articles.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/blog/${article.slug}`}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-warm-bg transition-colors group"
                  >
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: active.color }}
                    />
                    <span className="text-sm text-dark-text group-hover:text-teal transition-colors flex-1">
                      {article.title}
                    </span>
                    <ArrowRight className="w-4 h-4 text-grey-text group-hover:text-teal transition-colors" />
                  </Link>
                ))}
              </div>

              <Link
                href={`/blog?cat=${active.category}`}
                className="inline-flex items-center gap-2 mt-6 text-sm font-medium text-teal hover:underline"
              >
                Ver todos los articulos de {active.label}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center lg:text-left p-8"
            >
              <h3 className="text-3xl font-bold font-[family-name:var(--font-heading)] text-dark-text mb-4">
                Explora tu mente
              </h3>
              <p className="text-grey-text leading-relaxed max-w-md">
                Cada area del cerebro tiene una historia que contar. Haz clic en una region
                para descubrir articulos sobre regulacion emocional, relaciones, autoconocimiento
                y mucho mas.
              </p>
              <div className="flex flex-wrap gap-2 mt-6">
                {regions.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setActive(r)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium text-white transition-transform hover:scale-105"
                    style={{ backgroundColor: r.color }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function getCenter(pathStr: string) {
  const nums = pathStr.match(/[\d.]+/g)?.map(Number) ?? [];
  let x = 0, y = 0, count = 0;
  for (let i = 0; i < nums.length - 1; i += 2) {
    x += nums[i];
    y += nums[i + 1];
    count++;
  }
  return { x: x / count, y: y / count };
}
