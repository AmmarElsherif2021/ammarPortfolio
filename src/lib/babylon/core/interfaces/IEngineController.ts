import { Engine, Scene } from "@babylonjs/core";
import { EngineSettingsConfig } from "../../types/config.types";

/**
 * Sole responsibility: own the Babylon Engine lifecycle
 * (creation, render loop, resize handling).
 * Nothing else in this app is allowed to touch `new Engine(...)` directly.
 */
export interface IEngineController {
  /** Creates and returns the Babylon Engine bound to the given canvas. */
  createEngine(canvas: HTMLCanvasElement, settings: EngineSettingsConfig): Engine;

  /** Starts the render loop for the given scene. */
  runRenderLoop(scene: Scene): void;

  /** Wires up a window resize listener so the canvas stays responsive. */
  registerResize(): void;

  /** Releases the engine and any listeners it registered. */
  dispose(): void;
}
