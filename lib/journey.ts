import * as THREE from "three";

/**
 * JOURNEY
 *
 * The town is laid out along -Z. The visitor drifts from the edge of
 * town (z ≈ 14) to beyond the office (z ≈ -240) over one continuous
 * scroll. Both curves are hand-authored: `path` is where the camera
 * body travels, `gaze` is what it quietly looks at.
 *
 * The camera weaves gently across the street so each emotional stop
 * is approached the way a walking person would approach it — never
 * head-on, never centered like a product shot.
 */

/** Where each scene lives in world space (z) and in scroll progress. */
export const SCENES = {
  arrival: { z: 8, enter: 0.0, exit: 0.08 },
  ghar: { z: -24, enter: 0.09, exit: 0.2 },
  gali: { z: -62, enter: 0.22, exit: 0.34 },
  busStop: { z: -100, enter: 0.36, exit: 0.48 },
  chaiTapri: { z: -138, enter: 0.5, exit: 0.66 }, // widest dwell — the heart
  openRoad: { z: -180, enter: 0.68, exit: 0.8 },
  office: { z: -214, enter: 0.82, exit: 0.92 },
  departure: { z: -244, enter: 0.93, exit: 1.0 },
} as const;

const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

/** Camera body path — a slow dolly weaving down the street. */
export const cameraPath = new THREE.CatmullRomCurve3(
  [
    v(0.0, 3.4, 14), //  arrival, slightly raised, town below
    v(-1.2, 2.9, 2), //  drifting in
    v(-2.6, 2.4, -14), // easing toward the house on the left
    v(-2.2, 2.1, -28), // passing Ghar's window
    v(0.6, 2.0, -44), // crossing to the middle of the gali
    v(1.4, 1.8, -62), // low among the children & puddles
    v(0.4, 2.0, -80), // leaving the lane
    v(2.4, 2.2, -100), // sliding past the bus stop on the right
    v(1.0, 2.1, -120), // road bends toward warmth
    v(-0.6, 1.9, -133), // lingering at the chai tapri
    v(-2.4, 2.0, -147), // pulled away slowly, still looking back
    v(0.0, 2.6, -170), // the town opens
    v(0.8, 3.0, -186), // open road, higher, rain feels bigger
    v(1.8, 3.6, -206), // rising toward the office window
    v(1.2, 4.0, -222), // level with the glass
    v(0.0, 3.4, -244), // drifting out of town
  ],
  false,
  "catmullrom",
  0.5
);

/** Gaze path — what the invisible visitor is drawn to. */
export const gazePath = new THREE.CatmullRomCurve3(
  [
    v(0.0, 2.2, -6), //   the town ahead, wires against the sky
    v(-2.0, 2.0, -16), //  first warm windows
    v(-5.9, 1.9, -21), //  Ghar — the family window on the left
    v(-5.2, 2.0, -26), //  holding the window as we pass
    v(1.5, 1.2, -54), //   down at the gali, the puddles
    v(3.2, 1.4, -66), //   the paper boat drifting, window child beyond
    v(2.0, 1.6, -84), //   the lane opening out
    v(5.2, 1.8, -100), //  the bus stop shelter
    v(3.0, 1.8, -118), //  along the road
    v(-5.6, 1.5, -139), // the chai tapri's glow
    v(-5.2, 1.6, -140), // one last look at the stall
    v(0.0, 2.4, -168), //  the open road ahead
    v(-1.0, 2.6, -192), // a lone figure in the rain
    v(4.3, 6.0, -214), //  up to the office window
    v(4.3, 6.3, -216), //  holding the glass
    v(0.0, 3.0, -260), //  the rain, the mist, nothing more
  ],
  false,
  "catmullrom",
  0.5
);

export interface Caption {
  /** scroll progress window in which this line breathes in and out */
  enter: number;
  exit: number;
  hindi?: string;
  text: string;
}

/**
 * Whispered lines. No narrator, no explanation — just the quietest
 * possible captions, appearing like thoughts.
 */
export const captions: Caption[] = [
  {
    enter: 0.015,
    exit: 0.075,
    text: "The rain is the same. The people are not.",
  },
  {
    enter: 0.115,
    exit: 0.215,
    hindi: "घर",
    text: "For this family, rain means being together.",
  },
  {
    enter: 0.25,
    exit: 0.345,
    hindi: "गली",
    text: "For one child, rain is freedom. For another, it is waiting.",
  },
  {
    enter: 0.415,
    exit: 0.515,
    hindi: "बस स्टॉप",
    text: "Everyone looks at the same rain. Nobody feels the same thing.",
  },
  {
    enter: 0.56,
    exit: 0.68,
    hindi: "चाय तपरी",
    text: "For a few moments, strangers become neighbours.",
  },
  {
    enter: 0.715,
    exit: 0.815,
    hindi: "खुली सड़क",
    text: "Nobody is watching. So, for once, they let the rain in.",
  },
  {
    enter: 0.85,
    exit: 0.93,
    hindi: "दफ़्तर",
    text: "Sometimes rain isn't something we live. Only something we watch.",
  },
  {
    enter: 0.945,
    exit: 0.995,
    text: "The visitor leaves. The town doesn't.",
  },
];

/** Total scrollable height in viewport-heights — sets the pace of the walk. */
export const JOURNEY_LENGTH_VH = 1400;
