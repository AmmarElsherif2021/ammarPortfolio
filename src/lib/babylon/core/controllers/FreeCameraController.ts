import { FreeCamera, Scene, Vector3 } from "@babylonjs/core";
import { ICameraController } from "../interfaces/ICameraController";
import { CameraConfig } from "../../types/config.types";
import { toVector3 } from "../utils/vector.utils";

/**
 * Builds a first-person/walkthrough style camera.
 * Handles ONLY the "free" config type - see `supports()`.
 *
 * This class exists to prove the Open/Closed Principle in practice:
 * it was added to support a new camera type WITHOUT modifying
 * ArcRotateCameraController, CameraFactory's logic, or SceneManager.
 */
export class FreeCameraController implements ICameraController {
  public supports(type: CameraConfig["type"]): boolean {
    return type === "free";
  }

  public create(scene: Scene, canvas: HTMLCanvasElement, config: CameraConfig): FreeCamera {
    const position = toVector3(config.position) ?? new Vector3(0, 1, -10);
    const camera = new FreeCamera("freeCamera", position, scene);

    if (config.target) {
      camera.setTarget(toVector3(config.target)!);
    }
    if (config.fov !== undefined) camera.fov = config.fov;
    if (config.minZ !== undefined) camera.minZ = config.minZ;
    if (config.maxZ !== undefined) camera.maxZ = config.maxZ;

    camera.attachControl(canvas, true);
    return camera;
  }
}
