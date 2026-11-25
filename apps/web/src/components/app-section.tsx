import { Check, Download, Smartphone } from "lucide-react";
import { Button, Reveal, RevealText } from "@elena/ui";
import { APP_URL, appPoints, installSteps } from "@/lib/data";

/** Maqueta del móvil con una réplica sencilla de la pantalla "Hoy" de la app (datos de ejemplo). */
function Phone() {
  const r = 46;
  const c = 2 * Math.PI * r;
  return (
    <div
      aria-hidden
      className="relative mx-auto aspect-[9/18.5] w-[15.5rem] rounded-[2.6rem] border-[7px] border-[#1c1c1e] bg-black p-3 shadow-[0_30px_80px_-20px_rgb(250_204_21/0.4)] sm:w-[17rem]"
    >
      <div className="absolute left-1/2 top-2.5 h-5 w-20 -translate-x-1/2 rounded-full bg-[#1c1c1e]" />
      <div className="flex h-full flex-col gap-2.5 overflow-hidden rounded-[1.8rem] bg-ink px-3 pb-3 pt-9">
        <p className="font-display text-2xl leading-none">
          HOLA, <span className="text-volt">LUCÍA</span>
        </p>
        <div className="flex items-center gap-3 rounded-2xl border border-line bg-ink-2 p-3">
          <svg viewBox="0 0 110 110" className="size-[4.6rem] shrink-0 -rotate-90">
            <circle cx="55" cy="55" r={r} fill="none" stroke="#1b1b1f" strokeWidth="11" />
            <circle
              cx="55"
              cy="55"
              r={r}
              fill="none"
              stroke="#facc15"
              strokeWidth="11"
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={c * 0.38}
            />
          </svg>
          <div>
            <p className="font-display text-3xl leading-none">1.330</p>
            <p className="text-[10px] uppercase tracking-widest text-mute">kcal hoy</p>
          </div>
        </div>
        <div className="rounded-2xl border border-line bg-ink-2 p-3">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-volt">Entreno de hoy</p>
          <p className="mt-1 font-display text-2xl leading-none">EMPUJE</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-3">
            <div className="h-full w-[62%] rounded-full bg-volt" />
          </div>
          <p className="mt-1.5 text-[10px] text-mute">10 de 16 series</p>
        </div>
        <div className="rounded-2xl border border-line bg-ink-2 p-3">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-volt">Comidas</p>
          <ul className="mt-2 space-y-1.5 text-[10px]">
            {[
              ["Tostadas con aguacate", "320"],
              ["Yogur griego con fruta", "190"],
              ["Pechuga a la plancha", "300"],
            ].map(([n, k]) => (
              <li key={n} className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-volt" />
                  {n}
                </span>
                <span className="text-mute">{k}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-auto grid grid-cols-4 gap-1 border-t border-line pt-2 text-center text-[8px] font-semibold text-mute">
          <span className="text-volt">Hoy</span>
          <span>Entreno</span>
          <span>Comidas</span>
          <span>Progreso</span>
        </div>
      </div>
    </div>
  );
}

export function AppSection() {
  return (
    <section id="app" className="relative overflow-hidden border-t border-line">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 size-[34rem] -translate-y-1/2 translate-x-[5%] rounded-full bg-volt/15 blur-[120px] lg:translate-x-[20%]" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 py-28 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <Reveal y={12}>
            <p className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-volt">
              <span className="h-px w-8 bg-volt" /> La app
            </p>
          </Reveal>
          <RevealText
            as="h2"
            text="Tu plan, *siempre contigo*"
            className="font-display-tight text-5xl font-extrabold sm:text-6xl lg:text-7xl"
          />
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-xl text-lg text-mute">
              Entrenos, comidas y progreso en un solo lugar, para ti y para Elena. Funciona en el móvil como cualquier app y
              no hace falta pasar por las tiendas.
            </p>
          </Reveal>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {appPoints.map((p, i) => (
              <Reveal as="li" key={p.title} delay={0.1 + i * 0.08} y={18}>
                <div className="h-full rounded-2xl border border-line bg-ink-2 p-5">
                  <p className="flex items-center gap-2 font-semibold">
                    <Check className="size-4 shrink-0 text-volt" aria-hidden />
                    {p.title}
                  </p>
                  <p className="mt-2 text-sm text-mute">{p.text}</p>
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
            <p className="mt-3 text-xs text-mute">App de demostración con datos de ejemplo.</p>
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
              <div className="h-full rounded-2xl border border-line bg-ink-2 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-volt">{s.os}</p>
                <p className="mt-2">{s.how}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
