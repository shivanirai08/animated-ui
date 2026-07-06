"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { metalDark } from "./materials";
import { atmo } from "@/lib/atmosphere";
import { seeded } from "@/lib/rand";

interface StreetLampProps {
  position: [number, number, number];
  seed?: number;
  /** lamps near emotional scenes carry a real light */
  withLight?: boolean;
  flickery?: boolean;
}

/**
 * Sodium-vapour street lamp. Most are emissive-only (cheap); the ones
 * guarding emotional scenes carry a true point light so people and
 * rain catch their warmth.
 */
export default function StreetLamp({
  position,
  seed = 1,
  withLight = false,
  flickery = false,
}: StreetLampProps) {
  const bulbRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const coneRef = useRef<THREE.Mesh>(null);
  const phase = useMemo(() => seeded(seed)() * 100, [seed]);

  const bulbMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: "#ffb45e" }),
    []
  );
  const coneMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#c98a3a",
        transparent: true,
        opacity: 0.028,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime + phase;
    // sodium lamps hum and waver; a flickery one occasionally drops out
    let flicker = 0.92 + Math.sin(t * 9.3) * 0.03 + Math.sin(t * 23.7) * 0.02;
    if (flickery) {
      const drop = Math.sin(t * 0.7) > 0.985 ? 0.25 : 1;
      flicker *= drop * (0.85 + Math.sin(t * 47.0) * 0.12);
    }
    const night = 0.45 + atmo.darkness * 0.65;
    const power = flicker * night;

    bulbMat.color.setHSL(0.075, 0.9, 0.45 * power + 0.1);
    coneMat.opacity = 0.028 * power;
    if (lightRef.current) lightRef.current.intensity = 6.5 * power;
  });

  return (
    <group position={position}>
      <mesh position={[0, 2.6, 0]} material={metalDark}>
        <cylinderGeometry args={[0.05, 0.08, 5.2, 8]} />
      </mesh>
      {/* arm reaching over the road */}
      <mesh position={[0.55, 5.15, 0]} rotation-z={-0.35} material={metalDark}>
        <cylinderGeometry args={[0.04, 0.04, 1.3, 8]} />
      </mesh>
      <mesh ref={bulbRef} position={[1.05, 5.35, 0]} material={bulbMat}>
        <sphereGeometry args={[0.13, 10, 8]} />
      </mesh>
      {/* volume of drizzle-lit air under the lamp */}
      <mesh ref={coneRef} position={[1.05, 2.7, 0]} material={coneMat}>
        <coneGeometry args={[1.9, 5.3, 16, 1, true]} />
      </mesh>
      {withLight && (
        <pointLight
          ref={lightRef}
          position={[1.05, 5.1, 0]}
          color="#ff9f45"
          intensity={6}
          distance={16}
          decay={1.8}
        />
      )}
    </group>
  );
}
