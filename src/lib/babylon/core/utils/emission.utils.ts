// src/lib/babylon/core/utils/emission.utils.ts
import { AbstractMesh, Color3, Mesh, PBRMaterial, StandardMaterial } from '@babylonjs/core';

/**
 * Walks the loaded hierarchy and replaces each renderable mesh's material
 * with a clone whose emissiveColor is the config value.
 *
 * Data flow:
 *   scene-config.json (model.emissionColor)
 *     → Color3
 *     → cloned PBRMaterial/StandardMaterial
 *     → mesh.material
 *     → GPU emissive channel next frame
 *
 * Cloning (rather than mutating in place) matters because glTF materials
 * can be shared across meshes and across model loads; mutating shared
 * materials would tint unrelated meshes.
 */
export function applyEmission(
  meshes: AbstractMesh[],
  color: { r: number; g: number; b: number }
): void {
  const emissive = new Color3(color.r, color.g, color.b);

  for (const mesh of meshes) {
    if (!(mesh instanceof Mesh) || !mesh.material) continue;

    const cloned = mesh.material.clone(`${mesh.name}-emissive`);
    if (cloned instanceof PBRMaterial || cloned instanceof StandardMaterial) {
      cloned.emissiveColor = emissive;
    }
    mesh.material = cloned;
  }
}
