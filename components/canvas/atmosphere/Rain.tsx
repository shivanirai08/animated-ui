"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { atmo } from "@/lib/atmosphere";

/**
 * Rain in a camera-relative volume.
 *
 * Drops fall straight down (world Y only) with no wind drift or Z motion,
 * so scrolling through the street never makes rain appear to surge
 * forward or backward. The volume follows the camera on X/Z.
 */

const COUNT = 3200;
const RAIN_HEIGHT = 24;
const SPREAD = { x: 34, z: 18 };

const vertex = /* glsl */ `
  uniform float uTime;
  uniform vec3 uCameraPos;
  attribute vec3 aWorld;   // offset from camera: x, phase, z
  attribute float aSpeed;
  attribute float aAlpha;
  attribute float aLen;
  varying float vAlpha;

  void main() {
    // steady top-to-bottom fall — no horizontal drift
    float y = mod(aWorld.y - uTime * aSpeed, ${RAIN_HEIGHT}.0);

    vec3 world = vec3(
      uCameraPos.x + aWorld.x,
      y,
      uCameraPos.z + aWorld.z
    );

    // pure vertical streaks
    vec3 down = vec3(0.0, -1.0, 0.0);
    vec3 right = vec3(1.0, 0.0, 0.0);

    vec3 vert = position;
    vert.y *= aLen;

    vec3 finalPos = world + right * vert.x + down * vert.y;

    gl_Position = projectionMatrix * viewMatrix * vec4(finalPos, 1.0);
    vAlpha = aAlpha;
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
  const cameraPos = useMemo(() => ({ value: new THREE.Vector3() }), []);

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
      worlds[i * 3] = (Math.random() - 0.5) * SPREAD.x;
      worlds[i * 3 + 1] = Math.random() * RAIN_HEIGHT;
      worlds[i * 3 + 2] = (Math.random() - 0.5) * SPREAD.z;
      speeds[i] = 11 + Math.random() * 7;
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
        uCameraPos: cameraPos,
      },
    };
  }, [cameraPos]);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uFlash.value = atmo.flash;
    cameraPos.value.copy(state.camera.position);
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
