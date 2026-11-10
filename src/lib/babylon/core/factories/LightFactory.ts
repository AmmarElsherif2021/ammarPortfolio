import { Light, Scene } from "@babylonjs/core";
import { ILightController } from "../interfaces/ILightController";
import { LightConfig } from "../../types/config.types";

/**
 * Same dispatch pattern as CameraFactory, but for lights, and it handles
 * an array since a scene usually has more than one light.
 */
export class LightFactory {
  private readonly controllers: ILightController[];

  constructor(controllers: ILightController[]) {
    this.controllers = controllers;
  }

  public createAll(scene: Scene, configs: LightConfig[]): Light[] {
    return configs.map((config) => {
      const controller = this.controllers.find((c) => c.supports(config.type));
      if (!controller) {
        throw new Error(`LightFactory: no ILightController registered for type "${config.type}".`);
      }
      return controller.create(scene, config);
    });
  }
}
