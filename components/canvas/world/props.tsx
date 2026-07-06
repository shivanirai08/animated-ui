"use client";

import { metalDark, woodDark, concreteDark } from "./materials";
import * as THREE from "three";
import { useMemo } from "react";

/**
 * Street furniture — parked scooters, a waiting rickshaw, benches.
 * Stylized low forms; the fog and dusk do the rest.
 */

export function Scooter({
  position,
  rotation = 0,
  color = "#3d4a52",
}: {
  position: [number, number, number];
  rotation?: number;
  color?: string;
}) {
  const bodyMat = useMemo(() => new THREE.MeshLambertMaterial({ color }), [color]);
  return (
    <group position={position} rotation-y={rotation} scale={0.9}>
      {/* footboard and body */}
      <mesh position={[0, 0.35, 0]} material={bodyMat}>
        <boxGeometry args={[1.1, 0.18, 0.32]} />
      </mesh>
      <mesh position={[0.45, 0.62, 0]} material={bodyMat}>
        <boxGeometry args={[0.28, 0.5, 0.3]} />
      </mesh>
      {/* seat */}
      <mesh position={[-0.28, 0.62, 0]} material={metalDark}>
        <boxGeometry args={[0.5, 0.12, 0.28]} />
      </mesh>
      {/* handle */}
      <mesh position={[0.55, 0.95, 0]} rotation-x={Math.PI / 2} material={metalDark}>
        <cylinderGeometry args={[0.025, 0.025, 0.45, 6]} />
      </mesh>
      {/* wheels */}
      <mesh position={[0.55, 0.16, 0]} rotation-x={Math.PI / 2} material={metalDark}>
        <cylinderGeometry args={[0.16, 0.16, 0.08, 10]} />
      </mesh>
      <mesh position={[-0.5, 0.16, 0]} rotation-x={Math.PI / 2} material={metalDark}>
        <cylinderGeometry args={[0.16, 0.16, 0.08, 10]} />
      </mesh>
    </group>
  );
}

export function Rickshaw({
  position,
  rotation = 0,
}: {
  position: [number, number, number];
  rotation?: number;
}) {
  const bodyMat = useMemo(() => new THREE.MeshLambertMaterial({ color: "#3a4a3d" }), []);
  const hoodMat = useMemo(() => new THREE.MeshLambertMaterial({ color: "#26261f" }), []);
  return (
    <group position={position} rotation-y={rotation}>
      {/* cabin */}
      <mesh position={[0, 0.75, 0]} material={bodyMat}>
        <boxGeometry args={[1.3, 0.8, 1.15]} />
      </mesh>
      {/* rounded hood */}
      <mesh position={[0, 1.28, 0]} material={hoodMat}>
        <cylinderGeometry args={[0.62, 0.62, 1.25, 10, 1, false, 0, Math.PI]} />
      </mesh>
      {/* nose */}
      <mesh position={[0.85, 0.6, 0]} material={bodyMat}>
        <boxGeometry args={[0.5, 0.5, 0.6]} />
      </mesh>
      {/* wheels */}
      <mesh position={[1.0, 0.24, 0]} rotation-x={Math.PI / 2} material={metalDark}>
        <cylinderGeometry args={[0.24, 0.24, 0.1, 10]} />
      </mesh>
      <mesh position={[-0.45, 0.24, 0.5]} rotation-x={Math.PI / 2} material={metalDark}>
        <cylinderGeometry args={[0.24, 0.24, 0.1, 10]} />
      </mesh>
      <mesh position={[-0.45, 0.24, -0.5]} rotation-x={Math.PI / 2} material={metalDark}>
        <cylinderGeometry args={[0.24, 0.24, 0.1, 10]} />
      </mesh>
    </group>
  );
}

export function Bench({
  position,
  rotation = 0,
}: {
  position: [number, number, number];
  rotation?: number;
}) {
  return (
    <group position={position} rotation-y={rotation}>
      <mesh position={[0, 0.42, 0]} material={woodDark}>
        <boxGeometry args={[1.7, 0.07, 0.4]} />
      </mesh>
      <mesh position={[-0.7, 0.21, 0]} material={concreteDark}>
        <boxGeometry args={[0.1, 0.42, 0.36]} />
      </mesh>
      <mesh position={[0.7, 0.21, 0]} material={concreteDark}>
        <boxGeometry args={[0.1, 0.42, 0.36]} />
      </mesh>
    </group>
  );
}
