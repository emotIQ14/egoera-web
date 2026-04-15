import { ScrollReveal } from "@/components/animations/ScrollReveal";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre Nosotros",
  description: "Egoera Psikologia: psicologia accesible para todos. Conoce nuestra mision, vision y equipo.",
};

export default function SobreNosotrosPage() {
  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <ScrollReveal>
          <span className="text-teal text-sm font-semibold uppercase tracking-widest">
            Sobre Nosotros
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold font-[family-name:var(--font-heading)] text-dark-text mt-3 mb-6">
            Tu estado importa
          </h1>
          <p className="text-lg text-grey-text leading-relaxed mb-8">
            Egoera Psikologia nace con una mision clara: hacer la psicologia accesible,
            comprensible y util para el dia a dia. Creemos que entender como funciona
            tu mente no deberia ser un privilegio, sino un derecho.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="bg-teal/5 rounded-2xl p-8 mb-12">
            <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-dark-text mb-4">
              Nuestra mision
            </h2>
            <p className="text-grey-text leading-relaxed">
              Democratizar el acceso al conocimiento psicologico a traves de contenido
              riguroso, cercano y practico. No somos una revista academica ni un perfil
              de frases motivacionales — somos el punto medio que faltaba: ciencia con
              calidez humana.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-dark-text mb-6">
            Que hacemos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {[
              {
                title: "Blog de psicologia",
                desc: "Articulos basados en evidencia sobre emociones, relaciones, habitos y bienestar.",
              },
              {
                title: "Diario Emocional",
                desc: "Herramienta gratuita para registrar tu estado de animo y detectar patrones.",
              },
              {
                title: "Contenido en redes",
                desc: "Psicologia accesible en Instagram, TikTok, YouTube y X.",
              },
              {
                title: "Comunidad",
                desc: "Un espacio para personas que quieren entenderse mejor y cuidar su salud mental.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-5 bg-white rounded-xl border border-border"
              >
                <h3 className="font-semibold text-dark-text mb-2">{item.title}</h3>
                <p className="text-sm text-grey-text leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.25}>
          <div className="text-center bg-gradient-to-br from-teal/5 to-sage/5 rounded-2xl p-8">
            <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-dark-text mb-4">
              Conecta con nosotros
            </h2>
            <p className="text-grey-text mb-6">
              Siguenos en redes sociales y forma parte de la comunidad Egoera.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href="https://instagram.com/egoera.psikologia" target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-teal text-white rounded-full text-sm font-medium hover:bg-teal/90 transition-colors">
                Instagram
              </a>
              <a href="https://tiktok.com/@egoera.psikologia" target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-dark-text text-white rounded-full text-sm font-medium hover:bg-dark-text/90 transition-colors">
                TikTok
              </a>
              <a href="https://youtube.com/@egoera.psikologia" target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-red-500 text-white rounded-full text-sm font-medium hover:bg-red-500/90 transition-colors">
                YouTube
              </a>
              <Link href="/blog" className="px-5 py-2.5 border-2 border-teal text-teal rounded-full text-sm font-medium hover:bg-teal/5 transition-colors">
                Leer el blog
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Schema.org Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Egoera Psikologia",
            url: "https://egoera.es",
            description: "Blog de psicologia accesible y basada en ciencia",
            sameAs: [
              "https://instagram.com/egoera.psikologia",
              "https://tiktok.com/@egoera.psikologia",
              "https://youtube.com/@egoera.psikologia",
              "https://x.com/egoerapsikolog",
            ],
          }),
        }}
      />
    </div>
  );
}
