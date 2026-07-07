"use client";

import { MeshReflectorMaterial } from "@react-three/drei";

/**
 * The wet asphalt — the second most important surface in the world
 * after the sky. Streetlights and windows live twice: once above the
 * road, once inside it.
 */
export default function WetRoad() {
  return (
    <group>
      {/* the road itself, mirror-wet */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, -120]}>
        <planeGeometry args={[13, 300]} />
        <MeshReflectorMaterial
          resolution={768}
          blur={[300, 70]}
          mixBlur={0.7}
          mixStrength={4.5}
          mixContrast={1.1}
          mirror={0.85}
          depthScale={1.0}
          minDepthThreshold={0.3}
          maxDepthThreshold={1.4}
          color="#2a3440"
          metalness={0.1}
          roughness={0.55}
        />
      </mesh>

      {/* muddy shoulders on either side — wet but not mirrored */}
      <mesh rotation-x={-Math.PI / 2} position={[-11.5, -0.01, -120]}>
        <planeGeometry args={[10, 300]} />
        <meshLambertMaterial color="#232526" />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[11.5, -0.01, -120]}>
        <planeGeometry args={[10, 300]} />
        <meshLambertMaterial color="#232526" />
      </mesh>

      {/* the ground plane far beyond the street */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.03, -120]}>
        <planeGeometry args={[400, 400]} />
        <meshLambertMaterial color="#1a1d20" />
      </mesh>
    </group>
  );
}
