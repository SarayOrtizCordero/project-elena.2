import { CalendarDays, Check, Download, Smartphone } from "lucide-react";
import { Button, Reveal, RevealText } from "@elena/ui";
import { APP_URL, appPoints, installSteps } from "@/lib/data";

/** Maqueta del móvil con una réplica sencilla de la pantalla "Hoy" de la app (datos de ejemplo). */
function Phone() {
  const week = [
    ["L", "done"],
    ["M", "done"],
    ["X", "rest"],
    ["J", "today"],
    ["V", "todo"],
    ["S", "rest"],
    ["D", "rest"],
  ];
  return (
    <div
      aria-hidden
      className="relative mx-auto aspect-[9/18.5] w-[15.5rem] rounded-[2.6rem] border-[7px] border-fg bg-canvas p-3 shadow-[0_30px_80px_-20px_rgb(27_63_196/0.45)] sm:w-[17rem]"
    >
      <div className="absolute left-1/2 top-2.5 h-5 w-20 -translate-x-1/2 rounded-full bg-fg" />
      <div className="flex h-full flex-col gap-2.5 overflow-hidden rounded-[1.8rem] pb-1 pt-8">
        <p className="font-display text-2xl leading-none">
          HOLA, <span className="text-highlight">LUCÍA</span>
        </p>

        <div className="rounded-2xl bg-brand p-3 text-on-brand">
          <div className="flex items-center justify-between">
            <p className="font-display text-lg leading-none">TU SEMANA</p>
            <p className="rounded-full bg-accent px-2 py-0.5 font-display text-sm leading-tight text-on-accent">2/4</p>
          </div>
          <div className="mt-2.5 grid grid-cols-7 gap-1">
            {week.map(([d, state]) => (
              <span
                key={d}
                className={
                  "grid aspect-square place-items-center rounded-md border text-[9px] font-bold " +
                  (state === "done"
                    ? "border-accent bg-accent text-on-accent"
                    : state === "today"
                      ? "border-accent"
                      : state === "rest"
                        ? "border-dashed border-on-brand/40 text-on-brand/70"
                        : "border-on-brand/40")
                }
              >
                {state === "done" ? <Check className="size-3" strokeWidth={4} /> : d}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2.5 rounded-2xl border border-line bg-surface p-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-alt text-on-alt">
            <CalendarDays className="size-4" />
          </span>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-highlight">Tu próxima cita</p>
            <p className="text-[11px] font-semibold">Viernes · 10:00</p>
            <p className="text-[10px] text-muted">Quedan 5 sesiones</p>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-3">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-highlight">Entreno de hoy</p>
          <p className="mt-1 font-display text-2xl leading-none">TIRÓN</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-raised">
            <div className="h-full w-[62%] rounded-full bg-highlight" />
          </div>
          <p className="mt-1.5 text-[10px] text-muted">8 de 13 series</p>
          <p className="mt-2 inline-block rounded-full bg-accent px-3 py-1 font-display text-xs uppercase text-on-accent">Continuar</p>
        </div>

        <div className="mt-auto grid grid-cols-4 gap-1 border-t border-line pt-2 text-center text-[8px] font-semibold text-muted">
          <span className="text-highlight">Hoy</span>
          <span>Entreno</span>
          <span>Comidas</span>
          <span>Citas</span>
        </div>
      </div>
    </div>
  );
}

export function AppSection() {
  return (
    <section id="app" className="relative overflow-hidden border-t border-line">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 size-[34rem] -translate-y-1/2 translate-x-[5%] rounded-full bg-alt/60 blur-[120px] lg:translate-x-[20%]" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 py-28 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <Reveal y={12}>
            <p className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-highlight">
              <span className="h-px w-8 bg-highlight" /> La app
            </p>
          </Reveal>
          <RevealText
            as="h2"
            text="Tu plan, *siempre contigo*"
            className="font-display-tight text-5xl font-extrabold sm:text-6xl lg:text-7xl"
          />
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-xl text-lg text-muted">
              Entrenos, comidas y progreso en un solo lugar, para ti y para Elena. Funciona en el móvil como cualquier app y
              no hace falta pasar por las tiendas.
            </p>
          </Reveal>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {appPoints.map((p, i) => (
              <Reveal as="li" key={p.title} delay={0.1 + i * 0.08} y={18}>
                <div className="h-full glass rounded-2xl p-5">
                  <p className="flex items-center gap-2 font-semibold">
                    <Check className="size-4 shrink-0 text-highlight" aria-hidden />
                    {p.title}
                  </p>
                  <p className="mt-2 text-sm text-muted">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={0.2}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button href={APP_URL} size="lg">
                <Download className="size-5" aria-hidden /> Instalar la app
              </Button>
              <Button href={APP_URL} variant="ghost" size="lg">
                <Smartphone className="size-5" aria-hidden /> Abrir la demo
              </Button>
            </div>
            <p className="mt-3 text-xs text-muted">App de demostración con datos de ejemplo.</p>
          </Reveal>
        </div>

        <Reveal from="scale" delay={0.1}>
          <Phone />
        </Reveal>
      </div>

      <div className="relative mx-auto max-w-6xl px-5 pb-28">
        <Reveal y={16}>
          <h3 className="font-display-tight text-3xl font-extrabold sm:text-4xl">Cómo instalarla</h3>
        </Reveal>
        <ol className="mt-6 grid gap-4 md:grid-cols-3">
          {installSteps.map((s, i) => (
            <Reveal as="li" key={s.os} delay={i * 0.1} y={18}>
              <div className="h-full glass rounded-2xl p-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-highlight">{s.os}</p>
                <p className="mt-2">{s.how}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
