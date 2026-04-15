"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with banner watercolor */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
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
        <motion.div
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-[15%] w-72 h-72 rounded-full bg-teal/8 blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 15, 0], x: [0, -10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 left-[10%] w-96 h-96 rounded-full bg-mint/10 blur-3xl"
        />
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
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
          className="text-5xl sm:text-6xl md:text-7xl font-bold font-[family-name:var(--font-heading)] text-dark-text leading-tight"
        >
          Tu estado{" "}
          <span className="text-teal relative">
            importa
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
            href="#explora"
            className="px-8 py-4 bg-teal text-white rounded-full text-lg font-medium hover:bg-teal/90 transition-all hover:shadow-lg hover:shadow-teal/20"
          >
            Explorar el cerebro
          </a>
          <a
            href="/blog"
            className="px-8 py-4 border-2 border-dark-text/20 text-dark-text rounded-full text-lg font-medium hover:border-teal hover:text-teal transition-all"
          >
            Ir al blog
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#explora"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-grey-text hover:text-teal transition-colors"
      >
        <ChevronDown className="w-8 h-8" />
      </motion.a>
    </section>
  );
}
