import { preload } from "react-dom";
import { LogoBadge } from "@elena/ui";

/** Pantalla de carga al abrir la app. Se retira sola con CSS (`.splash`), aunque falle el JavaScript. */
export function Splash() {
  // El sello es una máscara CSS: sin precarga tardaría en aparecer.
  preload("/brand/logo-badge.png", { as: "image", crossOrigin: "anonymous" });

  return (
    <div aria-hidden className="splash safe-top fixed inset-0 z-[100] flex flex-col items-center bg-brand text-on-brand">
      <div className="flex flex-1 flex-col items-center justify-center gap-6">
        <LogoBadge className="size-40" />
        <p className="font-display-tight text-5xl font-extrabold uppercase">
          Elenita<span className="text-accent">Fit</span>
        </p>
      </div>
      <div className="mb-20 size-10 animate-spin rounded-full border-[3px] border-on-brand/25 border-t-accent motion-reduce:animate-none" />
    </div>
  );
}
