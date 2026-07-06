"use client";

import { create } from "zustand";

/**
 * Global experience state.
 *
 * `progress` is written every scroll frame — canvas systems read it
 * imperatively via `useBaarish.getState()` inside useFrame so the React
 * tree never re-renders during the journey.
 */
interface BaarishState {
  phase: "intro" | "journey";
  soundOn: boolean;
  hasScrolled: boolean;
  progress: number;
  begin: (sound: boolean) => void;
  setProgress: (p: number) => void;
  markScrolled: () => void;
  toggleSound: () => void;
}

export const useBaarish = create<BaarishState>((set) => ({
  phase: "intro",
  soundOn: false,
  hasScrolled: false,
  progress: 0,
  begin: (sound) => set({ phase: "journey", soundOn: sound }),
  setProgress: (p) => set({ progress: p }),
  markScrolled: () => set({ hasScrolled: true }),
  toggleSound: () => set((s) => ({ soundOn: !s.soundOn })),
}));
