"use client";

import { useMemo } from "react";
import WetRoad from "./WetRoad";
import Building from "./Building";
import StreetLamp from "./StreetLamp";
import ElectricPole, { WireSpan } from "./ElectricPole";
import Tree from "./Tree";
import HangingClothes from "../life/HangingClothes";
import { Scooter } from "./props";
import Ghar from "./scenes/Ghar";
import Gali from "./scenes/Gali";
import BusStop from "./scenes/BusStop";
import ChaiTapri from "./scenes/ChaiTapri";
import OpenRoad from "./scenes/OpenRoad";
import OfficeBuilding from "./scenes/OfficeBuilding";
import { seeded } from "@/lib/rand";

/**
 * The whole town, laid out along one street running into -z.
 *
 * Generated houses fill the gaps between the six authored scenes.
 * Gaps in the rows are deliberate — the scenes were there first,
 * the town grew around them.
 */

interface Lot {
  x: number;
  z: number;
  seed: number;
  rot: number;
  width: number;
  depth: number;
  litness: number;
}

function useLots() {
  return useMemo(() => {
    const lots: Lot[] = [];
    const rnd = seeded(2024);

    const skip = (side: "L" | "R", z: number) => {
      if (side === "L" && z < -16 && z > -32) return true; // Ghar
      if (side === "R" && z < -58 && z > -74) return true; // window child's house
      if (side === "R" && z < -92 && z > -108) return true; // the bus stop shelter
      if (side === "L" && z < -129 && z > -147) return true; // the chai tapri
      if (z < -156 && z > -206) return true; // open road breathes
      if (side === "R" && z < -206 && z > -224) return true; // the office tower
      return false;
    };

    for (let z = 14; z > -156; z -= 9.5) {
      for (const side of ["L", "R"] as const) {
        const zz = z + (rnd() - 0.5) * 2.5;
        if (skip(side, zz)) continue;
        if (rnd() < 0.12) continue; // an empty plot, a story untold
        lots.push({
          x: side === "L" ? -9.4 - rnd() * 1.4 : 9.4 + rnd() * 1.4,
          z: zz,
          seed: Math.floor(rnd() * 10000),
          rot: side === "L" ? Math.PI / 2 : -Math.PI / 2,
          width: 5 + rnd() * 2.5,
          depth: 5 + rnd() * 2,
          litness: 0.35 + rnd() * 0.4,
        });
      }
    }

    // the far end of town, framing the office
    lots.push(
      { x: -9.6, z: -212, seed: 771, rot: Math.PI / 2, width: 6, depth: 6, litness: 0.3 },
      { x: -10.2, z: -226, seed: 772, rot: Math.PI / 2, width: 5.5, depth: 6, litness: 0.25 },
      { x: 10.0, z: -234, seed: 773, rot: -Math.PI / 2, width: 6, depth: 5, litness: 0.2 }
    );

    return lots;
  }, []);
}

const POLE_ZS = [12, -13, -38, -63, -88, -113, -138, -163, -188, -213, -238];

export default function Town() {
  const lots = useLots();

  return (
    <group>
      <WetRoad />

      {/* houses face the street: facades rotated toward the road */}
      {lots.map((lot, i) => (
        <group key={i} position={[lot.x, 0, lot.z]} rotation-y={lot.rot}>
          <Building
            position={[0, 0, 0]}
            seed={lot.seed}
            width={lot.width}
            depth={lot.depth}
            litness={lot.litness}
          />
        </group>
      ))}

      {/* street lamps — a few carry true light near the emotional stops */}
      <StreetLamp position={[-4.9, 0, 4]} seed={2} />
      <group position={[4.9, 0, -18]} rotation-y={Math.PI}>
        <StreetLamp position={[0, 0, 0]} seed={3} />
      </group>
      <StreetLamp position={[-4.9, 0, -40]} seed={5} />
      <StreetLamp position={[-4.9, 0, -62]} seed={7} withLight />
      <group rotation-y={Math.PI} position={[4.9, 0, -84]}>
        <StreetLamp position={[0, 0, 0]} seed={11} />
      </group>
      <group rotation-y={Math.PI} position={[4.9, 0, -104]}>
        <StreetLamp position={[0, 0, 0]} seed={13} withLight />
      </group>
      <StreetLamp position={[-4.9, 0, -122]} seed={17} flickery />
      <group rotation-y={Math.PI} position={[4.9, 0, -144]}>
        <StreetLamp position={[0, 0, 0]} seed={19} />
      </group>
      <StreetLamp position={[-4.9, 0, -166]} seed={23} withLight flickery />
      <group rotation-y={Math.PI} position={[4.9, 0, -190]}>
        <StreetLamp position={[0, 0, 0]} seed={29} />
      </group>
      <StreetLamp position={[-4.9, 0, -204]} seed={31} />
      <group rotation-y={Math.PI} position={[4.9, 0, -230]}>
        <StreetLamp position={[0, 0, 0]} seed={37} />
      </group>

      {/* electric poles stitching the street to the sky */}
      {POLE_ZS.map((z) => (
        <ElectricPole key={z} position={[5.9, 0, z]} />
      ))}
      {POLE_ZS.slice(0, -1).map((z, i) => {
        const z2 = POLE_ZS[i + 1];
        return (
          <group key={`w${z}`}>
            <WireSpan from={[5.2, 6.4, z]} to={[5.2, 6.4, z2]} sag={0.8} phase={i * 1.7} />
            <WireSpan from={[6.6, 6.4, z]} to={[6.6, 6.4, z2]} sag={0.7} phase={i * 2.3 + 1} />
            <WireSpan from={[5.9, 5.9, z]} to={[5.9, 5.9, z2]} sag={0.9} phase={i * 1.1 + 2} />
          </group>
        );
      })}
      {/* messy wires crossing the road to rooftops */}
      <WireSpan from={[5.9, 5.9, -38]} to={[-9, 7.2, -41]} sag={1.3} phase={4} />
      <WireSpan from={[5.9, 5.9, -113]} to={[-9.2, 6.8, -116]} sag={1.5} phase={7} />
      <WireSpan from={[5.9, 5.9, -213]} to={[-9.4, 7.5, -215]} sag={1.4} phase={9} />

      {/* trees and roadside plants growing where they please */}
      <Tree position={[-7.6, 0, -46]} seed={101} scale={1.1} />
      <Tree position={[7.8, 0, -32]} seed={103} scale={0.9} />
      <Tree position={[8.0, 0, -90]} seed={107} scale={1.2} />
      <Tree position={[-7.8, 0, -112]} seed={109} scale={1.0} />
      <Tree position={[-6.9, 0, -55]} seed={113} scale={0.3} />
      <Tree position={[6.7, 0, -95]} seed={127} scale={0.28} />
      <Tree position={[-6.8, 0, -131]} seed={131} scale={0.32} />

      {/* clothes someone forgot to bring in */}
      <group position={[-8.4, 3.2, -50]} rotation-y={Math.PI / 2}>
        <HangingClothes position={[0, 0, 0]} seed={141} width={2.2} />
      </group>
      <group position={[8.4, 3.0, -86]} rotation-y={Math.PI / 2}>
        <HangingClothes position={[0, 0, 0]} seed={143} width={2.6} />
      </group>
      <group position={[-8.5, 2.9, -118]} rotation-y={Math.PI / 2}>
        <HangingClothes position={[0, 0, 0]} seed={147} width={2.0} />
      </group>

      {/* parked two-wheelers waiting out the rain */}
      <Scooter position={[4.4, 0, -16]} rotation={1.4} color="#46525a" />
      <Scooter position={[-4.5, 0, -70]} rotation={-1.8} color="#4f4438" />
      <Scooter position={[-4.3, 0, -133]} rotation={1.2} color="#3d4a52" />
      <Scooter position={[-4.7, 0, -135]} rotation={1.35} color="#52463f" />

      {/* the six moments */}
      <Ghar />
      <Gali />
      <BusStop />
      <ChaiTapri />
      <OpenRoad />
      <OfficeBuilding />
    </group>
  );
}
