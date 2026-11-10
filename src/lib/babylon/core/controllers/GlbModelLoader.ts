import { AbstractMesh, Scene, SceneLoader } from "@babylonjs/core";
import "@babylonjs/loaders/glTF"; // registers the .glb/.gltf loader plugin as a side effect
import { IModelLoader } from "../interfaces/IModelLoader";
import { ModelConfig } from "../../types/config.types";
import { toVector3 } from "../utils/vector.utils";

/**
 * Imports .glb files (from public/assets/models) and applies transform
 * config (position/rotation/scaling) to their root mesh.
 * This is the ONLY class that talks to `SceneLoader` directly.
 */
export class GlbModelLoader implements IModelLoader {
  public async load(scene: Scene, basePath: string, config: ModelConfig): Promise<AbstractMesh[]> {
    const result = await SceneLoader.ImportMeshAsync("", basePath, config.fileName, scene);
    const meshes = result.meshes;

    // Babylon always returns a "__root__" transform node as meshes[0]; apply
    // the configured transform there so the whole hierarchy moves together.
    const root = meshes[0];
    if (root) {
      root.name = config.name;

      const position = toVector3(config.position);
      if (position) root.position = position;

      const rotation = toVector3(config.rotation);
      if (rotation) root.rotation = rotation;

      const scaling = toVector3(config.scaling);
      if (scaling) root.scaling = scaling;
    }

    return meshes;
  }

  public async loadAll(
    scene: Scene,
    basePath: string,
    configs: ModelConfig[]
  ): Promise<AbstractMesh[]> {
    // Load in parallel: independent model files don't need to block each other.
    const results = await Promise.all(configs.map((config) => this.load(scene, basePath, config)));
    return results.flat();
  }
}
