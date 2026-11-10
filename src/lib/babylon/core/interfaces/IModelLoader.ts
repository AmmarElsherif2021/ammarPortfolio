import { AbstractMesh, Scene } from "@babylonjs/core";
import { ModelConfig } from "../../types/config.types";

/**
 * Sole responsibility: import .glb models into the scene and place them
 * according to config (position/rotation/scaling). Import mechanics
 * (SceneLoader, draco, etc.) are fully hidden behind this interface.
 */
export interface IModelLoader {
  load(scene: Scene, basePath: string, config: ModelConfig): Promise<AbstractMesh[]>;
  loadAll(scene: Scene, basePath: string, configs: ModelConfig[]): Promise<AbstractMesh[]>;
}
