import { Color3, Color4, Vector3 } from "@babylonjs/core";
import { ColorConfig, Vector3Config } from "../../types/config.types";

/**
 * Converts our plain JSON vector shape into a real Babylon Vector3.
 * Every controller that reads position/rotation/target/direction from
 * config calls this instead of writing `new Vector3(v.x, v.y, v.z)` inline.
 */
export function toVector3(v?: Vector3Config): Vector3 | undefined {
  if (!v) return undefined;
  return new Vector3(v.x, v.y, v.z);
}

/** Converts our plain JSON color shape (no alpha) into a Babylon Color3. */
export function toColor3(c?: ColorConfig): Color3 | undefined {
  if (!c) return undefined;
  return new Color3(c.r, c.g, c.b);
}

/** Converts our plain JSON color shape (with alpha) into a Babylon Color4. */
export function toColor4(c?: ColorConfig): Color4 | undefined {
  if (!c) return undefined;
  return new Color4(c.r, c.g, c.b, c.a ?? 1);
}
