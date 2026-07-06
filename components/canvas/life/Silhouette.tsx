"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { silhouetteMaterial } from "../world/materials";
import { seeded } from "@/lib/rand";

/**
 * People remembered rather than rendered.
 *
 * This world is a memory, and memory blurs faces. Each person is a
 * soft dark form — head, body, sometimes an umbrella — that shifts
 * weight, breathes, and sways exactly like someone waiting in rain.
 * Nobody freezes. Nobody performs.
 */

interface SilhouetteProps {
  position: [number, number, number];
  rotation?: number;
  seed?: number;
  scale?: number;
  /** child-sized */
  small?: boolean;
  umbrella?: boolean;
  umbrellaColor?: string;
  /** sitting on something ~0.45 high */
  sitting?: boolean;
  /** how animated this person is (children > adults) */
  energy?: number;
}

export default function Silhouette({
  position,
  rotation = 0,
  seed = 1,
  scale = 1,
  small = false,
  umbrella = false,
  umbrellaColor = "#1b1b20",
  sitting = false,
  energy = 1,
}: SilhouetteProps) {
  const group = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const umbRef = useRef<THREE.Group>(null);
  const phase = useMemo(() => seeded(seed)() * 20, [seed]);

  const s = (small ? 0.55 : 1) * scale;
  const bodyH = sitting ? 0.85 : 1.35;

  const umbMat = useMemo(
    () => new THREE.MeshLambertMaterial({ color: umbrellaColor, side: THREE.DoubleSide }),
    [umbrellaColor]
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime + phase;
    if (bodyRef.current) {
      // breathing + weight shifting; children bounce a little
      bodyRef.current.position.y = Math.sin(t * 1.4) * 0.012 * energy + (small ? Math.abs(Math.sin(t * 2.2)) * 0.03 * energy : 0);
      bodyRef.current.rotation.z = Math.sin(t * 0.5) * 0.025 * energy;
      bodyRef.current.rotation.y = Math.sin(t * 0.23) * 0.06 * energy;
    }
    if (umbRef.current) {
      umbRef.current.rotation.z = Math.sin(t * 0.7) * 0.04;
      umbRef.current.rotation.x = Math.sin(t * 0.9 + 2) * 0.03;
    }
  });

  return (
    <group ref={group} position={position} rotation-y={rotation} scale={s}>
      <group ref={bodyRef}>
        {/* body */}
        <mesh position={[0, bodyH / 2 + (sitting ? 0.45 : 0), 0]} material={silhouetteMaterial}>
          <capsuleGeometry args={[0.21, bodyH - 0.42, 4, 8]} />
        </mesh>
        {/* head */}
        <mesh
          position={[0, bodyH + (sitting ? 0.45 : 0) + 0.12, 0]}
          material={silhouetteMaterial}
        >
          <sphereGeometry args={[0.14, 10, 8]} />
        </mesh>
        {umbrella && (
          <group ref={umbRef} position={[0.12, bodyH + (sitting ? 0.45 : 0) + 0.15, 0]}>
            <mesh position={[0, 0.35, 0]} material={silhouetteMaterial}>
              <cylinderGeometry args={[0.012, 0.012, 0.75, 6]} />
            </mesh>
            <mesh position={[0, 0.72, 0]} material={umbMat}>
              <coneGeometry args={[0.62, 0.28, 8]} />
            </mesh>
          </group>
        )}
      </group>
    </group>
  );
}
