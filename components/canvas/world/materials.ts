"use client";

import * as THREE from "three";

/**
 * Shared materials for the whole town.
 *
 * Sharing keeps draw state small and lets the atmosphere controller
 * warm every window in town with three writes per frame.
 */
export const warmMaterials = {
  dim: new THREE.MeshBasicMaterial({ color: "#5a3d1e", toneMapped: true }),
  warm: new THREE.MeshBasicMaterial({ color: "#a86a2a", toneMapped: true }),
  bright: new THREE.MeshBasicMaterial({ color: "#d98f3a", toneMapped: true }),
};

/** unlit windows — homes where nobody is back yet */
export const darkWindow = new THREE.MeshBasicMaterial({ color: "#0c121c" });

/** old plaster walls, slightly different weathering each */
export const wallMaterials = [
  new THREE.MeshLambertMaterial({ color: "#7a6f62" }),
  new THREE.MeshLambertMaterial({ color: "#857a6c" }),
  new THREE.MeshLambertMaterial({ color: "#6e6a62" }),
  new THREE.MeshLambertMaterial({ color: "#8a7f72" }),
  new THREE.MeshLambertMaterial({ color: "#756e66" }),
  new THREE.MeshLambertMaterial({ color: "#686460" }),
];

/** painted houses that survived many monsoons */
export const paintedMaterials = [
  new THREE.MeshLambertMaterial({ color: "#5e6e64" }),
  new THREE.MeshLambertMaterial({ color: "#6e6078" }),
  new THREE.MeshLambertMaterial({ color: "#77695d" }),
  new THREE.MeshLambertMaterial({ color: "#5a6878" }),
];

export const roofMaterial = new THREE.MeshLambertMaterial({ color: "#4a4540" });
export const concreteDark = new THREE.MeshLambertMaterial({ color: "#525860" });
export const woodDark = new THREE.MeshLambertMaterial({ color: "#5a4838" });
export const metalDark = new THREE.MeshLambertMaterial({ color: "#4a5058" });
export const skinMaterial = new THREE.MeshLambertMaterial({ color: "#a0715a" });
export const foliageMaterial = new THREE.MeshLambertMaterial({ color: "#3d5238" });
export const trunkMaterial = new THREE.MeshLambertMaterial({ color: "#4a3c30" });
