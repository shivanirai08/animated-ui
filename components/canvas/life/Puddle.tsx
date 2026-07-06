"use client";

import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * A puddle alive with rain — expanding rings appear at pseudo-random
 * points and fade, drawn entirely in the fragment shader.
 */

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  float ring(vec2 uv, vec2 center, float t) {
    float d = distance(uv, center);
    float radius = t * 0.34;
    float width = 0.012 + t * 0.02;
    float band = smoothstep(width, 0.0, abs(d - radius));
    return band * (1.0 - t);
  }

  void main() {
    vec2 uv = vUv;
    float glow = 0.0;

    // several drop sites, each on its own clock
    for (int i = 0; i < 5; i++) {
      float fi = float(i);
      float cycle = 1.6 + hash(vec2(fi, 3.7)) * 1.4;
      float local = mod(uTime + fi * 13.7, cycle) / cycle;
      float slot = floor((uTime + fi * 13.7) / cycle);
      vec2 c = vec2(hash(vec2(slot, fi)), hash(vec2(fi, slot))) * 0.7 + 0.15;
      glow += ring(uv, c, local);
    }

    // circular puddle mask, soft edged
    float mask = smoothstep(0.5, 0.42, distance(uv, vec2(0.5)));
    vec3 water = vec3(0.055, 0.07, 0.1);
    vec3 col = water + vec3(0.16, 0.19, 0.24) * glow;
    gl_FragColor = vec4(col, mask * 0.55);
  }
`;

interface PuddleProps {
  position: [number, number, number];
  size?: number;
}

export default function Puddle({ position, size = 1.6 }: PuddleProps) {
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh position={position} rotation-x={-Math.PI / 2}>
      <planeGeometry args={[size, size]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertex}
        fragmentShader={fragment}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
