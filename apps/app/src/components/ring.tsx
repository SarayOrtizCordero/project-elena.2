"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

export function Ring({
  value,
  max,
  size = 176,
  stroke = 14,
  children,
}: {
  value: number;
  max: number;
  size?: number;
  stroke?: number;
  children?: ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.min(1, max ? value / max : 0);
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-raised)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-highlight)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - pct) }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
    </div>
  );
}

export function Bar({ value, max, label, unit = "g", tone = "bg-highlight" }: { value: number; max: number; label: string; unit?: string; tone?: string }) {
  const pct = Math.min(100, max ? (value / max) * 100 : 0);
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-xs">
        <span className="font-medium">{label}</span>
        <span className="text-muted">
          {Math.round(value)} / {max} {unit}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-raised">
        <motion.div
          className={`h-full rounded-full ${tone}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}
