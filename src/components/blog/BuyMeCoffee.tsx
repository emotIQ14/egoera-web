"use client";

import { Coffee } from "lucide-react";

export function BuyMeCoffee() {
  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200/50 text-center my-8">
      <Coffee className="w-8 h-8 text-amber-600 mx-auto mb-3" />
      <h3 className="text-lg font-semibold text-dark-text font-[family-name:var(--font-heading)] mb-2">
        Te ha sido util este contenido?
      </h3>
      <p className="text-sm text-grey-text mb-4 max-w-md mx-auto">
        Si nuestros articulos te ayudan, puedes invitarnos a un cafe.
        Cada aportacion nos permite seguir creando contenido gratuito.
      </p>
      <a
        href="https://buymeacoffee.com/egoerapsikologia"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-full font-medium hover:bg-amber-600 transition-colors text-sm"
      >
        <Coffee className="w-4 h-4" />
        Invitanos a un cafe
      </a>
    </div>
  );
}
