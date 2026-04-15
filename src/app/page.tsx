import { InteractiveBrain } from "@/components/brain/InteractiveBrain";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { HeroSection } from "@/components/layout/HeroSection";
import { FeaturedPosts } from "@/components/blog/FeaturedPosts";
import { NewsletterCTA } from "@/components/layout/NewsletterCTA";
import { CategoryGrid } from "@/components/blog/CategoryGrid";

export default function HomePage() {
  return (
    <>
      <HeroSection />

      {/* Interactive Brain Section */}
      <section id="explora" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-warm-bg">
        <div className="max-w-7xl mx-auto">
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
                Haz clic y descubre contenido relevante para ti.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <InteractiveBrain />
          </ScrollReveal>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="text-sage text-sm font-semibold uppercase tracking-widest">
                Nuestras tematicas
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold font-[family-name:var(--font-heading)] text-dark-text mt-3">
                6 pilares para tu bienestar
              </h2>
            </div>
          </ScrollReveal>
          <CategoryGrid />
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
              <div>
                <span className="text-teal text-sm font-semibold uppercase tracking-widest">
                  Ultimos articulos
                </span>
                <h2 className="text-4xl font-bold font-[family-name:var(--font-heading)] text-dark-text mt-3">
                  Lee lo mas reciente
                </h2>
              </div>
              <a
                href="/blog"
                className="text-teal text-sm font-medium hover:underline"
              >
                Ver todos los articulos →
              </a>
            </div>
          </ScrollReveal>
          <FeaturedPosts />
        </div>
      </section>

      {/* Diario Emocional Promo */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-teal/5 via-mint/10 to-sage/5">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-teal/10 text-center">
              <div className="w-16 h-16 rounded-2xl bg-teal/10 flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">📝</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-heading)] text-dark-text mb-4">
                Diario Emocional Egoera
              </h2>
              <p className="text-grey-text text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
                Registra tu estado de animo diario, detecta patrones emocionales
                y entiende mejor como te sientes. Tu herramienta personal de bienestar,
                directamente desde el navegador.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/diario"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-teal text-white rounded-full text-lg font-medium hover:bg-teal/90 transition-all hover:shadow-lg hover:shadow-teal/20"
                >
                  Abrir Diario Emocional
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterCTA />
    </>
  );
}
