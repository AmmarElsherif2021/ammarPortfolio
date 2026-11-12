// src/lib/babylon/core/controllers/GlbModelLoader.ts
import { AbstractMesh, Scene, SceneLoader } from '@babylonjs/core';
import '@babylonjs/loaders/glTF'; // registers .glb / .gltf (.gltf includes Draco)
import { IModelLoader } from '../interfaces/IModelLoader';
import { ModelConfig } from '@/lib/babylon/types/config.types';
import { applyEmission } from '../utils/emission.utils';

/**
 * Imports .glb files (from public/assets/models) and applies transform
 * config (position/rotation/scaling) to their root mesh.
 * This is the ONLY class that talks to `SceneLoader` directly.
 */

export class GlbModelLoader implements IModelLoader {
  public async load(scene: Scene, basePath: string, config: ModelConfig): Promise<AbstractMesh[]> {
    // Babylon decodes Draco inside the glTF loader; no extra plugin wiring needed.
    const result = await SceneLoader.ImportMeshAsync('', basePath, config.fileName, scene);

    const root = result.meshes[0];
    if (root) {
      root.name = config.name;
      if (config.position)
        root.position.set(config.position.x, config.position.y, config.position.z);
      if (config.rotation)
        root.rotation.set(config.rotation.x, config.rotation.y, config.rotation.z);
      if (config.scaling) root.scaling.set(config.scaling.x, config.scaling.y, config.scaling.z);

      if (config.emissionColor) {
        applyEmission(result.meshes, config.emissionColor);
      }
    }

    return result.meshes;
  }

  public async loadAll(
    scene: Scene,
    basePath: string,
    configs: ModelConfig[]
  ): Promise<AbstractMesh[]> {
    const results = await Promise.all(configs.map((c) => this.load(scene, basePath, c)));
    return results.flat();
  }
}
