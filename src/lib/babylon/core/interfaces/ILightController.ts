import { Light, Scene } from "@babylonjs/core";
import { LightConfig } from "../../types/config.types";

/**
 * Sole responsibility: build ONE light from config.
 * Same substitution guarantee as ICameraController: any implementation
 * can replace another as long as it honors this contract.
 */
export interface ILightController {
  supports(type: LightConfig["type"]): boolean;
  create(scene: Scene, config: LightConfig): Light;
}
