"use client";

import { useState } from "react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Mail, Phone, MapPin, Clock, Send, Calendar, CheckCircle, AtSign } from "lucide-react";

export default function ContactoPage() {
  const [formState, setFormState] = useState<"idle" | "sending" | "sent">("idle");
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "consulta", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setFormState("sent");
      } else {
        // Fallback to mailto if API fails
        const mailtoLink = `mailto:hola@egoera.es?subject=${encodeURIComponent(
          `[Web] ${form.subject === "consulta" ? "Consulta" : form.subject === "sesion" ? "Reserva de sesion" : form.subject === "empresa" ? "Taller empresa" : "Colaboracion"}: ${form.name}`
        )}&body=${encodeURIComponent(
          `Nombre: ${form.name}\nEmail: ${form.email}\nTelefono: ${form.phone}\n\n${form.message}`
        )}`;
        window.open(mailtoLink, "_blank");
        setFormState("sent");
      }
    } catch {
      // Network error — fallback to mailto
      const mailtoLink = `mailto:hola@egoera.es?subject=${encodeURIComponent(
        `[Web] Consulta: ${form.name}`
      )}&body=${encodeURIComponent(
        `Nombre: ${form.name}\nEmail: ${form.email}\nTelefono: ${form.phone}\n\n${form.message}`
      )}`;
      window.open(mailtoLink, "_blank");
      setFormState("sent");
    }
  };

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-teal text-sm font-semibold uppercase tracking-widest">
              Contacto
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold font-[family-name:var(--font-heading)] text-dark-text mt-3 mb-4">
              Hablemos
            </h1>
            <p className="text-lg text-grey-text max-w-2xl mx-auto">
              Da el primer paso. Escribenos sin compromiso y te respondemos en menos de 24 horas.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-3">
            <ScrollReveal>
              <div className="bg-white rounded-2xl p-8 border border-border shadow-sm">
                {formState === "sent" ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-teal mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-dark-text font-[family-name:var(--font-heading)] mb-2">
                      Mensaje enviado
                    </h3>
                    <p className="text-grey-text mb-6">
                      Te respondemos en menos de 24 horas. Revisa tu correo.
                    </p>
                    <button
                      onClick={() => { setFormState("idle"); setForm({ name: "", email: "", phone: "", subject: "consulta", message: "" }); }}
                      className="text-teal font-medium hover:underline"
                    >
                      Enviar otro mensaje
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-dark-text mb-1.5">Nombre *</label>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-teal/50"
                          placeholder="Tu nombre"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-dark-text mb-1.5">Email *</label>
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-teal/50"
                          placeholder="tu@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-dark-text mb-1.5">Telefono</label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-teal/50"
                          placeholder="+34 600 000 000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-dark-text mb-1.5">Motivo *</label>
                        <select
                          value={form.subject}
                          onChange={(e) => setForm({ ...form, subject: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-teal/50 bg-white"
                        >
                          <option value="consulta">Consulta general</option>
                          <option value="sesion">Reservar sesion</option>
                          <option value="empresa">Taller para empresa</option>
                          <option value="colaboracion">Colaboracion</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-dark-text mb-1.5">Mensaje *</label>
                      <textarea
                        required
                        rows={5}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-teal/50 resize-none"
                        placeholder="Cuentanos en que podemos ayudarte..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={formState === "sending"}
                      className="w-full py-3.5 bg-teal text-white rounded-xl font-medium hover:bg-teal/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      {formState === "sending" ? "Enviando..." : "Enviar mensaje"}
                    </button>

                    <p className="text-xs text-grey-text text-center">
                      Al enviar este formulario aceptas nuestra politica de privacidad.
                    </p>
                  </form>
                )}
              </div>
            </ScrollReveal>
          </div>

          {/* Info Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            <ScrollReveal delay={0.1}>
              <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
                <h3 className="font-semibold text-dark-text mb-4 font-[family-name:var(--font-heading)]">
                  Informacion de contacto
                </h3>
                <div className="space-y-4">
                  <a href="mailto:hola@egoera.es" className="flex items-center gap-3 text-sm text-dark-text hover:text-teal transition-colors">
                    <Mail className="w-5 h-5 text-teal shrink-0" />
                    hola@egoera.es
                  </a>
                  <a href="https://instagram.com/egoera.psikologia" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-dark-text hover:text-teal transition-colors">
                    <AtSign className="w-5 h-5 text-teal shrink-0" />
                    @egoera.psikologia
                  </a>
                  <div className="flex items-start gap-3 text-sm text-grey-text">
                    <Clock className="w-5 h-5 text-teal shrink-0 mt-0.5" />
                    <div>
                      <p className="text-dark-text font-medium">Horario de atencion</p>
                      <p>Lunes a Viernes: 9:00 - 20:00</p>
                      <p>Sabados: 10:00 - 14:00</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-grey-text">
                    <MapPin className="w-5 h-5 text-teal shrink-0 mt-0.5" />
                    <div>
                      <p className="text-dark-text font-medium">Ubicacion</p>
                      <p>Bilbao, Bizkaia</p>
                      <p>Sesiones online disponibles</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="bg-gradient-to-br from-teal/5 to-mint/10 rounded-2xl p-6 border border-teal/10">
                <Calendar className="w-8 h-8 text-teal mb-3" />
                <h3 className="font-semibold text-dark-text mb-2 font-[family-name:var(--font-heading)]">
                  Primera consulta gratis
                </h3>
                <p className="text-sm text-grey-text mb-4">
                  20 minutos para conocernos sin compromiso ni coste.
                </p>
                <a
                  href="mailto:hola@egoera.es?subject=Primera consulta gratuita&body=Hola, me gustaria reservar una primera consulta gratuita.%0A%0ANombre:%0ATelefono:%0AHorario preferido:"
                  className="block text-center py-3 bg-teal text-white rounded-xl font-medium hover:bg-teal/90 transition-colors text-sm"
                >
                  Reservar consulta gratuita
                </a>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
                <h3 className="font-semibold text-dark-text mb-3 font-[family-name:var(--font-heading)]">
                  Respuesta rapida
                </h3>
                <p className="text-sm text-grey-text mb-1">
                  Respondemos a todos los mensajes en menos de <strong className="text-dark-text">24 horas</strong>.
                </p>
                <p className="text-sm text-grey-text">
                  Para urgencias, escribe directamente a <a href="mailto:hola@egoera.es" className="text-teal hover:underline">hola@egoera.es</a>.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
}
