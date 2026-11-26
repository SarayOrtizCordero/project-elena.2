"use client";

import { useId, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@elena/ui";

export const fmtNum = (n: number) => n.toLocaleString("es-ES", { maximumFractionDigits: 2, useGrouping: false });

type Props = {
  label: string;
  value: number;
  onChange: (n: number) => void;
  step?: number;
  min?: number;
  max?: number;
  /** Permite decimales (peso) o solo enteros (repeticiones) */
  decimal?: boolean;
  className?: string;
};

/** Número con botones grandes − / + que también se puede escribir. Pensado para usarlo con una mano. */
export function Stepper({ label, value, onChange, step = 1, min = 0, max = 999, decimal, className }: Props) {
  const id = useId();
  const [text, setText] = useState<string | null>(null);

  const clamp = (n: number) => Math.min(max, Math.max(min, Math.round(n * 100) / 100));
  const bump = (by: number) => {
    setText(null);
    onChange(clamp(value + by));
  };

  const btn =
    "grid h-14 w-11 shrink-0 place-items-center text-highlight transition active:scale-90 disabled:opacity-30 disabled:active:scale-100";

  return (
    <div className={cn("min-w-0", className)}>
      <label htmlFor={id} className="mb-1.5 block text-center text-xs font-semibold uppercase tracking-widest text-muted">
        {label}
      </label>
      <div className="flex items-center rounded-2xl border border-line bg-canvas focus-within:border-highlight">
        <button type="button" onClick={() => bump(-step)} disabled={value <= min} aria-label={`Bajar ${label}`} className={btn}>
          <Minus className="size-5" aria-hidden />
        </button>
        <input
          id={id}
          type="text"
          inputMode={decimal ? "decimal" : "numeric"}
          value={text ?? fmtNum(value)}
          onFocus={(e) => e.target.select()}
          onChange={(e) => {
            const raw = e.target.value;
            if (!(decimal ? /^\d{0,3}([.,]\d{0,2})?$/ : /^\d{0,3}$/).test(raw)) return;
            setText(raw);
            const n = Number(raw.replace(",", "."));
            if (raw !== "" && n >= min && n <= max) onChange(n);
          }}
          onBlur={() => setText(null)}
          className="h-14 w-full min-w-0 bg-transparent text-center font-display text-3xl tabular-nums focus:outline-none"
        />
        <button type="button" onClick={() => bump(step)} disabled={value >= max} aria-label={`Subir ${label}`} className={btn}>
          <Plus className="size-5" aria-hidden />
        </button>
      </div>
    </div>
  );
}
