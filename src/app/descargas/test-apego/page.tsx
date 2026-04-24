import type { Metadata } from "next";
import Link from "next/link";
import { Heart, Check, ArrowLeft } from "lucide-react";
import { LeadMagnetForm } from "@/components/monetization/LeadMagnetForm";

export const metadata: Metadata = {
  title: "Test de apego interactivo — Descubre tu estilo",
  description:
    "Test de apego validado, basado en Bartholomew & Horowitz. Descubre tu estilo relacional con un informe personalizado gratuito.",
};

const BENEFITS = [
  "20 preguntas basadas en modelos clasicos de apego.",
  "Identifica tu estilo: seguro, ansioso, evitativo o desorganizado.",
  "Informe personalizado en tu correo.",
  "Recomendaciones de lectura segun tu perfil.",
];

export default function TestApegoPage() {
  return (
    <main className="relative overflow-hidden pb-20 pt-24">
      <div className="watercolor-section watercolor-deep absolute inset-0 -z-10" aria-hidden />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/recursos"
          className="mb-6 inline-flex items-center gap-2 text-sm text-grey-text transition-colors hover:text-teal"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a recursos
        </Link>

        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sage/10 px-3 py-1 text-xs font-medium text-sage">
              Test interactivo
            </span>
            <h1 className="mt-4 font-[family-name:var(--font-heading)] text-3xl font-bold leading-tight text-dark-text sm:text-4xl md:text-5xl">
              Descubre tu estilo de apego
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-grey-text">
              Un test validado y gratuito para entender como te vinculas en tus
              relaciones. Obten un informe personalizado con recomendaciones concretas.
            </p>

            <ul className="mt-8 space-y-3">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-sage/15">
                    <Check className="h-3 w-3 text-sage" />
                  </div>
                  <span className="text-sm text-dark-text">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-sage/15 bg-white/80 p-6 shadow-sm backdrop-blur sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage/10">
                <Heart className="h-6 w-6 text-sage" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-grey-text">Test</p>
                <p className="text-sm font-medium text-dark-text">Estilo de apego</p>
              </div>
            </div>
            <LeadMagnetForm
              leadMagnet="test-apego"
              deliveryUrl="/test-apego"
              ctaLabel="Empezar el test"
              resourceLabel="el test"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
