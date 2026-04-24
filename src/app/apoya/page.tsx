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
  title: "Apoya Egoera",
  description:
    "Egoera se mantiene gracias a su comunidad. Descubre como puedes apoyar el vlog de Ander Bilbao: newsletter, cafe, afiliados o redes.",
};

export default function ApoyaPage() {
  const cards = [
    {
      icon: Mail,
      title: "Suscribete a la newsletter",
      description:
        "Un articulo semanal, gratuito y sin spam. La forma mas directa de sostener el proyecto.",
      cta: "Suscribirme",
      href: "/#newsletter",
    },
    {
      icon: Coffee,
      title: "Invitame a un cafe",
      description:
        "Aportaciones puntuales via Buy Me a Coffee. Cada una financia horas de escritura y revision.",
      cta: "Apoyar con un cafe",
      href: MONETIZATION_CONFIG.buyMeCoffee.url,
      external: true,
    },
    {
      icon: BookOpen,
      title: "Compra por Amazon Afiliados",
      description:
        "Si vas a comprar un libro de psicologia, usar mis enlaces no te cuesta nada y me deja una pequena comision.",
      cta: "Ver lecturas recomendadas",
      href: "/blog",
    },
    {
      icon: Users,
      title: "Siguenos en redes",
      description:
        "Comparte, comenta y difunde. Cuanta mas gente nos sigue, mas podemos publicar sin muros de pago.",
      cta: "@egoera.psikologia",
      href: "https://instagram.com/egoera.psikologia",
      external: true,
    },
  ];

  return (
    <main className="relative overflow-hidden pt-28 pb-24">
      <section className="mx-auto max-w-[900px] px-5 pt-16 md:px-12">
        <div className="kicker mb-5">Apoya el proyecto</div>
        <h1
          className="mb-6 leading-none tracking-[-0.03em]"
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 300,
            fontSize: "clamp(48px, 7vw, 96px)",
          }}
        >
          Egoera se mantiene{" "}
          <em className="italic" style={{ color: "var(--accent)" }}>
            gracias a ti.
          </em>
        </h1>
        <p
          className="max-w-[620px] leading-[1.6]"
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: 20,
            color: "var(--ink-dim)",
          }}
        >
          No tengo patrocinadores agresivos, ni cursos de miles de euros, ni
          planes premium bloqueando el contenido. Solo psicologia accesible,
          basada en evidencia. Si te sirve, puedes ayudarme a sostenerlo.
        </p>
      </section>

      <section className="mx-auto mt-16 max-w-[1100px] px-5 md:px-12">
        <div className="grid gap-4 sm:grid-cols-2">
          {cards.map((card) => (
            <SupportCard key={card.title} {...card} />
          ))}
        </div>
      </section>

      {/* Telegram */}
      <section className="mx-auto mt-16 max-w-[900px] px-5 md:px-12">
        <div
          className="rounded-sm border p-10 text-center"
          style={{
            borderColor: "var(--rule)",
            background: "var(--bg-2)",
          }}
        >
          <div
            className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full"
            style={{
              background: "rgba(168,194,182,0.1)",
              border: "1px solid var(--rule)",
            }}
          >
            <Send className="h-6 w-6" style={{ color: "var(--accent)" }} />
          </div>
          <h2
            className="mb-3 tracking-[-0.02em]"
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 300,
              fontSize: 36,
            }}
          >
            Habla conmigo por{" "}
            <em className="italic" style={{ color: "var(--accent)" }}>
              Telegram
            </em>
          </h2>
          <p
            className="mx-auto mb-7 max-w-[540px] leading-[1.6]"
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: 17,
              color: "var(--ink-dim)",
            }}
          >
            Tengo un bot que te responde con articulos, ejercicios y recursos
            segun lo que estes atravesando. Gratuito y sin registro.
          </p>
          <a
            href={MONETIZATION_CONFIG.telegram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[13px] font-medium"
            style={{
              background: "var(--ink)",
              color: "var(--bg)",
              fontFamily: "var(--font-sans)",
            }}
          >
            <Send className="h-4 w-4" />
            Abrir @{MONETIZATION_CONFIG.telegram.username}
          </a>
        </div>
      </section>

      {/* Bio */}
      <AuthorBio />
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
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  cta: string;
  href: string;
  external?: boolean;
}) {
  const cardClass =
    "group flex h-full flex-col rounded-sm border p-8 transition-all hover:-translate-y-0.5 hover:border-[color:var(--accent)]";
  const cardStyle: React.CSSProperties = {
    borderColor: "var(--rule)",
    background: "rgba(12,16,14,0.4)",
  };

  const content = (
    <>
      <div
        className="mb-5 flex h-11 w-11 items-center justify-center rounded-full"
        style={{
          background: "rgba(168,194,182,0.1)",
          border: "1px solid var(--rule)",
        }}
      >
        <Icon className="h-5 w-5" />
      </div>
      <h3
        className="mb-3 leading-tight tracking-[-0.01em]"
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: 24,
          fontWeight: 400,
          color: "var(--ink)",
        }}
      >
        {title}
      </h3>
      <p
        className="mb-6 flex-1 leading-[1.6]"
        style={{
          color: "var(--ink-dim)",
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          fontSize: 15,
        }}
      >
        {description}
      </p>
      <span
        className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.18em]"
        style={{
          color: "var(--accent)",
          fontFamily: "var(--font-mono)",
        }}
      >
        {cta}{" "}
        {external ? <ExternalLink className="h-3.5 w-3.5" /> : <span>→</span>}
      </span>
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cardClass}
        style={cardStyle}
      >
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={cardClass} style={cardStyle}>
      {content}
    </Link>
  );
}

function AuthorBio() {
  return (
    <section className="mx-auto mt-16 max-w-[900px] px-5 md:px-12">
      <div
        className="rounded-sm border p-10"
        style={{
          borderColor: "var(--rule)",
          background: "var(--bg-2)",
        }}
      >
        <div className="flex flex-col gap-7 sm:flex-row sm:items-start">
          <div
            className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-full"
            style={{
              background: "rgba(168,194,182,0.1)",
              border: "1px solid var(--rule)",
            }}
          >
            <Image
              src="/egoera-logo.png"
              alt="Ander Bilbao"
              fill
              sizes="112px"
              className="object-cover p-3"
            />
          </div>
          <div className="flex-1">
            <h3
              className="mb-1 tracking-[-0.02em]"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 32,
                fontWeight: 400,
              }}
            >
              Ander Bilbao Castejon
            </h3>
            <p
              className="mb-4 text-[12px] uppercase tracking-[0.22em]"
              style={{
                color: "var(--accent)",
                fontFamily: "var(--font-mono)",
              }}
            >
              Creador de Egoera · Donostia
            </p>
            <p
              className="leading-[1.65]"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 17,
                color: "var(--ink-dim)",
              }}
            >
              Escribo sobre psicologia porque creo que el conocimiento clinico
              no deberia quedarse en consulta. En Egoera traduzco investigacion
              reciente a herramientas practicas para el dia a dia, sin
              infantilizar y sin recetas magicas. Si este proyecto te acompana,
              cualquier forma de apoyo ayuda a mantenerlo gratuito.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
