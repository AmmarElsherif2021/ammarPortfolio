import { ArcRotateCamera, Scene, Vector3 } from "@babylonjs/core";
import { ICameraController } from "../interfaces/ICameraController";
import { CameraConfig } from "../../types/config.types";
import { toVector3 } from "../utils/vector.utils";

/**
 * Builds an orbit-style camera (the most common "look at an object" camera).
 * Handles ONLY the "arcRotate" config type - see `supports()`.
 */
export class ArcRotateCameraController implements ICameraController {
  public supports(type: CameraConfig["type"]): boolean {
    return type === "arcRotate";
  }

  public create(scene: Scene, canvas: HTMLCanvasElement, config: CameraConfig): ArcRotateCamera {
    const target = toVector3(config.target) ?? Vector3.Zero();

    const camera = new ArcRotateCamera(
      "arcRotateCamera",
      config.alpha ?? -Math.PI / 2,
      config.beta ?? Math.PI / 2.5,
      config.radius ?? 10,
      target,
      scene
    );

    if (config.fov !== undefined) camera.fov = config.fov;
    if (config.minZ !== undefined) camera.minZ = config.minZ;
    if (config.maxZ !== undefined) camera.maxZ = config.maxZ;

    camera.attachControl(canvas, true);
    return camera;
  }
}
