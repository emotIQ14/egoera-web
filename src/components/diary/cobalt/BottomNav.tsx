"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/diario", label: "Hoy", icon: "○" },
  { href: "/diario/historial", label: "Historial", icon: "▤" },
  { href: "/diario/check-in", label: "Check-in", icon: "+", cta: true },
  { href: "/diario/semanal", label: "Semanal", icon: "✦" },
  { href: "/diario/ajustes", label: "Ajustes", icon: "≡" },
];

export function BottomNav() {
  const path = usePathname();
  return (
    <nav className="diario-nav" aria-label="Navegacion del diario">
      <div className="diario-nav-inner">
        {TABS.map((t) => {
          const active = path === t.href || (t.href !== "/diario" && path?.startsWith(t.href));
          return (
            <Link
              key={t.href}
              href={t.href}
              className={active ? "active" : ""}
              aria-current={active ? "page" : undefined}
            >
              <span className={`nav-icon ${t.cta ? "nav-cta" : ""}`}>{t.icon}</span>
              <span>{t.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
