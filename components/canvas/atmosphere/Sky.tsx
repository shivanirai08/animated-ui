"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { atmo } from "@/lib/atmosphere";

const vertex = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragment = /* glsl */ `
  uniform float uDarkness;
  uniform float uFlash;
  uniform float uTime;
  varying vec3 vDir;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }

  void main() {
    float h = clamp(vDir.y, 0.0, 1.0);
    float below = smoothstep(0.02, -0.2, vDir.y);

    // monsoon evening ~5pm: soft grey-blue sky, warm horizon band
    vec3 zenithEarly  = vec3(0.42, 0.52, 0.65);
    vec3 horizonEarly = vec3(0.72, 0.62, 0.52);
    vec3 zenithLate   = vec3(0.32, 0.40, 0.55);
    vec3 horizonLate  = vec3(0.55, 0.48, 0.42);

    vec3 zenith = mix(zenithEarly, zenithLate, uDarkness);
    vec3 horizon = mix(horizonEarly, horizonLate, uDarkness);

    vec3 sky = mix(horizon, zenith, pow(h, 0.48));

    // overcast cloud mottling
    vec2 uv = vDir.xz / max(vDir.y + 0.18, 0.08);
    float clouds = noise(uv * 1.2 + uTime * 0.006) * 0.55
                 + noise(uv * 2.8 - uTime * 0.009) * 0.35;
    sky *= 0.88 + clouds * 0.22;

    sky += vec3(0.55, 0.62, 0.78) * uFlash * (0.3 + clouds * 0.7) * pow(1.0 - h, 0.35);

    vec3 fogFloor = mix(vec3(0.45, 0.48, 0.55), vec3(0.32, 0.36, 0.44), uDarkness);
    sky = mix(sky, fogFloor, below);

    gl_FragColor = vec4(sky, 1.0);
  }
`;

export default function Sky() {
  const mesh = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(
    () => ({
      uDarkness: { value: 0 },
      uFlash: { value: 0 },
      uTime: { value: 0 },
    }),
    []
  );

  useFrame((state) => {
    uniforms.uDarkness.value = atmo.darkness;
    uniforms.uFlash.value = atmo.flash;
    uniforms.uTime.value = state.clock.elapsedTime;
    mesh.current?.position.copy(state.camera.position);
  });

  return (
    <mesh ref={mesh} frustumCulled={false}>
      <sphereGeometry args={[190, 32, 24]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertex}
        fragmentShader={fragment}
        side={THREE.BackSide}
        depthWrite={false}
        fog={false}
      />
    </mesh>
  );
}
