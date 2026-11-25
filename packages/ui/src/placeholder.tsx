import { Dumbbell } from "lucide-react";
import { cn } from "./cn";

type PlaceholderProps = {
  label?: string;
  tone?: "dark" | "volt";
  className?: string;
  /** Ej. "4/5", "1/1", "16/9" */
  ratio?: string;
};

/** Imagen provisional para la demo. Se sustituirá por fotos reales de Elena. */
export function Placeholder({
  label = "Foto demo",
  tone = "dark",
  className,
  ratio = "4/5",
}: PlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={label}
      style={{ aspectRatio: ratio }}
      className={cn(
        "stripes relative flex w-full items-center justify-center overflow-hidden",
        tone === "dark"
          ? "bg-[radial-gradient(120%_90%_at_30%_10%,#2a2a2f_0%,#111113_60%,#0a0a0a_100%)]"
          : "bg-[radial-gradient(120%_90%_at_30%_10%,#fde047_0%,#facc15_55%,#ca8a04_100%)]",
        className,
      )}
    >
      <div
        className={cn(
          "flex flex-col items-center gap-2",
          tone === "dark" ? "text-volt/70" : "text-ink/70",
        )}
      >
        <Dumbbell className="size-10 sm:size-12" strokeWidth={1.5} aria-hidden />
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">{label}</span>
      </div>
    </div>
  );
}
