"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { WatercolorBlob } from "@/components/animations/WatercolorBlob";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Watercolor floating blobs — contained within section */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <WatercolorBlob color="#6BA3BE" size={280} top="5%" right="5%" delay={0} />
        <WatercolorBlob color="#A8D5C8" size={250} bottom="10%" left="3%" delay={2} />
        <WatercolorBlob color="#7FB5A0" size={200} top="35%" left="55%" delay={4} />
        <WatercolorBlob color="#B8A9C9" size={150} top="65%" right="60%" delay={6} />

        {/* Banner watercolor background */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.08 }}
          transition={{ duration: 2 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[1000px]"
        >
          <Image src="/egoera-banner.png" alt="" width={1200} height={400} className="w-full h-auto" priority />
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 sm:px-8 w-full max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-teal/10 text-teal text-sm font-medium mb-6">
            Blog de Psicologia Positiva
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-[family-name:var(--font-heading)] text-dark-text leading-[1.1]"
        >
          Tu estado{" "}
          <span className="text-teal relative inline-block">
            importa
            <span className="paint-stroke-animated absolute -inset-x-3 -inset-y-1 -z-10">
              <svg viewBox="0 0 300 80" preserveAspectRatio="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <filter id="hero-paint-filter">
                    <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" xChannelSelector="R" yChannelSelector="G" />
                  </filter>
                </defs>
                <rect x="10" y="20" width="280" height="45" rx="12" fill="rgba(107,163,190,0.18)" filter="url(#hero-paint-filter)" />
                <rect x="20" y="25" width="260" height="35" rx="10" fill="rgba(168,213,200,0.12)" filter="url(#hero-paint-filter)" />
              </svg>
            </span>
            <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
              <path d="M 2 5 Q 50 1 100 4 Q 150 7 198 3" stroke="#6BA3BE" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
            </svg>
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="text-lg sm:text-xl text-grey-text mt-6 max-w-xl mx-auto leading-relaxed"
        >
          Psicologia accesible y basada en ciencia para entenderte mejor. Articulos, herramientas y un diario emocional para tu bienestar.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-10"
        >
          <a href="/blog" className="px-8 py-4 bg-teal text-white rounded-full text-lg font-medium hover:bg-teal/90 transition-all hover:shadow-lg hover:shadow-teal/20">
            Explorar el blog
          </a>
          <a href="/diario" className="px-8 py-4 border-2 border-teal/30 text-teal rounded-full text-lg font-medium hover:bg-teal/5 hover:border-teal transition-all">
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
