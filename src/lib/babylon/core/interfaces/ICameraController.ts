import { Camera, Scene } from "@babylonjs/core";
import { CameraConfig } from "../../types/config.types";

/**
 * Sole responsibility: build ONE camera from config and attach controls.
 * Concrete implementations (ArcRotate, Free, ...) are interchangeable
 * because they all speak this same contract (Liskov substitution).
 */
export interface ICameraController {
  /** Returns true if this controller knows how to build the given config's camera type. */
  supports(type: CameraConfig["type"]): boolean;

  /** Builds the camera in the scene and attaches it to the canvas for user control. */
  create(scene: Scene, canvas: HTMLCanvasElement, config: CameraConfig): Camera;
}
