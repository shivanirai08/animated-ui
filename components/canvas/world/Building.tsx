"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { seeded } from "@/lib/rand";
import {
  wallMaterials,
  paintedMaterials,
  roofMaterial,
  concreteDark,
  warmMaterials,
  darkWindow,
  metalDark,
} from "./materials";

interface BuildingProps {
  position: [number, number, number];
  seed: number;
  /** which way the facade faces: 1 = toward +x (west side), -1 = toward -x */
  face?: 1 | -1;
  floors?: number;
  width?: number;
  depth?: number;
  /** fraction of windows that are lit */
  litness?: number;
}

/**
 * An old Indian house, grown rather than designed.
 *
 * Every building is deterministic from its seed — slightly crooked,
 * slightly different height, water tank or not, balcony or not —
 * so the town is imperfect but permanent.
 */
export default function Building({
  position,
  seed,
  face = 1,
  floors,
  width = 6,
  depth = 6,
  litness = 0.5,
}: BuildingProps) {
  const data = useMemo(() => {
    const rnd = seeded(seed);
    const f = floors ?? 2 + Math.floor(rnd() * 2);
    const floorH = 2.6 + rnd() * 0.4;
    const h = f * floorH;
    const painted = rnd() < 0.45;
    const wall = painted
      ? paintedMaterials[Math.floor(rnd() * paintedMaterials.length)]
      : wallMaterials[Math.floor(rnd() * wallMaterials.length)];
    const lean = (rnd() - 0.5) * 0.03;

    // windows on the street-facing facade
    const cols = Math.max(2, Math.floor(width / 2.4));
    const windows: {
      x: number;
      y: number;
      lit: "dim" | "warm" | "bright" | "dark";
      w: number;
      hh: number;
    }[] = [];
    for (let fl = 0; fl < f; fl++) {
      for (let c = 0; c < cols; c++) {
        if (rnd() < 0.12) continue; // a wall where a window might have been
        const isLit = rnd() < litness;
        const kind = !isLit
          ? "dark"
          : rnd() < 0.3
            ? "dim"
            : rnd() < 0.72
              ? "warm"
              : "bright";
        windows.push({
          x: -width / 2 + (c + 0.5) * (width / cols) + (rnd() - 0.5) * 0.2,
          y: fl * floorH + floorH * 0.55,
          lit: kind,
          w: 0.7 + rnd() * 0.35,
          hh: 0.9 + rnd() * 0.4,
        });
      }
    }

    const hasTank = rnd() < 0.55;
    const hasBalcony = f >= 2 && rnd() < 0.6;
    const balconyFloor = 1 + Math.floor(rnd() * (f - 1));
    const hasParapet = rnd() < 0.7;

    return { f, floorH, h, wall, lean, windows, hasTank, hasBalcony, balconyFloor, hasParapet };
  }, [seed, floors, width, litness]);

  const windowMat = (kind: string) =>
    kind === "dark"
      ? darkWindow
      : warmMaterials[kind as keyof typeof warmMaterials];

  return (
    <group position={position} rotation-z={data.lean} rotation-y={face === 1 ? 0 : Math.PI}>
      {/* body */}
      <mesh position={[0, data.h / 2, 0]} material={data.wall}>
        <boxGeometry args={[width, data.h, depth]} />
      </mesh>

      {/* flat roof slab overhanging slightly */}
      <mesh position={[0, data.h + 0.08, 0]} material={roofMaterial}>
        <boxGeometry args={[width + 0.35, 0.16, depth + 0.35]} />
      </mesh>

      {data.hasParapet && (
        <mesh position={[0, data.h + 0.4, 0]} material={data.wall}>
          <boxGeometry args={[width + 0.1, 0.5, depth + 0.1]} />
        </mesh>
      )}

      {/* windows sit just proud of the facade */}
      {data.windows.map((w, i) => (
        <group key={i} position={[w.x, w.y, depth / 2 + 0.02]}>
          <mesh material={windowMat(w.lit)}>
            <planeGeometry args={[w.w, w.hh]} />
          </mesh>
          {/* lintel above every window — old construction */}
          <mesh position={[0, w.hh / 2 + 0.09, 0.02]} material={concreteDark}>
            <boxGeometry args={[w.w + 0.25, 0.12, 0.08]} />
          </mesh>
        </group>
      ))}

      {/* balcony with thin railing */}
      {data.hasBalcony && (
        <group position={[0, data.balconyFloor * data.floorH, depth / 2 + 0.55]}>
          <mesh material={concreteDark}>
            <boxGeometry args={[width * 0.55, 0.12, 1.1]} />
          </mesh>
          <mesh position={[0, 0.45, 0.5]} material={metalDark}>
            <boxGeometry args={[width * 0.55, 0.04, 0.03]} />
          </mesh>
          {[-1, -0.5, 0, 0.5, 1].map((t) => (
            <mesh key={t} position={[t * width * 0.26, 0.24, 0.5]} material={metalDark}>
              <boxGeometry args={[0.03, 0.45, 0.03]} />
            </mesh>
          ))}
        </group>
      )}

      {/* the water tank every Indian rooftop has */}
      {data.hasTank && (
        <mesh position={[width * 0.25, data.h + 0.75, -depth * 0.2]} material={metalDark}>
          <cylinderGeometry args={[0.55, 0.55, 1.1, 10]} />
        </mesh>
      )}
    </group>
  );
}
