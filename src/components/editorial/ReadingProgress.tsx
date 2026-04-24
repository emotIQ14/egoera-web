"use client";

import { useEffect, useState } from "react";

/**
 * Barra fina de progreso de lectura anclada al top de la ventana.
 * Se calcula con scroll/scrollHeight.
 */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      const pct = total > 0 ? (h.scrollTop / total) * 100 : 0;
      setProgress(pct);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden
      className="fixed left-0 top-0 z-[200] h-[2px] bg-[color:var(--accent)] transition-[width] duration-75"
      style={{ width: `${progress}%` }}
    />
  );
}
