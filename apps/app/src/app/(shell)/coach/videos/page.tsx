"use client";

import { useState } from "react";
import { Trash2, Upload } from "lucide-react";
import { cn } from "@elena/ui";
import { ElenaVideo } from "@/components/elena-video";
import { useToast } from "@/components/toast";
import { clients } from "@/lib/data";
import { shortDate } from "@/lib/hooks";
import { dayKey, newId, useApp } from "@/lib/store";
import { deleteVideoFile, saveVideoFile } from "@/lib/video-files";

const MAX_MB = 200;

export default function Biblioteca() {
  const videos = useApp((s) => s.videos);
  const plans = useApp((s) => s.plans);
  const templates = useApp((s) => s.templates);
  const addVideo = useApp((s) => s.addVideo);
  const updateVideo = useApp((s) => s.updateVideo);
  const removeVideo = useApp((s) => s.removeVideo);
  const toast = useToast((s) => s.show);
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState<string | null>(null);

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("video/")) {
        toast(`${file.name} no es un vídeo`);
        continue;
      }
      if (file.size > MAX_MB * 1024 * 1024) {
        toast(`${file.name} pesa más de ${MAX_MB} MB`);
        continue;
      }
      const id = newId("vid");
      try {
        await saveVideoFile(id, file);
        addVideo({ id, title: file.name.replace(/\.[^.]+$/, ""), date: dayKey(), size: file.size, clients: [] });
        toast("Vídeo guardado en tu biblioteca");
      } catch {
        toast("No hay espacio en el móvil para guardar el vídeo");
      }
    }
    setBusy(false);
  }

  const uses = (id: string) =>
    [...Object.values(plans), ...templates.flatMap((t) => (t.kind === "Rutina" ? [t.plan] : []))]
      .flatMap((p) => p.workouts)
      .flatMap((w) => w.exercises)
      .filter((e) => e.videoId === id).length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display-tight text-5xl font-extrabold sm:text-6xl">
          Mis <span className="text-highlight">vídeos</span>
        </h1>
        <p className="text-muted">Súbelos una vez y asígnalos a tus clientes o a un ejercicio.</p>
      </div>

      <label
        className={cn(
          "flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-highlight bg-surface p-5 text-center focus-within:ring-2 focus-within:ring-highlight",
          busy && "pointer-events-none opacity-60",
        )}
      >
        <Upload className="size-8 text-highlight" aria-hidden />
        <span className="font-display-tight text-2xl font-bold">{busy ? "Guardando…" : "Subir vídeo"}</span>
        <span className="text-sm text-muted">Desde la galería o la cámara · máximo {MAX_MB} MB</span>
        <input
          type="file"
          accept="video/*"
          multiple
          className="sr-only"
          onChange={(e) => {
            upload(e.target.files);
            e.target.value = "";
          }}
        />
      </label>
      <p className="text-xs text-muted">En esta demo los vídeos se guardan solo en este dispositivo.</p>

      {!videos.length && <p className="py-6 text-center text-muted">Tu biblioteca está vacía.</p>}

      <ul className="space-y-3">
        {videos.map((v) => (
          <li key={v.id} className="space-y-3 rounded-3xl border border-line bg-surface p-4">
            <div className="flex items-center gap-2">
              <input
                value={v.title}
                onChange={(e) => updateVideo(v.id, { title: e.target.value })}
                aria-label="Título del vídeo"
                className="h-11 min-w-0 flex-1 rounded-xl border border-line bg-canvas px-3 font-semibold focus:border-highlight focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  if (!window.confirm(`¿Borrar el vídeo “${v.title}”?`)) return;
                  removeVideo(v.id);
                  deleteVideoFile(v.id).catch(() => {});
                }}
                aria-label={`Borrar ${v.title}`}
                className="grid size-11 shrink-0 place-items-center rounded-full text-muted hover:text-bad"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
            <p className="text-xs text-muted">
              {shortDate(v.date)} · {(v.size / 1048576).toFixed(1)} MB · en {uses(v.id)} ejercicios
            </p>
            {open === v.id ? (
              <ElenaVideo id={v.id} title={v.title} />
            ) : (
              <button type="button" onClick={() => setOpen(v.id)} className="h-10 rounded-full border border-line px-4 text-sm font-semibold hover:border-highlight">
                Ver vídeo
              </button>
            )}
            <fieldset>
              <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Enviar a (lo ven en su pestaña Vídeos)</legend>
              <div className="flex flex-wrap gap-2">
                {clients.map((c) => {
                  const on = v.clients.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => updateVideo(v.id, { clients: on ? v.clients.filter((x) => x !== c.id) : [...v.clients, c.id] })}
                      className={cn("h-10 rounded-full border px-4 text-sm font-semibold", on ? "border-brand bg-brand text-on-brand" : "border-line text-muted")}
                    >
                      {c.name.split(" ")[0]}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          </li>
        ))}
      </ul>
      {videos.length > 0 && <p className="text-xs text-muted">Para ponerlo en un ejercicio concreto, elígelo al editar la rutina o la plantilla.</p>}
    </div>
  );
}
