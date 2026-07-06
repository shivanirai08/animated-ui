"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * A paper boat drifting down the rainwater at the road's edge —
 * one of the things visitors should remember after they leave.
 * It travels a short stretch of gutter, bobbing, then quietly
 * starts again far behind (the fog hides the seam).
 */
export default function PaperBoat({
  start,
  end,
  duration = 26,
}: {
  start: [number, number, number];
  end: [number, number, number];
  duration?: number;
}) {
  const ref = useRef<THREE.Group>(null);
  const a = useMemo(() => new THREE.Vector3(...start), [start]);
  const b = useMemo(() => new THREE.Vector3(...end), [end]);
  const pos = useMemo(() => new THREE.Vector3(), []);

  const paper = useMemo(
    () => new THREE.MeshLambertMaterial({ color: "#cfc8ba", side: THREE.DoubleSide }),
    []
  );

  useFrame((state) => {
    if (!ref.current) return;
    const t = (state.clock.elapsedTime % duration) / duration;
    pos.lerpVectors(a, b, t);
    const wobble = state.clock.elapsedTime;
    ref.current.position.set(
      pos.x + Math.sin(wobble * 1.3) * 0.06,
      pos.y + Math.sin(wobble * 2.1) * 0.015,
      pos.z
    );
    ref.current.rotation.z = Math.sin(wobble * 1.7) * 0.09;
    ref.current.rotation.y = Math.sin(wobble * 0.6) * 0.25;
    // fade in / out at the ends of the run
    const edge = Math.min(t / 0.12, (1 - t) / 0.12, 1);
    paper.opacity = edge;
    paper.transparent = true;
  });

  return (
    <group ref={ref} scale={0.16}>
      {/* hull — two tilted planes meeting at a keel */}
      <mesh rotation={[0, 0, 0.5]} position={[-0.35, 0.25, 0]} material={paper}>
        <planeGeometry args={[1.1, 0.55]} />
      </mesh>
      <mesh rotation={[0, 0, -0.5]} position={[0.35, 0.25, 0]} material={paper}>
        <planeGeometry args={[1.1, 0.55]} />
      </mesh>
      {/* sail */}
      <mesh position={[0, 0.55, 0]} rotation-y={Math.PI / 2} material={paper}>
        <planeGeometry args={[0.5, 0.6]} />
      </mesh>
    </group>
  );
}
