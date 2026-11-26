"use client";

import { CalendarPlus, Ticket } from "lucide-react";
import { cn } from "@elena/ui";
import { bonus, calendarFile, kinds, type Appointment } from "@/lib/agenda";
import { useApp } from "@/lib/store";

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** "Sábado, 28 de noviembre" */
export function dayLabel(start: string) {
  const [y, m, d] = start.slice(0, 10).split("-").map(Number);
  return cap(new Date(y, m - 1, d).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" }));
}
export const timeLabel = (start: string) => start.slice(11, 16);

/** Color de cada tipo de cita. */
export const kindTone: Record<Appointment["kind"], string> = {
  entreno: "bg-highlight",
  valoracion: "bg-pop-3",
  nutricion: "bg-pop-2",
  otro: "bg-pop-4",
};

export const useBonus = (clientId: string) => {
  const appointments = useApp((s) => s.appointments);
  const packs = useApp((s) => s.packs);
  return bonus(clientId, appointments, packs);
};

/** Sesiones que quedan en el bono, con un punto por sesión. */
export function BonusMeter({ clientId, title }: { clientId: string; title: string }) {
  const b = useBonus(clientId);
  // Solo se dibujan las sesiones del tramo actual: las ya gastadas de bonos antiguos no aportan
  const dots = Math.min(b.bought, Math.max(b.left, 8));
  return (
    <div>
      <div className="flex items-center gap-4">
        <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-alt text-on-alt">
          <Ticket className="size-7" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">{title}</p>
          {b.bought === 0 ? (
            <p className="font-display-tight text-3xl font-bold">Sin bono activo</p>
          ) : (
            <p className="font-display-tight text-3xl font-bold">
              {b.left === 1 ? "Queda 1 sesión" : `Quedan ${Math.max(0, b.left)} sesiones`}
            </p>
          )}
          {b.pending > 0 && (
            <p className="text-sm text-muted">
              {b.pending === 1 ? "1 ya reservada" : `${b.pending} ya reservadas`} · {Math.max(0, b.free)} sin reservar
            </p>
          )}
        </div>
      </div>
      {dots > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5" aria-hidden>
          {Array.from({ length: dots }, (_, i) => (
            <span
              key={i}
              className={cn(
                "h-2.5 w-7 rounded-full",
                i < b.free ? "bg-highlight" : i < b.left ? "bg-highlight/45" : "bg-raised",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/** Descarga la cita para guardarla en el calendario del móvil (con aviso 24 h antes). */
export function CalendarButton({ appointment, className }: { appointment: Appointment; className?: string }) {
  function download() {
    const blob = new Blob([calendarFile(appointment, kinds[appointment.kind])], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cita-elenitafit.ics";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <button
      type="button"
      onClick={download}
      className={cn("inline-flex min-h-10 items-center gap-2 rounded-full border border-line px-4 text-sm font-semibold hover:border-highlight", className)}
    >
      <CalendarPlus className="size-4" aria-hidden /> Añadir a mi calendario
    </button>
  );
}
