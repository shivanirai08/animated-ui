"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Building from "../Building";
import Silhouette from "../../life/Silhouette";
import Steam from "../../life/Steam";
import { atmo } from "@/lib/atmosphere";

/**
 * Scene One — Ghar. Warmth.
 *
 * A family behind one large glowing window. Chai on the table,
 * conversation, nobody minding the rain at all. The window is the
 * warmest thing the visitor has seen so far, and its light spills
 * onto the wet road.
 */
export default function Ghar() {
  const spill = useRef<THREE.PointLight>(null);
  const glowMat = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const night = 0.5 + atmo.darkness * 0.6;
    // the hearth breathes — light from a room where people move
    const life = 1 + Math.sin(t * 1.2) * 0.05 + Math.sin(t * 3.7) * 0.025;
    if (spill.current) spill.current.intensity = 9 * night * life;
    if (glowMat.current)
      glowMat.current.color.setHSL(0.085, 0.85, 0.5 * night * life);
  });

  return (
    <group position={[-7.2, 0, -24]}>
      {/* the house itself — a lived-in two-storey home */}
      <Building position={[0, 0, 0]} seed={41} floors={2} width={7} depth={6} litness={0.75} />

      {/* the family window — larger and warmer than any other */}
      <group position={[1.2, 1.9, 3.06]}>
        <mesh>
          <planeGeometry args={[2.3, 1.7]} />
          <meshBasicMaterial ref={glowMat} color="#e8a04a" />
        </mesh>
        {/* window frame cross */}
        <mesh position={[0, 0, 0.01]}>
          <boxGeometry args={[0.06, 1.7, 0.02]} />
          <meshBasicMaterial color="#241a10" />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <boxGeometry args={[2.3, 0.06, 0.02]} />
          <meshBasicMaterial color="#241a10" />
        </mesh>

        {/* the family, backlit against the glow: pouring chai, sitting, watching rain */}
        <group position={[0, -0.85, 0.12]}>
          <Silhouette position={[-0.7, 0, 0]} seed={7} scale={0.72} energy={0.7} />
          <Silhouette position={[0.15, 0, 0.05]} seed={11} scale={0.68} sitting energy={0.9} />
          <Silhouette position={[0.8, 0, 0]} seed={13} scale={0.7} energy={0.5} rotation={2.6} />
        </group>
      </group>

      {/* chai steam rising against the window light */}
      <Steam position={[1.5, 1.6, 3.25]} count={4} scale={0.45} />

      {/* the warm spill onto the street */}
      <pointLight
        ref={spill}
        position={[1.2, 2.2, 4.4]}
        color="#ff9c3f"
        intensity={9}
        distance={13}
        decay={1.9}
      />
    </group>
  );
}
