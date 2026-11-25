"use client";

import { AnimatePresence, motion } from "motion/react";
import { create } from "zustand";

type ToastState = { msg: string | null; id: number; show: (msg: string) => void; hide: () => void };

export const useToast = create<ToastState>((set, get) => ({
  msg: null,
  id: 0,
  show: (msg) => {
    const id = get().id + 1;
    set({ msg, id });
    setTimeout(() => {
      if (get().id === id) set({ msg: null });
    }, 2400);
  },
  hide: () => set({ msg: null }),
}));

export function Toaster() {
  const msg = useToast((s) => s.msg);
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex justify-center px-4 lg:bottom-8">
      <AnimatePresence>
        {msg && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            className="rounded-full border border-line bg-ink-3 px-5 py-3 text-sm font-medium shadow-2xl"
          >
            {msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
