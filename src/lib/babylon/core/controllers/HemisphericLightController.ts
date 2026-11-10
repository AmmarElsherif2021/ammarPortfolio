import { HemisphericLight, Scene, Vector3 } from "@babylonjs/core";
import { ILightController } from "../interfaces/ILightController";
import { LightConfig } from "../../types/config.types";
import { toVector3, toColor3 } from "../utils/vector.utils";

/** Soft ambient-style light coming from a single direction. Handles "hemispheric" only. */
export class HemisphericLightController implements ILightController {
  public supports(type: LightConfig["type"]): boolean {
    return type === "hemispheric";
  }

  public create(scene: Scene, config: LightConfig): HemisphericLight {
    const direction = toVector3(config.direction) ?? new Vector3(0, 1, 0);
    const light = new HemisphericLight(config.name, direction, scene);
    light.intensity = config.intensity;
    const diffuse = toColor3(config.diffuse);
    if (diffuse) light.diffuse = diffuse;
    return light;
  }
}
