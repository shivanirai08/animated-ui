"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { seeded } from "@/lib/rand";

/**
 * Clothes forgotten on a balcony line, moving with the wind —
 * someone will remember them when the rain stops.
 */
export default function HangingClothes({
  position,
  seed = 1,
  width = 2.4,
}: {
  position: [number, number, number];
  seed?: number;
  width?: number;
}) {
  const group = useRef<THREE.Group>(null);
  const phase = useMemo(() => seeded(seed)() * 10, [seed]);

  const items = useMemo(() => {
    const rnd = seeded(seed * 13 + 5);
    const colors = ["#4a3b34", "#39424a", "#4a4438", "#3d3546"];
    const n = 2 + Math.floor(rnd() * 3);
    return Array.from({ length: n }, (_, i) => ({
      x: -width / 2 + ((i + 0.5) / n) * width,
      w: 0.35 + rnd() * 0.25,
      h: 0.5 + rnd() * 0.3,
      color: colors[Math.floor(rnd() * colors.length)],
      sway: 0.5 + rnd(),
    }));
  }, [seed, width]);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime + phase;
    group.current.children.forEach((child, i) => {
      if (i === 0) return; // the line itself
      const item = items[i - 1];
      child.rotation.x = Math.sin(t * 0.8 * item.sway) * 0.12 + Math.sin(t * 2.3 * item.sway) * 0.04;
    });
  });

  return (
    <group ref={group} position={position}>
      <mesh rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[0.008, 0.008, width, 4]} />
        <meshBasicMaterial color="#0e1114" />
      </mesh>
      {items.map((item, i) => (
        // pivot group sits on the line so cloth swings from where it hangs
        <group key={i} position={[item.x, 0, 0]}>
          <mesh position={[0, -item.h / 2, 0]}>
            <planeGeometry args={[item.w, item.h]} />
            <meshLambertMaterial color={item.color} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
