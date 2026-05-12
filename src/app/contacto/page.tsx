"use client";

import { useState } from "react";
import Link from "next/link";

/* =========================================================================
 * /contacto · página editorial cobalto + crema
 * -------------------------------------------------------------------------
 * El layout.tsx aporta EgoeraNav + EgoeraFooter (server async). Esta
 * page.tsx es cliente para manejar el estado del formulario.
 *
 * Tokens locales (cobalto + crema) inline en .cnt-page para no contaminar
 * el dark mode global. Sigue la misma densidad editorial que la home y
 * el blog (manchas Fraunces, números mono, sellos hand-drawn).
 * ===================================================================== */

type FormState = "idle" | "sending" | "sent" | "error";
type Subject =
  | "diario"
  | "colaboracion"
  | "prensa"
  | "feedback"
  | "otro";

const SUBJECTS: { value: Subject; label: string; hint: string }[] = [
  {
    value: "diario",
    label: "Diario emocional o brújula",
    hint: "Dudas técnicas o sugerencias para diario.egoera.es / /sentir",
  },
  {
    value: "colaboracion",
    label: "Colaboración o invitación",
    hint: "Podcast, charla, taller, escritura conjunta",
  },
  {
    value: "prensa",
    label: "Prensa y medios",
    hint: "Entrevistas y consultas editoriales",
  },
  {
    value: "feedback",
    label: "Comentar el cuaderno",
    hint: "Una entrada, una idea, algo que te resonó",
  },
  { value: "otro", label: "Otro", hint: "Cuéntame qué te trae" },
];

export default function ContactoPage() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "diario" as Subject,
    message: "",
  });

  const onChange = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formState === "sending") return;
    setFormState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({ success: false }));
      if (data?.success) {
        setFormState("sent");
        return;
      }
      throw new Error("api fail");
    } catch {
      // Fallback mailto si la API falla
      const body = `Hola Ander,\n\nMotivo: ${
        SUBJECTS.find((s) => s.value === form.subject)?.label ?? form.subject
      }\nNombre: ${form.name}\nTeléfono: ${form.phone}\n\n${form.message}`;
      window.location.href = `mailto:hola@egoera.es?subject=${encodeURIComponent(
        `Contacto Egoera · ${form.subject}`
      )}&body=${encodeURIComponent(body)}`;
      setFormState("sent");
    }
  };

  const selected = SUBJECTS.find((s) => s.value === form.subject)!;

  return (
    <main className="cnt-page">
      <style jsx>{`
        .cnt-page {
          --blue: #1d2bdb;
          --blue-deep: #0f1baa;
          --cream: #f1ead8;
          --cream-2: #e6dec9;
          --cream-3: #d8cfb6;
          --ink: #1d2bdb;
          --ink-soft: rgba(29, 43, 219, 0.78);
          --rule: rgba(29, 43, 219, 0.32);
          --rule-soft: rgba(29, 43, 219, 0.16);
          --orange: #d97757;
          --serif: var(--font-serif), "Fraunces", Georgia, serif;
          --display: var(--font-display), "Caveat", cursive;
          --sans: var(--font-sans), "Inter", system-ui, sans-serif;
          --mono: var(--font-mono), "JetBrains Mono", monospace;
          background: var(--cream);
          color: var(--ink);
          font-family: var(--sans);
          min-height: 100vh;
        }
        .wrap { max-width: 1240px; margin: 0 auto; padding: 0 32px; }
        @media (max-width: 768px) { .wrap { padding: 0 22px; } }
        @media (max-width: 480px) { .wrap { padding: 0 18px; } }

        /* ─── MASTHEAD ────────────────────────────────────── */
        .cnt-mast {
          padding: 96px 0 72px;
          border-bottom: 1.5px solid var(--blue);
        }
        .cnt-mast-row {
          display: flex; justify-content: space-between; align-items: center;
          font-family: var(--mono); font-size: 10.5px; letter-spacing: 0.22em;
          text-transform: uppercase; color: var(--ink-soft); margin-bottom: 32px;
          flex-wrap: wrap; gap: 12px;
        }
        .cnt-mast h1 {
          font-family: var(--display); font-style: italic; font-weight: 600;
          font-size: clamp(64px, 11vw, 168px); line-height: 0.9;
          color: var(--blue); letter-spacing: -0.01em; margin: 0;
          text-wrap: balance;
        }
        .cnt-mast h1 em { font-style: italic; color: var(--orange); }
        .cnt-mast-sub {
          font-family: var(--serif); font-style: italic;
          font-size: clamp(20px, 2.4vw, 28px); line-height: 1.4;
          color: var(--ink); max-width: 56ch; margin: 28px 0 0;
        }
        .cnt-mast-meta {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 0;
          margin-top: 56px; border-top: 1.5px solid var(--blue);
          border-bottom: 1.5px solid var(--blue);
        }
        .cnt-mast-meta .m {
          padding: 22px 28px; border-right: 1px dashed var(--rule);
          font-family: var(--mono); font-size: 10.5px; letter-spacing: 0.2em;
          text-transform: uppercase; color: var(--ink-soft);
        }
        .cnt-mast-meta .m:first-child { padding-left: 0; }
        .cnt-mast-meta .m:last-child { border-right: 0; padding-right: 0; }
        .cnt-mast-meta .m strong {
          display: block; font-family: var(--serif); font-style: italic;
          font-weight: 400; font-size: 22px; letter-spacing: -0.01em;
          text-transform: none; color: var(--blue); margin-top: 6px;
        }
        @media (max-width: 720px) {
          .cnt-mast-meta { grid-template-columns: 1fr; }
          .cnt-mast-meta .m {
            border-right: 0; border-bottom: 1px dashed var(--rule);
            padding: 18px 0;
          }
          .cnt-mast-meta .m:last-child { border-bottom: 0; }
        }

        /* ─── GRID PRINCIPAL ─────────────────────────────── */
        .cnt-grid {
          padding: 80px 0;
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 80px;
          align-items: start;
        }
        @media (max-width: 980px) {
          .cnt-grid { grid-template-columns: 1fr; gap: 56px; padding: 64px 0; }
        }

        /* ─── FORM ───────────────────────────────────────── */
        .cnt-form-h {
          font-family: var(--display); font-style: italic; font-weight: 600;
          font-size: clamp(36px, 5vw, 60px); line-height: 0.96;
          margin: 0 0 12px; color: var(--blue);
          text-wrap: balance;
        }
        .cnt-form-h em { color: var(--orange); }
        .cnt-form-lead {
          font-family: var(--serif); font-style: italic;
          font-size: 18px; line-height: 1.5; color: var(--ink);
          margin: 0 0 36px; max-width: 48ch;
        }

        .cnt-subjects {
          display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
          margin-bottom: 28px;
        }
        @media (max-width: 540px) {
          .cnt-subjects { grid-template-columns: 1fr; }
        }
        .cnt-subject {
          text-align: left; background: transparent;
          border: 1.5px solid var(--rule);
          border-radius: 12px; padding: 14px 16px; cursor: pointer;
          transition: background .15s, border-color .15s, transform .15s;
          font-family: var(--sans); color: var(--ink); display: block;
        }
        .cnt-subject:hover { border-color: var(--blue); transform: translateY(-1px); }
        .cnt-subject.active {
          background: var(--blue); color: var(--cream); border-color: var(--blue);
        }
        .cnt-subject strong {
          display: block; font-family: var(--serif); font-style: italic;
          font-weight: 500; font-size: 16px; margin-bottom: 4px;
        }
        .cnt-subject small {
          font-family: var(--mono); font-size: 10px; letter-spacing: 0.16em;
          text-transform: uppercase; opacity: 0.75;
        }

        .cnt-field { margin-bottom: 22px; }
        .cnt-field label {
          display: block; font-family: var(--mono); font-size: 10.5px;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--ink-soft); margin-bottom: 8px;
        }
        .cnt-field input, .cnt-field textarea {
          display: block; width: 100%;
          background: transparent;
          border: 0; border-bottom: 1.5px solid var(--rule);
          padding: 10px 0 12px; font-family: var(--serif);
          font-size: 19px; color: var(--blue); line-height: 1.4;
          transition: border-color .15s;
        }
        .cnt-field input::placeholder, .cnt-field textarea::placeholder {
          color: rgba(29, 43, 219, 0.32); font-style: italic;
        }
        .cnt-field input:focus, .cnt-field textarea:focus {
          outline: none; border-color: var(--blue);
        }
        .cnt-field textarea { resize: vertical; min-height: 140px; }

        .cnt-field-row {
          display: grid; grid-template-columns: 1fr 1fr; gap: 22px;
        }
        @media (max-width: 540px) {
          .cnt-field-row { grid-template-columns: 1fr; gap: 0; }
        }

        .cnt-submit-row {
          display: flex; align-items: center; gap: 16px; margin-top: 12px;
          flex-wrap: wrap;
        }
        .cnt-submit {
          display: inline-flex; align-items: center; gap: 12px;
          background: var(--blue); color: var(--cream);
          padding: 16px 28px; border: 0; border-radius: 999px;
          font-family: var(--sans); font-size: 14px; font-weight: 500;
          letter-spacing: 0.02em; cursor: pointer;
          transition: background .15s, transform .15s;
        }
        .cnt-submit:hover:not(:disabled) {
          background: var(--blue-deep); transform: translateY(-1px);
        }
        .cnt-submit:disabled { opacity: 0.6; cursor: progress; }
        .cnt-submit-note {
          font-family: var(--mono); font-size: 10.5px;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--ink-soft);
        }
        .cnt-success {
          margin-top: 20px; padding: 18px 22px;
          background: rgba(29, 43, 219, 0.06);
          border: 1px solid var(--rule);
          border-radius: 12px;
          font-family: var(--serif); font-style: italic;
          font-size: 16px; color: var(--blue); line-height: 1.5;
        }

        /* ─── SIDEBAR ────────────────────────────────────── */
        .cnt-side {
          position: relative;
          display: flex; flex-direction: column; gap: 28px;
        }
        .cnt-card {
          background: var(--cream); border: 1.5px solid var(--blue);
          border-radius: 18px; padding: 32px 28px; position: relative;
        }
        .cnt-card::before {
          content: ""; position: absolute; inset: 8px;
          border: 1px dashed var(--rule-soft); border-radius: 12px;
          pointer-events: none;
        }
        .cnt-card-eye {
          font-family: var(--mono); font-size: 10.5px;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--blue); margin: 0 0 16px; position: relative;
        }
        .cnt-card-h {
          font-family: var(--display); font-style: italic; font-weight: 600;
          font-size: 30px; line-height: 1.05; margin: 0 0 14px;
          color: var(--blue); position: relative;
        }
        .cnt-card-h em { color: var(--orange); }
        .cnt-card p {
          font-family: var(--serif); font-size: 16px; line-height: 1.6;
          color: var(--ink); margin: 0 0 8px; position: relative;
        }
        .cnt-channels {
          display: flex; flex-direction: column; gap: 0;
          position: relative;
        }
        .cnt-ch {
          display: grid; grid-template-columns: 80px 1fr auto; gap: 14px;
          align-items: center; padding: 14px 0;
          border-top: 1px dashed var(--rule);
          color: var(--ink); text-decoration: none;
          transition: padding-left .15s;
        }
        .cnt-ch:first-of-type { border-top: 0; }
        .cnt-ch:hover { padding-left: 4px; }
        .cnt-ch:hover { color: var(--blue); }
        .cnt-ch .ch-tag {
          font-family: var(--mono); font-size: 10px; letter-spacing: 0.2em;
          text-transform: uppercase; color: var(--ink-soft);
        }
        .cnt-ch .ch-val {
          font-family: var(--serif); font-style: italic;
          font-size: 17px; color: inherit;
        }
        .cnt-ch .ch-arr {
          font-family: var(--mono); font-size: 11px;
          border: 1px solid var(--rule); border-radius: 999px;
          padding: 6px 10px; transition: all .15s;
        }
        .cnt-ch:hover .ch-arr {
          background: var(--blue); color: var(--cream); border-color: var(--blue);
        }

        /* ─── CALLOUT consulta ──────────────────────────── */
        .cnt-callout {
          background: var(--blue); color: var(--cream);
          border-radius: 18px; padding: 32px 28px;
          position: relative; overflow: hidden;
        }
        .cnt-callout::before {
          content: ""; position: absolute; inset: 0;
          background:
            radial-gradient(ellipse at 80% 20%, rgba(241, 234, 216, 0.16), transparent 55%),
            radial-gradient(ellipse at 10% 90%, rgba(241, 234, 216, 0.08), transparent 60%);
          pointer-events: none;
        }
        .cnt-callout-eye {
          font-family: var(--mono); font-size: 10.5px;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--cream); margin: 0 0 14px;
          position: relative; opacity: 0.85;
        }
        .cnt-callout h3 {
          font-family: var(--display); font-style: italic; font-weight: 600;
          font-size: 36px; line-height: 1; margin: 0 0 14px;
          color: var(--cream); position: relative;
        }
        .cnt-callout h3 em { color: #f3a8c4; }
        .cnt-callout p {
          font-family: var(--serif); font-style: italic;
          font-size: 16px; line-height: 1.5;
          color: rgba(241, 234, 216, 0.85); margin: 0 0 20px;
          position: relative;
        }
        .cnt-callout-btn {
          display: inline-flex; align-items: center; gap: 10px;
          background: var(--cream); color: var(--blue);
          padding: 12px 22px; border-radius: 999px;
          font-family: var(--sans); font-size: 13px; font-weight: 500;
          text-decoration: none; position: relative;
          transition: background .15s;
        }
        .cnt-callout-btn:hover { background: var(--cream-2); }

        /* ─── FAQ ENDING ─────────────────────────────────── */
        .cnt-faq { padding: 80px 0 120px; border-top: 1.5px solid var(--blue); }
        .cnt-faq-head {
          display: flex; align-items: end; justify-content: space-between;
          gap: 32px; margin-bottom: 40px; flex-wrap: wrap;
        }
        .cnt-faq h2 {
          font-family: var(--display); font-style: italic; font-weight: 600;
          font-size: clamp(40px, 6vw, 80px); line-height: 0.95;
          color: var(--blue); letter-spacing: -0.01em; margin: 0;
        }
        .cnt-faq h2 em { color: var(--orange); }
        .cnt-faq-lead {
          font-family: var(--serif); font-style: italic;
          font-size: 18px; line-height: 1.5; color: var(--ink);
          max-width: 36ch; margin: 0;
        }
        .cnt-faq-list { display: flex; flex-direction: column; }
        .cnt-faq-item {
          border-top: 1.5px solid var(--blue);
          padding: 24px 0; display: grid;
          grid-template-columns: 80px 1fr; gap: 24px;
        }
        .cnt-faq-item:last-child { border-bottom: 1.5px solid var(--blue); }
        .cnt-faq-num {
          font-family: var(--display); font-style: italic; font-weight: 600;
          font-size: 44px; color: var(--orange); line-height: 1;
        }
        .cnt-faq-q {
          font-family: var(--serif); font-weight: 400;
          font-size: 22px; line-height: 1.3; color: var(--blue);
          margin: 0 0 8px;
        }
        .cnt-faq-a {
          font-family: var(--serif); font-size: 16px; line-height: 1.6;
          color: var(--ink); margin: 0; max-width: 60ch;
        }
        @media (max-width: 540px) {
          .cnt-faq-item { grid-template-columns: 1fr; gap: 6px; }
          .cnt-faq-num { font-size: 32px; }
        }
      `}</style>

      <section className="cnt-mast">
        <div className="wrap">
          <div className="cnt-mast-row">
            <span>contacto · escríbenos despacio</span>
            <span>bilbao · online</span>
            <span>respuesta en 48-72h</span>
          </div>
          <h1>
            Te <em>escucho</em>.
          </h1>
          <p className="cnt-mast-sub">
            Una hoja en blanco para contarme lo que quieras: una consulta,
            una colaboración, una entrada del cuaderno que te resonó, o
            simplemente cómo te ha llegado todo esto.
          </p>
          <div className="cnt-mast-meta">
            <div className="m">
              email
              <strong>hola@egoera.es</strong>
            </div>
            <div className="m">
              consulta
              <strong>presencial · online</strong>
            </div>
            <div className="m">
              tiempo medio de respuesta
              <strong>48 a 72 horas</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="cnt-grid wrap">
        <div>
          <h2 className="cnt-form-h">
            ¿Qué te trae <em>aquí</em>?
          </h2>
          <p className="cnt-form-lead">
            Escoge el motivo. Sin obligación, sin formularios kilométricos.
            Si después de leerlo no encaja, puedes escribirme directo a{" "}
            <Link href="mailto:hola@egoera.es" style={{ color: "var(--blue)" }}>
              hola@egoera.es
            </Link>
            .
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="cnt-subjects" role="radiogroup" aria-label="Motivo">
              {SUBJECTS.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  role="radio"
                  aria-checked={form.subject === s.value}
                  className={`cnt-subject ${
                    form.subject === s.value ? "active" : ""
                  }`}
                  onClick={() => onChange("subject", s.value)}
                >
                  <strong>{s.label}</strong>
                  <small>{s.hint}</small>
                </button>
              ))}
            </div>

            <div className="cnt-field-row">
              <div className="cnt-field">
                <label htmlFor="cnt-name">Tu nombre</label>
                <input
                  id="cnt-name"
                  type="text"
                  required
                  placeholder="cómo te llamas"
                  value={form.name}
                  onChange={(e) => onChange("name", e.target.value)}
                />
              </div>
              <div className="cnt-field">
                <label htmlFor="cnt-email">Tu email</label>
                <input
                  id="cnt-email"
                  type="email"
                  required
                  placeholder="hola@dominio.com"
                  value={form.email}
                  onChange={(e) => onChange("email", e.target.value)}
                />
              </div>
            </div>

            {form.subject === "diario" && (
              <div className="cnt-field">
                <label htmlFor="cnt-phone">Teléfono (opcional)</label>
                <input
                  id="cnt-phone"
                  type="tel"
                  placeholder="por si prefieres una llamada"
                  value={form.phone}
                  onChange={(e) => onChange("phone", e.target.value)}
                />
              </div>
            )}

            <div className="cnt-field">
              <label htmlFor="cnt-msg">{selected.label} · cuéntame</label>
              <textarea
                id="cnt-msg"
                required
                placeholder={selected.hint}
                value={form.message}
                onChange={(e) => onChange("message", e.target.value)}
              />
            </div>

            <div className="cnt-submit-row">
              <button
                type="submit"
                className="cnt-submit"
                disabled={formState === "sending"}
              >
                {formState === "sending" ? "Enviando…" : "Enviar la carta"}
                <span aria-hidden>→</span>
              </button>
              <span className="cnt-submit-note">
                sin trackers · respuesta personal
              </span>
            </div>

            {formState === "sent" && (
              <div className="cnt-success" role="status">
                Gracias por escribir. Te respondo personalmente en las
                próximas <strong>48-72 horas</strong>. Si era urgente,
                añade una nota.
              </div>
            )}
          </form>
        </div>

        <aside className="cnt-side">
          <div className="cnt-callout">
            <p className="cnt-callout-eye">diario · gratis</p>
            <h3>
              ¿Prefieres empezar <em>ya</em>?
            </h3>
            <p>
              Abre el diario emocional sin registro: una entrada al día,
              quince minutos, todo en tu navegador. Lo público de Egoera
              está pensado para no esperar.
            </p>
            <Link
              href="https://diario.egoera.es"
              target="_blank"
              rel="noopener noreferrer"
              className="cnt-callout-btn"
            >
              Abrir el diario →
            </Link>
          </div>

          <div className="cnt-card">
            <p className="cnt-card-eye">canales · escoge el tuyo</p>
            <h3 className="cnt-card-h">
              Otras <em>formas</em> de hablar.
            </h3>
            <div className="cnt-channels">
              <Link href="mailto:hola@egoera.es" className="cnt-ch">
                <span className="ch-tag">email</span>
                <span className="ch-val">hola@egoera.es</span>
                <span className="ch-arr">→</span>
              </Link>
              <Link
                href="https://www.instagram.com/egoera.psikologia/"
                target="_blank"
                rel="noopener noreferrer"
                className="cnt-ch"
              >
                <span className="ch-tag">instagram</span>
                <span className="ch-val">@egoera.psikologia</span>
                <span className="ch-arr">→</span>
              </Link>
              <Link
                href="https://www.linkedin.com/in/anderbilbaoc/"
                target="_blank"
                rel="noopener noreferrer"
                className="cnt-ch"
              >
                <span className="ch-tag">linkedin</span>
                <span className="ch-val">Ander Bilbao</span>
                <span className="ch-arr">→</span>
              </Link>
            </div>
          </div>

          <div className="cnt-card">
            <p className="cnt-card-eye">desde Bilbao</p>
            <h3 className="cnt-card-h">Dónde escribo.</h3>
            <p>
              Egoera se redacta en Bilbao. No tengo consulta presencial:
              esto es una pieza editorial. Si necesitas terapia, te
              recomiendo buscar un psicólogo colegiado de confianza en tu
              zona.
            </p>
            <p
              style={{
                marginTop: 14,
                fontStyle: "italic",
                color: "var(--ink-soft)",
              }}
            >
              Lecturas: jueves al amanecer.
              <br />
              Boletín: domingos.
            </p>
          </div>
        </aside>
      </section>

      <section className="cnt-faq">
        <div className="wrap">
          <div className="cnt-faq-head">
            <h2>
              Las dudas que <em>siempre</em> llegan.
            </h2>
            <p className="cnt-faq-lead">
              Antes de que escribas, por si están aquí.
            </p>
          </div>
          <div className="cnt-faq-list">
            <Faq
              n="01"
              q="¿En qué idiomas respondes?"
              a="Castellano y euskara. Inglés también, aunque por escrito. Indícalo en el mensaje y respondo en el que prefieras."
            />
            <Faq
              n="02"
              q="¿Cuánto tardas en responder?"
              a="Entre 48 y 72 horas. Soy una sola persona, así que no hay autoresponders ni bots. Si pasa más, vuelve a escribir sin miedo: a veces se cuela algo."
            />
            <Faq
              n="03"
              q="¿Cobras por consulta?"
              a="No tengo consulta privada. Egoera es una pieza editorial: cuaderno, brújula y diario emocional, todo gratis. Si necesitas terapia, busca un psicólogo colegiado de tu zona."
            />
            <Faq
              n="04"
              q="¿Y si solo quiero leerme tu cuaderno?"
              a={
                <>
                  Adelante.{" "}
                  <Link href="/blog" style={{ color: "var(--blue)" }}>
                    Todo el cuaderno está abierto
                  </Link>
                  . Sin email obligatorio, sin paywall, sin tracker.
                </>
              }
            />
            <Faq
              n="05"
              q="¿Hay newsletter?"
              a={
                <>
                  Sí, una carta cada domingo.{" "}
                  <Link href="/boletin" style={{ color: "var(--blue)" }}>
                    Te puedes suscribir aquí
                  </Link>
                  . Sin trackers, sin venderle tu correo a nadie.
                </>
              }
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function Faq({ n, q, a }: { n: string; q: string; a: React.ReactNode }) {
  return (
    <div className="cnt-faq-item">
      <span className="cnt-faq-num">{n}</span>
      <div>
        <p className="cnt-faq-q">{q}</p>
        <p className="cnt-faq-a">{a}</p>
      </div>
    </div>
  );
}
