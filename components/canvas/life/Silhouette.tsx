"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { seeded } from "@/lib/rand";

/**
 * Ordinary people — simple but readable human proportions with skin
 * tone and clothing colour. They respond to scene lighting so they
 * read as people in the evening, not flat black shapes.
 */

interface SilhouetteProps {
  position: [number, number, number];
  rotation?: number;
  seed?: number;
  scale?: number;
  small?: boolean;
  umbrella?: boolean;
  umbrellaColor?: string;
  sitting?: boolean;
  energy?: number;
}

const SKIN = ["#c68642", "#8d5524", "#a0715a", "#bc8f68", "#6b4423", "#d4a574"];
const SHIRTS = ["#4a5568", "#5c4033", "#2d4a3e", "#6b3a3a", "#3d4f6f", "#7a6348", "#4f5d73"];
const PANTS = ["#2c2c34", "#3a3a42", "#4a4038", "#353842", "#2e3338"];

function usePersonLook(seed: number) {
  return useMemo(() => {
    const rnd = seeded(seed);
    return {
      skin: new THREE.MeshLambertMaterial({ color: SKIN[Math.floor(rnd() * SKIN.length)] }),
      shirt: new THREE.MeshLambertMaterial({ color: SHIRTS[Math.floor(rnd() * SHIRTS.length)] }),
      pants: new THREE.MeshLambertMaterial({ color: PANTS[Math.floor(rnd() * PANTS.length)] }),
      hair: new THREE.MeshLambertMaterial({ color: rnd() < 0.7 ? "#1a1410" : "#3d2a1a" }),
    };
  }, [seed]);
}

export default function Silhouette({
  position,
  rotation = 0,
  seed = 1,
  scale = 1,
  small = false,
  umbrella = false,
  umbrellaColor = "#2a3440",
  sitting = false,
  energy = 1,
}: SilhouetteProps) {
  const group = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const umbRef = useRef<THREE.Group>(null);
  const phase = useMemo(() => seeded(seed)() * 20, [seed]);
  const mats = usePersonLook(seed);

  const s = (small ? 0.58 : 1) * scale;
  const umbMat = useMemo(
    () => new THREE.MeshLambertMaterial({ color: umbrellaColor, side: THREE.DoubleSide }),
    [umbrellaColor]
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime + phase;
    if (bodyRef.current) {
      bodyRef.current.position.y =
        Math.sin(t * 1.4) * 0.012 * energy +
        (small ? Math.abs(Math.sin(t * 2.2)) * 0.03 * energy : 0);
      bodyRef.current.rotation.z = Math.sin(t * 0.5) * 0.025 * energy;
      bodyRef.current.rotation.y = Math.sin(t * 0.23) * 0.06 * energy;
    }
    if (umbRef.current) {
      umbRef.current.rotation.z = Math.sin(t * 0.7) * 0.04;
      umbRef.current.rotation.x = Math.sin(t * 0.9 + 2) * 0.03;
    }
  });

  const seatY = sitting ? 0.45 : 0;

  return (
    <group ref={group} position={position} rotation-y={rotation} scale={s}>
      <group ref={bodyRef}>
        {/* ── legs ── */}
        {!sitting ? (
          <>
            <mesh position={[-0.09, 0.42, 0]} material={mats.pants}>
              <capsuleGeometry args={[0.075, 0.52, 4, 8]} />
            </mesh>
            <mesh position={[0.09, 0.42, 0]} material={mats.pants}>
              <capsuleGeometry args={[0.075, 0.52, 4, 8]} />
            </mesh>
          </>
        ) : (
          <>
            {/* seated legs bent forward */}
            <mesh position={[-0.1, 0.52, 0.14]} rotation-x={-1.35} material={mats.pants}>
              <capsuleGeometry args={[0.07, 0.38, 4, 8]} />
            </mesh>
            <mesh position={[0.1, 0.52, 0.14]} rotation-x={-1.35} material={mats.pants}>
              <capsuleGeometry args={[0.07, 0.38, 4, 8]} />
            </mesh>
          </>
        )}

        {/* ── torso ── */}
        <mesh position={[0, 1.02 + seatY, 0]} material={mats.shirt}>
          <capsuleGeometry args={[0.14, 0.42, 4, 8]} />
        </mesh>

        {/* ── arms ── */}
        <mesh position={[-0.22, 1.08 + seatY, 0.02]} rotation-z={0.25} material={mats.shirt}>
          <capsuleGeometry args={[0.055, 0.32, 4, 8]} />
        </mesh>
        <mesh position={[0.22, 1.08 + seatY, 0.02]} rotation-z={-0.25} material={mats.shirt}>
          <capsuleGeometry args={[0.055, 0.32, 4, 8]} />
        </mesh>
        {/* hands */}
        <mesh position={[-0.28, 0.88 + seatY, 0.04]} material={mats.skin}>
          <sphereGeometry args={[0.045, 6, 6]} />
        </mesh>
        <mesh position={[0.28, 0.88 + seatY, 0.04]} material={mats.skin}>
          <sphereGeometry args={[0.045, 6, 6]} />
        </mesh>

        {/* ── neck + head ── */}
        <mesh position={[0, 1.38 + seatY, 0]} material={mats.skin}>
          <cylinderGeometry args={[0.045, 0.05, 0.1, 6]} />
        </mesh>
        <mesh position={[0, 1.52 + seatY, 0]} material={mats.skin}>
          <sphereGeometry args={[0.11, 10, 8]} />
        </mesh>
        {/* hair cap */}
        <mesh position={[0, 1.58 + seatY, -0.01]} material={mats.hair}>
          <sphereGeometry args={[0.105, 8, 6, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        </mesh>

        {umbrella && (
          <group ref={umbRef} position={[0.14, 1.42 + seatY, 0.06]}>
            <mesh position={[0, 0.32, 0]} material={mats.pants}>
              <cylinderGeometry args={[0.012, 0.012, 0.68, 6]} />
            </mesh>
            <mesh position={[0, 0.66, 0]} material={umbMat}>
              <coneGeometry args={[0.58, 0.26, 10]} />
            </mesh>
          </group>
        )}
      </group>
    </group>
  );
}
