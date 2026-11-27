"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Play, Video } from "lucide-react";
import { cn } from "@elena/ui";
import { ElenaVideo } from "@/components/elena-video";
import { TutorialVideo } from "@/components/tutorial-video";
import { VideoSim } from "@/components/video-sim";
import { DEMO_CLIENT, useApp, usePlan } from "@/lib/store";
import { fallbackInfo, photoPositions, videoInfo, workoutPhoto } from "@/lib/videos";

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export default function Videos() {
  const { workouts } = usePlan();
  const videos = useApp((s) => s.videos);
  const all = workouts.flatMap((w) =>
    w.exercises.map((e, i) => ({
      ...e,
      key: `${w.id}:${e.id}`,
      workoutId: w.id,
      workoutTitle: w.title,
      photo: workoutPhoto[w.id] ?? "/photos/coach.jpg",
      position: photoPositions[i % photoPositions.length],
      info: videoInfo[e.id] ?? fallbackInfo,
      own: videos.find((v) => v.id === e.videoId),
    })),
  );
  const forMe = videos.filter((v) => v.clients.includes(DEMO_CLIENT));

  const [sel, setSel] = useState<string | null>(null);
  const [shared, setShared] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const playerRef = useRef<HTMLDivElement>(null);

  // Enlace directo desde Entreno: /videos?ex=push-1
  useEffect(() => {
    const ex = new URLSearchParams(window.location.search).get("ex");
    const w = workouts.find((x) => x.exercises.some((e) => e.id === ex));
    if (w) {
      setSel(`${w.id}:${ex}`);
      setFilter(w.id);
    }
  }, [workouts]);

  const current = all.find((e) => e.key === sel) ?? all[0];
  const sharedVideo = forMe.find((v) => v.id === shared);
  const list = filter === "all" ? all : all.filter((e) => e.workoutId === filter);
  const top = () => playerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display-tight text-5xl font-extrabold sm:text-6xl">
          Víde<span className="text-highlight">os</span>
        </h1>
        <p className="text-muted">Cómo hacer bien cada ejercicio, paso a paso.</p>
      </div>

      <div ref={playerRef} className="scroll-mt-20 lg:scroll-mt-6">
        <div className="mb-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-highlight">
            {sharedVideo ? "De Elena para ti" : current?.workoutTitle}
          </p>
          <h2 className="text-xl font-semibold">{sharedVideo?.title ?? current?.name}</h2>
        </div>
        {sharedVideo ? (
          <ElenaVideo id={sharedVideo.id} title={sharedVideo.title} />
        ) : current?.own ? (
          <ElenaVideo id={current.own.id} title={current.own.title} />
        ) : current?.info.src ? (
          <TutorialVideo name={current.name} src={current.info.src} poster={current.info.poster} info={current.info} />
        ) : current ? (
          <>
            <VideoSim name={current.name} muscle={current.muscle} photo={current.photo} position={current.position} info={current.info} />
            <p className="mt-3 text-xs text-muted">Vídeo simulado de demostración: aquí saldrá la grabación de Elena cuando la asigne.</p>
          </>
        ) : (
          <p className="text-sm text-muted">Tu rutina todavía no tiene ejercicios.</p>
        )}
      </div>

      {forMe.length > 0 && (
        <section aria-label="Vídeos de Elena para ti">
          <h2 className="font-display-tight mb-3 text-3xl font-bold">De Elena para ti</h2>
          <ul className="space-y-2">
            {forMe.map((v) => (
              <li key={v.id}>
                <button
                  type="button"
                  onClick={() => {
                    setShared(v.id);
                    top();
                  }}
                  className={cn("flex min-h-14 w-full items-center gap-3 rounded-2xl border bg-surface px-4 text-left", shared === v.id ? "border-highlight" : "border-line")}
                >
                  <Video className="size-5 shrink-0 text-highlight" aria-hidden />
                  <span className="min-w-0 flex-1 truncate font-semibold">{v.title}</span>
                  <Play className="size-4 shrink-0 fill-current text-highlight" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-label="Todos los vídeos">
        <div className="no-scrollbar -mx-4 mb-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:px-0" role="tablist" aria-label="Filtrar por rutina">
          {[{ id: "all", title: "Todos" }, ...workouts].map((f) => (
            <button
              key={f.id}
              role="tab"
              aria-selected={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "h-10 shrink-0 rounded-full border px-4 text-sm font-semibold transition-colors",
                filter === f.id ? "border-brand bg-brand text-on-brand" : "border-line text-muted hover:text-fg",
              )}
            >
              {f.title}
            </button>
          ))}
        </div>

        <ul className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {list.map((e) => {
            const on = !sharedVideo && e.key === current?.key;
            return (
              <li key={e.key}>
                <button
                  onClick={() => {
                    setShared(null);
                    setSel(e.key);
                    top();
                  }}
                  aria-current={on ? "true" : undefined}
                  className={cn("group h-full w-full overflow-hidden rounded-2xl border bg-surface text-left transition-colors", on ? "border-highlight" : "border-line hover:border-fg/40")}
                >
                  <span className="relative block aspect-video bg-black">
                    <Image
                      src={e.info.poster ?? e.photo}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 260px, 50vw"
                      className="object-cover saturate-[1.15] transition-transform duration-500 group-hover:scale-105"
                      style={{ objectPosition: e.info.poster ? "50% 25%" : e.position }}
                    />
                    <span aria-hidden className="absolute inset-0 bg-black/25" />
                    <span className="absolute left-1/2 top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-accent text-on-accent">
                      <Play className="size-5 translate-x-px fill-current" aria-hidden />
                    </span>
                    <span className="absolute bottom-2 right-2 rounded-md bg-black/75 px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-white">
                      {e.own ? "Elena" : fmt(e.info.duration)}
                    </span>
                  </span>
                  <span className="block p-3">
                    <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">{e.muscle}</span>
                    <span className="mt-0.5 block text-sm font-semibold leading-snug">{e.name}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
