"use client";

import { useEffect, useState } from "react";
import { useBaarish } from "@/lib/store";

/**
 * A single quiet invitation to move — appears only once the world
 * has opened, disappears forever after the first scroll.
 */
export default function ScrollHint() {
  const phase = useBaarish((s) => s.phase);
  const hasScrolled = useBaarish((s) => s.hasScrolled);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (phase !== "journey") return;
    const t = setTimeout(() => setVisible(true), 7000);
    return () => clearTimeout(t);
  }, [phase]);

  const shown = visible && !hasScrolled;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-[5vh] z-30 flex justify-center transition-opacity duration-[2000ms]"
      style={{ opacity: shown ? 1 : 0 }}
    >
      <span
        className="text-xs tracking-[0.4em]"
        style={{ color: "#7c8ba0", animation: "breathe 4.5s ease-in-out infinite" }}
      >
        walk slowly
      </span>
    </div>
  );
}
