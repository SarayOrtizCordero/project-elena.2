"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { AlertTriangle, ChevronRight, Search, TrendingUp, Users } from "lucide-react";
import { cn } from "@elena/ui";
import { bonus } from "@/lib/agenda";
import { clients } from "@/lib/data";
import { dayKey, useApp } from "@/lib/store";
import { adherenceTone } from "@/lib/tone";

const filters = ["Todos", "Online", "Presencial", "En riesgo"] as const;

export default function Panel() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("Todos");
  const [q, setQ] = useState("");
  const appointments = useApp((s) => s.appointments);
  const packs = useApp((s) => s.packs);
  const today = appointments.filter((a) => a.status === "booked" && a.start.startsWith(dayKey())).length;

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
          Hola, <span className="text-highlight">Elena</span>
        </h1>
        <p className="text-muted">Así van tus clientes esta semana.</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 * i }}
            className="rounded-3xl border border-line bg-surface p-4"
          >
            <s.icon className="mb-3 size-5 text-highlight" />
            <p className="font-display text-4xl leading-none sm:text-5xl">{s.value}</p>
            <p className="mt-1 text-xs text-muted">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <Link href="/coach/agenda" className="flex items-center justify-between gap-3 rounded-3xl bg-brand p-5 text-on-brand">
        <span>
          <span className="font-display-tight block text-3xl font-bold">
            {today === 0 ? "Hoy no tienes citas" : today === 1 ? "Hoy tienes 1 cita" : `Hoy tienes ${today} citas`}
          </span>
          <span className="text-sm font-semibold">Abrir la agenda</span>
        </span>
        <ChevronRight className="size-6 shrink-0" aria-hidden />
      </Link>

      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar cliente…"
            aria-label="Buscar cliente"
            className="h-12 w-full rounded-2xl border border-line bg-surface pl-12 pr-4 focus:border-highlight focus:outline-none"
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
                filter === f ? "border-brand bg-brand text-on-brand" : "border-line text-muted hover:text-fg",
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <ul className="space-y-3">
        {list.length === 0 && <li className="py-10 text-center text-muted">Ningún cliente coincide.</li>}
        {list.map((c, i) => {
          const atRisk = c.adherence < 60 || c.lastDays >= 5;
          const b = bonus(c.id, appointments, packs);
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
                className="group flex items-center gap-4 rounded-3xl border border-line bg-surface p-4 transition-colors hover:border-highlight/60"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-raised font-display text-2xl text-highlight">
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
                  <span className="block truncate text-xs text-muted">
                    {c.mode} · {c.goal} · {c.lastDays === 0 ? "activa hoy" : `hace ${c.lastDays} d`}
                  </span>
                  {b.bought > 0 && (
                    <span className={cn("block text-xs font-semibold", b.left <= 1 ? "text-bad" : "text-highlight")}>
                      Bono: {Math.max(0, b.left)} de {b.bought} sesiones{b.left <= 1 ? " · toca renovar" : ""}
                    </span>
                  )}
                  <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-raised">
                    <motion.span
                      className="block h-full rounded-full bg-highlight"
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
                  <span className="text-[10px] uppercase tracking-wider text-muted">adherencia</span>
                </span>
                <ChevronRight className="size-5 text-muted transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
