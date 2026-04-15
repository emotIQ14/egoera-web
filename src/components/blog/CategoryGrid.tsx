"use client";

import Link from "next/link";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Heart, Users, Eye, Shield, Lightbulb, Sparkles } from "lucide-react";

const categories = [
  {
    slug: "regulacion-emocional",
    title: "Regulacion Emocional",
    description: "Ansiedad, gestion de emociones, tecnicas de relajacion y mindfulness",
    icon: Heart,
    color: "#6BA3BE",
    count: 12,
  },
  {
    slug: "relaciones-apego",
    title: "Relaciones y Apego",
    description: "Estilos de apego, comunicacion en pareja, dependencia emocional",
    icon: Users,
    color: "#7FB5A0",
    count: 9,
  },
  {
    slug: "autoconocimiento",
    title: "Autoconocimiento",
    description: "Sesgos cognitivos, proyeccion, autoestima y crecimiento personal",
    icon: Eye,
    color: "#A8D5C8",
    count: 11,
  },
  {
    slug: "limites-asertividad",
    title: "Limites y Asertividad",
    description: "Aprender a decir no, comunicacion asertiva, establecer limites sanos",
    icon: Shield,
    color: "#B8A9C9",
    count: 7,
  },
  {
    slug: "desmitificacion",
    title: "Desmitificacion",
    description: "Mitos de la psicologia, estigma de la salud mental, ciencia vs creencia",
    icon: Lightbulb,
    color: "#E8A87C",
    count: 8,
  },
  {
    slug: "psicologia-cotidiana",
    title: "Psicologia Cotidiana",
    description: "Habitos, procrastinacion, motivacion y bienestar en el dia a dia",
    icon: Sparkles,
    color: "#F4B8C1",
    count: 10,
  },
];

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((cat, i) => {
        const Icon = cat.icon;
        return (
          <ScrollReveal key={cat.slug} delay={i * 0.1}>
            <Link
              href={`/blog?cat=${cat.slug}`}
              className="block p-6 bg-white rounded-2xl border border-border card-hover group"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${cat.color}20` }}
              >
                <Icon className="w-6 h-6" style={{ color: cat.color }} />
              </div>
              <h3 className="text-lg font-semibold text-dark-text mb-2 group-hover:text-teal transition-colors">
                {cat.title}
              </h3>
              <p className="text-sm text-grey-text leading-relaxed mb-3">
                {cat.description}
              </p>
              <span className="text-xs font-medium text-teal">
                {cat.count} articulos →
              </span>
            </Link>
          </ScrollReveal>
        );
      })}
    </div>
  );
}
