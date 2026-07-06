"use client";

import { useEffect } from "react";
import { atmo } from "@/lib/atmosphere";
import { rainAudio } from "@/lib/audio/rainEngine";

/**
 * Distant lightning.
 *
 * When sound is on, flashes arrive with the thunder the audio engine
 * schedules. A second, quieter schedule guarantees occasional silent
 * sheet-lightning even for visitors who entered in silence.
 */
export default function Lightning() {
  useEffect(() => {
    rainAudio.onThunder = (intensity) => {
      // double-strike feel: a leader flash, then the main one
      atmo.flash = Math.max(atmo.flash, intensity * 0.5);
      setTimeout(() => {
        atmo.flash = Math.max(atmo.flash, intensity * 1.1);
      }, 120 + Math.random() * 180);
    };

    let timer: ReturnType<typeof setTimeout>;
    const silentFlash = () => {
      timer = setTimeout(() => {
        atmo.flash = Math.max(atmo.flash, 0.25 + Math.random() * 0.45);
        silentFlash();
      }, 22000 + Math.random() * 38000);
    };
    silentFlash();

    return () => {
      rainAudio.onThunder = null;
      clearTimeout(timer);
    };
  }, []);

  return null;
}
