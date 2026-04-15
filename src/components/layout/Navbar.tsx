"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Brain, BookOpen, PenLine, ExternalLink, GraduationCap, Download, Stethoscope, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/blog", label: "Blog", icon: BookOpen },
  { href: "/servicios", label: "Servicios", icon: Stethoscope },
  { href: "/recursos", label: "Recursos", icon: Download },
  { href: "/contacto", label: "Contacto", icon: Mail },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isDiario = pathname.startsWith("/diario");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (isDiario) return null;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "nav-scrolled py-3" : "bg-transparent py-5"
      )}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/egoera-logo.png"
            alt="Egoera"
            width={40}
            height={40}
            className="rounded-full transition-transform group-hover:scale-110"
          />
          <span className="text-xl font-semibold text-dark-text font-[family-name:var(--font-heading)]">
            Egoera
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors relative py-1",
                  isActive ? "text-teal" : "text-dark-text hover:text-teal"
                )}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-teal rounded-full"
                  />
                )}
              </Link>
            );
          })}

          {/* Diario CTA */}
          <Link
            href="/diario"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal text-white rounded-full text-sm font-medium hover:bg-teal/90 transition-all hover:shadow-lg hover:shadow-teal/20"
          >
            <PenLine className="w-4 h-4" />
            Diario Emocional
            <ExternalLink className="w-3 h-3 opacity-60" />
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-dark-text"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-t border-border"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                      isActive
                        ? "bg-teal/10 text-teal"
                        : "text-dark-text hover:bg-muted"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                );
              })}
              <Link
                href="/diario"
                className="flex items-center gap-3 px-4 py-3 bg-teal text-white rounded-xl font-medium"
              >
                <PenLine className="w-5 h-5" />
                Diario Emocional
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
