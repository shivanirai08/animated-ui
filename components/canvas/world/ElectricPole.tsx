"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { metalDark } from "./materials";

interface WireSpanProps {
  from: [number, number, number];
  to: [number, number, number];
  sag?: number;
  phase?: number;
}

const wireMat = new THREE.LineBasicMaterial({
  color: "#0e1116",
  transparent: true,
  opacity: 0.85,
});

/**
 * A single sagging wire between two points, breathing very slightly
 * in the wind. The sag point is recomputed each frame — cheap, since
 * each wire is only ~14 segments.
 */
export function WireSpan({ from, to, sag = 0.7, phase = 0 }: WireSpanProps) {
  const lineRef = useRef<THREE.Line>(null);

  const { geometry, curve, mid } = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const m = a.clone().lerp(b, 0.5);
    m.y -= sag;
    const c = new THREE.QuadraticBezierCurve3(a, m, b);
    const geo = new THREE.BufferGeometry().setFromPoints(c.getPoints(14));
    return { geometry: geo, curve: c, mid: m };
  }, [from, to, sag]);

  const baseY = useMemo(() => mid.y, [mid]);

  useFrame((state) => {
    // wind breathes through the wires
    const t = state.clock.elapsedTime;
    curve.v1.y = baseY + Math.sin(t * 0.9 + phase) * 0.045 + Math.sin(t * 2.1 + phase * 2.0) * 0.015;
    const pts = curve.getPoints(14);
    const pos = geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pts.length; i++) pos.setXYZ(i, pts[i].x, pts[i].y, pts[i].z);
    pos.needsUpdate = true;
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const L = "line" as any;
  return <L ref={lineRef} geometry={geometry} material={wireMat} />;
}

interface ElectricPoleProps {
  position: [number, number, number];
}

/**
 * The concrete poles that stitch every Indian street to the sky.
 */
export default function ElectricPole({ position }: ElectricPoleProps) {
  return (
    <group position={position}>
      <mesh position={[0, 3.5, 0]} material={metalDark}>
        <cylinderGeometry args={[0.09, 0.13, 7, 8]} />
      </mesh>
      {/* crossarms */}
      <mesh position={[0, 6.4, 0]} rotation-z={Math.PI / 2} material={metalDark}>
        <boxGeometry args={[0.09, 1.6, 0.09]} />
      </mesh>
      <mesh position={[0, 5.9, 0]} rotation-z={Math.PI / 2} material={metalDark}>
        <boxGeometry args={[0.09, 1.2, 0.09]} />
      </mesh>
    </group>
  );
}
