/**
 * Egoera — Brújula Emocional ilustraciones.
 *
 * Set de SVGs hand-drawn estilo "absurd design": personajes esquemáticos
 * hechos con líneas imperfectas (tinta china) sobre papel, con áreas
 * de **amarillo mostaza fluorescente** como acento semántico. Cada
 * ilustración es una escena absurda pero significativa, no un objeto
 * pelado: el cuerpo es la metáfora.
 *
 * Convención:
 *  - viewBox 0 0 120 120 (espacio para escena).
 *  - stroke = currentColor (hereda sepia oscuro / tinta del contexto).
 *  - strokeWidth variable 1.6 a 2.2 (línea hand-drawn).
 *  - fill amarillo hardcoded #f4c842 para manchas de mostaza.
 *  - cap/join round, líneas con leves curvas, NO geometría limpia.
 */
import * as React from "react";

import type { RegionId } from "@/lib/sentir-data";

type IconProps = { size?: number; className?: string; title?: string };

const MUSTARD = "#f4c842";

const COMMON_PROPS = {
  viewBox: "0 0 120 120",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.9,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/* ──────────────────────────────────────────────────────────────────
 * MASCOTA — figura sentada con una flor mostaza enorme creciendo
 * de la cabeza, como pensamiento que ya echó raíz. Hand-drawn,
 * imperfecta, con manchas amarillas y trazos sueltos.
 * ────────────────────────────────────────────────────────────── */
export function Mascot({ size = 160, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {/* mancha mostaza grande detrás como aura */}
      <path
        d="M30 86 C28 56, 56 38, 84 42 C116 46, 134 72, 128 100 C122 124, 92 134, 70 128 C46 122, 32 110, 30 86 Z"
        fill={MUSTARD}
        stroke="none"
        opacity={0.85}
      />
      {/* salpicaduras alrededor */}
      <circle cx={24} cy={36} r={2.5} fill={MUSTARD} stroke="none" />
      <circle cx={138} cy={32} r={3.2} fill={MUSTARD} stroke="none" />
      <circle cx={142} cy={130} r={2} fill={MUSTARD} stroke="none" />
      <circle cx={18} cy={120} r={2.8} fill={MUSTARD} stroke="none" />

      {/* cuerpo: tronco simple sentado */}
      <path d="M52 142 C56 122, 66 114, 80 114 C94 114, 104 122, 108 142" />
      {/* brazos abrazándose */}
      <path d="M60 124 C70 130, 90 130, 100 124" />
      {/* cuello corto */}
      <path d="M74 114 L74 102" />
      <path d="M86 114 L86 102" />
      {/* cabeza, ligeramente ovalada e imperfecta */}
      <path d="M62 86 C61 70, 70 60, 80 60 C92 60, 100 70, 100 84 C100 96, 92 104, 80 104 C70 104, 62 96, 62 86 Z" />
      {/* ojos cerrados a dos rayas */}
      <path d="M70 84 L76 84" strokeWidth={2.2} />
      <path d="M86 84 L92 84" strokeWidth={2.2} />
      {/* boca pequeña, casi imperceptible */}
      <path d="M78 94 C80 95, 82 95, 84 94" />
      {/* flor / pensamiento mostaza que crece de la cabeza */}
      <path d="M80 60 L80 36" strokeWidth={1.8} />
      <circle cx={80} cy={28} r={10} fill={MUSTARD} stroke="currentColor" strokeWidth={1.6} />
      <path d="M76 24 L72 18" strokeWidth={1.4} />
      <path d="M84 24 L88 18" strokeWidth={1.4} />
      <path d="M70 30 L62 30" strokeWidth={1.4} />
      <path d="M90 30 L98 30" strokeWidth={1.4} />
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────────────
 * ILUSTRACIONES "ABSURD DESIGN" — una por emoción.
 * Cada una es una escena: cuerpo + metáfora amarilla.
 * ────────────────────────────────────────────────────────────── */

/* ANSIEDAD — figura con un NUDO MOSTAZA enorme donde debería estar el estómago */
export function IconKnot({ size = 56, className }: IconProps) {
  return (
    <svg width={size} height={size} {...COMMON_PROPS} className={className} aria-hidden>
      {/* cabeza pequeña arriba */}
      <path d="M50 16 C50 10, 56 6, 60 6 C66 6, 70 10, 70 16 C70 22, 66 26, 60 26 C56 26, 50 22, 50 16 Z" />
      {/* ojos cerrados con pestañas tensas */}
      <path d="M54 15 L57 14" strokeWidth={1.6} />
      <path d="M63 14 L66 15" strokeWidth={1.6} />
      {/* boca apretada */}
      <path d="M56 21 L64 21" strokeWidth={1.7} />
      {/* cuello hacia el nudo */}
      <path d="M60 26 L60 36" />
      {/* mancha mostaza del nudo */}
      <ellipse cx={60} cy={62} rx={28} ry={24} fill={MUSTARD} stroke="none" />
      {/* contorno del nudo trazado encima */}
      <path d="M34 58 C34 44, 46 38, 60 38 C74 38, 86 46, 86 60 C86 76, 76 86, 60 86 C44 86, 34 76, 34 62 Z" />
      {/* enredo dentro del nudo: dos curvas que se cruzan */}
      <path d="M42 50 C52 58, 58 62, 70 58 C78 56, 82 64, 78 72" strokeWidth={2} />
      <path d="M44 72 C52 68, 56 64, 64 68 C72 72, 80 70, 80 64" strokeWidth={2} />
      <path d="M48 60 C54 56, 62 56, 68 60" strokeWidth={1.7} />
      {/* piernecitas cortas */}
      <path d="M52 88 L48 104" />
      <path d="M68 88 L72 104" />
      <path d="M44 106 L52 104" strokeWidth={1.6} />
      <path d="M68 104 L76 106" strokeWidth={1.6} />
      {/* salpicaduras de tensión */}
      <circle cx={22} cy={48} r={1.8} fill={MUSTARD} stroke="none" />
      <circle cx={98} cy={50} r={1.6} fill={MUSTARD} stroke="none" />
      <circle cx={104} cy={70} r={2} fill={MUSTARD} stroke="none" />
    </svg>
  );
}

/* TRISTEZA — figura saliendo de un charco mostaza que se le pega a los pies */
export function IconPuddle({ size = 56, className }: IconProps) {
  return (
    <svg width={size} height={size} {...COMMON_PROPS} className={className} aria-hidden>
      {/* charco mostaza enorme en la base */}
      <path
        d="M14 100 C10 92, 16 84, 30 82 C46 80, 60 86, 78 84 C96 82, 110 88, 108 96 C106 106, 92 112, 70 112 C48 112, 22 110, 14 100 Z"
        fill={MUSTARD}
        stroke="none"
      />
      {/* contorno del charco */}
      <path d="M14 100 C10 92, 16 84, 30 82 C46 80, 60 86, 78 84 C96 82, 110 88, 108 96 C106 106, 92 112, 70 112 C48 112, 22 110, 14 100 Z" />
      {/* salpicaduras del charco */}
      <circle cx={18} cy={86} r={2.2} fill={MUSTARD} stroke="none" />
      <circle cx={110} cy={84} r={1.8} fill={MUSTARD} stroke="none" />
      <circle cx={26} cy={114} r={1.6} fill={MUSTARD} stroke="none" />
      {/* figura intentando salir: cabeza inclinada */}
      <path d="M48 32 C48 22, 54 16, 60 16 C68 16, 74 22, 74 32 C74 42, 68 48, 60 48 C54 48, 48 42, 48 32 Z" />
      {/* ojos cerrados tristes (curva hacia abajo) */}
      <path d="M52 30 C54 32, 56 32, 58 30" strokeWidth={1.7} />
      <path d="M64 30 C66 32, 68 32, 70 30" strokeWidth={1.7} />
      {/* boca pequeña hacia abajo */}
      <path d="M56 40 C58 38, 62 38, 64 40" strokeWidth={1.7} />
      {/* lagrimita mostaza en mejilla */}
      <path d="M54 38 C52 44, 52 48, 54 50 C56 50, 56 44, 54 38 Z" fill={MUSTARD} stroke="currentColor" strokeWidth={1.4} />
      {/* cuerpo encorvado, hombros caídos */}
      <path d="M40 70 C46 56, 56 50, 60 50" />
      <path d="M80 70 C74 56, 64 50, 60 50" />
      {/* tronco que se hunde en el charco */}
      <path d="M44 70 C46 84, 50 92, 60 92" />
      <path d="M76 70 C74 84, 70 92, 60 92" />
      {/* brazo colgando */}
      <path d="M40 72 C36 80, 34 88, 32 96" />
      <path d="M80 72 C84 80, 86 88, 88 96" />
    </svg>
  );
}

/* APEGO — dos figuras unidas por un hilo amarillo larguísimo, tenso */
export function IconThread({ size = 56, className }: IconProps) {
  return (
    <svg width={size} height={size} {...COMMON_PROPS} className={className} aria-hidden>
      {/* figura izquierda más pequeña */}
      <path d="M18 50 C18 42, 24 38, 30 38 C36 38, 42 42, 42 50 C42 58, 36 62, 30 62 C24 62, 18 58, 18 50 Z" />
      <path d="M22 49 L26 49" />
      <path d="M34 49 L38 49" />
      <path d="M26 56 C28 57, 32 57, 34 56" />
      {/* cuerpo izquierdo */}
      <path d="M22 78 C24 70, 26 64, 30 64" />
      <path d="M38 78 C36 70, 34 64, 30 64" />
      <path d="M26 102 L22 78" />
      <path d="M34 102 L38 78" />
      <path d="M18 104 L28 102" />
      <path d="M32 102 L42 104" />

      {/* hilo amarillo enorme que conecta los dos */}
      <path
        d="M30 38 C36 22, 60 16, 78 22 C92 26, 98 38, 92 50"
        stroke={MUSTARD}
        strokeWidth={4.5}
        strokeLinecap="round"
        fill="none"
      />
      {/* trazo de tinta encima del hilo */}
      <path
        d="M30 38 C36 22, 60 16, 78 22 C92 26, 98 38, 92 50"
        strokeWidth={1.4}
        strokeDasharray="2 6"
      />

      {/* figura derecha, también mira hacia el lado contrario */}
      <path d="M76 50 C76 42, 82 38, 92 38 C100 38, 104 44, 104 52 C104 60, 100 64, 92 64 C84 64, 76 58, 76 50 Z" />
      <path d="M82 49 L86 49" />
      <path d="M94 49 L98 49" />
      <path d="M84 56 C86 57, 90 57, 92 56" />
      {/* cuerpo derecho */}
      <path d="M82 80 C82 72, 86 66, 92 66" />
      <path d="M104 80 C102 72, 98 66, 92 66" />
      <path d="M86 104 L82 80" />
      <path d="M98 104 L104 80" />
      <path d="M78 106 L88 104" />
      <path d="M94 104 L106 106" />

      {/* nudo amarillo en el medio del hilo, pequeño */}
      <circle cx={60} cy={18} r={3.5} fill={MUSTARD} stroke="currentColor" strokeWidth={1.4} />
    </svg>
  );
}

/* AUTOESTIMA — figura sosteniendo en alto su propio reflejo mostaza */
export function IconBlossom({ size = 56, className }: IconProps) {
  return (
    <svg width={size} height={size} {...COMMON_PROPS} className={className} aria-hidden>
      {/* figura que sostiene */}
      <path d="M48 80 C48 72, 54 68, 60 68 C68 68, 72 72, 72 80 C72 88, 68 92, 60 92 C54 92, 48 88, 48 80 Z" />
      {/* ojos abiertos serenos (puntos) */}
      <circle cx={55} cy={78} r={1.3} fill="currentColor" stroke="none" />
      <circle cx={65} cy={78} r={1.3} fill="currentColor" stroke="none" />
      {/* sonrisa leve segura */}
      <path d="M55 84 C58 86, 62 86, 65 84" strokeWidth={1.7} />
      {/* cuerpo erguido */}
      <path d="M50 106 L50 92" />
      <path d="M70 106 L70 92" />
      <path d="M44 110 L56 108" />
      <path d="M64 108 L76 110" />
      {/* brazos levantados sosteniendo el reflejo */}
      <path d="M48 76 C40 64, 32 50, 30 38" />
      <path d="M72 76 C80 64, 88 50, 90 38" />
      {/* manchurrón mostaza grande arriba: el reflejo amarillo */}
      <path
        d="M30 36 C28 22, 42 12, 60 12 C80 12, 94 22, 90 36 C86 46, 76 50, 60 50 C44 50, 32 46, 30 36 Z"
        fill={MUSTARD}
        stroke="none"
      />
      <path d="M30 36 C28 22, 42 12, 60 12 C80 12, 94 22, 90 36 C86 46, 76 50, 60 50 C44 50, 32 46, 30 36 Z" />
      {/* dentro del reflejo, cara espejo (esquemática) */}
      <circle cx={54} cy={28} r={1.5} fill="currentColor" stroke="none" />
      <circle cx={66} cy={28} r={1.5} fill="currentColor" stroke="none" />
      <path d="M54 36 C58 38, 62 38, 66 36" strokeWidth={1.6} />
      {/* destellitos del reflejo */}
      <path d="M22 18 L18 14" strokeWidth={1.4} />
      <path d="M98 18 L102 14" strokeWidth={1.4} />
      <path d="M16 30 L12 32" strokeWidth={1.4} />
      <path d="M104 30 L108 32" strokeWidth={1.4} />
    </svg>
  );
}

/* ENFADO — cabeza explotando en chispas mostaza */
export function IconStone({ size = 56, className }: IconProps) {
  return (
    <svg width={size} height={size} {...COMMON_PROPS} className={className} aria-hidden>
      {/* chispas amarillas grandes alrededor */}
      <path
        d="M60 6 L62 18 L72 12 L66 22 L80 22 L68 28 L82 36 L66 32 L60 12 Z"
        fill={MUSTARD}
        stroke="none"
        opacity={0.95}
      />
      <path
        d="M40 14 L46 24 L34 30 L48 30 L42 40 L50 32 L60 16 Z"
        fill={MUSTARD}
        stroke="none"
        opacity={0.95}
      />
      <path
        d="M96 22 L88 30 L98 32 L86 38 L98 42 L88 44 L84 28 Z"
        fill={MUSTARD}
        stroke="none"
        opacity={0.95}
      />
      <circle cx={20} cy={28} r={2.8} fill={MUSTARD} stroke="none" />
      <circle cx={100} cy={56} r={2.6} fill={MUSTARD} stroke="none" />
      <circle cx={16} cy={50} r={2} fill={MUSTARD} stroke="none" />

      {/* cabeza fracturada arriba */}
      <path d="M40 52 C40 42, 48 36, 60 36 C72 36, 80 42, 80 52" />
      {/* línea zigzag de "explosión" donde se rompe la cabeza */}
      <path d="M40 52 L46 48 L52 56 L60 50 L68 56 L74 48 L80 52" strokeWidth={2.2} />
      {/* cejas furiosas hacia abajo */}
      <path d="M46 60 L54 62" strokeWidth={2.2} />
      <path d="M74 60 L66 62" strokeWidth={2.2} />
      {/* ojos apretados */}
      <path d="M50 66 L56 66" strokeWidth={2} />
      <path d="M64 66 L70 66" strokeWidth={2} />
      {/* boca apretada cuadrada */}
      <path d="M52 76 L68 76" strokeWidth={2} />
      <path d="M52 76 L52 80" strokeWidth={1.7} />
      <path d="M68 76 L68 80" strokeWidth={1.7} />
      {/* hombros tensos */}
      <path d="M34 96 C40 88, 50 84, 60 84 C70 84, 80 88, 86 96" />
      <path d="M34 108 C40 100, 50 96, 60 96 C70 96, 80 100, 86 108" />
    </svg>
  );
}

/* CALMA — figura flotando dentro de una mancha mostaza ovoide */
export function IconMoonWaves({ size = 56, className }: IconProps) {
  return (
    <svg width={size} height={size} {...COMMON_PROPS} className={className} aria-hidden>
      {/* mancha mostaza ovoide grande que la contiene */}
      <path
        d="M16 60 C16 36, 32 18, 60 18 C88 18, 104 36, 104 60 C104 86, 88 102, 60 102 C32 102, 16 84, 16 60 Z"
        fill={MUSTARD}
        stroke="none"
      />
      {/* contorno de la mancha imperfecto */}
      <path d="M16 60 C16 36, 32 18, 60 18 C88 18, 104 36, 104 60 C104 86, 88 102, 60 102 C32 102, 16 84, 16 60 Z" />

      {/* figura flotando, ojos cerrados, postura horizontal-relajada */}
      <path d="M50 48 C50 40, 54 36, 60 36 C66 36, 70 40, 70 48 C70 56, 66 60, 60 60 C54 60, 50 56, 50 48 Z" />
      {/* ojos cerrados curvos */}
      <path d="M54 47 C55 49, 57 49, 58 47" strokeWidth={1.6} />
      <path d="M62 47 C63 49, 65 49, 66 47" strokeWidth={1.6} />
      {/* sonrisa muy leve */}
      <path d="M56 54 C58 55, 62 55, 64 54" />
      {/* cuerpo recostado, piernas cruzadas */}
      <path d="M48 70 C50 64, 56 60, 60 60" />
      <path d="M72 70 C70 64, 64 60, 60 60" />
      <path d="M48 70 C50 78, 56 82, 64 80 C72 78, 80 76, 84 70" />
      {/* brazo descansando */}
      <path d="M44 68 C36 72, 30 76, 26 84" />

      {/* burbujitas amarillas alrededor */}
      <circle cx={108} cy={28} r={1.8} fill={MUSTARD} stroke="currentColor" strokeWidth={0.8} />
      <circle cx={14} cy={30} r={1.5} fill={MUSTARD} stroke="currentColor" strokeWidth={0.8} />
      <circle cx={104} cy={94} r={2} fill={MUSTARD} stroke="currentColor" strokeWidth={0.8} />
      <circle cx={18} cy={98} r={1.6} fill={MUSTARD} stroke="currentColor" strokeWidth={0.8} />
    </svg>
  );
}

/* SOLEDAD — figura pequeña con una SOMBRA MOSTAZA enorme detrás */
export function IconEmptyChair({ size = 56, className }: IconProps) {
  return (
    <svg width={size} height={size} {...COMMON_PROPS} className={className} aria-hidden>
      {/* sombra amarilla enorme alargada (la "presencia ausente") */}
      <path
        d="M16 108 C12 102, 30 56, 46 38 C58 24, 64 18, 70 18 C76 18, 76 26, 74 38 C70 60, 54 100, 50 110 C44 116, 24 116, 16 108 Z"
        fill={MUSTARD}
        stroke="none"
      />
      {/* contorno de sombra suave */}
      <path
        d="M16 108 C12 102, 30 56, 46 38 C58 24, 64 18, 70 18"
        strokeDasharray="2 4"
        opacity={0.65}
      />

      {/* figura pequeñita a la derecha */}
      <path d="M76 48 C76 42, 80 38, 84 38 C90 38, 94 42, 94 48 C94 54, 90 58, 84 58 C80 58, 76 54, 76 48 Z" />
      {/* ojos cerrados, mirada perdida */}
      <path d="M79 48 L82 48" strokeWidth={1.5} />
      <path d="M86 48 L90 48" strokeWidth={1.5} />
      {/* boca recta neutra */}
      <path d="M82 53 L88 53" strokeWidth={1.5} />
      {/* cuerpo: tronco corto */}
      <path d="M78 70 C78 64, 82 60, 85 60" />
      <path d="M92 70 C92 64, 88 60, 85 60" />
      {/* brazos abrazándose, encogidos */}
      <path d="M78 70 C76 76, 78 82, 84 84" />
      <path d="M92 70 C94 76, 92 82, 86 84" />
      {/* piernecitas pequeñas */}
      <path d="M80 92 L78 104" />
      <path d="M90 92 L92 104" />
      <path d="M74 106 L82 104" />
      <path d="M88 104 L96 106" />

      {/* puntos solitos alrededor */}
      <circle cx={108} cy={22} r={1.4} fill={MUSTARD} stroke="none" />
      <circle cx={102} cy={36} r={1.2} fill={MUSTARD} stroke="none" />
    </svg>
  );
}

/* CULPA — figura cargando una piedra amarilla enorme en la espalda */
export function IconHeartCurrent({ size = 56, className }: IconProps) {
  return (
    <svg width={size} height={size} {...COMMON_PROPS} className={className} aria-hidden>
      {/* piedra mostaza grande encima */}
      <path
        d="M28 38 C26 28, 36 18, 50 16 C66 14, 82 18, 92 26 C100 32, 102 42, 96 48 C88 54, 70 54, 56 52 C42 50, 30 46, 28 38 Z"
        fill={MUSTARD}
        stroke="none"
      />
      {/* contorno de la piedra imperfecto */}
      <path d="M28 38 C26 28, 36 18, 50 16 C66 14, 82 18, 92 26 C100 32, 102 42, 96 48 C88 54, 70 54, 56 52 C42 50, 30 46, 28 38 Z" />
      {/* grietas en la piedra */}
      <path d="M42 26 C48 30, 56 32, 64 30" strokeWidth={1.3} opacity={0.6} />
      <path d="M50 42 C58 40, 70 40, 80 38" strokeWidth={1.3} opacity={0.6} />

      {/* cabeza inclinada hacia adelante por el peso */}
      <path d="M50 70 C50 62, 56 58, 62 58 C70 58, 74 64, 74 72 C74 80, 70 84, 62 84 C56 84, 50 78, 50 70 Z" />
      {/* ojos cerrados */}
      <path d="M54 70 L57 70" strokeWidth={1.6} />
      <path d="M65 70 L68 70" strokeWidth={1.6} />
      {/* boca apretada hacia abajo */}
      <path d="M56 78 C58 76, 64 76, 66 78" strokeWidth={1.6} />
      {/* cuello aplastado por el peso */}
      <path d="M58 58 L58 52" strokeWidth={1.4} />
      <path d="M66 58 L66 52" strokeWidth={1.4} />
      {/* espalda muy encorvada */}
      <path d="M42 102 C42 92, 48 86, 60 86 C72 86, 80 92, 82 102" />
      {/* brazos colgando, tensos */}
      <path d="M44 96 C40 100, 36 106, 32 112" />
      <path d="M80 96 C84 100, 88 106, 92 112" />
      {/* piernas */}
      <path d="M50 104 L46 116" />
      <path d="M72 104 L76 116" />
    </svg>
  );
}

/* SEMILLA fallback — pequeño brote mostaza saliendo de tierra */
export function IconSeed({ size = 56, className }: IconProps) {
  return (
    <svg width={size} height={size} {...COMMON_PROPS} className={className} aria-hidden>
      {/* mancha mostaza redonda (semilla absurda enorme) */}
      <ellipse cx={60} cy={56} rx={24} ry={28} fill={MUSTARD} stroke="none" />
      <ellipse cx={60} cy={56} rx={24} ry={28} />
      {/* dos ojitos en la semilla */}
      <circle cx={52} cy={54} r={1.6} fill="currentColor" stroke="none" />
      <circle cx={68} cy={54} r={1.6} fill="currentColor" stroke="none" />
      <path d="M54 64 C58 66, 62 66, 66 64" strokeWidth={1.6} />
      {/* tallito */}
      <path d="M60 84 L60 100" strokeWidth={1.8} />
      {/* hoja pequeña */}
      <path d="M60 92 C66 90, 72 92, 74 96 C70 100, 64 98, 60 96" fill={MUSTARD} stroke="currentColor" />
      {/* tierra */}
      <path d="M20 108 C32 106, 48 110, 60 108 C72 106, 88 110, 100 108" strokeWidth={1.7} />
      <path d="M28 114 L34 112" />
      <path d="M88 112 L94 114" />
    </svg>
  );
}

/* LLAMA — alias usado por la región amygdala. Reusa la misma escena de
 * enfado (cabeza con chispas) porque es la metáfora más coherente con
 * la amígdala (centro de alerta). */
export function IconFlame({ size = 56, className }: IconProps) {
  return <IconStone size={size} className={className} />;
}

/* OJO con espiral — usado por región prefrontal. Reusa la metáfora del
 * NUDO (pensar sobre pensar). */
export function IconEyeSpiral({ size = 56, className }: IconProps) {
  return <IconKnot size={size} className={className} />;
}

/* RAÍZ — usado por región hippocampus (memoria). Reusa la sombra
 * alargada de Soledad como "memoria que arrastra". */
export function IconRootBranch({ size = 56, className }: IconProps) {
  return <IconEmptyChair size={size} className={className} />;
}

/* ──────────────────────────────────────────────────────────────────
 * Mapeos públicos.
 * ────────────────────────────────────────────────────────────── */

export function IconForRegion({
  region,
  size = 56,
  className,
}: {
  region: RegionId;
  size?: number;
  className?: string;
}) {
  switch (region) {
    case "amygdala":
      return <IconStone size={size} className={className} />;
    case "prefrontal":
      return <IconKnot size={size} className={className} />;
    case "hippocampus":
      return <IconEmptyChair size={size} className={className} />;
    case "insula":
      return <IconHeartCurrent size={size} className={className} />;
    case "accumbens":
      return <IconThread size={size} className={className} />;
    case "cerebellum":
      return <IconMoonWaves size={size} className={className} />;
    default:
      return <IconSeed size={size} className={className} />;
  }
}

export function IconForFeeling({
  id,
  size = 56,
  className,
}: {
  id: string;
  size?: number;
  className?: string;
}) {
  switch (id) {
    case "ansiedad":
      return <IconKnot size={size} className={className} />;
    case "tristeza":
      return <IconPuddle size={size} className={className} />;
    case "apego":
      return <IconThread size={size} className={className} />;
    case "autoestima":
      return <IconBlossom size={size} className={className} />;
    case "enfado":
      return <IconStone size={size} className={className} />;
    case "calma":
      return <IconMoonWaves size={size} className={className} />;
    case "soledad":
      return <IconEmptyChair size={size} className={className} />;
    case "culpa":
      return <IconHeartCurrent size={size} className={className} />;
    default:
      return <IconSeed size={size} className={className} />;
  }
}

/* ──────────────────────────────────────────────────────────────────
 * CARTA — marco hand-drawn con un pequeño acento mostaza en la
 * esquina superior izquierda (sello informal).
 * ────────────────────────────────────────────────────────────── */
export function CardFrame({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 320 460"
      preserveAspectRatio="none"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.2}
      aria-hidden
    >
      <rect x={8} y={8} width={304} height={444} rx={14} />
      <rect x={16} y={16} width={288} height={428} rx={10} opacity={0.5} strokeDasharray="2 4" />
      {/* esquinas hand-drawn */}
      <path d="M14 28 L14 14 L28 14" strokeWidth={2} />
      <path d="M306 14 L306 28 M306 14 L292 14" strokeWidth={2} />
      <path d="M14 432 L14 446 L28 446" strokeWidth={2} />
      <path d="M306 446 L306 432 M306 446 L292 446" strokeWidth={2} />
      {/* manchita mostaza en la esquina */}
      <circle cx={28} cy={28} r={6} fill={MUSTARD} stroke="none" opacity={0.85} />
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────────────
 * CONFETI absurd — manchas amarillas, salpicaduras y trazos sueltos.
 * Mantiene la API del ConfettiPiece original.
 * ────────────────────────────────────────────────────────────── */

export function ConfettiPiece({
  variant,
  color,
  className,
  style,
}: {
  variant: "leaf" | "petal" | "spiral" | "dot";
  color: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const common = {
    className,
    style,
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: color,
    stroke: color,
    strokeWidth: 0.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (variant) {
    case "leaf":
      return (
        <svg {...common}>
          {/* manchurrón irregular mostaza-tipo */}
          <path d="M4 8 C6 4, 14 2, 18 6 C22 10, 20 18, 14 20 C8 22, 2 18, 4 8 Z" fillOpacity={0.9} />
        </svg>
      );
    case "petal":
      return (
        <svg {...common}>
          {/* trazo tipo pincelada */}
          <path d="M4 14 C8 10, 14 8, 20 6 C18 12, 14 18, 6 20 C4 18, 3 16, 4 14 Z" fillOpacity={0.9} />
        </svg>
      );
    case "spiral":
      return (
        <svg {...common} fill="none" strokeWidth={1.6}>
          <path d="M6 12 C6 6, 14 4, 18 8 C20 12, 18 16, 12 16 C10 14, 12 12, 14 12" />
        </svg>
      );
    case "dot":
    default:
      return (
        <svg {...common}>
          {/* salpicadura irregular */}
          <path d="M8 8 C10 6, 14 6, 16 8 C18 10, 18 14, 16 16 C14 18, 10 18, 8 16 C6 14, 6 10, 8 8 Z" fillOpacity={0.95} />
        </svg>
      );
  }
}
