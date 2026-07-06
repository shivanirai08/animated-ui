"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { atmo } from "@/lib/atmosphere";

/**
 * The protagonist.
 *
 * ~2400 thin streaks live in a volume that follows the camera,
 * wrapping seamlessly on the GPU so rain exists everywhere the
 * visitor goes. Streaks are lit faintly from below near warm light
 * and fade with distance into the fog, so the rain belongs to the
 * world instead of sitting on the lens.
 */

const COUNT = 2400;
const BOX = { x: 44, y: 26, z: 52 };

const vertex = /* glsl */ `
  uniform float uTime;
  uniform vec3 uCam;
  attribute vec3 aOffset;
  attribute float aSpeed;
  attribute float aAlpha;
  varying float vAlpha;
  varying float vDist;

  void main() {
    vec3 box = vec3(${BOX.x}.0, ${BOX.y}.0, ${BOX.z}.0);

    // fall, then wrap inside a camera-centred volume
    vec3 p = aOffset;
    p.y = mod(p.y - uTime * aSpeed, box.y);
    p.x = mod(p.x + uCam.x + box.x * 0.5, box.x) - box.x * 0.5;
    p.z = mod(p.z + uCam.z + box.z * 0.5, box.z) - box.z * 0.5;
    vec3 world = vec3(uCam.x + p.x, p.y, uCam.z + p.z);

    // slight wind shear
    world.x += (world.y / box.y) * 0.6;

    // stretch the quad vertically into a streak
    vec3 vert = position;
    vert.y *= mix(0.45, 1.0, aSpeed / 26.0);

    // cheap cylindrical billboard around Y
    vec3 toCam = normalize(vec3(uCam.x, world.y, uCam.z) - world);
    vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), toCam));
    vec3 finalPos = world + right * vert.x + vec3(0.0, vert.y, 0.0);

    vDist = distance(finalPos.xz, uCam.xz);
    vAlpha = aAlpha;

    gl_Position = projectionMatrix * viewMatrix * vec4(finalPos, 1.0);
  }
`;

const fragment = /* glsl */ `
  uniform float uFlash;
  varying float vAlpha;
  varying float vDist;

  void main() {
    // rain dissolves into the fog with distance
    float fade = smoothstep(46.0, 6.0, vDist);
    vec3 col = vec3(0.62, 0.7, 0.82) + vec3(0.3) * uFlash;
    gl_FragColor = vec4(col, vAlpha * fade * 0.34);
  }
`;

export default function Rain() {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const { geometry, uniforms } = useMemo(() => {
    const base = new THREE.PlaneGeometry(0.016, 0.55);
    const geo = new THREE.InstancedBufferGeometry();
    geo.index = base.index;
    geo.attributes.position = base.attributes.position;
    geo.attributes.uv = base.attributes.uv;

    const offsets = new Float32Array(COUNT * 3);
    const speeds = new Float32Array(COUNT);
    const alphas = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      offsets[i * 3] = (Math.random() - 0.5) * BOX.x;
      offsets[i * 3 + 1] = Math.random() * BOX.y;
      offsets[i * 3 + 2] = (Math.random() - 0.5) * BOX.z;
      speeds[i] = 15 + Math.random() * 11;
      alphas[i] = 0.35 + Math.random() * 0.65;
    }
    geo.setAttribute("aOffset", new THREE.InstancedBufferAttribute(offsets, 3));
    geo.setAttribute("aSpeed", new THREE.InstancedBufferAttribute(speeds, 1));
    geo.setAttribute("aAlpha", new THREE.InstancedBufferAttribute(alphas, 1));
    geo.instanceCount = COUNT;

    return {
      geometry: geo,
      uniforms: {
        uTime: { value: 0 },
        uCam: { value: new THREE.Vector3() },
        uFlash: { value: 0 },
      },
    };
  }, []);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uCam.value.copy(state.camera.position);
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
