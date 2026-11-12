// src/lib/babylon/core/interfaces/IEngineController.ts
import { Engine, Scene } from '@babylonjs/core';
import { EngineSettingsConfig } from '@/lib/babylon/types/config.types';

/**
 * Sole responsibility: own the Babylon Engine lifecycle
 * (creation, render loop, resize handling).
 * Nothing else in this app is allowed to touch `new Engine(...)` directly.
 */

export interface IEngineController {
  createEngine(canvas: HTMLCanvasElement, settings: EngineSettingsConfig): Engine;
  runRenderLoop(scene: Scene): void;
  /** Stops the render loop without tearing down the engine. */
  pauseRenderLoop(): void;
  /** Re-submits the stored render function after pauseRenderLoop(). */
  resumeRenderLoop(): void;
  registerResize(): void;
  dispose(): void;
}
