"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * A street dog, curled and dry, peacefully indifferent to everything.
 */
export default function SleepingDog({
  position,
  rotation = 0,
}: {
  position: [number, number, number];
  rotation?: number;
}) {
  const body = useRef<THREE.Mesh>(null);
  const fur = useMemo(
    () => new THREE.MeshLambertMaterial({ color: "#8a7355" }),
    []
  );
  const darkFur = useMemo(
    () => new THREE.MeshLambertMaterial({ color: "#6a5540" }),
    []
  );

  useFrame((state) => {
    if (!body.current) return;
    const breath = 1 + Math.sin(state.clock.elapsedTime * 1.1) * 0.03;
    body.current.scale.set(1, breath, 1);
  });

  return (
    <group position={position} rotation-y={rotation}>
      <mesh ref={body} position={[0, 0.13, 0]} material={fur}>
        <sphereGeometry args={[0.28, 10, 8]} />
      </mesh>
      <mesh position={[0.2, 0.12, 0.1]} material={darkFur}>
        <sphereGeometry args={[0.13, 8, 6]} />
      </mesh>
      <mesh position={[-0.2, 0.06, 0.14]} rotation-y={0.8} material={fur}>
        <capsuleGeometry args={[0.04, 0.3, 4, 6]} />
      </mesh>
    </group>
  );
}
