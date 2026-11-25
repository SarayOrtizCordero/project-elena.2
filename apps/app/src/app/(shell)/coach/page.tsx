"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { AlertTriangle, ChevronRight, Search, TrendingUp, Users } from "lucide-react";
import { cn } from "@elena/ui";
import { clients } from "@/lib/data";
import { adherenceTone } from "@/lib/tone";

const filters = ["Todos", "Online", "Presencial", "En riesgo"] as const;

export default function Panel() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("Todos");
  const [q, setQ] = useState("");

  const avg = Math.round(clients.reduce((a, c) => a + c.adherence, 0) / clients.length);
  const risk = clients.filter((c) => c.adherence < 60 || c.lastDays >= 5).length;

  const list = useMemo(
    () =>
      clients.filter((c) => {
        if (q && !c.name.toLowerCase().includes(q.toLowerCase())) return false;
        if (filter === "Online") return c.mode === "Online" || c.mode === "Híbrido";
        if (filter === "Presencial") return c.mode === "Presencial" || c.mode === "Híbrido";
        if (filter === "En riesgo") return c.adherence < 60 || c.lastDays >= 5;
        return true;
      }),
    [filter, q],
  );

  const stats = [
    { icon: Users, label: "Clientes activos", value: clients.length },
    { icon: TrendingUp, label: "Adherencia media", value: `${avg}%` },
    { icon: AlertTriangle, label: "Necesitan atención", value: risk },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display-tight text-5xl font-extrabold sm:text-6xl">
          Hola, <span className="text-volt">Elena</span>
        </h1>
        <p className="text-mute">Así van tus clientes esta semana.</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 * i }}
            className="rounded-3xl border border-line bg-ink-2 p-4"
          >
            <s.icon className="mb-3 size-5 text-volt" />
            <p className="font-display text-4xl leading-none sm:text-5xl">{s.value}</p>
            <p className="mt-1 text-xs text-mute">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-mute" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar cliente…"
            aria-label="Buscar cliente"
            className="h-12 w-full rounded-2xl border border-line bg-ink-2 pl-12 pr-4 focus:border-volt focus:outline-none"
          />
        </div>
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:px-0">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={cn(
                "h-10 shrink-0 rounded-full border px-4 text-sm font-semibold transition-colors",
                filter === f ? "border-volt bg-volt text-ink" : "border-line text-mute hover:text-bone",
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <ul className="space-y-3">
        {list.length === 0 && <li className="py-10 text-center text-mute">Ningún cliente coincide.</li>}
        {list.map((c, i) => {
          const atRisk = c.adherence < 60 || c.lastDays >= 5;
          return (
            <motion.li
              key={c.id}
              layout
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * i }}
            >
              <Link
                href={`/coach/clientes/${c.id}`}
                className="group flex items-center gap-4 rounded-3xl border border-line bg-ink-2 p-4 transition-colors hover:border-volt/60"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-ink-3 font-display text-2xl text-volt">
                  {c.name[0]}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate font-semibold">{c.name}</span>
                    {atRisk && (
                      <span className="flex shrink-0 items-center gap-1 rounded-full bg-bad/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-bad">
                        <AlertTriangle className="size-3" /> Atención
                      </span>
                    )}
                  </span>
                  <span className="block truncate text-xs text-mute">
                    {c.mode} · {c.goal} · {c.lastDays === 0 ? "activa hoy" : `hace ${c.lastDays} d`}
                  </span>
                  <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-ink-3">
                    <motion.span
                      className="block h-full rounded-full bg-volt"
                      initial={{ width: 0 }}
                      animate={{ width: `${c.adherence}%` }}
                      transition={{ duration: 0.8, delay: 0.1 + 0.04 * i }}
                    />
                  </span>
                </span>
                <span className="text-right">
                  <span className={cn("block font-display text-3xl leading-none", adherenceTone(c.adherence))}>
                    {c.adherence}%
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-mute">adherencia</span>
                </span>
                <ChevronRight className="size-5 text-mute transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
