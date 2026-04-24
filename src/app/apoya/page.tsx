import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Coffee,
  BookOpen,
  Users,
  ExternalLink,
  Send,
} from "lucide-react";
import { MONETIZATION_CONFIG } from "@/lib/monetization-config";

export const metadata: Metadata = {
  title: "Apoya Egoera — Ayudanos a seguir creando",
  description:
    "Egoera se mantiene gracias a su comunidad. Descubre como puedes apoyarnos: newsletter, donaciones, afiliados o siguiendonos en redes.",
};

export default function ApoyaPage() {
  const cards = [
    {
      icon: Mail,
      title: "Suscribete a la newsletter",
      description:
        "Un articulo semanal, gratuito y sin spam. Es la manera mas directa de sostener el proyecto.",
      cta: "Suscribirme",
      href: "/recursos#newsletter",
      accent: "teal" as const,
    },
    {
      icon: Coffee,
      title: "Invitanos a un cafe",
      description:
        "Aportaciones puntuales via Buy Me a Coffee. Cada una financia horas de redaccion y revision.",
      cta: "Apoyar con un cafe",
      href: MONETIZATION_CONFIG.buyMeCoffee.url,
      external: true,
      accent: "amber" as const,
    },
    {
      icon: BookOpen,
      title: "Compra por Amazon Afiliados",
      description:
        "Si vas a comprar un libro de psicologia, usar nuestros enlaces no te cuesta nada y nos deja una pequena comision.",
      cta: "Ver lecturas recomendadas",
      href: "/recursos#lecturas",
      accent: "sage" as const,
    },
    {
      icon: Users,
      title: "Siguenos en redes",
      description:
        "Comparte, comenta y difunde. Cuanta mas gente nos sigue, mas podemos publicar sin muros de pago.",
      cta: "@egoera.psikologia",
      href: "https://instagram.com/egoera.psikologia",
      external: true,
      accent: "mint" as const,
    },
  ];

  return (
    <main className="relative overflow-hidden pb-24 pt-24">
      <div className="watercolor-section watercolor-deep absolute inset-0 -z-10" aria-hidden />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal/10 px-3 py-1 text-xs font-medium text-teal">
            Apoya el proyecto
          </span>
          <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-bold leading-tight text-dark-text sm:text-5xl">
            Egoera se mantiene <span className="paint-stroke-highlight">gracias a ti</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-grey-text">
            No tenemos patrocinadores agresivos, ni cursos de miles de euros,
            ni planes premium bloqueando el contenido. Solo psicologia accesible,
            basada en evidencia. Si te sirve, puedes ayudarnos a sostenerlo.
          </p>
        </div>

        {/* 4 apoyo cards */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {cards.map((card) => (
            <SupportCard key={card.title} {...card} />
          ))}
        </div>

        {/* Telegram bot */}
        <div className="mt-14 rounded-3xl border border-teal/15 bg-white/80 p-8 text-center backdrop-blur">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal/10">
            <Send className="h-7 w-7 text-teal" />
          </div>
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-semibold text-dark-text">
            Habla con nosotros por Telegram
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-grey-text">
            Tenemos un bot que te responde con articulos, ejercicios y recursos
            segun lo que estes atravesando. Gratuito y sin registro.
          </p>
          <a
            href={MONETIZATION_CONFIG.telegram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-teal px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-teal/90"
          >
            <Send className="h-4 w-4" />
            Abrir @{MONETIZATION_CONFIG.telegram.username}
          </a>
        </div>

        {/* Bio Ander */}
        <AuthorBio />
      </div>
    </main>
  );
}

function SupportCard({
  icon: Icon,
  title,
  description,
  cta,
  href,
  external,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  cta: string;
  href: string;
  external?: boolean;
  accent: "teal" | "sage" | "mint" | "amber";
}) {
  const accentMap: Record<string, string> = {
    teal: "bg-teal/10 text-teal",
    sage: "bg-sage/10 text-sage",
    mint: "bg-mint/20 text-dark-text",
    amber: "bg-amber-100 text-amber-600",
  };

  const cardClass = "group flex h-full flex-col rounded-2xl border border-border bg-white/90 p-6 transition-all hover:-translate-y-1 hover:border-teal/30 hover:shadow-lg";

  const content = (
    <>
      <div
        className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${accentMap[accent]}`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-dark-text">
        {title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-grey-text">
        {description}
      </p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-teal">
        {cta} {external ? <ExternalLink className="h-3.5 w-3.5" /> : <span aria-hidden>→</span>}
      </span>
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cardClass}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={cardClass}>
      {content}
    </Link>
  );
}

function AuthorBio() {
  return (
    <div className="mt-14 rounded-3xl border border-border bg-white/80 p-8 backdrop-blur">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-teal/10">
          {/* Fallback avatar si no hay imagen */}
          <Image
            src="/egoera-logo.png"
            alt="Ander Bilbao"
            fill
            sizes="96px"
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-dark-text">
            Ander Bilbao Castejon
          </h3>
          <p className="text-sm text-grey-text">Creador de Egoera Psikologia</p>
          <p className="mt-3 text-sm leading-relaxed text-dark-text">
            Escribo sobre psicologia porque creo que el conocimiento clinico no
            deberia quedarse en consulta. En Egoera traduzco investigacion
            reciente a herramientas practicas para el dia a dia, sin
            infantilizar y sin recetas magicas. Si este proyecto te acompana,
            cualquier forma de apoyo ayuda a mantenerlo gratuito.
          </p>
        </div>
      </div>
    </div>
  );
}
