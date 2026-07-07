"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { atmo } from "@/lib/atmosphere";

/**
 * Rain in world space.
 *
 * Each drop has a fixed X/Z on the street. Only Y changes over time.
 * The rain never follows the camera — it falls through the world the
 * visitor moves through, the way real rain does.
 */

const COUNT = 3200;
const RAIN_TOP = 24;
const WORLD = { x: 36, zMin: -270, zMax: 20 };

const vertex = /* glsl */ `
  uniform float uTime;
  attribute vec3 aWorld;   // fixed world x, y-offset, z
  attribute float aSpeed;
  attribute float aAlpha;
  attribute float aLen;
  varying float vAlpha;

  void main() {
    // fall in world space — no camera coupling on xz
    float y = mod(aWorld.y - uTime * aSpeed, ${RAIN_TOP}.0);
    vec3 world = vec3(aWorld.x, y, aWorld.z);

    // gentle wind drift (world-space, not screen-space)
    world.x += sin(uTime * 0.7 + aWorld.z * 0.04) * 0.08;

    // streak direction: mostly down, slightly angled by wind
    vec3 down = normalize(vec3(0.06, -1.0, 0.0));
    vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), down));

    vec3 vert = position;
    vert.y *= aLen;

    vec3 finalPos = world + right * vert.x + down * vert.y;

    gl_Position = projectionMatrix * viewMatrix * vec4(finalPos, 1.0);
  }
`;

const fragment = /* glsl */ `
  uniform float uFlash;
  varying float vAlpha;

  void main() {
    vec3 col = vec3(0.72, 0.78, 0.88) + vec3(0.25) * uFlash;
    gl_FragColor = vec4(col, vAlpha * 0.42);
  }
`;

export default function Rain() {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const { geometry, uniforms } = useMemo(() => {
    const base = new THREE.PlaneGeometry(0.012, 0.65);
    const geo = new THREE.InstancedBufferGeometry();
    geo.index = base.index;
    geo.attributes.position = base.attributes.position;
    geo.attributes.uv = base.attributes.uv;

    const worlds = new Float32Array(COUNT * 3);
    const speeds = new Float32Array(COUNT);
    const alphas = new Float32Array(COUNT);
    const lens = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      worlds[i * 3] = (Math.random() - 0.5) * WORLD.x;
      worlds[i * 3 + 1] = Math.random() * RAIN_TOP;
      worlds[i * 3 + 2] =
        WORLD.zMin + Math.random() * (WORLD.zMax - WORLD.zMin);
      speeds[i] = 10 + Math.random() * 8;
      alphas[i] = 0.4 + Math.random() * 0.6;
      lens[i] = 0.5 + Math.random() * 0.55;
    }

    geo.setAttribute("aWorld", new THREE.InstancedBufferAttribute(worlds, 3));
    geo.setAttribute("aSpeed", new THREE.InstancedBufferAttribute(speeds, 1));
    geo.setAttribute("aAlpha", new THREE.InstancedBufferAttribute(alphas, 1));
    geo.setAttribute("aLen", new THREE.InstancedBufferAttribute(lens, 1));
    geo.instanceCount = COUNT;

    return {
      geometry: geo,
      uniforms: {
        uTime: { value: 0 },
        uFlash: { value: 0 },
      },
    };
  }, []);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uFlash.value = atmo.flash;
  });

  return (
    <mesh geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={vertex}
        fragmentShader={fragment}
        transparent
        depthWrite={false}
        fog={false}
      />
    </mesh>
  );
}
