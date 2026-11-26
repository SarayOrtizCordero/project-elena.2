"use client";

import { useVideoUrl } from "@/lib/video-files";

/** Reproduce un vídeo subido por Elena. */
export function ElenaVideo({ id, title }: { id: string; title: string }) {
  const { url, missing } = useVideoUrl(id);
  return (
    <div className="grid aspect-video place-items-center overflow-hidden rounded-3xl border border-line bg-black text-white">
      {url ? (
        <video src={url} controls playsInline preload="metadata" className="size-full" aria-label={title} />
      ) : (
        <p className="px-6 text-center text-sm">
          {missing ? "En esta demo el vídeo solo está en el dispositivo donde se subió." : "Cargando vídeo…"}
        </p>
      )}
    </div>
  );
}
