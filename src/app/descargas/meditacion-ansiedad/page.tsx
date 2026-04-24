import type { Metadata } from "next";
import Link from "next/link";
import { Headphones, Check, ArrowLeft } from "lucide-react";
import { LeadMagnetForm } from "@/components/monetization/LeadMagnetForm";

export const metadata: Metadata = {
  title: "Meditacion guiada para la ansiedad — MP3 gratuito",
  description:
    "15 minutos de meditacion guiada especifica para reducir ansiedad, basada en protocolos de mindfulness y respiracion. Audio gratuito.",
};

const BENEFITS = [
  "15 minutos de meditacion guiada en espanol.",
  "Tecnica combinada: respiracion + body scan.",
  "Audio de alta calidad, descargable o via streaming.",
  "Eficaz en ansiedad anticipatoria y bucles de rumiacion.",
];

export default function MeditacionAnsiedadPage() {
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
            <span className="inline-flex items-center gap-1.5 rounded-full bg-mint/20 px-3 py-1 text-xs font-medium text-dark-text">
              Audio gratuito
            </span>
            <h1 className="mt-4 font-[family-name:var(--font-heading)] text-3xl font-bold leading-tight text-dark-text sm:text-4xl md:text-5xl">
              Meditacion guiada para la ansiedad
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-grey-text">
              Un audio de 15 minutos disenado para calmar el sistema nervioso
              cuando la ansiedad aprieta. Puedes escucharlo cuando lo necesites.
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

          <div className="rounded-3xl border border-mint/30 bg-white/80 p-6 shadow-sm backdrop-blur sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mint/20">
                <Headphones className="h-6 w-6 text-teal" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-grey-text">MP3</p>
                <p className="text-sm font-medium text-dark-text">Meditacion guiada</p>
              </div>
            </div>
            <LeadMagnetForm
              leadMagnet="meditacion-ansiedad"
              deliveryUrl="https://soundcloud.com/egoerapsikologia/meditacion-ansiedad"
              ctaLabel="Enviarme la meditacion"
              resourceLabel="la meditacion"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
