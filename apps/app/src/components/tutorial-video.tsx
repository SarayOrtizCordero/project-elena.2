"use client";

import { useRef, useState } from "react";
import { AlertTriangle, Repeat, Turtle } from "lucide-react";
import { cn } from "@elena/ui";
import type { VideoInfo } from "@/lib/videos";

type Props = { name: string; src: string; poster?: string; info: VideoInfo };

/**
 * Vídeo real de un ejercicio. Pensado para vídeos grabados en vertical con el móvil:
 * se ven enteros, sin recortar, en cualquier pantalla. Se puede repetir en bucle y ver a cámara lenta.
 */
export function TutorialVideo({ name, src, poster, info }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [loop, setLoop] = useState(true);
  const [slow, setSlow] = useState(false);
  const [failed, setFailed] = useState(false);

  function toggleSlow() {
    const next = !slow;
    setSlow(next);
    if (ref.current) ref.current.playbackRate = next ? 0.5 : 1;
  }

  return (
    <div>
      <div className="overflow-hidden rounded-3xl border border-line bg-black">
        {failed ? (
          <p className="grid min-h-60 place-items-center px-6 text-center text-sm text-white">
            No se ha podido cargar el vídeo. Comprueba tu conexión e inténtalo de nuevo.
          </p>
        ) : (
          <video
            ref={ref}
            key={src}
            src={src}
            poster={poster}
            controls
            playsInline
            muted
            loop={loop}
            preload="metadata"
            aria-label={`Vídeo: ${name}`}
            onLoadedMetadata={() => ref.current && (ref.current.playbackRate = slow ? 0.5 : 1)}
            onError={() => setFailed(true)}
            className="mx-auto block max-h-[56vh] w-full object-contain"
          />
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setLoop((v) => !v)}
          aria-pressed={loop}
          className={cn(
            "inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold",
            loop ? "border-brand bg-brand text-on-brand" : "border-line text-muted",
          )}
        >
          <Repeat className="size-4" aria-hidden /> Repetir
        </button>
        <button
          type="button"
          onClick={toggleSlow}
          aria-pressed={slow}
          className={cn(
            "inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold",
            slow ? "border-brand bg-brand text-on-brand" : "border-line text-muted",
          )}
        >
          <Turtle className="size-4" aria-hidden /> Cámara lenta
        </button>
      </div>

      <ol className="mt-4 grid gap-2 sm:grid-cols-3" aria-label="Pasos del ejercicio">
        {info.steps.map((s, i) => (
          <li key={s} className="rounded-2xl border border-line bg-surface p-3.5 text-sm">
            <span className="mb-1 block font-display text-xl leading-none text-highlight">{String(i + 1).padStart(2, "0")}</span>
            {s}
          </li>
        ))}
      </ol>

      <p className="mt-4 flex items-start gap-3 rounded-2xl border border-line bg-surface p-4 text-sm">
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-highlight" aria-hidden />
        <span>
          <strong className="text-highlight">Error común:</strong> {info.tip}
        </span>
      </p>
    </div>
  );
}
