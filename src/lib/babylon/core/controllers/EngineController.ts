import { Engine, Scene } from "@babylonjs/core";
import { IEngineController } from "../interfaces/IEngineController";
import { EngineSettingsConfig } from "../../types/config.types";

/**
 * Owns the Babylon Engine instance and its render/resize lifecycle.
 * No other class in the app instantiates `Engine` directly - that keeps
 * engine setup in exactly one place (DRY) and easy to swap/mocked in tests.
 */
export class EngineController implements IEngineController {
  private engine: Engine | null = null;
  private resizeHandler: (() => void) | null = null;

  public createEngine(canvas: HTMLCanvasElement, settings: EngineSettingsConfig): Engine {
    this.engine = new Engine(canvas, settings.antialias ?? true, {
      adaptToDeviceRatio: settings.adaptToDeviceRatio ?? true,
      preserveDrawingBuffer: true,
      stencil: true,
    });
    return this.engine;
  }

  public runRenderLoop(scene: Scene): void {
    this.assertEngineCreated();
    this.engine!.runRenderLoop(() => scene.render());
  }

  public registerResize(): void {
    this.assertEngineCreated();
    this.resizeHandler = () => this.engine!.resize();
    window.addEventListener("resize", this.resizeHandler);
  }

  public dispose(): void {
    if (this.resizeHandler) {
      window.removeEventListener("resize", this.resizeHandler);
      this.resizeHandler = null;
    }
    this.engine?.dispose();
    this.engine = null;
  }

  private assertEngineCreated(): void {
    if (!this.engine) {
      throw new Error("EngineController: createEngine() must be called first.");
    }
  }
}
