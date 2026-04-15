"use client";

interface AdSlotProps {
  slot: string;
  format?: "auto" | "horizontal" | "vertical";
  className?: string;
}

/**
 * Google AdSense ad slot placeholder.
 * Replace data-ad-client with your AdSense publisher ID (ca-pub-XXXXXXXX)
 * and data-ad-slot with the specific slot ID once approved.
 */
export function AdSlot({ slot, format = "auto", className = "" }: AdSlotProps) {
  return (
    <div className={`ad-slot my-8 ${className}`}>
      <div className="bg-muted/50 border border-border border-dashed rounded-xl p-6 text-center">
        <p className="text-xs text-grey-text uppercase tracking-wider mb-1">Publicidad</p>
        <div
          className="min-h-[90px] flex items-center justify-center text-sm text-grey-text"
          data-ad-client="ca-pub-XXXXXXXXXX"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        >
          {/* AdSense code will be inserted here once approved */}
          <span className="opacity-40">Espacio publicitario</span>
        </div>
      </div>
    </div>
  );
}
