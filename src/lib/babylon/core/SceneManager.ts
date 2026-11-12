import { Scene } from '@babylonjs/core';
import { IEngineController } from './interfaces/IEngineController';
import { IConfigLoader } from './interfaces/IConfigLoader';
import { IModelLoader } from './interfaces/IModelLoader';
import { CameraFactory } from './factories/CameraFactory';
import { LightFactory } from './factories/LightFactory';
import { toColor4 } from './utils/vector.utils';
import { AppConfig } from '../types/config.types';

/**
 * SceneManager is the single "composition point" that wires the config
 * to Babylon objects. It never instantiates a concrete controller itself -
 * every dependency arrives through the constructor (Dependency Inversion),
 * so this class can be unit tested with fakes/mocks, and any dependency
 * can be swapped without touching this file.
 */

export class SceneManager {
  constructor(
    private readonly engineController: IEngineController,
    private readonly configLoader: IConfigLoader,
    private readonly modelLoader: IModelLoader,
    private readonly cameraFactory: CameraFactory,
    private readonly lightFactory: LightFactory
  ) {}

  /** Convenience wrapper: loads config then delegates. */
  public async bootstrap(
    canvas: HTMLCanvasElement,
    configPath: string,
    modelsBasePath: string
  ): Promise<Scene> {
    const config = await this.configLoader.load(configPath);
    return this.bootstrapWithConfig(canvas, config, modelsBasePath);
  }

  /** Takes an already-loaded config — avoids double fetching from a component. */
  public async bootstrapWithConfig(
    canvas: HTMLCanvasElement,
    config: AppConfig,
    modelsBasePath: string
  ): Promise<Scene> {
    const engine = this.engineController.createEngine(canvas, config.engine);
    const scene = new Scene(engine);

    const clearColor = toColor4(config.scene.clearColor);
    if (clearColor) scene.clearColor = clearColor;
    if (config.scene.useRightHandedSystem !== undefined) {
      scene.useRightHandedSystem = config.scene.useRightHandedSystem;
    }

    this.cameraFactory.create(scene, canvas, config.camera);
    this.lightFactory.createAll(scene, config.lights);
    await this.modelLoader.loadAll(scene, modelsBasePath, config.models);

    this.engineController.registerResize();
    this.engineController.runRenderLoop(scene);

    return scene;
  }

  public dispose(): void {
    this.engineController.dispose();
  }
}
