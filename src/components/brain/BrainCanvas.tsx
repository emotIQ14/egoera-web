"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

const Brain3D = dynamic(() => import("./Brain3D"), {
  ssr: false,
  loading: () => <BrainFallback />,
});

function BrainFallback() {
  return (
    <div className="relative w-full aspect-square max-w-[500px] mx-auto sm:max-w-[550px] lg:max-w-[600px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div
            className="absolute inset-0 rounded-full border-2 border-transparent animate-spin"
            style={{
              borderTopColor: "#6BA3BE",
              borderRightColor: "#A8D5C8",
            }}
          />
          <div
            className="absolute inset-2 rounded-full border-2 border-transparent animate-spin"
            style={{
              animationDirection: "reverse",
              animationDuration: "1.5s",
              borderBottomColor: "#7FB5A0",
              borderLeftColor: "#F4B8C1",
            }}
          />
        </div>
        <p className="text-sm text-grey-text animate-pulse">
          Cargando cerebro 3D...
        </p>
      </div>
    </div>
  );
}

export function BrainCanvas() {
  return (
    <Suspense fallback={<BrainFallback />}>
      <Brain3D />
    </Suspense>
  );
}
