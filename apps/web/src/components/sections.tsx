import { Check, Dumbbell, Smartphone, Star } from "lucide-react";
import { Placeholder, Reveal, RevealText } from "@elena/ui";
import { marquee, services, steps, testimonials, transformations } from "@/lib/data";

export function Marquee() {
  const items = [...marquee, ...marquee];
  return (
    <div aria-hidden className="overflow-hidden border-y border-line bg-volt py-3 text-ink">
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
        {[...items, ...items].map((w, i) => (
          <span key={i} className="flex items-center gap-10 font-display text-2xl uppercase tracking-wide sm:text-3xl">
            {w} <span className="size-1.5 rounded-full bg-ink" />
          </span>
        ))}
      </div>
    </div>
  );
}

function SectionTitle({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="mb-14 max-w-2xl">
      <Reveal y={12}>
        <p className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-volt">
          <span className="h-px w-8 bg-volt" /> {kicker}
        </p>
      </Reveal>
      <RevealText as="h2" text={title} className="font-display-tight text-5xl font-extrabold sm:text-6xl lg:text-7xl" />
    </div>
  );
}

export function Services() {
  return (
    <section id="servicios" className="mx-auto max-w-6xl px-5 py-28">
      <SectionTitle kicker="Servicios" title="Dos formas de *llegar a tu meta*" />
      <div className="grid gap-5 md:grid-cols-2">
        {services.map((s, i) => (
          <Reveal key={s.id} delay={i * 0.12}>
            <article className="group h-full rounded-3xl border border-line bg-ink-2 p-7 transition duration-300 hover:border-volt/50 sm:p-9">
              <div className="mb-8 flex items-center justify-between">
                <span className="grid size-14 place-items-center rounded-2xl bg-volt text-ink">
                  {s.id === "online" ? <Smartphone className="size-7" /> : <Dumbbell className="size-7" />}
                </span>
                <span className="rounded-full border border-line px-3 py-1 text-xs uppercase tracking-widest text-mute">
                  {s.tag}
                </span>
              </div>
              <h3 className="font-display-tight text-5xl font-bold">{s.title}</h3>
              <p className="mt-4 text-mute">{s.blurb}</p>
              <ul className="mt-6 space-y-3">
                {s.points.map((p, k) => (
                  <Reveal as="li" key={p} delay={0.25 + k * 0.08} y={14} className="flex items-start gap-3">
                    <Check className="mt-0.5 size-5 shrink-0 text-volt" />
                    <span>{p}</span>
                  </Reveal>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Method() {
  return (
    <section id="metodo" className="border-y border-line">
      <div className="mx-auto max-w-6xl px-5 py-28">
        <SectionTitle kicker="Método" title="Simple, claro y *a tu medida*" />
        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal as="li" key={s.n} delay={i * 0.1} className="list-none">
              <div className="h-full rounded-3xl border border-line bg-ink-2 p-6 transition-colors hover:border-volt/50">
                <span
                  className="font-display text-7xl text-transparent"
                  style={{ WebkitTextStroke: "1.5px var(--color-volt)" }}
                >
                  {s.n}
                </span>
                <h3 className="mt-3 font-display-tight text-3xl font-bold">{s.title}</h3>
                <p className="mt-3 text-sm text-mute">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Results() {
  return (
    <section id="resultados" className="mx-auto max-w-6xl px-5 py-28">
      <SectionTitle kicker="Resultados" title="Personas reales, *cambios reales*" />
      <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 no-scrollbar md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
        {transformations.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.12} className="w-[82%] shrink-0 snap-center md:w-auto">
            <article className="overflow-hidden rounded-3xl border border-line bg-ink-2">
              <div className="grid grid-cols-2 gap-px bg-line">
                <div className="relative">
                  <Placeholder label="Antes" ratio="3/4" />
                  <span className="absolute left-3 top-3 rounded-full bg-ink/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest">
                    Antes
                  </span>
                </div>
                <div className="relative">
                  <Placeholder label="Después" ratio="3/4" tone="volt" />
                  <span className="absolute left-3 top-3 rounded-full bg-ink px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-volt">
                    Después
                  </span>
                </div>
              </div>
              <div className="flex items-end justify-between p-5">
                <div>
                  <p className="font-display text-3xl leading-none text-volt">{t.result}</p>
                  <p className="mt-1 text-sm text-mute">
                    {t.name} · {t.time}
                  </p>
                </div>
                <span className="rounded-full border border-line px-3 py-1 text-xs text-mute">{t.mode}</span>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
      <Reveal y={8}>
        <p className="mt-4 text-xs text-mute">Imágenes y datos provisionales de demostración.</p>
      </Reveal>
    </section>
  );
}

export function About() {
  return (
    <section className="border-y border-line">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 py-28 md:grid-cols-2">
        <Reveal from="left" y={48}>
          <div className="overflow-hidden rounded-3xl border border-line">
            <Placeholder label="Elena entrenando (demo)" ratio="1/1" tone="volt" />
          </div>
        </Reveal>
        <div>
          <Reveal y={12}>
            <p className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-volt">
              <span className="h-px w-8 bg-volt" /> Sobre Elena
            </p>
          </Reveal>
          <RevealText as="h2" text="Entrenadora, *no gurú*" className="font-display-tight text-5xl font-extrabold sm:text-6xl" />
          <Reveal delay={0.2}>
            <p className="mt-6 text-lg text-mute">
              Llevo años acompañando a personas que querían cambiar y no sabían por dónde empezar. Mi método es
              sencillo: un plan realista, datos para medir y ajustes constantes. Sin dietas milagro ni promesas vacías.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="mt-4 text-mute">
              Texto provisional de demostración. Aquí irá la historia real de Elena y sus certificaciones.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Testimonials() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-28">
      <SectionTitle kicker="Opiniones" title="Lo que dicen *mis clientas*" />
      <div className="grid gap-5 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.12}>
            <figure className="h-full rounded-3xl border border-line bg-ink-2 p-7">
              <div className="mb-4 flex gap-1 text-volt" aria-label="5 de 5 estrellas">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star key={k} className="size-5 fill-current" />
                ))}
              </div>
              <blockquote className="text-lg">&ldquo;{t.text}&rdquo;</blockquote>
              <figcaption className="mt-6 flex items-center gap-3 text-sm">
                <span className="grid size-10 place-items-center rounded-full bg-volt font-display text-lg text-ink">
                  {t.name[0]}
                </span>
                <span>
                  <strong>{t.name}</strong>
                  <span className="block text-mute">{t.mode}</span>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
