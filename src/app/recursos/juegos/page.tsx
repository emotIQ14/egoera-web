"use client";

/**
 * /recursos/juegos · biblioteca de juegos, ejercicios, meditaciones
 * y lecturas de psicología positiva. Adapta el patrón visual de
 * Bidaiatzen /recursos (tabs + chips + grid de cards con SVG) a la
 * paleta editorial de Egoera (cobalto + crema + terracota + mostaza).
 *
 * 4 categorías:
 *  - Juegos      → para hacer en pareja, familia, grupo
 *  - Ejercicios  → para hacer solo en 5-20 min
 *  - Meditaciones → audios guiados (placeholder por ahora)
 *  - Lecturas    → libros + ensayos recomendados
 *
 * Filtros por tema (Ansiedad, Apego, Autoconocimiento, etc.) y búsqueda
 * libre por texto.
 */
import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "./Juegos.module.css";

// ─── Tipos ──────────────────────────────────────────────────────────

type TabId = "juegos" | "ejercicios" | "meditaciones" | "lecturas";

type Tema =
  | "ansiedad"
  | "apego"
  | "autoconocimiento"
  | "pareja"
  | "familia"
  | "sueno"
  | "duelo"
  | "rumiacion";

interface Resource {
  id: string;
  tab: TabId;
  title: string;
  titleAccent?: string;
  lead: string;
  duration: string; // "10 min", "30 min · pareja"
  tag: string;
  temas: Tema[];
  href?: string;
  art: "respira" | "manos" | "carta" | "ojos" | "luna" | "libro" | "circulo" | "espejo" | "nudo";
}

// ─── DATA ───────────────────────────────────────────────────────────

const RESOURCES: Resource[] = [
  // ── Juegos ──────────────────────────────────────────────────
  {
    id: "5-apreciaciones",
    tab: "juegos",
    title: "Las 5",
    titleAccent: "apreciaciones",
    lead: "Cinco cosas que aprecio de ti, dichas en voz alta. Antes de dormir, cada noche, durante una semana.",
    duration: "15 min · pareja",
    tag: "pareja",
    temas: ["pareja", "apego"],
    art: "manos",
  },
  {
    id: "frasco-momentos",
    tab: "juegos",
    title: "El frasco",
    titleAccent: "de los momentos buenos",
    lead: "Apunta cada día algo bueno en un papel y mételo en el frasco. El 31 de diciembre los abrís todos.",
    duration: "1 año · familia",
    tag: "familia",
    temas: ["familia", "autoconocimiento"],
    art: "circulo",
  },
  {
    id: "tarot-emocional",
    tab: "juegos",
    title: "Tarot",
    titleAccent: "emocional",
    lead: "Saca tres cartas: cómo me siento ahora, qué necesito, qué puedo darme. Sin adivinar nada — solo escucharte.",
    duration: "10 min · individual",
    tag: "auto-conocimiento",
    temas: ["autoconocimiento", "rumiacion"],
    art: "carta",
  },
  {
    id: "caja-enfado",
    tab: "juegos",
    title: "La caja",
    titleAccent: "del enfado",
    lead: "Para niños: la caja física donde se mete el enfado. Se etiqueta, se mira, se devuelve a la caja cuando ya no muerde.",
    duration: "5 min · niños",
    tag: "familia",
    temas: ["familia"],
    art: "nudo",
  },
  {
    id: "circulo-gratitud",
    tab: "juegos",
    title: "Círculo",
    titleAccent: "de gratitud",
    lead: "En grupo: cada uno mira a la persona de su derecha y le dice una cosa que le agradece. Sin justificar.",
    duration: "20 min · grupo",
    tag: "grupo",
    temas: ["familia", "pareja"],
    art: "circulo",
  },
  {
    id: "bingo-emocional",
    tab: "juegos",
    title: "Bingo",
    titleAccent: "emocional",
    lead: "Cartón con 16 emociones. Cuando hayas sentido cada una y le hayas puesto nombre, marca. Sin prisa.",
    duration: "1 semana · individual",
    tag: "auto-conocimiento",
    temas: ["autoconocimiento"],
    art: "ojos",
  },
  {
    id: "cartas-fortalezas",
    tab: "juegos",
    title: "Cartas",
    titleAccent: "de fortalezas",
    lead: "24 cartas con tus mejores rasgos (curiosidad, valentía, gratitud…). Roba 3, decide cuál usar hoy.",
    duration: "5 min · individual",
    tag: "auto-conocimiento",
    temas: ["autoconocimiento"],
    art: "carta",
  },
  {
    id: "3-conversaciones",
    tab: "juegos",
    title: "Las 3",
    titleAccent: "conversaciones",
    lead: "Pareja: las tres conversaciones que llevamos meses evitando. Las nombramos. Una por semana, en orden.",
    duration: "30 min · pareja",
    tag: "pareja",
    temas: ["pareja", "apego"],
    art: "espejo",
  },
  {
    id: "espejo-amable",
    tab: "juegos",
    title: "El espejo",
    titleAccent: "amable",
    lead: "Frente al espejo, una frase de cariño hacia ti. Sin sonreír, sin justificar. Solo decirla y aguantar la incomodidad.",
    duration: "3 min · individual",
    tag: "auto-conocimiento",
    temas: ["autoconocimiento"],
    art: "espejo",
  },

  // ── Ejercicios ──────────────────────────────────────────────
  {
    id: "respiracion-4-7-8",
    tab: "ejercicios",
    title: "Respiración",
    titleAccent: "4 · 7 · 8",
    lead: "Inhalar 4 segundos, sostener 7, exhalar 8. Tres ciclos. Activa el parasimpático y baja el pulso en 90 segundos.",
    duration: "2 min",
    tag: "ansiedad",
    temas: ["ansiedad", "sueno"],
    art: "respira",
  },
  {
    id: "body-scan",
    tab: "ejercicios",
    title: "Body",
    titleAccent: "scan",
    lead: "Recorrido lento por el cuerpo, de la coronilla a los pies, nombrando lo que aprieta sin querer cambiarlo.",
    duration: "10 min",
    tag: "ansiedad",
    temas: ["ansiedad", "rumiacion"],
    art: "manos",
  },
  {
    id: "carta-yo-10",
    tab: "ejercicios",
    title: "Carta a tu",
    titleAccent: "yo de 10 años",
    lead: "Dile lo que necesitaba oír. Sin corregir el pasado: solo acompañarlo. Quédate con la carta. No hace falta enviarla a nadie.",
    duration: "30 min",
    tag: "auto-conocimiento",
    temas: ["autoconocimiento", "duelo"],
    art: "carta",
  },
  {
    id: "anclaje-5-4-3-2-1",
    tab: "ejercicios",
    title: "Anclaje",
    titleAccent: "5 · 4 · 3 · 2 · 1",
    lead: "Mira 5 cosas, toca 4, escucha 3, huele 2, prueba 1. Devuelve la atención al cuerpo cuando la cabeza se va.",
    duration: "3 min",
    tag: "ansiedad",
    temas: ["ansiedad", "rumiacion"],
    art: "ojos",
  },
  {
    id: "diario-3-paginas",
    tab: "ejercicios",
    title: "Las 3",
    titleAccent: "páginas",
    lead: "Al despertar, tres páginas a mano de lo que sea. Sin pensar, sin censurar, sin volver a leer. Saca el ruido del primer pensamiento.",
    duration: "20 min · diario",
    tag: "rumiacion",
    temas: ["rumiacion", "autoconocimiento"],
    art: "libro",
  },
  {
    id: "stop-4-segundos",
    tab: "ejercicios",
    title: "STOP",
    titleAccent: "4 segundos",
    lead: "Antes de reaccionar: para, respira, observa, procede. Tres segundos para que el córtex prefrontal vuelva al volante.",
    duration: "10 seg",
    tag: "ansiedad",
    temas: ["ansiedad"],
    art: "respira",
  },
  {
    id: "mapa-corporal",
    tab: "ejercicios",
    title: "Mapa corporal",
    titleAccent: "de emociones",
    lead: "Dibujas tu silueta y pintas dónde aprieta cada emoción. La rabia en la mandíbula, la tristeza en el pecho, el miedo en el estómago.",
    duration: "15 min",
    tag: "auto-conocimiento",
    temas: ["autoconocimiento", "ansiedad"],
    art: "manos",
  },
  {
    id: "3-preguntas-soltar",
    tab: "ejercicios",
    title: "Tres preguntas",
    titleAccent: "para soltar",
    lead: "¿Esto que pienso es cierto?, ¿qué pierdo si lo suelto?, ¿qué gano? Tres preguntas, tres líneas, una decisión más despacio.",
    duration: "5 min",
    tag: "rumiacion",
    temas: ["rumiacion", "autoconocimiento"],
    art: "espejo",
  },
  {
    id: "caminata-consciente",
    tab: "ejercicios",
    title: "Caminata",
    titleAccent: "consciente",
    lead: "20 minutos a paso lento. Cuenta los pasos hasta 10 y vuelve a empezar. Cuando la cabeza se vaya, vuelve al pie que toca el suelo.",
    duration: "20 min",
    tag: "ansiedad",
    temas: ["ansiedad", "rumiacion"],
    art: "circulo",
  },

  // ── Meditaciones ────────────────────────────────────────────
  {
    id: "meditacion-montana",
    tab: "meditaciones",
    title: "La",
    titleAccent: "montaña",
    lead: "Visualización guiada. Te sientas firme como una montaña: los pensamientos pasan como nubes, tú permaneces.",
    duration: "12 min",
    tag: "ansiedad",
    temas: ["ansiedad", "rumiacion"],
    art: "luna",
  },
  {
    id: "meditacion-bondad",
    tab: "meditaciones",
    title: "Bondad",
    titleAccent: "amorosa",
    lead: "Loving-kindness: cuatro frases dirigidas a ti, a alguien querido, a alguien neutro, a alguien difícil. En ese orden.",
    duration: "15 min",
    tag: "apego",
    temas: ["apego", "autoconocimiento"],
    art: "manos",
  },
  {
    id: "meditacion-body-scan",
    tab: "meditaciones",
    title: "Body scan",
    titleAccent: "para dormir",
    lead: "20 minutos en la cama, escaneando el cuerpo de pies a cabeza. Diseñado para que te duermas antes de terminar.",
    duration: "20 min",
    tag: "sueño",
    temas: ["sueno"],
    art: "luna",
  },
  {
    id: "meditacion-compasion",
    tab: "meditaciones",
    title: "Auto-",
    titleAccent: "compasión",
    lead: "Para días duros: tres frases de Kristin Neff («esto duele, el sufrimiento es parte de la vida, ¿puedo darme amor ahora?»).",
    duration: "10 min",
    tag: "auto-conocimiento",
    temas: ["autoconocimiento", "duelo"],
    art: "espejo",
  },
  {
    id: "espacio-pensamientos",
    tab: "meditaciones",
    title: "Espacio",
    titleAccent: "para pensar",
    lead: "Observas tus pensamientos sin engancharte. Los etiquetas («planificación», «memoria», «juicio») y los dejas pasar.",
    duration: "8 min",
    tag: "rumiacion",
    temas: ["rumiacion", "ansiedad"],
    art: "ojos",
  },

  // ── Lecturas ────────────────────────────────────────────────
  {
    id: "el-cuerpo-cuenta",
    tab: "lecturas",
    title: "El cuerpo",
    titleAccent: "lleva la cuenta",
    lead: "Bessel van der Kolk · 2014. Tratado fundacional sobre el trauma: cómo se guarda en el cuerpo y cómo se descarga.",
    duration: "475 pág · trauma",
    tag: "trauma",
    temas: ["duelo", "ansiedad"],
    art: "libro",
  },
  {
    id: "comunicacion-no-violenta",
    tab: "lecturas",
    title: "Comunicación",
    titleAccent: "no violenta",
    lead: "Marshall Rosenberg. Cuatro pasos para pedir lo que necesitas sin disparar al otro: observo, siento, necesito, pido.",
    duration: "240 pág · pareja",
    tag: "pareja",
    temas: ["pareja", "familia"],
    art: "libro",
  },
  {
    id: "atrapados",
    tab: "lecturas",
    title: "Atrapados",
    titleAccent: "en el deseo",
    lead: "Marta Tafalla · 2024. Filosofía y psicología sobre la trampa de querer querer. Para quien siempre busca lo que falta.",
    duration: "320 pág · ensayo",
    tag: "auto-conocimiento",
    temas: ["autoconocimiento", "rumiacion"],
    art: "libro",
  },
  {
    id: "apego-adulto",
    tab: "lecturas",
    title: "Apego",
    titleAccent: "adulto",
    lead: "Levine & Heller. Los 3 estilos de apego en pareja (seguro, ansioso, evitativo) y por qué siempre eliges al mismo.",
    duration: "300 pág · apego",
    tag: "apego",
    temas: ["apego", "pareja"],
    art: "libro",
  },
  {
    id: "inteligencia-emocional",
    tab: "lecturas",
    title: "Inteligencia",
    titleAccent: "emocional",
    lead: "Daniel Goleman · 1995. El libro que metió esta palabra en el diccionario. Cómo el cerebro emocional manda más que el racional.",
    duration: "420 pág · base",
    tag: "auto-conocimiento",
    temas: ["autoconocimiento"],
    art: "libro",
  },
];

// ─── Ilustraciones SVG ──────────────────────────────────────────────

const ARTS: Record<Resource["art"], React.ReactNode> = {
  respira: (
    <svg viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="240" fill="#1d2bdb" />
      <circle cx="160" cy="120" r="74" fill="none" stroke="#f4c842" strokeWidth="1.4" opacity="0.5" />
      <circle cx="160" cy="120" r="54" fill="none" stroke="#f4c842" strokeWidth="1.4" opacity="0.7" />
      <circle cx="160" cy="120" r="34" fill="none" stroke="#f1ead8" strokeWidth="2" />
      <text x="160" y="125" textAnchor="middle" fontFamily="Caveat" fontSize="22" fill="#f1ead8" fontWeight="600">4·7·8</text>
    </svg>
  ),
  manos: (
    <svg viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="240" fill="#1d2bdb" />
      <path d="M120 90 C 110 110, 110 140, 120 160 L 145 165 L 145 130 C 145 110, 135 95, 120 90 Z" fill="#f1ead8" />
      <path d="M200 90 C 210 110, 210 140, 200 160 L 175 165 L 175 130 C 175 110, 185 95, 200 90 Z" fill="#f1ead8" />
      <circle cx="160" cy="135" r="14" fill="#f4c842" />
      <circle cx="160" cy="135" r="6" fill="#1d2bdb" />
    </svg>
  ),
  carta: (
    <svg viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="240" fill="#1d2bdb" />
      <g transform="translate(120, 60) rotate(-8)">
        <rect width="80" height="120" rx="3" fill="#f1ead8" stroke="#1d2bdb" strokeWidth="1.5" />
        <path d="M 18 30 L 62 30 M 18 50 L 62 50 M 18 70 L 50 70" stroke="#1d2bdb" strokeWidth="1.5" opacity="0.5" />
        <circle cx="40" cy="98" r="10" fill="#c47a4b" />
      </g>
      <g transform="translate(160, 70) rotate(6)">
        <rect width="80" height="120" rx="3" fill="#fefaeb" stroke="#1d2bdb" strokeWidth="1.5" />
        <path d="M 18 30 L 62 30 M 18 50 L 62 50 M 18 70 L 56 70" stroke="#1d2bdb" strokeWidth="1.5" opacity="0.5" />
        <path d="M 30 95 L 50 95 L 40 110 Z" fill="#f4c842" />
      </g>
    </svg>
  ),
  ojos: (
    <svg viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="240" fill="#1d2bdb" />
      <path d="M 80 120 Q 130 80, 180 120 Q 130 160, 80 120 Z" fill="none" stroke="#f1ead8" strokeWidth="2.5" />
      <circle cx="130" cy="120" r="18" fill="#f1ead8" />
      <circle cx="130" cy="120" r="9" fill="#1d2bdb" />
      <path d="M 200 120 Q 220 105, 240 120" stroke="#f4c842" strokeWidth="2" fill="none" />
      <path d="M 200 130 Q 220 145, 240 130" stroke="#f4c842" strokeWidth="2" fill="none" />
      <path d="M 250 110 Q 270 95, 290 110" stroke="#c47a4b" strokeWidth="2" fill="none" />
    </svg>
  ),
  luna: (
    <svg viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="240" fill="#0f1baa" />
      <circle cx="200" cy="100" r="50" fill="#f1ead8" />
      <circle cx="218" cy="92" r="40" fill="#0f1baa" />
      <g fill="#f4c842">
        <circle cx="80" cy="60" r="2" />
        <circle cx="130" cy="40" r="2.5" />
        <circle cx="60" cy="120" r="1.5" />
        <circle cx="280" cy="170" r="2" />
        <circle cx="100" cy="180" r="1.5" />
      </g>
      <path d="M 0 220 Q 80 180, 160 200 Q 240 220, 320 200 L 320 240 L 0 240 Z" fill="#1d2bdb" />
    </svg>
  ),
  libro: (
    <svg viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="240" fill="#1d2bdb" />
      <g transform="translate(80, 50)">
        <rect width="160" height="140" rx="4" fill="#fefaeb" />
        <path d="M 80 0 L 80 140" stroke="#c47a4b" strokeWidth="2" />
        <g stroke="#1d2bdb" strokeWidth="1.5" opacity="0.5">
          <path d="M 14 30 L 70 30 M 14 50 L 70 50 M 14 70 L 60 70 M 14 90 L 70 90 M 14 110 L 56 110" />
          <path d="M 90 30 L 146 30 M 90 50 L 146 50 M 90 70 L 138 70 M 90 90 L 146 90 M 90 110 L 132 110" />
        </g>
      </g>
      <rect x="60" y="160" width="200" height="6" fill="#c47a4b" opacity="0.5" />
    </svg>
  ),
  circulo: (
    <svg viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="240" fill="#1d2bdb" />
      <circle cx="160" cy="120" r="60" fill="none" stroke="#f1ead8" strokeWidth="2" />
      <g fill="#f4c842">
        <circle cx="160" cy="60" r="6" />
        <circle cx="212" cy="90" r="6" />
        <circle cx="212" cy="150" r="6" />
        <circle cx="160" cy="180" r="6" />
        <circle cx="108" cy="150" r="6" />
        <circle cx="108" cy="90" r="6" />
      </g>
      <text x="160" y="126" textAnchor="middle" fontFamily="Caveat" fontSize="24" fill="#f1ead8" fontWeight="600">·6·</text>
    </svg>
  ),
  espejo: (
    <svg viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="240" fill="#1d2bdb" />
      <rect x="100" y="40" width="120" height="160" rx="60" fill="#f1ead8" />
      <rect x="108" y="48" width="104" height="144" rx="52" fill="#0f1baa" />
      <ellipse cx="160" cy="100" rx="34" ry="38" fill="#f1ead8" opacity="0.92" />
      <path d="M 130 130 Q 160 150, 190 130" stroke="#f4c842" strokeWidth="2.5" fill="none" />
      <circle cx="146" cy="92" r="3" fill="#1d2bdb" />
      <circle cx="174" cy="92" r="3" fill="#1d2bdb" />
    </svg>
  ),
  nudo: (
    <svg viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="240" fill="#1d2bdb" />
      <path
        d="M 100 100 Q 130 60, 160 100 Q 190 140, 220 100 Q 250 60, 220 140 Q 190 180, 160 140 Q 130 100, 100 140 Q 70 180, 100 100"
        fill="none"
        stroke="#f4c842"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <circle cx="160" cy="120" r="14" fill="#c47a4b" />
    </svg>
  ),
};

// ─── COMPONENTE ─────────────────────────────────────────────────────

const TABS: { id: TabId; label: string }[] = [
  { id: "juegos", label: "Juegos" },
  { id: "ejercicios", label: "Ejercicios" },
  { id: "meditaciones", label: "Meditaciones" },
  { id: "lecturas", label: "Lecturas" },
];

const CHIPS: { id: "all" | Tema; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "ansiedad", label: "Ansiedad" },
  { id: "apego", label: "Apego" },
  { id: "autoconocimiento", label: "Auto-conocimiento" },
  { id: "pareja", label: "Pareja" },
  { id: "familia", label: "Familia" },
  { id: "sueno", label: "Sueño" },
  { id: "duelo", label: "Duelo" },
  { id: "rumiacion", label: "Rumiación" },
];

export default function JuegosPage() {
  const [tab, setTab] = useState<TabId>("juegos");
  const [chip, setChip] = useState<"all" | Tema>("all");
  const [q, setQ] = useState("");

  const counts = useMemo(() => {
    return TABS.reduce<Record<TabId, number>>(
      (acc, t) => {
        acc[t.id] = RESOURCES.filter((r) => r.tab === t.id).length;
        return acc;
      },
      { juegos: 0, ejercicios: 0, meditaciones: 0, lecturas: 0 },
    );
  }, []);

  const filtered = useMemo(() => {
    const norm = q.trim().toLowerCase();
    return RESOURCES.filter((r) => r.tab === tab).filter((r) => {
      if (chip !== "all" && !r.temas.includes(chip)) return false;
      if (norm.length === 0) return true;
      return (
        r.title.toLowerCase().includes(norm) ||
        (r.titleAccent || "").toLowerCase().includes(norm) ||
        r.lead.toLowerCase().includes(norm) ||
        r.tag.toLowerCase().includes(norm)
      );
    });
  }, [tab, chip, q]);

  const sectionTitles: Record<TabId, { pre: string; em: string; small: string }> = {
    juegos: {
      pre: "Juegos para",
      em: "jugar con otros",
      small: "Pareja · familia · grupo",
    },
    ejercicios: {
      pre: "Ejercicios para",
      em: "hacer solo",
      small: "5–30 min · individual",
    },
    meditaciones: {
      pre: "Audios",
      em: "guiados",
      small: "Próximamente · 5 piezas",
    },
    lecturas: {
      pre: "Lecturas para",
      em: "el cuaderno",
      small: "Libros y ensayos curados",
    },
  };

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <div className={styles.breadcrumb}>
          <Link href="/recursos">Recursos</Link>
          <span className={styles.dot} />
          Juegos &amp; ejercicios
        </div>
        <h1>
          Cosas para <em>hacer.</em>
          <br />
          No para <b>leer</b>.
        </h1>
        <p className={styles.dek}>
          Una biblioteca curada de juegos, ejercicios, meditaciones y lecturas
          de psicología positiva. Para hacer en pareja, con la familia, en
          grupo o tú solo. Sin pantalla cuando se pueda.
        </p>
        <div className={styles.stats}>
          <span>
            <b>{RESOURCES.length}</b>
            piezas
          </span>
          <span>
            <b>{counts.juegos}</b>
            juegos
          </span>
          <span>
            <b>{counts.ejercicios}</b>
            ejercicios
          </span>
          <span>
            <b>{counts.meditaciones}</b>
            audios
          </span>
        </div>
      </header>

      {/* TABS */}
      <div className={styles.tabs}>
        <div className={styles.tabsWrap}>
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`${styles.tab} ${tab === t.id ? styles.on : ""}`}
              onClick={() => setTab(t.id)}
              aria-pressed={tab === t.id}
            >
              {t.label}
              <span className={styles.count}>{counts[t.id]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* TOOLBAR */}
      <div className={styles.toolbar}>
        <div className={styles.search}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-5-5" />
          </svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por título, tema, palabra…"
            aria-label="Buscar"
          />
        </div>
        <div className={styles.chips}>
          {CHIPS.map((c) => (
            <button
              key={c.id}
              className={`${styles.chip} ${chip === c.id ? styles.on : ""}`}
              onClick={() => setChip(c.id)}
              aria-pressed={chip === c.id}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* PANEL */}
      <section className={`${styles.panel} ${styles.on}`}>
        <h2 className={styles.sectionTitle}>
          {sectionTitles[tab].pre} <em>{sectionTitles[tab].em}</em>
          <small>{sectionTitles[tab].small}</small>
        </h2>
        <div className={styles.grid}>
          {filtered.length === 0 ? (
            <div className={styles.empty}>
              No hay resultados con esos filtros. Prueba a quitar alguno.
            </div>
          ) : (
            filtered.map((r) => (
              <a key={r.id} className={styles.card} href={r.href || "#"}>
                <div className={styles.cardArt}>
                  <span className={styles.cardTag}>{r.tag}</span>
                  <span className={styles.cardDuration}>{r.duration}</span>
                  {ARTS[r.art]}
                </div>
                <div className={styles.cardMeta}>
                  <h3 className={styles.cardTitle}>
                    {r.title}{" "}
                    {r.titleAccent && <em>{r.titleAccent}</em>}
                  </h3>
                  <p className={styles.cardLead}>{r.lead}</p>
                  <div className={styles.cardFoot}>
                    <span>{r.temas.join(" · ")}</span>
                    <span className={styles.arrow}>abrir →</span>
                  </div>
                </div>
              </a>
            ))
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <div className={styles.bottomCta}>
        <h3>
          ¿Te falta <em>una pieza?</em>
        </h3>
        <p>
          Si quieres un juego o ejercicio que no encuentras aquí, escríbeme.
          Voy ampliando la biblioteca con lo que la gente pide.
        </p>
        <Link href="/contacto">Sugerir un recurso</Link>
      </div>
    </div>
  );
}
