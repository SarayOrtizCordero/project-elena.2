"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, ClipboardEdit, MessageCircle } from "lucide-react";
import { cn } from "@elena/ui";
import { ClientLoads } from "@/components/client-loads";
import { LineChart } from "@/components/line-chart";
import { useToast } from "@/components/toast";
import { clients } from "@/lib/data";
import { adherenceTone } from "@/lib/tone";

export default function ClienteDetalle() {
  const { id } = useParams<{ id: string }>();
  const toast = useToast((s) => s.show);
  const c = clients.find((x) => x.id === id);

  if (!c) {
    return (
      <div className="py-16 text-center">
        <p className="text-mute">Cliente no encontrado.</p>
        <Link href="/coach" className="mt-4 inline-block text-volt underline">
          Volver al panel
        </Link>
      </div>
    );
  }

  const delta = c.trend[c.trend.length - 1] - c.trend[0];
  const data = c.trend.map((v, i) => ({ label: `S${i + 1}`, value: v }));

  return (
    <div className="space-y-5">
      <Link href="/coach" className="inline-flex items-center gap-1 text-sm text-mute hover:text-volt">
        <ChevronLeft className="size-4" /> Panel
      </Link>

      <div className="flex items-center gap-4">
        <span className="grid size-16 place-items-center rounded-full bg-volt font-display text-4xl text-ink">{c.name[0]}</span>
        <div>
          <h1 className="font-display-tight text-4xl font-extrabold sm:text-5xl">{c.name}</h1>
          <p className="text-sm text-mute">
            {c.mode} · {c.goal}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-3xl border border-line bg-ink-2 p-4">
          <p className="text-xs text-mute">Adherencia</p>
          <p className={cn("font-display text-4xl leading-none", adherenceTone(c.adherence))}>{c.adherence}%</p>
        </div>
        <div className="rounded-3xl border border-line bg-ink-2 p-4">
          <p className="text-xs text-mute">Último registro</p>
          <p className="font-display text-4xl leading-none">{c.lastDays === 0 ? "Hoy" : `${c.lastDays} d`}</p>
        </div>
        <div className="rounded-3xl border border-line bg-ink-2 p-4">
          <p className="text-xs text-mute">Cambio peso</p>
          <p className="font-display text-4xl leading-none">
            {delta > 0 ? "+" : ""}
            {delta.toFixed(1)}
            <span className="text-base text-mute"> kg</span>
          </p>
        </div>
      </div>

      <section className="rounded-3xl border border-line bg-ink-2 p-5" aria-label="Evolución">
        <h2 className="font-display-tight mb-3 text-3xl font-bold">Evolución del peso</h2>
        <LineChart data={data} />
      </section>

      <ClientLoads clientId={c.id} firstName={c.name.split(" ")[0]} />

      <section className="rounded-3xl border border-line bg-ink-2 p-5" aria-label="Nota">
        <h2 className="font-display-tight mb-2 text-3xl font-bold">Nota de la semana</h2>
        <p className="text-mute">{c.note}</p>
      </section>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          onClick={() => toast(`Mensaje enviado a ${c.name.split(" ")[0]} (demo)`)}
          className="flex h-14 items-center justify-center gap-2 rounded-full bg-volt font-display text-lg uppercase tracking-wide text-ink transition active:scale-[0.97]"
        >
          <MessageCircle className="size-5" /> Enviar mensaje
        </button>
        <button
          onClick={() => toast("Editor de planes disponible en la versión final")}
          className="flex h-14 items-center justify-center gap-2 rounded-full border border-line font-display text-lg uppercase tracking-wide transition hover:border-volt hover:text-volt active:scale-[0.97]"
        >
          <ClipboardEdit className="size-5" /> Editar plan
        </button>
      </div>
    </div>
  );
}
