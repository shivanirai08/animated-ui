"use client";

/**
 * Shared mutable atmosphere state.
 *
 * These values change every frame (lightning decay, sky darkening,
 * the intro "opening eyes" reveal). They live outside React so the
 * sky, fog, lights and rain can all read them without re-renders.
 */
export const atmo = {
  /** 0 → 1 : dusk deepening into night, driven by journey progress */
  darkness: 0,
  /** transient lightning flash energy, decays every frame */
  flash: 0,
  /** 0 → 1 : the world emerging from mist after the title fades */
  reveal: 0,
};
