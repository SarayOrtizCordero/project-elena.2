"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AlertTriangle, Pause, Play, RotateCcw } from "lucide-react";
import { cn } from "@elena/ui";
import type { VideoInfo } from "@/lib/videos";

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

type Props = {
  name: string;
  muscle: string;
  photo: string;
  position: string;
  info: VideoInfo;
};

/**
 * Reproductor SIMULADO: no carga ningún vídeo. Avanza un reloj, muestra los pasos como subtítulos,
 * cuenta repeticiones y permite pausar, saltar de paso y cambiar la velocidad.
 */
export function VideoSim({ name, muscle, photo, position, info }: Props) {
  const D = info.duration;
  const n = info.steps.length;
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const [speed, setSpeed] = useState<1 | 2>(1);

  // Al cambiar de ejercicio se reinicia
  useEffect(() => {
    setT(0);
    setPlaying(false);
  }, [name]);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setT((p) => Math.min(D, p + 0.1 * speed)), 100);
    return () => clearInterval(id);
  }, [playing, speed, D]);

  useEffect(() => {
    if (t >= D) setPlaying(false);
  }, [t, D]);

  const ended = t >= D;
  const step = Math.min(n - 1, Math.floor((t / D) * n));
  const reps = Math.floor(t / 3);
  const zoom = 1 + (t / D) * 0.14;

  function toggle() {
    if (ended) {
      setT(0);
      setPlaying(true);
    } else setPlaying((p) => !p);
  }

  function seekStep(i: number) {
    setT((i / n) * D + 0.05);
    setPlaying(true);
  }

  return (
    <div>
      <div className="overflow-hidden rounded-3xl border border-line bg-ink-2">
        <div className="relative aspect-[4/5] bg-black min-[480px]:aspect-video">
          <Image
            src={photo}
            alt=""
            fill
            sizes="(min-width: 1024px) 800px, 100vw"
            className="object-cover grayscale contrast-110 transition-transform duration-100 ease-linear motion-reduce:!scale-100"
            style={{ objectPosition: position, transform: `scale(${zoom})` }}
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-black/55" />

          <p className="absolute left-3 top-3 rounded-full bg-black/65 px-3 py-1 text-[11px] font-bold uppercase tracking-widest backdrop-blur">
            {muscle}
          </p>
          <p className="absolute right-3 top-3 rounded-full bg-black/65 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-volt backdrop-blur">
            Vídeo simulado
          </p>

          {!playing && (
            <button
              onClick={toggle}
              aria-label={ended ? "Volver a ver" : `Reproducir ${name}`}
              className="absolute left-1/2 top-1/2 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-volt text-ink shadow-[0_0_0_10px_rgb(0_0_0/0.35)] transition active:scale-90"
            >
              {ended ? <RotateCcw className="size-8" aria-hidden /> : <Play className="size-8 translate-x-0.5 fill-current" aria-hidden />}
            </button>
          )}

          {t > 0 && (
            <p className="absolute bottom-16 right-3 rounded-full bg-volt px-3 py-1 font-display text-lg leading-none text-ink">
              Rep {reps}
            </p>
          )}

          <div className="absolute inset-x-3 bottom-14 sm:bottom-16" aria-live="polite">
            <p className="inline-block max-w-[85%] rounded-lg bg-black/70 px-3 py-2 text-sm font-medium backdrop-blur sm:text-base">
              <span className="mr-2 text-volt">
                {step + 1}/{n}
              </span>
              {info.steps[step]}
            </p>
          </div>

          <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-black/70 px-3 py-2.5 backdrop-blur">
            <button
              onClick={toggle}
              aria-label={playing ? "Pausar" : ended ? "Volver a ver" : "Reproducir"}
              className="grid size-10 shrink-0 place-items-center rounded-full bg-white/10 transition hover:bg-white/20 active:scale-90"
            >
              {playing ? <Pause className="size-5" aria-hidden /> : <Play className="size-5 fill-current" aria-hidden />}
            </button>
            <input
              type="range"
              min={0}
              max={D}
              step={0.1}
              value={t}
              onChange={(e) => setT(Number(e.target.value))}
              aria-label="Progreso del vídeo"
              aria-valuetext={`${fmt(t)} de ${fmt(D)}`}
              className="h-1.5 flex-1 cursor-pointer accent-volt"
            />
            <span className="w-[5.2rem] shrink-0 text-right text-xs tabular-nums text-bone/80">
              {fmt(t)} / {fmt(D)}
            </span>
            <button
              onClick={() => setSpeed((s) => (s === 1 ? 2 : 1))}
              aria-label={`Velocidad ${speed}x, cambiar`}
              className="h-8 shrink-0 rounded-full border border-white/20 px-2.5 text-xs font-bold tabular-nums hover:border-volt"
            >
              {speed}x
            </button>
          </div>
        </div>
      </div>

      <ol className="mt-4 grid gap-2 sm:grid-cols-3" aria-label="Pasos del ejercicio">
        {info.steps.map((s, i) => (
          <li key={s}>
            <button
              onClick={() => seekStep(i)}
              aria-current={i === step ? "step" : undefined}
              className={cn(
                "h-full w-full rounded-2xl border p-3.5 text-left text-sm transition-colors",
                i === step ? "border-volt bg-volt/10" : "border-line bg-ink-2 hover:border-bone/40",
              )}
            >
              <span className={cn("mb-1 block font-display text-xl leading-none", i === step ? "text-volt" : "text-mute")}>
                {String(i + 1).padStart(2, "0")}
              </span>
              {s}
            </button>
          </li>
        ))}
      </ol>

      <p className="mt-4 flex items-start gap-3 rounded-2xl border border-line bg-ink-2 p-4 text-sm">
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-volt" aria-hidden />
        <span>
          <strong className="text-volt">Error común:</strong> {info.tip}
        </span>
      </p>
    </div>
  );
}
