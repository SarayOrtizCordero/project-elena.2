"use client";

// Los archivos de vídeo pesan demasiado para localStorage: se guardan en IndexedDB.
// DEMO: quedan solo en este dispositivo. En producción irán a un almacenamiento en la nube.

import { useEffect, useState } from "react";

const DB = "elenitafit-videos";
const STORE = "files";

function run<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const open = indexedDB.open(DB, 1);
    open.onupgradeneeded = () => open.result.createObjectStore(STORE);
    open.onerror = () => reject(open.error);
    open.onsuccess = () => {
      const tx = open.result.transaction(STORE, mode);
      const request = action(tx.objectStore(STORE));
      tx.oncomplete = () => {
        open.result.close();
        resolve(request.result);
      };
      tx.onerror = tx.onabort = () => {
        open.result.close();
        reject(tx.error);
      };
    };
  });
}

export const saveVideoFile = (id: string, file: Blob) => run("readwrite", (s) => s.put(file, id));
export const deleteVideoFile = (id: string) => run("readwrite", (s) => s.delete(id));

/** URL para reproducir un vídeo guardado. `missing` si no está en este dispositivo. */
export function useVideoUrl(id: string) {
  const [state, setState] = useState<{ url?: string; missing?: boolean }>({});
  useEffect(() => {
    let url: string | undefined;
    let alive = true;
    setState({});
    run<Blob | undefined>("readonly", (s) => s.get(id))
      .then((blob) => {
        if (!alive) return;
        if (!blob) return setState({ missing: true });
        url = URL.createObjectURL(blob);
        setState({ url });
      })
      .catch(() => alive && setState({ missing: true }));
    return () => {
      alive = false;
      if (url) URL.revokeObjectURL(url);
    };
  }, [id]);
  return state;
}
