"use client";

import Link from "next/link";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Clock, ArrowRight } from "lucide-react";

const posts = [
  {
    slug: "estilos-de-apego",
    title: "Los 4 estilos de apego: cual es el tuyo y como te afecta",
    excerpt: "Tu estilo de apego condiciona como te relacionas. Descubre cual es el tuyo y como impacta en tus vinculos afectivos.",
    category: "Relaciones y Apego",
    categoryColor: "#7FB5A0",
    readTime: 8,
    date: "10 Abr 2026",
    featured: true,
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

export function FeaturedPosts() {
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Featured post - large */}
      <ScrollReveal>
        <Link
          href={`/blog/${featured.slug}`}
          className="block bg-gradient-to-br from-teal/5 to-mint/10 rounded-2xl p-8 border border-teal/10 card-hover group h-full"
        >
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-medium text-white mb-4"
            style={{ backgroundColor: featured.categoryColor }}
          >
            {featured.category}
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-heading)] text-dark-text mb-4 group-hover:text-teal transition-colors leading-tight">
            {featured.title}
          </h3>
          <p className="text-grey-text leading-relaxed mb-6">
            {featured.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-grey-text">
              <span>{featured.date}</span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {featured.readTime} min
              </span>
            </div>
            <ArrowRight className="w-5 h-5 text-teal group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </ScrollReveal>

      {/* Rest of posts */}
      <div className="space-y-4">
        {rest.map((post, i) => (
          <ScrollReveal key={post.slug} delay={(i + 1) * 0.1}>
            <Link
              href={`/blog/${post.slug}`}
              className="flex gap-4 p-4 bg-white rounded-xl border border-border card-hover group"
            >
              <div
                className="w-2 rounded-full shrink-0"
                style={{ backgroundColor: post.categoryColor }}
              />
              <div className="flex-1 min-w-0">
                <span
                  className="text-xs font-medium"
                  style={{ color: post.categoryColor }}
                >
                  {post.category}
                </span>
                <h4 className="text-sm font-semibold text-dark-text mt-1 group-hover:text-teal transition-colors line-clamp-2">
                  {post.title}
                </h4>
                <div className="flex items-center gap-3 mt-2 text-xs text-grey-text">
                  <span>{post.date}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime} min
                  </span>
                </div>
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
