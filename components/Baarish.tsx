"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { useBaarish } from "@/lib/store";
import { atmo } from "@/lib/atmosphere";
import { JOURNEY_LENGTH_VH } from "@/lib/journey";
import Intro from "@/components/dom/Intro";
import Captions from "@/components/dom/Captions";
import SoundToggle from "@/components/dom/SoundToggle";
import ScrollHint from "@/components/dom/ScrollHint";

const Experience = dynamic(() => import("@/components/canvas/Experience"), {
  ssr: false,
});

/**
 * The whole artwork lives on one page: a fixed canvas behind an
 * invisible scroll runway. Lenis turns the scroll wheel into slow,
 * weighted travel; the store carries progress into the 3D world.
 */
export default function Baarish() {
  const phase = useBaarish((s) => s.phase);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      // heavy, syrupy smoothing — movement should feel like drifting
      lerp: 0.055,
      wheelMultiplier: 0.55,
      touchMultiplier: 1.1,
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ({ progress }: { progress: number }) => {
      const state = useBaarish.getState();
      state.setProgress(progress);
      if (!state.hasScrolled && progress > 0.002) state.markScrolled();
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // dev hook: ?peek=0.5 skips the intro and jumps into the journey
    const peek = new URLSearchParams(window.location.search).get("peek");
    if (peek !== null) {
      const p = Math.min(Math.max(parseFloat(peek) || 0, 0), 1);
      atmo.reveal = 1;
      useBaarish.getState().begin(false);
      setTimeout(() => {
        const max = document.body.scrollHeight - window.innerHeight;
        lenis.scrollTo(p * max, { immediate: true });
        useBaarish.getState().setProgress(p);
      }, 300);
    }

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  // The journey cannot be scrolled until the visitor steps in.
  useEffect(() => {
    if (phase === "intro") {
      lenisRef.current?.stop();
      window.scrollTo(0, 0);
    } else {
      lenisRef.current?.start();
    }
  }, [phase]);

  return (
    <>
      {/* the world */}
      <div className="fixed inset-0">
        <Experience />
      </div>

      {/* the runway that gives the journey its length */}
      <div
        aria-hidden
        style={{ height: `${JOURNEY_LENGTH_VH}vh` }}
        className="relative w-full"
      />

      {/* the quiet DOM layer */}
      <Intro />
      <Captions />
      <ScrollHint />
      <SoundToggle />
    </>
  );
}
