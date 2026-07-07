"use client";

import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { atmo } from "@/lib/atmosphere";
import { warmMaterials } from "../world/materials";

const fogColor = new THREE.Color();
const fogEarly = new THREE.Color("#8a9bb0");
const fogLate = new THREE.Color("#6a7d94");

/**
 * Monsoon evening atmosphere — readable at 4–6pm, gently deepening
 * toward the end of the walk but never turning into night.
 */
export default function AtmosphereController() {
  const { gl, scene } = useThree();

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);

    atmo.flash = Math.max(0, atmo.flash - delta * (1.2 + atmo.flash));

    // brighter base exposure for an overcast evening
    gl.toneMappingExposure =
      atmo.reveal * (1.35 - atmo.darkness * 0.15) + atmo.flash * 0.25;

    const fog = scene.fog as THREE.FogExp2 | null;
    if (fog) {
      fogColor.lerpColors(fogEarly, fogLate, atmo.darkness);
      fogColor.lerp(new THREE.Color("#b0c0d4"), Math.min(atmo.flash * 0.25, 0.4));
      fog.color.copy(fogColor);
      // lighter fog — visibility stays good through the evening
      fog.density = 0.014 + (1 - atmo.reveal) * 0.025 + atmo.darkness * 0.003;
    }

    const t = state.clock.elapsedTime;
    const glow = 0.65 + atmo.darkness * 0.35;
    warmMaterials.dim.color.setHSL(0.085, 0.65, 0.32 * glow + Math.sin(t * 1.7) * 0.004);
    warmMaterials.warm.color.setHSL(0.09, 0.75, 0.48 * glow + Math.sin(t * 2.3 + 5) * 0.006);
    warmMaterials.bright.color.setHSL(0.095, 0.82, 0.58 * glow + Math.sin(t * 2.9 + 9) * 0.008);
  });

  return null;
}
