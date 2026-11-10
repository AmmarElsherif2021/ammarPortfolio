import { DirectionalLight, Scene, Vector3 } from "@babylonjs/core";
import { ILightController } from "../interfaces/ILightController";
import { LightConfig } from "../../types/config.types";
import { toVector3, toColor3 } from "../utils/vector.utils";

/** Parallel-ray light simulating something like sunlight. Handles "directional" only. */
export class DirectionalLightController implements ILightController {
  public supports(type: LightConfig["type"]): boolean {
    return type === "directional";
  }

  public create(scene: Scene, config: LightConfig): DirectionalLight {
    const direction = toVector3(config.direction) ?? new Vector3(0, -1, 0);
    const light = new DirectionalLight(config.name, direction, scene);
    light.intensity = config.intensity;
    const diffuse = toColor3(config.diffuse);
    if (diffuse) light.diffuse = diffuse;
    return light;
  }
}
