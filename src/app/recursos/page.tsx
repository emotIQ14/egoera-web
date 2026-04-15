"use client";

import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Download, FileText, Headphones, BookOpen, Lock } from "lucide-react";

const freeResources = [
  {
    title: "Guia: 10 Tecnicas de Regulacion Emocional",
    description: "PDF con 10 tecnicas basadas en evidencia para gestionar tus emociones en el dia a dia.",
    format: "PDF — 15 paginas",
    icon: FileText,
    color: "#6BA3BE",
  },
  {
    title: "Cuestionario de Estilo de Apego",
    description: "Test interactivo para descubrir tu estilo de apego y entender tus patrones relacionales.",
    format: "Test online — 5 min",
    icon: BookOpen,
    color: "#7FB5A0",
  },
  {
    title: "Audio: Meditacion de Grounding",
    description: "Meditacion guiada de 10 minutos para anclarte al presente cuando la ansiedad aparece.",
    format: "MP3 — 10 min",
    icon: Headphones,
    color: "#A8D5C8",
  },
];

const premiumResources = [
  {
    title: "Workbook: Conoce tu Ventana de Tolerancia",
    description: "Cuaderno de trabajo de 30 paginas con ejercicios para entender y ampliar tu ventana de tolerancia.",
    price: 9.99,
    format: "PDF interactivo",
    icon: FileText,
  },
  {
    title: "Pack: Diario de Emociones (imprimible)",
    description: "Plantillas imprimibles para un ano completo de registro emocional. Incluye guia de uso.",
    price: 7.99,
    format: "PDF A4 — 52 paginas",
    icon: Download,
  },
  {
    title: "Audio Pack: 5 Meditaciones para la Ansiedad",
    description: "Coleccion de 5 meditaciones guiadas especificas para diferentes tipos de ansiedad.",
    price: 14.99,
    format: "5 MP3 — 60 min total",
    icon: Headphones,
  },
];

export default function RecursosPage() {
  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-teal text-sm font-semibold uppercase tracking-widest">
              Recursos
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold font-[family-name:var(--font-heading)] text-dark-text mt-3 mb-4">
              Herramientas para tu bienestar
            </h1>
            <p className="text-lg text-grey-text max-w-2xl mx-auto">
              Guias, ejercicios y herramientas practicas para trabajar tu salud mental
              desde casa. Recursos gratuitos y premium.
            </p>
          </div>
        </ScrollReveal>

        {/* Free Resources - Lead Magnets */}
        <section className="mb-20">
          <ScrollReveal>
            <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-dark-text mb-2">
              Recursos gratuitos
            </h2>
            <p className="text-grey-text mb-8">
              Descarga gratis a cambio de tu email. Sin spam, solo contenido de valor.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {freeResources.map((r, i) => {
              const Icon = r.icon;
              return (
                <ScrollReveal key={r.title} delay={i * 0.1}>
                  <div className="bg-white rounded-2xl p-6 border border-border card-hover h-full flex flex-col">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                      style={{ backgroundColor: `${r.color}20` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: r.color }} />
                    </div>
                    <h3 className="text-lg font-semibold text-dark-text mb-2 font-[family-name:var(--font-heading)]">
                      {r.title}
                    </h3>
                    <p className="text-sm text-grey-text leading-relaxed mb-4 flex-1">
                      {r.description}
                    </p>
                    <p className="text-xs text-grey-text mb-4">{r.format}</p>
                    <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
                      <input
                        type="email"
                        placeholder="tu@email.com"
                        className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-teal/50"
                      />
                      <button className="w-full py-2.5 bg-teal text-white rounded-lg text-sm font-medium hover:bg-teal/90 transition-colors flex items-center justify-center gap-2">
                        <Download className="w-4 h-4" />
                        Descargar gratis
                      </button>
                    </form>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </section>

        {/* Premium Resources */}
        <section className="mb-20">
          <ScrollReveal>
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-5 h-5 text-teal" />
              <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-dark-text">
                Recursos premium
              </h2>
            </div>
            <p className="text-grey-text mb-8">
              Material de trabajo en profundidad para complementar tu proceso terapeutico.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {premiumResources.map((r, i) => {
              const Icon = r.icon;
              return (
                <ScrollReveal key={r.title} delay={i * 0.1}>
                  <div className="bg-white rounded-2xl p-6 border-2 border-teal/20 card-hover h-full flex flex-col">
                    <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-teal" />
                    </div>
                    <h3 className="text-lg font-semibold text-dark-text mb-2 font-[family-name:var(--font-heading)]">
                      {r.title}
                    </h3>
                    <p className="text-sm text-grey-text leading-relaxed mb-4 flex-1">
                      {r.description}
                    </p>
                    <p className="text-xs text-grey-text mb-4">{r.format}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-dark-text">
                        {r.price}<span className="text-sm text-grey-text ml-1">EUR</span>
                      </span>
                      <button className="px-5 py-2.5 bg-teal text-white rounded-lg text-sm font-medium hover:bg-teal/90 transition-colors">
                        Comprar
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </section>

        {/* Affiliate Books */}
        <section>
          <ScrollReveal>
            <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-dark-text mb-2">
              Libros recomendados
            </h2>
            <p className="text-grey-text mb-8">
              Nuestra seleccion de lecturas imprescindibles sobre psicologia y bienestar emocional.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "El cuerpo lleva la cuenta", author: "Bessel van der Kolk", topic: "Trauma", asin: "8494759000" },
              { title: "Apegos feroces", author: "Vivian Gornick", topic: "Relaciones", asin: "8418526076" },
              { title: "Pensar rapido, pensar despacio", author: "Daniel Kahneman", topic: "Sesgos", asin: "8499922163" },
              { title: "El arte de no amargarse la vida", author: "Rafael Santandreu", topic: "Bienestar", asin: "8425348897" },
              { title: "Reinventa tu vida", author: "J. Young & J. Klosko", topic: "Esquemas", asin: "844930764X" },
              { title: "Limites", author: "H. Cloud & J. Townsend", topic: "Asertividad", asin: "0829728961" },
              { title: "El poder del ahora", author: "Eckhart Tolle", topic: "Mindfulness", asin: "8484452069" },
              { title: "Tus zonas erroneas", author: "Wayne Dyer", topic: "Autoayuda", asin: "8499085504" },
            ].map((book, i) => (
              <ScrollReveal key={book.title} delay={i * 0.05}>
                <a
                  href={`https://www.amazon.es/dp/${book.asin}?tag=abc01f7-21`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 bg-white rounded-xl border border-border card-hover group"
                >
                  <span className="text-xs font-medium text-teal">{book.topic}</span>
                  <h4 className="text-sm font-semibold text-dark-text mt-1 group-hover:text-teal transition-colors line-clamp-2">
                    {book.title}
                  </h4>
                  <p className="text-xs text-grey-text mt-1">{book.author}</p>
                  <span className="text-xs text-teal mt-2 inline-block">Ver en Amazon →</span>
                </a>
              </ScrollReveal>
            ))}
          </div>
          <p className="text-xs text-grey-text mt-4 text-center">
            * Los enlaces de Amazon son de afiliados. Si compras a traves de ellos, recibimos una
            pequena comision sin coste adicional para ti.
          </p>
        </section>
      </div>
    </div>
  );
}
