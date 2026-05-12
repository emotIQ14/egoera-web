"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
} from "framer-motion";

import {
  scoreSwipes,
  SENTIR_CARDS,
  type RegionId,
  type SentirCard,
  type SentirExercise,
  type SentirResult,
  type SwipeAnswer,
  type SwipeRecord,
} from "@/lib/sentir-data";
import {
  EMPTY_STATE,
  levelFor,
  liveStreak,
  loadState,
  mergeSession,
  saveState,
  type SentirState,
  type SessionDelta,
} from "@/lib/sentir-streak";
import { BRAIN_REGIONS, FEELINGS, type BrainRegion } from "@/lib/egoera-data";
import type { Dictionary } from "@/i18n/getDictionary";

import {
  CardFrame,
  ConfettiPiece,
  IconForFeeling,
  IconForRegion,
  Mascot,
} from "./illustrations";
import styles from "./sentir.module.css";

/**
 * Mapa de region -> post precargado en server.
 */
export type PostByRegion = Record<
  string,
  | {
      slug: string;
      title: string;
      excerpt: string;
      readTime: string;
      coverImage?: string | null;
    }
  | undefined
>;

interface Props {
  postsByRegion: PostByRegion;
  dict: Dictionary["sentir"];
}

type Phase = "intro" | "deck" | "celebrate" | "result";

const SWIPE_X_THRESHOLD = 110;
const SWIPE_Y_THRESHOLD = 90;
const SOUND_PREF_KEY = "egoera.sentir.sound";

/* =========================================================================
 * Top-level
 * ===================================================================== */
export function SentirClient({ postsByRegion, dict }: Props) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [answers, setAnswers] = useState<SwipeRecord[]>([]);

  // Estado persistente de gamificación.
  const [streakState, setStreakState] = useState<SentirState>(EMPTY_STATE);
  const [sessionDelta, setSessionDelta] = useState<SessionDelta | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Ref siempre sincronizado con streakState para leerlo desde efectos
  // que NO deben tener streakState en sus deps (evita bucles).
  const streakStateRef = useRef(streakState);
  useEffect(() => {
    streakStateRef.current = streakState;
  }, [streakState]);

  // Sonido (opt-out por defecto activado, se persiste).
  const [soundOn, setSoundOn] = useState(true);

  useEffect(() => {
    setStreakState(loadState());
    if (typeof window !== "undefined") {
      const pref = window.localStorage.getItem(SOUND_PREF_KEY);
      if (pref === "off") setSoundOn(false);
    }
    setHydrated(true);
  }, []);

  // El root layout fija el body en crema #f1ead8 (rediseño cobalto-crema).
  // /sentir vive en su propia paleta papel-herbario (#f4ebd9, más cálido).
  // Pintamos body+html con el papel local mientras esta página esté
  // montada y restauramos al desmontar para no afectar a otras rutas.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const PAPER = "#f4ebd9";
    const prevBody = document.body.style.backgroundColor;
    const prevHtml = document.documentElement.style.backgroundColor;
    document.body.style.backgroundColor = PAPER;
    document.documentElement.style.backgroundColor = PAPER;
    return () => {
      document.body.style.backgroundColor = prevBody;
      document.documentElement.style.backgroundColor = prevHtml;
    };
  }, []);

  const toggleSound = useCallback(() => {
    setSoundOn((s) => {
      const next = !s;
      if (typeof window !== "undefined") {
        window.localStorage.setItem(SOUND_PREF_KEY, next ? "on" : "off");
      }
      return next;
    });
  }, []);

  // Scroll al top al cambiar de fase para que la transición se sienta.
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [phase]);

  const start = useCallback(() => {
    setAnswers([]);
    setSessionDelta(null);
    setPhase("deck");
  }, []);

  const handleAnswer = useCallback(
    (cardId: string, answer: SwipeAnswer) => {
      // Sonido sutil (Web Audio API) — sin libs.
      if (soundOn) playSwipeTone(answer);
      setAnswers((prev) => {
        const next = [...prev, { cardId, answer }];
        if (next.length >= SENTIR_CARDS.length) {
          // Cuando termina el deck, arranca la celebración tras 280ms
          // (lo justo para que la última carta termine su exit anim).
          setTimeout(() => setPhase("celebrate"), 280);
        }
        return next;
      });
    },
    [soundOn]
  );

  const undo = useCallback(() => {
    setAnswers((prev) => prev.slice(0, -1));
  }, []);

  const restart = useCallback(() => {
    setAnswers([]);
    setSessionDelta(null);
    setPhase("intro");
  }, []);

  // Resultado calculado solo cuando ya estamos en celebración / resultado.
  const result = useMemo<SentirResult | null>(() => {
    if (phase !== "celebrate" && phase !== "result") return null;
    return scoreSwipes(answers);
  }, [phase, answers]);

  // Reset del ref de merge cuando volvemos a intro/deck.
  const mergedSessionRef = useRef(false);
  useEffect(() => {
    if (phase === "intro" || phase === "deck") {
      mergedSessionRef.current = false;
    }
  }, [phase]);

  // Una sola vez al pasar a celebrate: mergeamos la sesión y persistimos.
  // Importante: NO incluimos `streakState` en deps (provocaría bucle al
  // setearlo). Tampoco hacemos setState anidados dentro del updater
  // (Strict Mode lo dispararía dos veces).
  useEffect(() => {
    if (phase !== "celebrate" || !result || !hydrated) return;
    if (mergedSessionRef.current) return;
    mergedSessionRef.current = true;

    const yesCount = answers.filter(
      (a) => a.answer === "yes" || a.answer === "mucho"
    ).length;
    const { next, delta } = mergeSession(
      streakStateRef.current,
      result,
      yesCount,
      answers.length
    );
    setStreakState(next);
    setSessionDelta(delta);
    saveState(next);
    if (soundOn) playCelebrationChime();
    // El componente Celebrate hará setPhase("result") tras su tiempo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, result, hydrated, answers]);

  // Tokens de color que pasamos como CSS vars al wrap del result.
  const resultStyle = result
    ? ({
        "--feel-c1": result.feeling.c1,
        "--feel-c2": result.feeling.c2,
      } as React.CSSProperties)
    : undefined;

  return (
    <main className={styles.page} style={resultStyle}>
      <div
        className={`${styles.bgGlow} ${
          phase === "result" ? styles.bgGlowResult : ""
        }`}
        aria-hidden
      />
      <div className={styles.wrap}>
        {phase === "intro" && (
          <IntroScreen
            dict={dict}
            onStart={start}
            streakState={streakState}
            hydrated={hydrated}
          />
        )}
        {phase === "deck" && (
          <DeckScreen
            dict={dict}
            answers={answers}
            onAnswer={handleAnswer}
            onUndo={undo}
            soundOn={soundOn}
            onToggleSound={toggleSound}
          />
        )}
        {phase === "result" && result && sessionDelta && (
          <ResultScreen
            dict={dict}
            result={result}
            postsByRegion={postsByRegion}
            onRestart={restart}
            streakState={streakState}
            sessionDelta={sessionDelta}
          />
        )}
      </div>

      {phase === "celebrate" && result && sessionDelta && (
        <CelebrateOverlay
          result={result}
          delta={sessionDelta}
          onDone={() => setPhase("result")}
        />
      )}
    </main>
  );
}

export default SentirClient;

/* =========================================================================
 * INTRO
 * ===================================================================== */
function IntroScreen({
  dict,
  onStart,
  streakState,
  hydrated,
}: {
  dict: Dictionary["sentir"];
  onStart: () => void;
  streakState: SentirState;
  hydrated: boolean;
}) {
  const live = liveStreak(streakState);
  const level = levelFor(streakState.points);

  return (
    <div className={styles.intro}>
      <div className={styles.fadeUp}>
        <div className={styles.kicker}>{dict.kicker}</div>

        <div className={styles.mascot} aria-hidden>
          <Mascot size={168} />
        </div>

        {/* Streak/nivel solo cuando el cliente ya está hidratado, así
            evitamos un flash de "0 días" en la primera carga. */}
        {hydrated && streakState.totalSessions > 0 && (
          <div className={styles.streakRow}>
            <span className={styles.streakFlame}>↑</span>
            <span className={styles.streakNumber}>
              {live > 0 ? live : 0}
            </span>
            <span className={styles.streakLabel}>
              {live === 1 ? "día" : "días"} contigo
            </span>
            <span className={styles.streakDivider} aria-hidden />
            <span className={styles.streakLevel}>
              <span className={styles.streakLevelGlyph} aria-hidden>
                <IconForFeeling id={streakState.lastRegion ?? "autoestima"} size={18} />
              </span>
              {level.current.name}
            </span>
            <span className={styles.streakDivider} aria-hidden />
            <span className={styles.streakLabel}>
              {streakState.points} pts
            </span>
          </div>
        )}

        <h1 className={styles.heroTitle}>
          {splitFirstWord(dict.heroTitle).first}{" "}
          <em>{splitFirstWord(dict.heroTitle).rest}</em>
        </h1>
        <p className={styles.heroLead}>{dict.heroLeadFirst}</p>
        <p className={styles.heroLeadSecond}>{dict.heroLeadSecond}</p>
        <p className={styles.heroFine}>{dict.heroFinePrint}</p>
        <div className={styles.heroActions}>
          <button
            type="button"
            className={styles.startBtn}
            onClick={onStart}
            aria-label={dict.heroStartLabel}
          >
            {dict.heroStartLabel}
            <span aria-hidden>→</span>
          </button>
          <Link href="/diario" className={styles.skipBtn}>
            {dict.heroSkipLabel}
          </Link>
        </div>
      </div>

      <aside
        className={`${styles.steps} ${styles.fadeUp} ${styles.fadeUpDelay2}`}
      >
        <h2 className={styles.stepsTitle}>{dict.introStepsTitle}</h2>
        <ol className={styles.stepList}>
          <Step
            n="01"
            title={dict.introStep1Title}
            body={dict.introStep1Body}
          />
          <Step
            n="02"
            title={dict.introStep2Title}
            body={dict.introStep2Body}
          />
          <Step
            n="03"
            title={dict.introStep3Title}
            body={dict.introStep3Body}
          />
        </ol>
        <div className={styles.privacy}>{dict.introPrivacy}</div>
      </aside>
    </div>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <li className={styles.step}>
      <span className={styles.stepNum} aria-hidden>
        {n}
      </span>
      <div className={styles.stepText}>
        <h4>{title}</h4>
        <p>{body}</p>
      </div>
    </li>
  );
}

function splitFirstWord(s: string): { first: string; rest: string } {
  const tokens = s.split(" ");
  if (tokens.length <= 1) return { first: "", rest: s };
  const last = tokens.pop()!;
  return { first: tokens.join(" "), rest: last };
}

/* =========================================================================
 * DECK
 * ===================================================================== */
function DeckScreen({
  dict,
  answers,
  onAnswer,
  onUndo,
  soundOn,
  onToggleSound,
}: {
  dict: Dictionary["sentir"];
  answers: SwipeRecord[];
  onAnswer: (cardId: string, answer: SwipeAnswer) => void;
  onUndo: () => void;
  soundOn: boolean;
  onToggleSound: () => void;
}) {
  const total = SENTIR_CARDS.length;
  const idx = answers.length;
  const progress = (idx / total) * 100;
  const visible = SENTIR_CARDS.slice(idx, idx + 3);

  // Atajos: ← no, → sí, ↑ mucho, espacio = no estoy seguro.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const card = SENTIR_CARDS[idx];
      if (!card) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        onAnswer(card.id, "no");
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        onAnswer(card.id, "yes");
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        onAnswer(card.id, "mucho");
      } else if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        onAnswer(card.id, "skip");
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idx, onAnswer]);

  return (
    <div className={styles.deckShell}>
      <div className={styles.deckHead}>
        <span className={styles.deckProgress}>
          {dict.deckProgress
            .replace("{current}", String(idx + 1))
            .replace("{total}", String(total))}
        </span>
        <div className={styles.progressBar} aria-hidden>
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
        </div>
        <button
          type="button"
          className={styles.undoBtn}
          onClick={onUndo}
          disabled={answers.length === 0}
        >
          ← {dict.deckUndo}
        </button>
        <button
          type="button"
          className={styles.soundToggle}
          onClick={onToggleSound}
          aria-pressed={soundOn}
          aria-label={soundOn ? "Silenciar sonido" : "Activar sonido"}
          title={soundOn ? "♪ sonido on" : "♪ sonido off"}
        >
          {soundOn ? "♪ on" : "♪ off"}
        </button>
      </div>

      <div className={styles.stack}>
        <AnimatePresence initial={false}>
          {visible
            .slice()
            .reverse()
            .map((card, posInReversed) => {
              const depth = visible.length - 1 - posInReversed;
              const isFront = depth === 0;
              return (
                <DeckCard
                  key={card.id}
                  card={card}
                  depth={depth}
                  isFront={isFront}
                  onAnswer={isFront ? onAnswer : undefined}
                  dict={dict}
                />
              );
            })}
        </AnimatePresence>
      </div>

      <div className={styles.choices}>
        <ChoiceButton
          variant="no"
          icon="✗"
          label={dict.deckHintNo}
          strong={dict.deckButtonNo}
          onClick={() => {
            const card = SENTIR_CARDS[idx];
            if (card) onAnswer(card.id, "no");
          }}
        />
        <ChoiceButton
          variant="skip"
          icon="·"
          label={dict.deckHintSkip}
          strong={dict.deckButtonSkip}
          onClick={() => {
            const card = SENTIR_CARDS[idx];
            if (card) onAnswer(card.id, "skip");
          }}
        />
        <ChoiceButton
          variant="yes"
          icon="✓"
          label={dict.deckHintYes}
          strong={dict.deckButtonYes}
          onClick={() => {
            const card = SENTIR_CARDS[idx];
            if (card) onAnswer(card.id, "yes");
          }}
        />
        <ChoiceButton
          variant="mucho"
          icon="↑"
          label={dict.deckHintMucho}
          strong={dict.deckButtonMucho}
          onClick={() => {
            const card = SENTIR_CARDS[idx];
            if (card) onAnswer(card.id, "mucho");
          }}
        />
      </div>
    </div>
  );
}

function ChoiceButton({
  variant,
  icon,
  label,
  strong,
  onClick,
}: {
  variant: "no" | "skip" | "yes" | "mucho";
  icon: string;
  label: string;
  strong: string;
  onClick: () => void;
}) {
  const variantClass = {
    no: styles.choiceNo,
    skip: styles.choiceSkip,
    yes: styles.choiceYes,
    mucho: styles.choiceMucho,
  }[variant];

  return (
    <button
      type="button"
      className={`${styles.choice} ${variantClass}`}
      onClick={onClick}
      aria-label={`${strong} — ${label}`}
    >
      <span className={styles.choiceIcon} aria-hidden>
        {icon}
      </span>
      <strong>{strong}</strong>
      <span className={styles.choiceLabel}>{label}</span>
    </button>
  );
}

/* =========================================================================
 * DECK CARD (única, con drag)
 * ===================================================================== */

const REGION_BY_ID: Record<RegionId, BrainRegion> = BRAIN_REGIONS.reduce(
  (acc, r) => {
    acc[r.id as RegionId] = r;
    return acc;
  },
  {} as Record<RegionId, BrainRegion>
);

function topWeightRegion(card: SentirCard): BrainRegion {
  const entries = Object.entries(card.weights) as [RegionId, number][];
  if (entries.length === 0) return BRAIN_REGIONS[0];
  entries.sort((a, b) => b[1] - a[1]);
  return REGION_BY_ID[entries[0][0]] ?? BRAIN_REGIONS[0];
}

function DeckCard({
  card,
  depth,
  isFront,
  onAnswer,
  dict,
}: {
  card: SentirCard;
  depth: number;
  isFront: boolean;
  onAnswer?: (cardId: string, answer: SwipeAnswer) => void;
  dict: Dictionary["sentir"];
}) {
  const region = topWeightRegion(card);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotate = useTransform(x, [-220, 220], [-14, 14]);

  const noOpacity = useTransform(x, [-180, -60], [1, 0]);
  const yesOpacity = useTransform(x, [60, 180], [0, 1]);
  const muchoOpacity = useTransform(y, [-180, -60], [1, 0]);

  const handleDragEnd = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (!onAnswer) return;
    const { offset, velocity } = info;
    if (
      offset.y < -SWIPE_Y_THRESHOLD &&
      Math.abs(offset.y) > Math.abs(offset.x)
    ) {
      onAnswer(card.id, "mucho");
      return;
    }
    if (offset.x > SWIPE_X_THRESHOLD || velocity.x > 600) {
      onAnswer(card.id, "yes");
      return;
    }
    if (offset.x < -SWIPE_X_THRESHOLD || velocity.x < -600) {
      onAnswer(card.id, "no");
      return;
    }
  };

  const stackStyle = isFront
    ? {}
    : {
        transform: `translateY(${depth * 10}px) scale(${1 - depth * 0.04})`,
        opacity: 1 - depth * 0.18,
        filter: depth > 0 ? "saturate(0.9)" : undefined,
        transition: "transform 0.4s ease, opacity 0.4s ease",
      };

  const cardColors = {
    "--card-c1": region.color,
    "--card-c2": region.c2,
  } as React.CSSProperties;

  if (!isFront) {
    return (
      <div
        className={`${styles.card} ${styles.cardBack}`}
        style={{ ...cardColors, ...stackStyle }}
        aria-hidden
      >
        <div className={styles.cardSheen} aria-hidden />
        <div className={styles.cardCorner}>
          <span>{card.id.replace(/-/g, " ")}</span>
          <span className={styles.cardCornerGlyph}>
            <IconForRegion region={region.id as RegionId} size={28} />
          </span>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.cardGlyph}>
            <IconForRegion region={region.id as RegionId} size={88} />
          </div>
          <p className={styles.cardPrompt}>{card.prompt}</p>
          <p className={styles.cardHint}>{card.hint}</p>
        </div>
        <div className={styles.cardFoot}>
          <span>{region.cat}</span>
          <span>egoera</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={styles.card}
      style={{ ...cardColors, x, y, rotate }}
      drag
      dragSnapToOrigin
      dragElastic={0.24}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 280, damping: 30 }}
      role="article"
      aria-label={`${card.prompt} — ${card.hint}`}
    >
      <div className={styles.cardSheen} aria-hidden />
      <div className={styles.cardCorner}>
        <span>{card.id.replace(/-/g, " ")}</span>
        <span className={styles.cardCornerGlyph}>
          <IconForRegion region={region.id as RegionId} size={28} />
        </span>
      </div>

      <motion.span
        className={`${styles.stamp} ${styles.stampNo}`}
        style={{ opacity: noOpacity }}
        aria-hidden
      >
        {dict.deckButtonNo}
      </motion.span>
      <motion.span
        className={`${styles.stamp} ${styles.stampYes}`}
        style={{ opacity: yesOpacity }}
        aria-hidden
      >
        {dict.deckButtonYes}
      </motion.span>
      <motion.span
        className={`${styles.stamp} ${styles.stampMucho}`}
        style={{ opacity: muchoOpacity }}
        aria-hidden
      >
        {dict.deckButtonMucho}
      </motion.span>

      <div className={styles.cardBody}>
        <div className={styles.cardGlyph} aria-hidden>
          <IconForRegion region={region.id as RegionId} size={88} />
        </div>
        <p className={styles.cardPrompt}>{card.prompt}</p>
        <p className={styles.cardHint}>{card.hint}</p>
      </div>
      <div className={styles.cardFoot}>
        <span>{region.cat}</span>
        <span className={styles.cardSwipeHint}>{dict.deckSwipeHint}</span>
      </div>
    </motion.div>
  );
}

/* =========================================================================
 * CELEBRATE — pantalla intermedia tipo Duolingo
 * ===================================================================== */

function CelebrateOverlay({
  result,
  delta,
  onDone,
}: {
  result: SentirResult;
  delta: SessionDelta;
  onDone: () => void;
}) {
  // Auto-close a los 2.6s; si el usuario hace click, se cierra antes.
  const closed = useRef(false);

  useEffect(() => {
    const id = setTimeout(() => {
      if (!closed.current) {
        closed.current = true;
        onDone();
      }
    }, 2600);
    return () => clearTimeout(id);
  }, [onDone]);

  const handleClick = () => {
    if (closed.current) return;
    closed.current = true;
    onDone();
  };

  const message = useMemo(() => {
    if (delta.unlockedLevel) {
      return {
        title: `nivel: ${delta.unlockedLevel.name}`,
        sub: delta.unlockedLevel.tagline,
      };
    }
    if (delta.hitWeeklyMilestone) {
      return {
        title: "siete días seguidos",
        sub: "te estás cuidando con constancia",
      };
    }
    if (delta.isNewDay && delta.newStreak > 1) {
      return {
        title: `día ${delta.newStreak}`,
        sub: "vuelves a mirarte. eso ya es algo.",
      };
    }
    if (delta.isNewDay) {
      return {
        title: "primera vez",
        sub: "te has dado tres minutos. cuenta.",
      };
    }
    return {
      title: "lectura completa",
      sub: "gracias por volver.",
    };
  }, [delta]);

  return (
    <div
      className={styles.celebrate}
      role="dialog"
      aria-live="polite"
      aria-label="Sesión completada"
      onClick={handleClick}
    >
      <ConfettiLayer />
      <span className={styles.celebrateGlyph} aria-hidden>
        <IconForFeeling id={result.feeling.id} size={220} />
      </span>
      <h2 className={styles.celebrateTitle}>{message.title}</h2>
      <p className={styles.celebrateSub}>{message.sub}</p>
      <div className={styles.celebratePoints}>
        <strong>+{delta.pointsEarned}</strong>
        <span>puntos</span>
      </div>
      <p className={styles.celebrateTip}>toca para continuar</p>
    </div>
  );
}

function ConfettiLayer() {
  // 32 piezas botánicas (hojas, pétalos, espirales, puntos) cayendo
  // con duraciones, posiciones y rotaciones aleatorias pero estables
  // durante la vida del overlay (no re-renders).
  const pieces = useMemo(() => {
    const palette = [
      "#c9694b", // terracota
      "#8b3a26", // terracota deep
      "#6b8e5a", // oliva
      "#44603a", // oliva deep
      "#c75d7a", // bloom
      "#c89a3f", // mostaza
      "#2b1d12", // sepia
      "#f4ebd9", // paper (highlights)
    ];
    const variants: ("leaf" | "petal" | "spiral" | "dot")[] = [
      "leaf",
      "leaf",
      "leaf",
      "petal",
      "petal",
      "spiral",
      "dot",
    ];
    const arr: {
      id: number;
      left: number;
      delay: number;
      dur: number;
      color: string;
      rot: number;
      variant: "leaf" | "petal" | "spiral" | "dot";
      size: number;
    }[] = [];
    for (let i = 0; i < 32; i++) {
      arr.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 1.0,
        dur: 2.8 + Math.random() * 2.4,
        color: palette[i % palette.length],
        rot: Math.random() * 360,
        variant: variants[i % variants.length],
        size: 14 + Math.random() * 16,
      });
    }
    return arr;
  }, []);
  return (
    <div className={styles.confetti} aria-hidden>
      {pieces.map((p) => (
        <span
          key={p.id}
          className={styles.confettiPiece}
          style={
            {
              left: `${p.left}%`,
              transform: `rotate(${p.rot}deg)`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              "--dur": `${p.dur}s`,
              "--delay": `${p.delay}s`,
              color: p.color,
            } as React.CSSProperties
          }
        >
          <ConfettiPiece variant={p.variant} color={p.color} />
        </span>
      ))}
    </div>
  );
}

/* =========================================================================
 * RESULT
 * ===================================================================== */
function ResultScreen({
  dict,
  result,
  postsByRegion,
  onRestart,
  streakState,
  sessionDelta,
}: {
  dict: Dictionary["sentir"];
  result: SentirResult;
  postsByRegion: PostByRegion;
  onRestart: () => void;
  streakState: SentirState;
  sessionDelta: SessionDelta;
}) {
  const { feeling, region, normalized, exercise, alternatives } = result;
  const post = postsByRegion[region.id];

  const [activeExercise, setActiveExercise] = useState<SentirExercise>(exercise);
  const level = levelFor(streakState.points);

  const otherFeelings = useMemo(
    () => FEELINGS.filter((f) => f.id !== feeling.id).slice(0, 4),
    [feeling.id]
  );

  const [shareCopied, setShareCopied] = useState(false);
  const handleShare = useCallback(async () => {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/sentir`
        : "https://egoera.es/sentir";
    const shareData = {
      title: dict.metaTitle,
      text: `${dict.resultTitle} ${feeling.name}.`,
      url,
    };
    try {
      if (
        typeof navigator !== "undefined" &&
        typeof navigator.share === "function"
      ) {
        await navigator.share(shareData);
        return;
      }
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2200);
      }
    } catch {
      /* user cancelled — silent */
    }
  }, [dict.metaTitle, dict.resultTitle, feeling.name]);

  return (
    <div className={styles.result}>
      {/* Hero */}
      <header className={`${styles.resultHero} ${styles.fadeUp}`}>
        <div>
          <p className={styles.resultLabel}>{dict.resultKicker}</p>
          <p className={styles.resultTitle}>{dict.resultTitle}</p>
          <h1 className={styles.resultName}>{feeling.name}.</h1>
          <p className={styles.resultDesc}>{feeling.desc}</p>
        </div>
        <aside className={styles.resultRegionBox}>
          <div className={styles.resultRegionIcon} aria-hidden>
            <IconForRegion region={region.id as RegionId} size={56} />
          </div>
          <h3 className={styles.resultRegionTitle}>{dict.resultRegionLabel}</h3>
          <p className={styles.resultRegionName}>{region.name}</p>
          <p className={styles.resultRegionAnatomy}>{region.cat}</p>
          <p className={styles.resultRegionDesc}>{region.desc}</p>
        </aside>
      </header>

      {/* Gain strip — racha, sesión, puntos, nivel */}
      <section
        className={`${styles.fadeUp} ${styles.fadeUpDelay1}`}
        aria-label="Resumen de progreso"
      >
        <div className={styles.gainStrip}>
          <div
            className={`${styles.gainCell} ${styles.gainCellHighlight}`}
          >
            <strong>+{sessionDelta.pointsEarned}</strong>
            <span>puntos hoy</span>
          </div>
          <div className={styles.gainCell}>
            <strong>{streakState.points}</strong>
            <span>total acumulados</span>
          </div>
          <div className={styles.gainCell}>
            <strong>{sessionDelta.newStreak}</strong>
            <span>
              {sessionDelta.newStreak === 1 ? "día seguido" : "días seguidos"}
            </span>
          </div>
          <div
            className={`${styles.gainCell} ${
              sessionDelta.unlockedLevel ? styles.gainCellNew : ""
            }`}
          >
            <strong>{level.current.name}</strong>
            <span>nivel actual</span>
          </div>
        </div>

        <div className={styles.levelCard}>
          <div className={styles.levelGlyph} aria-hidden>
            {level.current.glyph}
          </div>
          <div className={styles.levelMeta}>
            <div className={styles.levelHead}>
              <span className={styles.levelName}>{level.current.name}</span>
              <span className={styles.levelTagline}>
                {level.current.tagline}
              </span>
              <span className={styles.levelPoints}>
                {streakState.points} pts
              </span>
            </div>
            <div className={styles.levelTrack}>
              <div
                className={styles.levelFill}
                style={{ width: `${Math.round(level.progress * 100)}%` }}
              />
            </div>
            <div className={styles.levelNext}>
              {level.next
                ? `próximo: ${level.next.name} · ${level.next.threshold} pts`
                : "nivel máximo alcanzado"}
            </div>
          </div>
        </div>
      </section>

      {/* Balance */}
      <section
        className={`${styles.balance} ${styles.fadeUp} ${styles.fadeUpDelay1}`}
      >
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionHeadH}>
            {splitForEm(dict.resultBalanceTitle).before}
            <em>{splitForEm(dict.resultBalanceTitle).em}</em>
          </h2>
          <p className={styles.sectionLead}>{dict.resultBalanceLead}</p>
        </div>
        <div className={styles.balanceList}>
          {BRAIN_REGIONS.map((r) => {
            const value = normalized[r.id as RegionId] ?? 0;
            const isDom = r.id === region.id;
            return (
              <div
                key={r.id}
                className={`${styles.balanceRow} ${
                  isDom ? styles.balanceRowDominant : ""
                }`}
              >
                <div className={styles.balanceRowName}>
                  {r.name}
                  <small>{r.cat}</small>
                </div>
                <div className={styles.balanceTrack}>
                  <div
                    className={styles.balanceFill}
                    style={
                      {
                        width: `${Math.max(2, Math.round(value * 100))}%`,
                        "--row-c1": r.color,
                        "--row-c2": r.c2,
                      } as React.CSSProperties
                    }
                  />
                </div>
                <span className={styles.balanceRowVal}>
                  {Math.round(value * 100)}%
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recomendaciones */}
      <section className={`${styles.fadeUp} ${styles.fadeUpDelay2}`}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionHeadH}>
            Algo <em>concreto</em> para hoy
          </h2>
          <p className={styles.sectionLead}>
            Una lectura, un ejercicio y una invitación al diario. Tres pasos
            cortos según lo que te ha salido.
          </p>
        </div>

        <div className={styles.recGrid}>
          {post ? (
            <Link href={`/blog/${post.slug}`} className={styles.recCard}>
              <p className={styles.recKicker}>{dict.resultArticleKicker}</p>
              <h3 className={styles.recTitle}>{post.title}</h3>
              {post.excerpt && (
                <p className={styles.recBody}>
                  {truncate(stripTags(post.excerpt), 180)}
                </p>
              )}
              <span className={styles.recArrow}>
                {dict.resultArticleCta} · {post.readTime}
              </span>
            </Link>
          ) : (
            <div className={styles.recCard} aria-disabled>
              <p className={styles.recKicker}>{dict.resultArticleKicker}</p>
              <h3 className={styles.recTitle}>{dict.resultArticleTitle}</h3>
              <p className={styles.recBody}>{dict.resultArticleEmpty}</p>
              <Link
                href={`/sentimiento/${feeling.id}`}
                className={styles.recArrow}
              >
                {dict.resultArticleCta}
              </Link>
            </div>
          )}

          <article className={styles.recCard}>
            <p className={styles.recKicker}>{dict.resultExerciseKicker}</p>
            <h3 className={styles.recTitle}>{activeExercise.title}</h3>
            <p className={styles.exMeta}>
              <span>{activeExercise.kind}</span>
              <span>·</span>
              <span className={styles.exMetaTime}>
                {dict.resultExerciseTime}: {activeExercise.time}
              </span>
            </p>
            <p className={styles.recBody}>{activeExercise.body}</p>
            {alternatives.length > 0 && (
              <>
                <p className={styles.altLabel}>
                  {dict.resultExerciseAlternative}
                </p>
                <div className={styles.altList}>
                  {alternatives.map((alt) => (
                    <button
                      key={alt.id}
                      type="button"
                      className={styles.altItem}
                      onClick={() => setActiveExercise(alt)}
                    >
                      <span>{alt.title}</span>
                      <span className={styles.altItemTime}>{alt.time}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </article>

          <Link
            href="/diario"
            className={`${styles.recCard} ${styles.recCardBig}`}
          >
            <p className={styles.recKicker}>{dict.resultDiaryKicker}</p>
            <h3 className={styles.recTitle}>{dict.resultDiaryTitle}</h3>
            <p className={styles.recBody}>{dict.resultDiaryBody}</p>
            <span className={styles.recArrow}>{dict.resultDiaryCta}</span>
          </Link>
        </div>
      </section>

      {/* Otros sentimientos */}
      <section className={`${styles.fadeUp} ${styles.fadeUpDelay3}`}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionHeadH}>
            {splitForEm(dict.resultMoreTitle).before}
            <em>{splitForEm(dict.resultMoreTitle).em}</em>
          </h2>
        </div>
        <div className={styles.feelingsGrid}>
          {otherFeelings.map((f) => (
            <Link
              key={f.id}
              href={`/sentimiento/${f.id}`}
              className={styles.feelTile}
              style={
                {
                  "--tile-c1": f.c1,
                  "--tile-c2": f.c2,
                } as React.CSSProperties
              }
            >
              <span className={styles.feelTileIcon} aria-hidden>
                <IconForFeeling id={f.id} size={46} />
              </span>
              <h4 className={styles.feelTileName}>{f.name}</h4>
              <p className={styles.feelTileMeta}>
                {f.count} archivados · {f.meta}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <footer className={styles.resultFooter}>
        <div className={styles.footerActions}>
          <button
            type="button"
            className={`${styles.actionBtn} ${styles.actionPrimary}`}
            onClick={onRestart}
          >
            ↺ {dict.resultRestart}
          </button>
          <button
            type="button"
            className={styles.actionBtn}
            onClick={handleShare}
          >
            {shareCopied ? dict.resultShareCopied : dict.resultShare}
          </button>
        </div>
        <p className={styles.endNote}>{dict.endNote}</p>
      </footer>
    </div>
  );
}

/* =========================================================================
 * Helpers
 * ===================================================================== */

function splitForEm(s: string): { before: string; em: string } {
  const tokens = s.split(" ");
  if (tokens.length <= 1) return { before: "", em: s };
  const em = tokens.pop()!;
  return { before: tokens.join(" ") + " ", em };
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, "");
}

function truncate(s: string, n: number): string {
  if (s.length <= n) return s;
  return s.slice(0, n).trimEnd() + "…";
}

/* =========================================================================
 * Sonidos (Web Audio API, sin libs)
 * ===================================================================== */

let _audioCtx: AudioContext | null = null;
function getAudioCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (_audioCtx) return _audioCtx;
  const Ctor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return null;
  _audioCtx = new Ctor();
  return _audioCtx;
}

/**
 * Pitido suave (tipo "tonk") con frecuencia distinta según la respuesta.
 * No, sí, mucho, skip → cada uno suena ligeramente distinto. Vol bajo.
 */
function playSwipeTone(answer: SwipeAnswer) {
  const ctx = getAudioCtx();
  if (!ctx) return;
  const freq = {
    no: 220,
    skip: 280,
    yes: 392,
    mucho: 523,
  }[answer];
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.2);
}

/**
 * Carillón de 3 notas al completar la sesión. Igual de suave.
 */
function playCelebrationChime() {
  const ctx = getAudioCtx();
  if (!ctx) return;
  const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
  notes.forEach((f, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.12);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime + i * 0.12);
    gain.gain.exponentialRampToValueAtTime(0.07, ctx.currentTime + i * 0.12 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.12 + 0.45);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + i * 0.12);
    osc.stop(ctx.currentTime + i * 0.12 + 0.5);
  });
}
