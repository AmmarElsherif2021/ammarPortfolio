/**
 * All types below describe the *shape* of scene-config.json.
 * Keeping them in one file (DRY) means every controller/factory
 * imports the same contract instead of redefining it locally.
 */

export interface Vector3Config {
  x: number;
  y: number;
  z: number;
}

export interface ColorConfig {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export type CameraType = 'arcRotate' | 'free';

export interface CameraConfig {
  type: CameraType;
  position?: Vector3Config;
  target?: Vector3Config;
  alpha?: number;
  beta?: number;
  radius?: number;
  fov?: number;
  minZ?: number;
  maxZ?: number;
}

export type LightType = 'hemispheric' | 'directional' | 'point';

export interface LightConfig {
  type: LightType;
  name: string;
  direction?: Vector3Config;
  position?: Vector3Config;
  intensity: number;
  diffuse?: ColorConfig;
}

export interface ModelConfig {
  name: string;
  fileName: string;
  position?: Vector3Config;
  rotation?: Vector3Config;
  scaling?: Vector3Config;
}

export interface SceneSettingsConfig {
  clearColor?: ColorConfig;
  useRightHandedSystem?: boolean;
}

export interface EngineSettingsConfig {
  antialias?: boolean;
  adaptToDeviceRatio?: boolean;
}

export interface ActionConfig {
  id: string;
  type: string;
  params: Record<string, number | string | boolean>;
  trigger?: 'auto' | 'manual';
}

/** The full contents of scene-config.json */
export interface AppConfig {
  engine: EngineSettingsConfig;
  scene: SceneSettingsConfig;
  camera: CameraConfig;
  lights: LightConfig[];
  models: ModelConfig[];
  actions?: ActionConfig[];
}
