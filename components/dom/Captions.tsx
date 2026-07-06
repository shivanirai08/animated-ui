"use client";

import { useEffect, useRef } from "react";
import { captions } from "@/lib/journey";
import { useBaarish } from "@/lib/store";

/**
 * Whispered lines that breathe in and out with the journey.
 * Rendered imperatively from a rAF loop so scrolling never
 * triggers React renders.
 */
export default function Captions() {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const { progress, phase } = useBaarish.getState();
      captions.forEach((c, i) => {
        const el = refs.current[i];
        if (!el) return;
        let o = 0;
        if (phase === "journey" && progress > c.enter && progress < c.exit) {
          const span = c.exit - c.enter;
          const t = (progress - c.enter) / span;
          // long ease in, long ease out — the line surfaces like a thought
          o = Math.min(1, Math.min(t, 1 - t) * 4);
          o = o * o * (3 - 2 * o);
        }
        el.style.opacity = String(o * 0.92);
        el.style.transform = `translateY(${(1 - o) * 6}px)`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[9vh] z-30 flex justify-center">
      <div className="relative h-24 w-full max-w-2xl px-8">
        {captions.map((c, i) => (
          <div
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className="absolute inset-x-0 flex flex-col items-center text-center"
            style={{ opacity: 0, willChange: "opacity, transform" }}
          >
            {c.hindi && (
              <span
                className="devanagari mb-2 text-sm tracking-widest"
                style={{ color: "#c9a76a" }}
              >
                {c.hindi}
              </span>
            )}
            <p
              className="text-lg italic leading-relaxed md:text-xl"
              style={{ color: "#c3cedd", textShadow: "0 1px 18px rgba(4,8,14,0.9)" }}
            >
              {c.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
