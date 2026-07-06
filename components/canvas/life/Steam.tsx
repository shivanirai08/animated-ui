"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Chai steam — a handful of soft billboards rising, wobbling and
 * dissolving into the cold air. The texture is painted once on a
 * canvas: a soft radial breath, nothing more.
 */

let steamTexture: THREE.Texture | null = null;
function getSteamTexture() {
  if (steamTexture) return steamTexture;
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
  g.addColorStop(0, "rgba(255,250,240,0.55)");
  g.addColorStop(0.55, "rgba(240,235,228,0.18)");
  g.addColorStop(1, "rgba(235,230,225,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  steamTexture = new THREE.CanvasTexture(c);
  return steamTexture;
}

interface SteamProps {
  position: [number, number, number];
  count?: number;
  scale?: number;
}

export default function Steam({ position, count = 6, scale = 1 }: SteamProps) {
  const group = useRef<THREE.Group>(null);

  const puffs = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        offset: i / count,
        drift: Math.random() * Math.PI * 2,
        speed: 0.14 + Math.random() * 0.1,
      })),
    [count]
  );

  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: getSteamTexture(),
        transparent: true,
        depthWrite: false,
        opacity: 0.5,
      }),
    []
  );

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.children.forEach((child, i) => {
      const p = puffs[i];
      const life = (t * p.speed + p.offset) % 1;
      child.position.y = life * 1.5 * scale;
      child.position.x = Math.sin(t * 0.8 + p.drift + life * 3) * 0.12 * scale;
      child.position.z = Math.cos(t * 0.6 + p.drift) * 0.08 * scale;
      const s = (0.25 + life * 0.75) * scale;
      child.scale.setScalar(s);
      (child as THREE.Mesh & { material: THREE.MeshBasicMaterial }).material.opacity =
        0.42 * Math.sin(life * Math.PI);
      child.quaternion.copy(state.camera.quaternion);
    });
  });

  return (
    <group ref={group} position={position}>
      {puffs.map((_, i) => (
        <mesh key={i} material={material.clone()}>
          <planeGeometry args={[0.5, 0.5]} />
        </mesh>
      ))}
    </group>
  );
}
