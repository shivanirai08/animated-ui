"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { foliageMaterial, trunkMaterial } from "./materials";
import { seeded } from "@/lib/rand";

interface TreeProps {
  position: [number, number, number];
  seed?: number;
  scale?: number;
}

/**
 * A rain tree — irregular clumps of leaves that sway slowly, heavy
 * with water. Roadside plants use the same clumping at small scale.
 */
export default function Tree({ position, seed = 1, scale = 1 }: TreeProps) {
  const foliage = useRef<THREE.Group>(null);
  const phase = useMemo(() => seeded(seed)() * 10, [seed]);

  const clumps = useMemo(() => {
    const rnd = seeded(seed * 7 + 3);
    return Array.from({ length: 5 }, () => ({
      pos: [
        (rnd() - 0.5) * 2.2,
        2.6 + rnd() * 1.6,
        (rnd() - 0.5) * 2.2,
      ] as [number, number, number],
      r: 0.9 + rnd() * 0.9,
    }));
  }, [seed]);

  useFrame((state) => {
    if (!foliage.current) return;
    const t = state.clock.elapsedTime;
    foliage.current.rotation.z = Math.sin(t * 0.45 + phase) * 0.018;
    foliage.current.rotation.x = Math.sin(t * 0.32 + phase * 1.7) * 0.014;
  });

  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 1.4, 0]} material={trunkMaterial}>
        <cylinderGeometry args={[0.12, 0.22, 2.8, 7]} />
      </mesh>
      <group ref={foliage}>
        {clumps.map((c, i) => (
          <mesh key={i} position={c.pos} material={foliageMaterial}>
            <icosahedronGeometry args={[c.r, 1]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
