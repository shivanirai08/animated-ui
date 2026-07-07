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
        toneMappingExposure: 0.0,
        powerPreference: "high-performance",
      }}
      camera={{ fov: 55, near: 0.1, far: 220, position: [0, 3.4, 14] }}
      shadows={false}
    >
      <color attach="background" args={["#6a7d94"]} />
      <fogExp2 attach="fog" args={["#8a9bb0", 0.014]} />

      <CameraRig />
      <AtmosphereController />
      <Lightning />

      {/* monsoon evening ~5pm: soft overcast sky + warm low sun */}
      <hemisphereLight args={["#b8c8dc", "#5a5e66", 1.5]} />
      <directionalLight
        position={[-28, 32, 36]}
        intensity={1.15}
        color="#ffd8a8"
      />
      {/* cool fill from the cloud layer above */}
      <directionalLight position={[12, 48, -10]} intensity={0.35} color="#c8d4e4" />
      {/* street-level bounce so people and buildings read clearly */}
      <pointLight position={[0, 4, -80]} intensity={0.6} color="#d4c4b0" distance={120} decay={1.5} />

      <Sky />
      <Rain />
      <Town />
    </Canvas>
  );
}
