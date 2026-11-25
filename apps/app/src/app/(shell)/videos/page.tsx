"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { cn } from "@elena/ui";
import { VideoSim } from "@/components/video-sim";
import { workouts } from "@/lib/data";
import { photoPositions, videoInfo, workoutPhoto } from "@/lib/videos";

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export default function Videos() {
  const all = useMemo(
    () =>
      workouts.flatMap((w) =>
        w.exercises.map((e, i) => ({
          ...e,
          workoutId: w.id,
          workoutTitle: w.title,
          photo: workoutPhoto[w.id],
          position: photoPositions[i % photoPositions.length],
        })),
      ),
    [],
  );

  const [sel, setSel] = useState(all[0].id);
  const [filter, setFilter] = useState<string>("all");
  const playerRef = useRef<HTMLDivElement>(null);

  // Enlace directo desde Entreno: /videos?ex=push-1
  useEffect(() => {
    const ex = new URLSearchParams(window.location.search).get("ex");
    const found = all.find((e) => e.id === ex);
    if (found) {
      setSel(found.id);
      setFilter(found.workoutId);
    }
  }, [all]);

  const current = all.find((e) => e.id === sel) ?? all[0];
  const list = filter === "all" ? all : all.filter((e) => e.workoutId === filter);

  function pick(id: string) {
    setSel(id);
    playerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display-tight text-5xl font-extrabold sm:text-6xl">
          Víde<span className="text-volt">os</span>
        </h1>
        <p className="text-mute">Cómo hacer bien cada ejercicio, paso a paso.</p>
      </div>

      <div ref={playerRef} className="scroll-mt-20 lg:scroll-mt-6">
        <div className="mb-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-volt">{current.workoutTitle}</p>
          <h2 className="text-xl font-semibold">{current.name}</h2>
        </div>
        <VideoSim
          name={current.name}
          muscle={current.muscle}
          photo={current.photo}
          position={current.position}
          info={videoInfo[current.id]}
        />
        <p className="mt-3 text-xs text-mute">Vídeo simulado de demostración: en la versión final serán grabaciones reales de Elena.</p>
      </div>

      <section aria-label="Todos los vídeos">
        <div className="no-scrollbar -mx-4 mb-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:px-0" role="tablist" aria-label="Filtrar por rutina">
          {[{ id: "all", title: "Todos" }, ...workouts.map((w) => ({ id: w.id, title: w.title }))].map((f) => (
            <button
              key={f.id}
              role="tab"
              aria-selected={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "h-10 shrink-0 rounded-full border px-4 text-sm font-semibold transition-colors",
                filter === f.id ? "border-volt bg-volt text-ink" : "border-line text-mute hover:text-bone",
              )}
            >
              {f.title}
            </button>
          ))}
        </div>

        <ul className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {list.map((e) => (
            <li key={e.id}>
              <button
                onClick={() => pick(e.id)}
                aria-current={e.id === sel ? "true" : undefined}
                className={cn(
                  "group w-full overflow-hidden rounded-2xl border bg-ink-2 text-left transition-colors",
                  e.id === sel ? "border-volt" : "border-line hover:border-bone/40",
                )}
              >
                <span className="relative block aspect-video bg-black">
                  <Image
                    src={e.photo}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 260px, 50vw"
                    className="object-cover grayscale contrast-110 transition-transform duration-500 group-hover:scale-105"
                    style={{ objectPosition: e.position }}
                  />
                  <span aria-hidden className="absolute inset-0 bg-black/35" />
                  <span className="absolute left-1/2 top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-volt text-ink">
                    <Play className="size-5 translate-x-px fill-current" aria-hidden />
                  </span>
                  <span className="absolute bottom-2 right-2 rounded-md bg-black/75 px-1.5 py-0.5 text-[11px] font-semibold tabular-nums">
                    {fmt(videoInfo[e.id].duration)}
                  </span>
                </span>
                <span className="block p-3">
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-mute">{e.muscle}</span>
                  <span className="mt-0.5 block text-sm font-semibold leading-snug">{e.name}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
