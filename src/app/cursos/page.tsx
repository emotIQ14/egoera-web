"use client";

import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Play, Clock, Users, Award, Check, Star } from "lucide-react";

const courses = [
  {
    title: "Domina tu Ansiedad",
    subtitle: "Curso completo de regulacion emocional",
    description:
      "Un programa de 6 semanas para entender tu ansiedad, aprender a regularla y recuperar el control de tu bienestar emocional.",
    price: 97,
    originalPrice: 147,
    modules: 6,
    hours: 8,
    students: 0,
    features: [
      "6 modulos en video (8h de contenido)",
      "Workbook descargable con ejercicios",
      "Meditaciones guiadas incluidas",
      "Acceso de por vida",
      "Certificado de finalizacion",
      "Grupo privado de apoyo",
    ],
    badge: "Proximamente",
    color: "#6BA3BE",
  },
  {
    title: "Relaciones Conscientes",
    subtitle: "Taller intensivo sobre apego y comunicacion",
    description:
      "Un taller de 4 sesiones para entender tu estilo de apego, mejorar tu comunicacion y construir relaciones mas sanas.",
    price: 67,
    originalPrice: 97,
    modules: 4,
    hours: 5,
    students: 0,
    features: [
      "4 sesiones grabadas (5h)",
      "Cuestionario de apego incluido",
      "Ejercicios practicos en pareja",
      "Acceso de por vida",
      "Material complementario PDF",
    ],
    badge: "Proximamente",
    color: "#7FB5A0",
  },
];

export default function CursosPage() {
  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-teal text-sm font-semibold uppercase tracking-widest">
              Formacion
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold font-[family-name:var(--font-heading)] text-dark-text mt-3 mb-4">
              Cursos y talleres online
            </h1>
            <p className="text-lg text-grey-text max-w-2xl mx-auto">
              Aprende psicologia aplicada a tu ritmo. Contenido basado en evidencia,
              con ejercicios practicos y acompanamiento.
            </p>
          </div>
        </ScrollReveal>

        {/* Courses */}
        <div className="space-y-8 mb-20">
          {courses.map((course, i) => (
            <ScrollReveal key={course.title} delay={i * 0.15}>
              <div className="bg-white rounded-2xl border-2 border-border overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-5">
                  {/* Info */}
                  <div className="lg:col-span-3 p-8 sm:p-10">
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                        style={{ backgroundColor: course.color }}
                      >
                        {course.badge}
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-heading)] text-dark-text">
                      {course.title}
                    </h2>
                    <p className="text-teal font-medium mt-1">{course.subtitle}</p>
                    <p className="text-grey-text mt-4 leading-relaxed">{course.description}</p>

                    <div className="flex flex-wrap gap-4 mt-6 text-sm text-grey-text">
                      <span className="flex items-center gap-1">
                        <Play className="w-4 h-4 text-teal" />
                        {course.modules} modulos
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-teal" />
                        {course.hours}h de contenido
                      </span>
                      <span className="flex items-center gap-1">
                        <Award className="w-4 h-4 text-teal" />
                        Certificado
                      </span>
                    </div>
                  </div>

                  {/* Pricing sidebar */}
                  <div className="lg:col-span-2 bg-warm-bg p-8 sm:p-10 flex flex-col justify-center">
                    <div className="text-center lg:text-left">
                      <div className="flex items-baseline gap-2 justify-center lg:justify-start">
                        <span className="text-4xl font-bold text-dark-text">{course.price}</span>
                        <span className="text-grey-text">EUR</span>
                        <span className="text-sm text-grey-text line-through ml-2">
                          {course.originalPrice} EUR
                        </span>
                      </div>
                      <p className="text-xs text-teal font-medium mt-1">
                        Ahorra {course.originalPrice - course.price} EUR — precio de lanzamiento
                      </p>
                    </div>

                    <ul className="mt-6 space-y-2">
                      {course.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-dark-text">
                          <Check className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <form className="mt-6 space-y-2" onSubmit={(e) => e.preventDefault()}>
                      <input
                        type="email"
                        placeholder="tu@email.com"
                        className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-teal/50"
                      />
                      <button className="w-full py-3 bg-teal text-white rounded-xl font-medium hover:bg-teal/90 transition-colors">
                        Avisarme cuando abra
                      </button>
                    </form>
                    <p className="text-xs text-grey-text mt-2 text-center">
                      Te avisamos sin compromiso cuando el curso este disponible.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Corporate / Group */}
        <ScrollReveal>
          <div className="bg-dark-text rounded-2xl p-8 sm:p-12 text-center">
            <Users className="w-10 h-10 text-teal mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-heading)] text-white mb-3">
              Talleres para empresas
            </h2>
            <p className="text-white/60 max-w-xl mx-auto mb-6">
              Formacion en bienestar emocional, gestion del estres y comunicacion
              para equipos. Adaptamos el contenido a las necesidades de tu organizacion.
            </p>
            <a
              href="mailto:hola@egoera.es?subject=Taller para empresa"
              className="inline-flex items-center gap-2 px-8 py-4 bg-teal text-white rounded-full font-medium hover:bg-teal/90 transition-colors"
            >
              Solicitar informacion
            </a>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
