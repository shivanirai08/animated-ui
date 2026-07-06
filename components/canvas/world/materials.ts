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
  new THREE.MeshLambertMaterial({ color: "#5d5348" }),
  new THREE.MeshLambertMaterial({ color: "#665a4a" }),
  new THREE.MeshLambertMaterial({ color: "#4f4b45" }),
  new THREE.MeshLambertMaterial({ color: "#6a5f55" }),
  new THREE.MeshLambertMaterial({ color: "#57524e" }),
  new THREE.MeshLambertMaterial({ color: "#4a4640" }),
];

/** painted houses that survived many monsoons */
export const paintedMaterials = [
  new THREE.MeshLambertMaterial({ color: "#4e5a52" }), // faded green
  new THREE.MeshLambertMaterial({ color: "#5e5064" }), // washed violet
  new THREE.MeshLambertMaterial({ color: "#615549" }), // ochre
  new THREE.MeshLambertMaterial({ color: "#465361" }), // indigo-grey
];

export const roofMaterial = new THREE.MeshLambertMaterial({ color: "#2e2a26" });
export const concreteDark = new THREE.MeshLambertMaterial({ color: "#3a3d42" });
export const woodDark = new THREE.MeshLambertMaterial({ color: "#3d2f24" });
export const metalDark = new THREE.MeshLambertMaterial({ color: "#2b2e33" });
export const silhouetteMaterial = new THREE.MeshBasicMaterial({ color: "#120e0a" });
export const foliageMaterial = new THREE.MeshLambertMaterial({ color: "#2a3b2a" });
export const trunkMaterial = new THREE.MeshLambertMaterial({ color: "#332a22" });
