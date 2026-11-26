"use client";

import { useId } from "react";
import { motion } from "motion/react";

export type Point = { label: string; value: number };

export function LineChart({ data, unit = "kg", height = 220 }: { data: Point[]; unit?: string; height?: number }) {
  const gid = useId();
  if (data.length === 0) return null;

  const W = 640;
  const H = height;
  const pl = 44;
  const pr = 16;
  const pt = 16;
  const pb = 30;

  const vals = data.map((d) => d.value);
  let min = Math.min(...vals);
  let max = Math.max(...vals);
  const pad = (max - min) * 0.3 || 1;
  min -= pad;
  max += pad;

  const x = (i: number) => pl + (data.length === 1 ? 0.5 : i / (data.length - 1)) * (W - pl - pr);
  const y = (v: number) => pt + (1 - (v - min) / (max - min)) * (H - pt - pb);

  const pts = data.map((d, i) => [x(i), y(d.value)] as const);
  let line = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const cx = (x0 + x1) / 2;
    line += ` C${cx},${y0} ${cx},${y1} ${x1},${y1}`;
  }
  const area = `${line} L${pts[pts.length - 1][0]},${H - pb} L${pts[0][0]},${H - pb} Z`;

  const ticks = [0, 1, 2, 3].map((i) => min + ((max - min) * i) / 3);
  const labelStep = Math.max(1, Math.ceil(data.length / 6));
  const last = pts[pts.length - 1];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`Evolución en ${unit}`}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" style={{ stopColor: "var(--color-highlight)" }} stopOpacity="0.35" />
          <stop offset="100%" style={{ stopColor: "var(--color-highlight)" }} stopOpacity="0" />
        </linearGradient>
      </defs>

      {ticks.map((t) => (
        <g key={t}>
          <line x1={pl} x2={W - pr} y1={y(t)} y2={y(t)} stroke="var(--color-line)" strokeDasharray="3 5" />
          <text x={pl - 8} y={y(t) + 4} textAnchor="end" fontSize="12" fill="var(--color-muted)">
            {t.toFixed(1)}
          </text>
        </g>
      ))}

      <motion.path
        d={area}
        fill={`url(#${gid})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      />
      <motion.path
        d={line}
        fill="none"
        stroke="var(--color-highlight)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.1, ease: "easeInOut" }}
      />

      {pts.map(([px, py], i) => (
        <motion.circle
          key={i}
          cx={px}
          cy={py}
          r={i === pts.length - 1 ? 6 : 3.5}
          fill={i === pts.length - 1 ? "var(--color-highlight)" : "var(--color-canvas)"}
          stroke="var(--color-highlight)"
          strokeWidth="2"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 + i * 0.04 }}
        />
      ))}

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
        <rect x={Math.min(last[0] - 34, W - pr - 68)} y={last[1] - 38} width="68" height="24" rx="12" fill="var(--color-accent)" />
        <text
          x={Math.min(last[0], W - pr - 34)}
          y={last[1] - 21.5}
          textAnchor="middle"
          fontSize="13"
          fontWeight="700"
          fill="var(--color-on-accent)"
        >
          {data[data.length - 1].value.toFixed(1)} {unit}
        </text>
      </motion.g>

      {data.map((d, i) =>
        i % labelStep === 0 || i === data.length - 1 ? (
          <text key={i} x={x(i)} y={H - 8} textAnchor="middle" fontSize="12" fill="var(--color-muted)">
            {d.label}
          </text>
        ) : null,
      )}
    </svg>
  );
}
