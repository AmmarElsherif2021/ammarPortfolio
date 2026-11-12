// types.ts
//import { Color, Vector3 } from "three";

import { User } from '@/domain/entities/User';

/** Configuration for a single 3D model. */
export interface ModelConfig {
  priority?: boolean;
  path?: string;
  scale?: number | { x: number; y: number; z: number };
  position?: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number };
  visible?: boolean;
  castShadow?: boolean;
  receiveShadow?: boolean;
  userData?: Record<string, User>;
  material?: { roughness?: number; metalness?: number };
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  navPath?: string; // internal Next.js path (e.g., '/projects')
  navSection?: string; // section id to scroll to
  link?: string; // external or internal URL
  buttonLabel?: string;
  explicit?: {
    label: string;
    label_ar: string;
    brief: string;
    brief_ar: string;
    link: string;
  };
  // optional transformation overrides
  flipX?: boolean;
  flipY?: boolean;
  flipZ?: boolean;
  tilt?: { x: number; y: number; z: number };
}

export interface ModelsConfig {
  models: Record<string, ModelConfig>;
  default: Partial<ModelConfig>;
  global: {
    cameraPosition: { x: number; y: number; z: number };
    cameraFov?: number;
    controlsEnabled?: boolean;
    shadows?: boolean;
  };
}

/** A single landing page segment (section). */
export interface Segment {
  id: string;
  navSection: string;
  title: string;
  title_ar: string;
  subtitle?: string;
  subtitle_ar?: string;
  description: string;
  description_ar: string;
  modelKey: string | string[];
  sceneBackground: string;
  cameraPosition: { x: number; y: number; z: number };
  textColor: string;
  buttonText?: string;
  buttonText_ar?: string;
  buttonLink?: string;
  animation?: string;
  textAlign?: string;
  linkedSections?: string[];
}

export interface LandingConfig {
  theme: {
    primaryColor: string;
    sparkleColor: string;
  };
  segments: Segment[];
}
