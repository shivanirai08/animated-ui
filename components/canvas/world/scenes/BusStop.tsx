"use client";

import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Silhouette from "../../life/Silhouette";
import { Bench } from "../props";
import { metalDark, concreteDark } from "../materials";
import { atmo } from "@/lib/atmosphere";

/**
 * Scene Three — Bus Stop. Different lives, same rain.
 *
 * Five people under one roof, nobody feeling the same thing:
 * a soaked office worker pacing, someone relieved and still,
 * someone leaning out to look for the bus, and a couple sharing
 * one umbrella just outside, closer than they need to be.
 */
export default function BusStop() {
  // a tired fluorescent tube under the tin roof — enough to see faces by
  const tubeMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: "#b8c8c2" }),
    []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const night = 0.5 + atmo.darkness * 0.6;
    // fluorescent stutter — mostly steady, occasionally nervous
    const stutter = Math.sin(t * 43) > 0.96 ? 0.6 : 1;
    tubeMat.color.setHSL(0.42, 0.12, 0.5 * night * stutter);
  });

  // rotated so the shelter's open side faces the road the visitor travels
  return (
    <group position={[6.6, 0, -100]} rotation-y={-Math.PI / 2 - 0.06}>
      {/* the shelter */}
      <group>
        {/* roof, tin, slightly tilted for runoff */}
        <mesh position={[0, 2.5, 0]} rotation-z={0.04} material={metalDark}>
          <boxGeometry args={[4.6, 0.08, 2]} />
        </mesh>
        {/* the tube and its pale wash */}
        <mesh position={[0, 2.42, -0.2]} material={tubeMat}>
          <boxGeometry args={[1.6, 0.05, 0.08]} />
        </mesh>
        <pointLight
          position={[0, 2.2, -0.1]}
          color="#cfe4da"
          intensity={4}
          distance={7}
          decay={1.9}
        />
        {/* posts */}
        {[-2.1, 2.1].map((x) =>
          [-0.85, 0.85].map((z) => (
            <mesh key={`${x}${z}`} position={[x, 1.25, z]} material={metalDark}>
              <cylinderGeometry args={[0.045, 0.045, 2.5, 8]} />
            </mesh>
          ))
        )}
        {/* back panel */}
        <mesh position={[0, 1.4, -0.9]} material={concreteDark}>
          <boxGeometry args={[4.6, 1.6, 0.06]} />
        </mesh>
        <Bench position={[-0.8, 0, -0.45]} />
      </group>

      {/* the frustrated one — pacing weight, soaked, checking the road */}
      <Silhouette position={[-1.7, 0, 0.2]} seed={37} rotation={-1.9} energy={1.4} />

      {/* the relieved one — sitting, finally cool after the summer */}
      <Silhouette position={[-0.8, 0, -0.45]} seed={43} sitting energy={0.5} rotation={-1.6} />

      {/* the anxious one — leaning out from under the roof */}
      <Silhouette position={[1.8, 0, 0.65]} seed={47} rotation={-2.3} energy={1.1} />

      {/* the couple — one umbrella, just outside the shelter */}
      <group position={[3.4, 0, 1.3]}>
        <Silhouette position={[0, 0, 0]} seed={53} umbrella umbrellaColor="#26333e" rotation={-1.7} energy={0.6} />
        <Silhouette position={[0.42, 0, 0.1]} seed={59} scale={0.94} rotation={-1.5} energy={0.6} />
      </group>
    </group>
  );
}
