"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Silhouette from "../../life/Silhouette";
import { concreteDark } from "../materials";
import { atmo } from "@/lib/atmosphere";
import { seeded } from "@/lib/rand";

/**
 * Scene Six — Office Window. Distance.
 *
 * A taller, cooler building than anything else in town. Rows of
 * pale fluorescent windows — and at one of them, a woman watching
 * the rain she cannot be part of today. The journey's quiet ending.
 */
export default function OfficeBuilding() {
  const coolMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: "#9fb4bd" }),
    []
  );
  const herWindowMat = useRef<THREE.MeshBasicMaterial>(null);
  const her = useRef<THREE.Group>(null);

  const windows = useMemo(() => {
    const rnd = seeded(97);
    const list: { z: number; y: number; on: boolean }[] = [];
    for (let fl = 0; fl < 5; fl++) {
      for (let c = 0; c < 4; c++) {
        if (fl === 2 && c === 1) {
          rnd(); // her window lives in this slot — keep the sequence stable
          continue;
        }
        list.push({
          z: -2.7 + c * 1.8,
          y: 1.6 + fl * 2.4,
          on: rnd() < 0.6,
        });
      }
    }
    return list;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const night = 0.5 + atmo.darkness * 0.6;
    // fluorescent: steadier and colder than any home light
    coolMat.color.setHSL(0.52, 0.16, 0.3 * night + Math.sin(t * 40) * 0.004);
    if (herWindowMat.current)
      herWindowMat.current.color.setHSL(0.52, 0.2, 0.36 * night);
    if (her.current) {
      // she is almost still; only the smallest sway, watching
      her.current.rotation.y = Math.sin(t * 0.15) * 0.04;
      her.current.position.y = Math.sin(t * 1.3) * 0.008;
    }
  });

  return (
    <group position={[8.4, 0, -214]} rotation-y={-0.04}>
      {/* the tower — plain, glassy-grey, out of place among old houses */}
      <mesh position={[0, 6.5, 0]} material={concreteDark}>
        <boxGeometry args={[8, 13, 7]} />
      </mesh>
      <mesh position={[0, 13.1, 0]}>
        <boxGeometry args={[8.3, 0.25, 7.3]} />
        <meshLambertMaterial color="#26292e" />
      </mesh>

      {/* the grid of working evenings, facing the street below */}
      {windows.map((w, i) =>
        w.on ? (
          <mesh key={i} position={[-4.03, w.y, w.z]} rotation-y={-Math.PI / 2} material={coolMat}>
            <planeGeometry args={[1.2, 1.4]} />
          </mesh>
        ) : (
          <mesh key={i} position={[-4.03, w.y, w.z]} rotation-y={-Math.PI / 2}>
            <planeGeometry args={[1.2, 1.4]} />
            <meshBasicMaterial color="#11151b" />
          </mesh>
        )
      )}

      {/* her window — third floor, watching the street the visitor walked */}
      <group position={[-4.06, 6.4, -0.9]} rotation-y={-Math.PI / 2}>
        <mesh>
          <planeGeometry args={[1.2, 1.4]} />
          <meshBasicMaterial ref={herWindowMat} color="#c8d8dc" />
        </mesh>
        <group ref={her}>
          <Silhouette position={[0.05, -1.1, 0.14]} seed={89} scale={0.8} energy={0.15} />
        </group>
      </group>

      {/* faint cool light washing the pavement below */}
      <pointLight position={[-5, 5.5, -0.9]} color="#a8c4cf" intensity={2} distance={10} decay={2} />
    </group>
  );
}
