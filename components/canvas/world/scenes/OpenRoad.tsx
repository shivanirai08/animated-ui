"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Silhouette from "../../life/Silhouette";
import Tree from "../Tree";
import { Rickshaw } from "../props";

/**
 * Scene Five — Open Road. Solitude.
 *
 * The town falls away. One person stands in the middle of the rain
 * with no umbrella and no hurry, face tilted upward, quietly glad
 * that nobody is watching. Further on, an auto driver waits out a
 * slow evening. Space itself is the composition here.
 */
export default function OpenRoad() {
  const walker = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!walker.current) return;
    const t = state.clock.elapsedTime;
    // arms loose, head tilted back — a slow private sway in the rain
    walker.current.rotation.z = Math.sin(t * 0.3) * 0.05;
    walker.current.rotation.x = -0.08 + Math.sin(t * 0.45) * 0.02;
  });

  return (
    <group position={[0, 0, -180]}>
      {/* the one who let the rain in */}
      <group ref={walker} position={[-1.6, 0, -8]}>
        <Silhouette position={[0, 0, 0]} seed={79} energy={0.4} rotation={0.4} />
      </group>

      {/* the auto driver waiting for a fare that may not come */}
      <group position={[5.8, 0, 6]}>
        <Rickshaw position={[0, 0, 0]} rotation={-1.4} />
        <Silhouette position={[0.1, 0, 0.35]} seed={83} sitting scale={0.85} energy={0.4} />
      </group>

      {/* sparse rain trees — the sky owns this stretch */}
      <Tree position={[-8.5, 0, -2]} seed={5} scale={1.4} />
      <Tree position={[9.5, 0, -14]} seed={9} scale={1.2} />
      <Tree position={[-10, 0, -22]} seed={17} scale={1.5} />
    </group>
  );
}
