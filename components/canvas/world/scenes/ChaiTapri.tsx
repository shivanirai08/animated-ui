"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Silhouette from "../../life/Silhouette";
import SleepingDog from "../../life/SleepingDog";
import Steam from "../../life/Steam";
import { Bench } from "../props";
import { woodDark, metalDark } from "../materials";
import { atmo } from "@/lib/atmosphere";

/**
 * Scene Four — Chai Tapri. The heart.
 *
 * A small stall glowing under a tarpaulin, one bare bulb swinging
 * gently, the chaiwala working, strangers standing together because
 * the rain decided they should. A dog sleeps under the bench.
 * The visitor should instinctively slow down here.
 */
export default function ChaiTapri() {
  const bulb = useRef<THREE.Group>(null);
  const bulbLight = useRef<THREE.PointLight>(null);
  const bulbMat = useRef<THREE.MeshBasicMaterial>(null);
  const chaiwala = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // the bulb swings a little in the wind blowing through the stall
    if (bulb.current) {
      bulb.current.rotation.z = Math.sin(t * 1.1) * 0.07 + Math.sin(t * 2.7) * 0.02;
      bulb.current.rotation.x = Math.sin(t * 0.8 + 1) * 0.05;
    }
    const night = 0.5 + atmo.darkness * 0.6;
    const hum = 1 + Math.sin(t * 11) * 0.02 + Math.sin(t * 31) * 0.012;
    if (bulbLight.current) bulbLight.current.intensity = 10 * night * hum;
    if (bulbMat.current) bulbMat.current.color.setHSL(0.09, 0.9, 0.55 * night * hum);
    // the chaiwala never stops working — pouring, turning, serving
    if (chaiwala.current) {
      chaiwala.current.rotation.y = Math.sin(t * 0.35) * 0.5;
      chaiwala.current.position.x = Math.sin(t * 0.22) * 0.15;
    }
  });

  // rotated so the counter and tarp open toward the road
  return (
    <group position={[-6.4, 0, -138]} rotation-y={Math.PI / 2 + 0.1}>
      {/* the stall: wooden cabin with a tarp leaning over the street */}
      <group>
        {/* cabin */}
        <mesh position={[0, 1.1, -0.6]} material={woodDark}>
          <boxGeometry args={[3.4, 2.2, 1.6]} />
        </mesh>
        {/* counter */}
        <mesh position={[0, 0.95, 0.45]} material={woodDark}>
          <boxGeometry args={[3.4, 0.09, 0.7]} />
        </mesh>
        {/* tarp roof reaching over the customers */}
        <mesh position={[0, 2.5, 0.9]} rotation-x={0.18}>
          <boxGeometry args={[4.4, 0.05, 3.2]} />
          <meshLambertMaterial color="#2e3a44" />
        </mesh>
        {/* bamboo poles holding the tarp */}
        {[-2.0, 2.0].map((x) => (
          <mesh key={x} position={[x, 1.35, 2.2]} material={metalDark}>
            <cylinderGeometry args={[0.035, 0.035, 2.7, 6]} />
          </mesh>
        ))}
        {/* stacked glasses & big pateela implied by small forms */}
        <mesh position={[-1.1, 1.12, 0.3]} material={metalDark}>
          <cylinderGeometry args={[0.16, 0.13, 0.22, 10]} />
        </mesh>
        <mesh position={[-0.7, 1.08, 0.4]} material={metalDark}>
          <boxGeometry args={[0.3, 0.14, 0.2]} />
        </mesh>
      </group>

      {/* the bulb on its wire */}
      <group ref={bulb} position={[0, 2.42, 0.7]}>
        <mesh position={[0, -0.18, 0]}>
          <cylinderGeometry args={[0.006, 0.006, 0.36, 4]} />
          <meshBasicMaterial color="#0d0f12" />
        </mesh>
        <mesh position={[0, -0.42, 0]}>
          <sphereGeometry args={[0.07, 10, 8]} />
          <meshBasicMaterial ref={bulbMat} color="#ffb45e" />
        </mesh>
        <pointLight
          ref={bulbLight}
          position={[0, -0.45, 0]}
          color="#ff9c42"
          intensity={10}
          distance={12}
          decay={1.8}
        />
      </group>

      {/* the chaiwala, always in motion behind the counter */}
      <group ref={chaiwala} position={[0.2, 0, -0.1]}>
        <Silhouette position={[0, 0, 0]} seed={61} energy={1.3} rotation={0.2} />
      </group>

      {/* steam off the pateela — the smell almost feels real */}
      <Steam position={[-0.7, 1.25, 0.4]} count={7} scale={0.8} />
      <Steam position={[0.6, 1.15, 0.35]} count={4} scale={0.5} />

      {/* strangers the rain gathered */}
      <Silhouette position={[-1.5, 0, 1.6]} seed={67} rotation={2.6} energy={0.6} />
      <Silhouette position={[0.3, 0, 1.9]} seed={71} rotation={3.3} energy={0.5} />
      <Silhouette position={[1.6, 0, 1.4]} seed={73} rotation={2.2} energy={0.8} umbrella umbrellaColor="#332a2e" />

      {/* the bench, and the dog who found the perfect spot */}
      <Bench position={[2.6, 0, 1.9]} rotation={0.4} />
      <SleepingDog position={[2.5, 0, 2.35]} rotation={1.2} />

      {/* light spilling onto the wet road */}
      <pointLight position={[0.5, 0.7, 3.2]} color="#c97a35" intensity={2.2} distance={7} decay={2} />
    </group>
  );
}
