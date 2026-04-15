"use client";

import { motion } from "framer-motion";

interface WatercolorBlobProps {
  color: string;
  size?: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  delay?: number;
  className?: string;
}

export function WatercolorBlob({
  color,
  size = 300,
  top,
  left,
  right,
  bottom,
  delay = 0,
  className = "",
}: WatercolorBlobProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: [0.15, 0.25, 0.15],
        scale: [0.95, 1.05, 0.95],
        rotate: [0, 8, -5, 0],
      }}
      transition={{
        duration: 12,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
      className={`absolute pointer-events-none ${className}`}
      style={{
        top,
        left,
        right,
        bottom,
        width: size,
        height: size,
      }}
    >
      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <filter id={`watercolor-${color.replace("#", "")}`}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.03"
              numOctaves="4"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="30"
              xChannelSelector="R"
              yChannelSelector="G"
            />
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>
        <ellipse
          cx="100"
          cy="100"
          rx="80"
          ry="70"
          fill={color}
          filter={`url(#watercolor-${color.replace("#", "")})`}
          opacity="0.6"
        />
      </svg>
    </motion.div>
  );
}
