"use client";

import { motion } from "framer-motion";

interface MoodBlobProps {
  /** 0-1, controls intensity of motion */
  intensity?: number;
  size?: number;
}

/** Animated abstract gradient blob — centerpiece of "How do you feel today?" */
export function MoodBlob({ intensity = 0.6, size = 280 }: MoodBlobProps) {
  return (
    <div
      className="mood-blob-wrap"
      style={{ width: size, height: size, maxWidth: size }}
      aria-hidden="true"
    >
      <motion.div
        className="mood-blob"
        animate={{
          scale: [1, 1.05 + intensity * 0.05, 0.97 + intensity * 0.02, 1],
          rotate: [0, 8, -4, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <div className="mood-blob-grain" />
    </div>
  );
}
