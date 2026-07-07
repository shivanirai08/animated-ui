"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Building from "../Building";
import Silhouette from "../../life/Silhouette";
import Puddle from "../../life/Puddle";
import PaperBoat from "../../life/PaperBoat";
import { warmMaterials, skinMaterial } from "../materials";

/**
 * Scene Two — Gali. Childhood.
 *
 * Children own the street: one jumps between puddles, one follows a
 * paper boat down the gutter. Across the lane, a third child watches
 * from behind glass — a hand resting where the rain can't reach.
 * Two childhoods, a few metres apart.
 */

function JumpingChild({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    // runs a small loop between puddles, jumping as it goes
    const loop = (t * 0.35) % (Math.PI * 2);
    ref.current.position.x = position[0] + Math.sin(loop) * 1.6;
    ref.current.position.z = position[2] + Math.cos(loop * 2) * 0.9;
    const hop = Math.abs(Math.sin(t * 2.6));
    ref.current.position.y = position[1] + hop * hop * 0.22;
    ref.current.rotation.y = loop + Math.PI / 2;
  });

  return (
    <group ref={ref} position={position}>
      <Silhouette position={[0, 0, 0]} seed={23} small energy={1.6} />
    </group>
  );
}

function BoatChild({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    // crouched, shuffling along the gutter after the boat
    ref.current.position.z = position[2] - ((t * 0.55) % 14);
    ref.current.position.y = position[1] - 0.18 + Math.sin(t * 3.1) * 0.02;
  });

  return (
    <group ref={ref} position={position}>
      <Silhouette position={[0, 0, 0]} seed={29} small energy={1.2} rotation={Math.PI} />
    </group>
  );
}

export default function Gali() {
  const handRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    // the window child's hand shifts against the glass, slowly
    if (handRef.current) {
      const t = state.clock.elapsedTime;
      handRef.current.position.y = 0.07 + Math.sin(t * 0.4) * 0.04;
    }
  });

  return (
    <group position={[0, 0, -62]}>
      {/* puddles the children live in */}
      <Puddle position={[1.6, 0.01, 1]} size={1.8} />
      <Puddle position={[-0.8, 0.01, -2]} size={1.4} />
      <Puddle position={[2.4, 0.01, -3.5]} size={1.2} />

      <JumpingChild position={[1.2, 0, -0.5]} />
      <BoatChild position={[3.6, 0, 4]} />

      {/* the boat drifts along the road's edge and away into fog */}
      <PaperBoat start={[4.1, 0.04, 4]} end={[4.1, 0.04, -16]} duration={30} />

      {/* the window child's house, close to the lane, facing the visitor */}
      <group position={[7.4, 0, -4]}>
        <Building position={[0, 0, 0]} seed={57} floors={1} width={5} depth={5} litness={0.4} />
        {/* their window — lit, small, and someone stands very still in it */}
        <group position={[-0.9, 1.55, 2.56]}>
          <mesh material={warmMaterials.warm}>
            <planeGeometry args={[1.1, 1.15]} />
          </mesh>
          {/* the child, a dark stillness against the light */}
          <Silhouette position={[0.1, -0.95, 0.12]} seed={31} small energy={0.25} />
          {/* the hand resting where the rain can't reach */}
          <mesh ref={handRef} position={[0.28, 0.07, 0.02]} material={skinMaterial}>
            <circleGeometry args={[0.07, 8]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
