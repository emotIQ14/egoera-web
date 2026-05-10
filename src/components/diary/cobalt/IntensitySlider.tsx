"use client";

import { useRef, useCallback, useEffect } from "react";

interface IntensitySliderProps {
  value: number; // 1-10
  onChange: (v: number) => void;
}

export function IntensitySlider({ value, onChange }: IntensitySliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const setFromEvent = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left - 4) / (rect.width - 8)));
      const v = Math.max(1, Math.min(10, Math.round(ratio * 9 + 1)));
      onChange(v);
    },
    [onChange]
  );

  useEffect(() => {
    const move = (e: MouseEvent | TouchEvent) => {
      if (!draggingRef.current) return;
      const x = "touches" in e ? e.touches[0].clientX : e.clientX;
      setFromEvent(x);
    };
    const up = () => {
      draggingRef.current = false;
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", move);
    window.addEventListener("touchend", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", up);
    };
  }, [setFromEvent]);

  const pct = ((value - 1) / 9) * 100;

  return (
    <div className="intensity">
      <div className="intensity-value">
        {value}<span className="small">de 10 · intensidad</span>
      </div>
      <div
        className="intensity-track"
        ref={trackRef}
        onMouseDown={(e) => {
          draggingRef.current = true;
          setFromEvent(e.clientX);
        }}
        onTouchStart={(e) => {
          draggingRef.current = true;
          setFromEvent(e.touches[0].clientX);
        }}
        role="slider"
        aria-valuemin={1}
        aria-valuemax={10}
        aria-valuenow={value}
      >
        <div className="intensity-fill" style={{ width: `calc(${pct}% + 0px)` }} />
        <div className="intensity-thumb" style={{ left: `calc(${pct}% + 14px)` }} />
      </div>
      <div className="intensity-marks">
        <span>suave</span>
        <span>medio</span>
        <span>intenso</span>
      </div>
    </div>
  );
}
