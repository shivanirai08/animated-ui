"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { cameraPath, gazePath } from "@/lib/journey";
import { useBaarish } from "@/lib/store";
import { atmo } from "@/lib/atmosphere";

const _pos = new THREE.Vector3();
const _gaze = new THREE.Vector3();
const _target = new THREE.Vector3();

/**
 * The camera is a slow cinematic dolly.
 *
 * Scroll progress is damped twice — once by Lenis, once here — so no
 * flick of the wheel can ever produce a snap. A small amount of mouse
 * drift adds parallax, as if the observer is gently turning their head.
 */
export default function CameraRig() {
  const { camera } = useThree();
  const smoothed = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });
  const driftedMouse = useRef({ x: 0, y: 0 });
  const initialised = useRef(false);

  // track the pointer without re-renders
  if (typeof window !== "undefined" && !initialised.current) {
    initialised.current = true;
    window.addEventListener("pointermove", (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    });
  }

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const { progress } = useBaarish.getState();

    // heavy damping: the world takes a breath before it follows you
    smoothed.current = THREE.MathUtils.damp(smoothed.current, progress, 1.6, delta);
    const t = smoothed.current;

    // getPoint (not getPointAt): control points land on exact progress
    // values, and clustered points naturally slow the dolly — the
    // journey dwells where the story dwells
    cameraPath.getPoint(t, _pos);
    gazePath.getPoint(t, _gaze);

    // the head turns slower than the hand moves
    driftedMouse.current.x = THREE.MathUtils.damp(
      driftedMouse.current.x,
      mouse.current.x,
      2.0,
      delta
    );
    driftedMouse.current.y = THREE.MathUtils.damp(
      driftedMouse.current.y,
      mouse.current.y,
      2.0,
      delta
    );

    camera.position.copy(_pos);
    camera.position.x += driftedMouse.current.x * 0.35;
    camera.position.y += -driftedMouse.current.y * 0.22;

    _target.copy(_gaze);
    _target.x += driftedMouse.current.x * 1.1;
    _target.y += -driftedMouse.current.y * 0.6;
    camera.lookAt(_target);

    // dusk deepens as the journey continues
    atmo.darkness = t;
  });

  return null;
}
