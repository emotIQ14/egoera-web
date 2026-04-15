"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { WatercolorBlob } from "@/components/animations/WatercolorBlob";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Watercolor floating blobs */}
      <WatercolorBlob
        color="#6BA3BE"
        size={500}
        top="-5%"
        right="-10%"
        delay={0}
        className="hero-blob-1"
      />
      <WatercolorBlob
        color="#A8D5C8"
        size={450}
        bottom="5%"
        left="-8%"
        delay={2}
        className="hero-blob-2"
      />
      <WatercolorBlob
        color="#7FB5A0"
        size={350}
        top="30%"
        left="60%"
        delay={4}
        className="hero-blob-3"
      />
      <WatercolorBlob
        color="#A8D5C8"
        size={250}
        top="60%"
        right="70%"
        delay={6}
      />

      {/* Background with banner watercolor */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1.5 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] sm:w-[1200px]"
        >
          <Image
            src="/egoera-banner.png"
            alt=""
            width={1200}
            height={400}
            className="w-full h-auto"
            priority
          />
        </motion.div>
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 w-full max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-teal/10 text-teal text-sm font-medium mb-6">
            Blog de Psicologia
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-[family-name:var(--font-heading)] text-dark-text leading-tight"
        >
          Tu estado{" "}
          <span className="text-teal relative inline-block">
            importa
            {/* Watercolor paint stroke behind "importa" */}
            <span className="paint-stroke-animated absolute -inset-x-4 -inset-y-2 -z-10">
              <svg
                viewBox="0 0 300 80"
                preserveAspectRatio="none"
                className="w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <filter id="hero-paint-filter">
                    <feTurbulence
                      type="fractalNoise"
                      baseFrequency="0.04"
                      numOctaves="4"
                      result="noise"
                    />
                    <feDisplacementMap
                      in="SourceGraphic"
                      in2="noise"
                      scale="8"
                      xChannelSelector="R"
                      yChannelSelector="G"
                    />
                  </filter>
                </defs>
                <rect
                  x="10"
                  y="20"
                  width="280"
                  height="45"
                  rx="12"
                  fill="rgba(107, 163, 190, 0.18)"
                  filter="url(#hero-paint-filter)"
                />
                <rect
                  x="20"
                  y="25"
                  width="260"
                  height="35"
                  rx="10"
                  fill="rgba(168, 213, 200, 0.15)"
                  filter="url(#hero-paint-filter)"
                />
              </svg>
            </span>
            <svg
              className="absolute -bottom-2 left-0 w-full"
              viewBox="0 0 200 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M 2 5 Q 50 1 100 4 Q 150 7 198 3"
                stroke="#6BA3BE"
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.4"
              />
            </svg>
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-xl sm:text-2xl text-grey-text mt-6 max-w-2xl mx-auto leading-relaxed"
        >
          Psicologia accesible para entenderte mejor. Regulacion emocional,
          relaciones, autoconocimiento y herramientas practicas.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-10"
        >
          <a
            href="/blog"
            className="px-8 py-4 bg-teal text-white rounded-full text-lg font-medium hover:bg-teal/90 transition-all hover:shadow-lg hover:shadow-teal/20"
          >
            Explorar el blog
          </a>
          <a
            href="/diario"
            className="px-8 py-4 border-2 border-teal/30 text-teal rounded-full text-lg font-medium hover:bg-teal/5 hover:border-teal transition-all"
          >
            Diario Emocional
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#brain-3d-container"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-grey-text hover:text-teal transition-colors"
      >
        <ChevronDown className="w-8 h-8" />
      </motion.a>
    </section>
  );
}
