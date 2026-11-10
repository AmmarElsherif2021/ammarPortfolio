import { PointLight, Scene, Vector3 } from "@babylonjs/core";
import { ILightController } from "../interfaces/ILightController";
import { LightConfig } from "../../types/config.types";
import { toVector3, toColor3 } from "../utils/vector.utils";

/** Omnidirectional light from a single point, like a bulb. Handles "point" only. */
export class PointLightController implements ILightController {
  public supports(type: LightConfig["type"]): boolean {
    return type === "point";
  }

  public create(scene: Scene, config: LightConfig): PointLight {
    const position = toVector3(config.position) ?? new Vector3(0, 5, 0);
    const light = new PointLight(config.name, position, scene);
    light.intensity = config.intensity;
    const diffuse = toColor3(config.diffuse);
    if (diffuse) light.diffuse = diffuse;
    return light;
  }
}
