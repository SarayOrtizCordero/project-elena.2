import { Dumbbell } from "lucide-react";
import { cn } from "./cn";

type PlaceholderProps = {
  label?: string;
  tone?: "soft" | "accent";
  className?: string;
  /** Ej. "4/5", "1/1", "16/9" */
  ratio?: string;
};

/** Imagen provisional para la demo. Se sustituirá por fotos reales de Elena. */
export function Placeholder({ label = "Foto demo", tone = "soft", className, ratio = "4/5" }: PlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={label}
      style={{ aspectRatio: ratio }}
      className={cn(
        "stripes relative flex w-full items-center justify-center overflow-hidden",
        tone === "soft" ? "bg-raised text-highlight" : "bg-accent text-on-accent",
        className,
      )}
    >
      <div className="flex flex-col items-center gap-2">
        <Dumbbell className="size-10 sm:size-12" strokeWidth={1.5} aria-hidden />
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">{label}</span>
      </div>
    </div>
  );
}
