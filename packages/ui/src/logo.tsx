import { cn } from "./cn";

/** Logo de Elena. Los PNG viven en `public/brand/` de cada app (origen: packages/ui/assets). */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 font-display text-2xl uppercase leading-none", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/logo-mark-volt.png"
        alt=""
        width={226}
        height={314}
        className="h-[1.35em] w-auto"
        decoding="async"
      />
      <span className="tracking-wide">
        Elena<span className="text-volt">Fit</span>
      </span>
    </span>
  );
}

/** Sello circular completo ("Mi misión · Tú éxito"). */
export function LogoBadge({
  className,
  tone = "white",
  spin = false,
}: {
  className?: string;
  tone?: "white" | "ink";
  spin?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/brand/logo-badge-${tone}.png`}
      alt="Sello Elena Fit: Mi misión, tu éxito"
      width={640}
      height={640}
      decoding="async"
      className={cn(spin && "animate-[spin_28s_linear_infinite]", className)}
    />
  );
}
