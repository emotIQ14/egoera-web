import { ScrollReveal } from "@/components/animations/ScrollReveal";
import Link from "next/link";
import { Check, Clock, Video, Users, Brain, Heart, Shield, Star } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Servicios de Psicologia | Terapia Online y Presencial",
  description:
    "Terapia psicologica individual, de pareja y familiar. Sesiones online y presenciales. Primera consulta gratuita.",
};

const services = [
  {
    name: "Terapia Individual",
    price: 65,
    duration: "50 min",
    icon: Brain,
    color: "#6BA3BE",
    features: [
      "Sesion individual con psicologo",
      "Online o presencial",
      "Herramientas personalizadas",
      "Seguimiento entre sesiones",
    ],
    popular: false,
  },
  {
    name: "Terapia de Pareja",
    price: 80,
    duration: "60 min",
    icon: Heart,
    color: "#7FB5A0",
    features: [
      "Sesion con ambos miembros",
      "Comunicacion y conflictos",
      "Herramientas para la relacion",
      "Plan de trabajo conjunto",
    ],
    popular: true,
  },
  {
    name: "Bono 4 Sesiones",
    price: 230,
    duration: "4 x 50 min",
    icon: Shield,
    color: "#A8D5C8",
    features: [
      "4 sesiones individuales",
      "Ahorro de 30EUR",
      "Flexibilidad de horario",
      "Validez 3 meses",
    ],
    popular: false,
  },
];

const specialties = [
  "Ansiedad y estres",
  "Depresion",
  "Autoestima",
  "Regulacion emocional",
  "Relaciones de pareja",
  "Dependencia emocional",
  "Duelo y perdida",
  "Trauma",
  "Limites y asertividad",
  "Crecimiento personal",
];

export default function ServiciosPage() {
  return (
    <div className="pt-24 pb-20">
      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center mb-20">
        <ScrollReveal>
          <span className="text-teal text-sm font-semibold uppercase tracking-widest">
            Servicios
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold font-[family-name:var(--font-heading)] text-dark-text mt-3 mb-6">
            Tu bienestar emocional, nuestra prioridad
          </h1>
          <p className="text-lg text-grey-text max-w-2xl mx-auto leading-relaxed">
            Terapia psicologica profesional adaptada a ti. Sesiones online y presenciales
            con un enfoque integrador, cercano y basado en evidencia.
          </p>
        </ScrollReveal>
      </section>

      {/* Pricing Cards */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <ScrollReveal key={service.name} delay={i * 0.1}>
                <div
                  className={`relative rounded-2xl p-8 border-2 transition-all hover:shadow-xl ${
                    service.popular
                      ? "border-teal bg-teal/5 shadow-lg"
                      : "border-border bg-white"
                  }`}
                >
                  {service.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-teal text-white text-xs font-semibold rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3" /> Mas popular
                    </div>
                  )}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${service.color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: service.color }} />
                  </div>
                  <h3 className="text-xl font-bold text-dark-text font-[family-name:var(--font-heading)]">
                    {service.name}
                  </h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-dark-text">{service.price}</span>
                    <span className="text-grey-text">EUR</span>
                  </div>
                  <p className="text-sm text-grey-text mt-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {service.duration}
                  </p>
                  <ul className="mt-6 space-y-3">
                    {service.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-dark-text">
                        <Check className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="https://calendly.com/egoera-psikologia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-8 block text-center py-3 rounded-xl font-medium transition-colors ${
                      service.popular
                        ? "bg-teal text-white hover:bg-teal/90"
                        : "bg-muted text-dark-text hover:bg-teal/10 hover:text-teal"
                    }`}
                  >
                    Reservar sesion
                  </a>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* First session free */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto mb-20">
        <ScrollReveal>
          <div className="bg-gradient-to-r from-teal/10 to-sage/10 rounded-2xl p-8 sm:p-12 text-center">
            <Video className="w-10 h-10 text-teal mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-heading)] text-dark-text mb-3">
              Primera consulta gratuita
            </h2>
            <p className="text-grey-text max-w-xl mx-auto mb-6">
              Conocernos sin compromiso. 20 minutos para entender tu situacion,
              resolver dudas y ver si encajamos. Sin coste ni obligacion.
            </p>
            <a
              href="https://calendly.com/egoera-psikologia/primera-consulta"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-teal text-white rounded-full text-lg font-medium hover:bg-teal/90 transition-all hover:shadow-lg hover:shadow-teal/20"
            >
              Reservar consulta gratuita
            </a>
          </div>
        </ScrollReveal>
      </section>

      {/* Specialties */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto mb-20">
        <ScrollReveal>
          <h2 className="text-3xl font-bold font-[family-name:var(--font-heading)] text-dark-text text-center mb-8">
            Especialidades
          </h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {specialties.map((s) => (
              <span
                key={s}
                className="px-4 py-2 rounded-full bg-white border border-border text-sm text-dark-text"
              >
                {s}
              </span>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* FAQ */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto mb-20">
        <ScrollReveal>
          <h2 className="text-3xl font-bold font-[family-name:var(--font-heading)] text-dark-text text-center mb-8">
            Preguntas frecuentes
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Como funcionan las sesiones online?",
                a: "Las sesiones online se realizan por videollamada a traves de una plataforma segura y confidencial. Solo necesitas un dispositivo con camara y conexion a internet.",
              },
              {
                q: "Cuanto dura el proceso terapeutico?",
                a: "Depende de cada persona y situacion. Algunas personas notan mejoras en 4-6 sesiones, mientras que procesos mas profundos pueden requerir mas tiempo. Siempre trabajamos a tu ritmo.",
              },
              {
                q: "Es confidencial?",
                a: "Absolutamente. Todo lo que compartas en sesion esta protegido por el secreto profesional. Es un espacio seguro y privado.",
              },
              {
                q: "Puedo cancelar o cambiar mi cita?",
                a: "Si, puedes cancelar o reprogramar tu cita con al menos 24 horas de antelacion sin coste alguno.",
              },
            ].map((faq) => (
              <div key={faq.q} className="bg-white rounded-xl p-6 border border-border">
                <h3 className="font-semibold text-dark-text mb-2">{faq.q}</h3>
                <p className="text-sm text-grey-text leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* Schema.org Service */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            name: "Egoera Psikologia",
            description: "Terapia psicologica individual, de pareja y familiar",
            url: "https://egoera.es/servicios",
            priceRange: "65-80 EUR",
            areaServed: ["Bilbao", "Bizkaia", "Euskadi", "Online"],
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Servicios de Psicologia",
              itemListElement: services.map((s) => ({
                "@type": "Offer",
                name: s.name,
                price: s.price,
                priceCurrency: "EUR",
              })),
            },
          }),
        }}
      />
    </div>
  );
}
