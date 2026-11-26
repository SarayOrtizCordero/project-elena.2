import { cn } from "./cn";

/* Los PNG son siluetas: se usan como máscara para que el logo tome el color del tema.
   Viven en `public/brand/` de cada app (origen: packages/ui/assets). */
const mask = (file: string) => ({
  WebkitMask: `url(/brand/${file}) center / contain no-repeat`,
  mask: `url(/brand/${file}) center / contain no-repeat`,
});

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 font-display text-2xl uppercase leading-none", className)}>
      <span aria-hidden className="h-[1.15em] w-[1.6em] shrink-0 bg-highlight" style={mask("logo-mark.png")} />
      <span className="tracking-wide">
        Elenita<span className="text-highlight">Fit</span>
      </span>
    </span>
  );
}

/** Sello circular completo ("Tú éxito · Mi misión"). Hereda el color del texto. */
export function LogoBadge({ className }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="Sello ElenitaFit: tú éxito, mi misión"
      className={cn("inline-block aspect-square shrink-0 bg-current", className)}
      style={mask("logo-badge.png")}
    />
  );
}
