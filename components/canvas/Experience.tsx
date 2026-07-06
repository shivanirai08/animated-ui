"use client";

import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import CameraRig from "./CameraRig";
import AtmosphereController from "./atmosphere/AtmosphereController";
import Sky from "./atmosphere/Sky";
import Rain from "./atmosphere/Rain";
import Lightning from "./atmosphere/Lightning";
import Town from "./world/Town";

/**
 * One canvas. One continuous world. No scene cuts.
 */
export default function Experience() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.0, // the intro raises this as the world opens its eyes
        powerPreference: "high-performance",
      }}
      camera={{ fov: 55, near: 0.1, far: 220, position: [0, 3.4, 14] }}
      shadows={false}
    >
      <color attach="background" args={["#0a0f1a"]} />
      <fogExp2 attach="fog" args={["#101a2b", 0.05]} />

      <CameraRig />
      <AtmosphereController />
      <Lightning />

      {/* base light: cold overcast dusk */}
      <hemisphereLight args={["#364963", "#161d29", 1.0]} />
      <directionalLight position={[18, 40, 20]} intensity={0.4} color="#5a6f8f" />

      <Sky />
      <Rain />
      <Town />
    </Canvas>
  );
}
