"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const NAV_LINKS: { href: string; label: string }[] = [
  { href: "/", label: "Vlog" },
  { href: "/blog", label: "Articulos" },
  { href: "/#sentimientos", label: "Sentimientos" },
  { href: "/#sobre", label: "Sobre Ander" },
  { href: "/apoya", label: "Apoya" },
];

export function DarkNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return false;
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <header
      className="fixed left-0 right-0 top-0 z-50 transition-colors"
      style={{
        background: scrolled
          ? "rgba(15,19,17,0.85)"
          : "linear-gradient(to bottom, rgba(15,19,17,0.7), transparent)",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled ? "1px solid var(--rule)" : "none",
      }}
    >
      <nav className="flex items-center justify-between px-5 py-5 md:px-12">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/egoera-logo.png"
            alt="Egoera"
            width={32}
            height={32}
            className="rounded-full transition-transform group-hover:scale-105"
            style={{ filter: "drop-shadow(0 0 8px rgba(168,194,182,0.25))" }}
            priority
          />
          <span
            className="font-serif text-xl tracking-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            egoera
            <em
              className="not-italic ml-0.5"
              style={{ color: "var(--accent)" }}
            >
              .
            </em>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-9">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-[13.5px] transition-colors"
                style={{
                  color: active ? "var(--ink)" : "var(--ink-dim)",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {link.label}
                {active && (
                  <span
                    aria-hidden
                    className="absolute -bottom-1.5 left-0 right-0 h-px"
                    style={{ background: "var(--accent)" }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/apoya"
            className="hidden md:inline-flex rounded-full px-5 py-2.5 text-[13px] font-medium transition-colors"
            style={{
              background: "var(--ink)",
              color: "var(--bg)",
              fontFamily: "var(--font-sans)",
            }}
          >
            Apoya Egoera
          </Link>

          <button
            type="button"
            className="md:hidden p-2"
            style={{ color: "var(--ink)" }}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div
          className="md:hidden border-t"
          style={{
            background: "rgba(11,14,13,0.96)",
            borderColor: "var(--rule)",
            backdropFilter: "blur(14px)",
          }}
        >
          <div className="flex flex-col gap-1 px-6 py-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-3 text-base"
                style={{
                  color: "var(--ink-dim)",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/apoya"
              className="mt-3 inline-flex justify-center rounded-full px-5 py-3 text-sm font-medium"
              style={{ background: "var(--ink)", color: "var(--bg)" }}
            >
              Apoya Egoera
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
