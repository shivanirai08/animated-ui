"use client";

import { useBaarish } from "@/lib/store";
import { rainAudio } from "@/lib/audio/rainEngine";

/**
 * The only persistent UI element — a small quiet word in the corner.
 */
export default function SoundToggle() {
  const phase = useBaarish((s) => s.phase);
  const soundOn = useBaarish((s) => s.soundOn);
  const toggle = useBaarish((s) => s.toggleSound);

  if (phase !== "journey") return null;

  const onClick = () => {
    if (soundOn) rainAudio.stop();
    else rainAudio.start();
    toggle();
  };

  return (
    <button
      onClick={onClick}
      className="fixed right-6 top-6 z-40 cursor-pointer text-[11px] tracking-[0.3em] opacity-40 transition-opacity duration-700 hover:opacity-85"
      style={{ color: "#9aa8bb" }}
      aria-label={soundOn ? "mute the rain" : "hear the rain"}
    >
      {soundOn ? "sound" : "silence"}
    </button>
  );
}
