"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useBaarish } from "@/lib/store";
import { atmo } from "@/lib/atmosphere";
import { rainAudio } from "@/lib/audio/rainEngine";

/**
 * The opening of the book.
 *
 * Darkness → the title breathes in → a single quiet choice → the
 * title dissolves and the world opens like eyes adjusting to an
 * evening. Nothing here should feel like a loading screen.
 */
export default function Intro() {
  const begin = useBaarish((s) => s.begin);
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);
  const [ready, setReady] = useState(false);

  // the ?peek dev hook skips straight into the journey
  useEffect(() => {
    if (window.location.search.includes("peek=")) setGone(true);
  }, []);

  useEffect(() => {
    if (!root.current) return;
    const q = gsap.utils.selector(root.current);
    const tl = gsap.timeline();
    tl.fromTo(
      q(".title"),
      { opacity: 0, filter: "blur(14px)" },
      { opacity: 1, filter: "blur(0px)", duration: 3.2, ease: "power2.out", delay: 1.4 }
    )
      .fromTo(
        q(".tagline"),
        { opacity: 0, y: 8 },
        { opacity: 0.85, y: 0, duration: 2.4, ease: "power2.out" },
        "-=1.6"
      )
      .fromTo(
        q(".enter"),
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1.8,
          ease: "power1.inOut",
          // the door opens as soon as it becomes visible
          onStart: () => setReady(true),
        },
        "-=0.8"
      );
    return () => {
      tl.kill();
    };
  }, []);

  const enter = (withSound: boolean) => {
    if (!ready || !root.current) return;
    if (withSound) rainAudio.start();
    const tl = gsap.timeline({
      onComplete: () => setGone(true),
    });
    tl.to(root.current.querySelectorAll(".enter, .tagline"), {
      opacity: 0,
      duration: 1.2,
      ease: "power1.in",
    })
      .to(
        root.current.querySelector(".title"),
        { opacity: 0, filter: "blur(18px)", duration: 2.6, ease: "power2.inOut" },
        "-=0.4"
      )
      .to(
        root.current,
        { backgroundColor: "rgba(6,9,15,0)", duration: 4.5, ease: "power2.inOut" },
        "-=2.2"
      )
      // the world slowly opens its eyes
      .to(
        atmo,
        { reveal: 1, duration: 6.5, ease: "power2.inOut" },
        "<"
      );
    begin(withSound);
  };

  if (gone) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ backgroundColor: "rgba(6,9,15,1)" }}
    >
      <h1
        className="title devanagari select-none text-7xl md:text-8xl"
        style={{ color: "#e8dcc8", opacity: 0, textShadow: "0 0 60px rgba(255,201,122,0.15)" }}
      >
        बारिश
      </h1>
      <p
        className="tagline mt-6 select-none text-lg italic tracking-[0.28em] md:text-xl"
        style={{ color: "#8fa0b5", opacity: 0 }}
      >
        Ek Nazar. Kai Ehsaas.
      </p>

      <div className="enter absolute bottom-[16vh] flex flex-col items-center gap-5" style={{ opacity: 0 }}>
        <button
          onClick={() => enter(true)}
          className="cursor-pointer border-b border-transparent pb-1 text-base tracking-[0.2em] transition-all duration-700 hover:border-[#ffc97a66]"
          style={{ color: "#d8cdb8" }}
        >
          step into the rain
        </button>
        <button
          onClick={() => enter(false)}
          className="cursor-pointer text-xs tracking-[0.25em] opacity-45 transition-opacity duration-700 hover:opacity-80"
          style={{ color: "#8fa0b5" }}
        >
          enter in silence
        </button>
      </div>
    </div>
  );
}
