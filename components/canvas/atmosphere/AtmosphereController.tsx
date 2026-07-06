"use client";

import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { atmo } from "@/lib/atmosphere";
import { warmMaterials } from "../world/materials";

const fogColor = new THREE.Color();
const fogDusk = new THREE.Color("#16233a");
const fogNight = new THREE.Color("#0b1220");

/**
 * Breathes the global atmosphere every frame:
 * exposure (the intro reveal), fog colour and density (dusk → night),
 * lightning decay, and the slow warming of every lit window in town.
 */
export default function AtmosphereController() {
  const { gl, scene } = useThree();

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);

    // lightning decays like an afterimage
    atmo.flash = Math.max(0, atmo.flash - delta * (1.2 + atmo.flash));

    // the world opening its eyes, then holding steady
    gl.toneMappingExposure = atmo.reveal * (1.05 - atmo.darkness * 0.12) + atmo.flash * 0.35;

    const fog = scene.fog as THREE.FogExp2 | null;
    if (fog) {
      fogColor.lerpColors(fogDusk, fogNight, atmo.darkness);
      // lightning momentarily silvers the mist
      fogColor.lerp(new THREE.Color("#8fa5c8"), Math.min(atmo.flash * 0.35, 0.5));
      fog.color.copy(fogColor);
      // thick during the reveal, settling into humid evening air
      fog.density = 0.026 + (1 - atmo.reveal) * 0.06 + atmo.darkness * 0.004;
    }

    // windows glow warmer as the sky darkens; a faint communal flicker
    const t = state.clock.elapsedTime;
    const glow = 0.55 + atmo.darkness * 0.75;
    warmMaterials.dim.color.setHSL(0.085, 0.72, 0.22 * glow + Math.sin(t * 1.7) * 0.004);
    warmMaterials.warm.color.setHSL(0.09, 0.78, 0.34 * glow + Math.sin(t * 2.3 + 5) * 0.006);
    warmMaterials.bright.color.setHSL(0.095, 0.85, 0.46 * glow + Math.sin(t * 2.9 + 9) * 0.008);
  });

  return null;
}
