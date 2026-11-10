import { Camera, Scene } from "@babylonjs/core";
import { ICameraController } from "../interfaces/ICameraController";
import { CameraConfig } from "../../types/config.types";

/**
 * Holds a list of ICameraController implementations and dispatches to
 * whichever one `supports()` the requested type.
 *
 * Adding a new camera type = writing a new ICameraController + registering
 * it here. No existing controller or this factory's logic needs editing
 * (Open/Closed Principle).
 */
export class CameraFactory {
  private readonly controllers: ICameraController[];

  constructor(controllers: ICameraController[]) {
    this.controllers = controllers;
  }

  public create(scene: Scene, canvas: HTMLCanvasElement, config: CameraConfig): Camera {
    const controller = this.controllers.find((c) => c.supports(config.type));
    if (!controller) {
      throw new Error(`CameraFactory: no ICameraController registered for type "${config.type}".`);
    }
    return controller.create(scene, canvas, config);
  }
}
