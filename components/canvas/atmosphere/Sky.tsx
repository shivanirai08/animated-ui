"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { atmo } from "@/lib/atmosphere";

const vertex = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    // the dome follows the camera so the sky is unreachable
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragment = /* glsl */ `
  uniform float uDarkness;
  uniform float uFlash;
  uniform float uTime;
  varying vec3 vDir;

  // cheap value noise for slow cloud mottling
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

    // dusk: deep storm blue overhead, a bruised warm band at the horizon
    vec3 zenithDusk  = vec3(0.055, 0.085, 0.16);
    vec3 horizonDusk = vec3(0.22, 0.17, 0.16);
    vec3 zenithNight  = vec3(0.02, 0.032, 0.075);
    vec3 horizonNight = vec3(0.07, 0.075, 0.11);

    vec3 zenith = mix(zenithDusk, zenithNight, uDarkness);
    vec3 horizon = mix(horizonDusk, horizonNight, uDarkness);

    vec3 sky = mix(horizon, zenith, pow(h, 0.55));

    // heavy slow-moving cloud cover
    vec2 uv = vDir.xz / max(vDir.y + 0.18, 0.08);
    float clouds = noise(uv * 1.4 + uTime * 0.008) * 0.6
                 + noise(uv * 3.4 - uTime * 0.012) * 0.4;
    sky *= 0.82 + clouds * 0.36;

    // lightning blooms inside the clouds, not on top of them
    sky += vec3(0.55, 0.62, 0.78) * uFlash * (0.35 + clouds * 0.9) * pow(1.0 - h, 0.4);

    // below the horizon the dome sinks into the fog, hiding the seam
    vec3 fogFloor = mix(vec3(0.075, 0.1, 0.155), vec3(0.038, 0.05, 0.085), uDarkness);
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
