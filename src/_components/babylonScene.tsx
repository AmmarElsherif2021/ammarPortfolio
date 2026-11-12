// src/_components/babylonScene.tsx
'use client';

import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders/glTF';

import { SceneManager } from '@/lib/babylon/core/SceneManager';
import { EngineController } from '@/lib/babylon/core/controllers/EngineController';
import { JsonConfigLoader } from '@/lib/babylon/core/controllers/JsonConfigLoader';
import { GlbModelLoader } from '@/lib/babylon/core/controllers/GlbModelLoader';
import { PerformanceGuard } from '@/lib/babylon/core/controllers/PerformanceGuard';
import { CameraFactory } from '@/lib/babylon/core/factories/CameraFactory';
import { LightFactory } from '@/lib/babylon/core/factories/LightFactory';
import { ArcRotateCameraController } from '@/lib/babylon/core/controllers/ArcRotateCameraController';
import { FreeCameraController } from '@/lib/babylon/core/controllers/FreeCameraController';
import { HemisphericLightController } from '@/lib/babylon/core/controllers/HemisphericLightController';
import { DirectionalLightController } from '@/lib/babylon/core/controllers/DirectionalLightController';
import { PointLightController } from '@/lib/babylon/core/controllers/PointLightController';
import type { ActionConfig, AppConfig } from '@/lib/babylon/types/config.types';

/* ------------------------------------------------------------------ */
/* Public handle                                                      */
/* ------------------------------------------------------------------ */

export interface BabylonSceneHandle {
  triggerAction: (actionId: string) => void;
  stopAction: (actionId: string) => void;
  isReady: () => boolean;
}

/* ------------------------------------------------------------------ */
/* Action infrastructure (unchanged in shape; in-component only)      */
/* ------------------------------------------------------------------ */

type ActionContext = {
  scene: BABYLON.Scene;
  camera: BABYLON.Camera;
  meshes: Map<string, BABYLON.AbstractMesh>;
  lights: Map<string, BABYLON.Light>;
};

type ActionHandler = (ctx: ActionContext, action: ActionConfig) => (() => void) | void;

function actionCameraOrbit(ctx: ActionContext, action: ActionConfig): (() => void) | void {
  if (!(ctx.camera instanceof BABYLON.ArcRotateCamera)) return;
  const camera = ctx.camera;
  const speed = typeof action.params.speed === 'number' ? action.params.speed : 0.003;
  const observer = ctx.scene.onBeforeRenderObservable.add(() => {
    camera.alpha += speed;
    camera.target.set(0, 0, 0);
  });
  return () => ctx.scene.onBeforeRenderObservable.remove(observer);
}

function actionCameraLerp(ctx: ActionContext, action: ActionConfig): void {
  if (!(ctx.camera instanceof BABYLON.ArcRotateCamera)) return;
  const camera = ctx.camera;
  const duration = typeof action.params.duration === 'number' ? action.params.duration : 1000;
  const fps = 60;
  const frames = Math.max(1, Math.round((duration / 1000) * fps));
  const alphaEnd = typeof action.params.alpha === 'number' ? action.params.alpha : camera.alpha;
  const betaEnd = typeof action.params.beta === 'number' ? action.params.beta : camera.beta;
  const radiusEnd = typeof action.params.radius === 'number' ? action.params.radius : camera.radius;

  // Fixed target per Phase 4 brief: every lerp eases to origin.
  BABYLON.Animation.CreateAndStartAnimation(
    `lerp-target-${action.id}`,
    camera,
    'target',
    fps,
    frames,
    camera.target.clone(),
    BABYLON.Vector3.Zero(),
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
  );
  BABYLON.Animation.CreateAndStartAnimation(
    `lerp-alpha-${action.id}`,
    camera,
    'alpha',
    fps,
    frames,
    camera.alpha,
    alphaEnd,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
  );
  BABYLON.Animation.CreateAndStartAnimation(
    `lerp-beta-${action.id}`,
    camera,
    'beta',
    fps,
    frames,
    camera.beta,
    betaEnd,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
  );
  BABYLON.Animation.CreateAndStartAnimation(
    `lerp-radius-${action.id}`,
    camera,
    'radius',
    fps,
    frames,
    camera.radius,
    radiusEnd,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
  );
}

function actionCameraZoom(ctx: ActionContext, action: ActionConfig): (() => void) | void {
  if (!(ctx.camera instanceof BABYLON.ArcRotateCamera)) return;
  const camera = ctx.camera;
  const base = camera.radius;
  const min = typeof action.params.min === 'number' ? action.params.min : Math.max(1, base - 10);
  const max = typeof action.params.max === 'number' ? action.params.max : base + 10;
  const speed = typeof action.params.speed === 'number' ? action.params.speed : 0.02;
  let phase = 0;
  const observer = ctx.scene.onBeforeRenderObservable.add(() => {
    phase += speed;
    camera.radius = min + ((Math.sin(phase) + 1) / 2) * (max - min);
    camera.target.set(0, 0, 0);
  });
  return () => ctx.scene.onBeforeRenderObservable.remove(observer);
}

const ACTION_REGISTRY: Record<string, ActionHandler> = {
  cameraOrbit: actionCameraOrbit,
  cameraLerp: actionCameraLerp,
  cameraZoom: actionCameraZoom,
};

/* ------------------------------------------------------------------ */
/* Particle orbit (per-model behavior; separate from the action system) */
/* ------------------------------------------------------------------ */

const DEFAULT_ORBIT_SPEED = 0.003;

function applyOrbitMotion(
  scene: BABYLON.Scene,
  meshMap: Map<string, BABYLON.AbstractMesh>,
  models: AppConfig['models']
): () => void {
  const cleanups: Array<() => void> = [];

  for (const cfg of models) {
    if (cfg.isStill) continue;
    const mesh = meshMap.get(cfg.name);
    if (!mesh) continue;
    const radius = Math.sqrt(cfg.position.x ** 2 + cfg.position.z ** 2);
    if (radius === 0) continue;
    const height = cfg.position.y;
    const speed = cfg.orbitSpeed ?? DEFAULT_ORBIT_SPEED;
    let angle = Math.atan2(cfg.position.z, cfg.position.x);

    const observer = scene.onBeforeRenderObservable.add(() => {
      angle += speed;
      mesh.position.set(radius * Math.cos(angle), height, radius * Math.sin(angle));
    });
    cleanups.push(() => scene.onBeforeRenderObservable.remove(observer));
  }

  return () => cleanups.forEach((fn) => fn());
}

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

const BabylonScene = forwardRef<BabylonSceneHandle, { children?: React.ReactNode }>(
  (_props, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const engineControllerRef = useRef<EngineController | null>(null);
    const sceneManagerRef = useRef<SceneManager | null>(null);
    const guardRef = useRef<PerformanceGuard | null>(null);
    const contextRef = useRef<ActionContext | null>(null);
    const manualActionsRef = useRef<Map<string, ActionConfig>>(new Map());
    const runningCleanupsRef = useRef<Map<string, () => void>>(new Map());
    const orbitDisposeRef = useRef<() => void>(() => {});
    const [ready, setReady] = useState(false);

    useImperativeHandle(
      ref,
      () => ({
        isReady: () => contextRef.current !== null,
        triggerAction: (id) => {
          const ctx = contextRef.current;
          if (!ctx || runningCleanupsRef.current.has(id)) return;
          const action = manualActionsRef.current.get(id);
          if (!action) return;
          const handler = ACTION_REGISTRY[action.type];
          if (!handler) return;
          const cleanup = handler(ctx, action);
          if (cleanup) runningCleanupsRef.current.set(id, cleanup);
        },
        stopAction: (id) => {
          const cleanup = runningCleanupsRef.current.get(id);
          if (cleanup) {
            cleanup();
            runningCleanupsRef.current.delete(id);
          }
        },
      }),
      []
    );

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      let cancelled = false;
      let localGuard: PerformanceGuard | null = null;
      let localManager: SceneManager | null = null;

      const boot = async () => {
        // Load config exactly once.
        const config = await new JsonConfigLoader().load('/assets/scene-config.json');
        if (cancelled) return;

        const engineController = new EngineController();
        const modelLoader = new GlbModelLoader();
        const cameraFactory = new CameraFactory([
          new ArcRotateCameraController(),
          new FreeCameraController(),
        ]);
        const lightFactory = new LightFactory([
          new HemisphericLightController(),
          new DirectionalLightController(),
          new PointLightController(),
        ]);

        const manager = new SceneManager(
          engineController,
          new JsonConfigLoader(),
          modelLoader,
          cameraFactory,
          lightFactory
        );
        localManager = manager;
        sceneManagerRef.current = manager;
        engineControllerRef.current = engineController;

        // Use the pre-loaded config — one fetch total.
        const scene = await manager.bootstrapWithConfig(canvas, config, '/assets/models/');
        if (cancelled) return;

        const camera = scene.activeCamera!;
        const meshMap = new Map(scene.meshes.map((m) => [m.name, m]));
        const lightMap = new Map(scene.lights.map((l) => [l.name, l]));

        const ctx: ActionContext = { scene, camera, meshes: meshMap, lights: lightMap };
        contextRef.current = ctx;

        const reducedMotion = PerformanceGuard.prefersReducedMotion();

        if (!reducedMotion) {
          orbitDisposeRef.current = applyOrbitMotion(scene, meshMap, config.models);
        }

        localGuard = new PerformanceGuard({
          engineController,
          canvas,
          onPause: () => {},
          onResume: () => {},
        });
        localGuard.start();
        guardRef.current = localGuard;

        const actions = config.actions ?? [];
        const auto = actions.filter((a) => (a.trigger ?? 'auto') === 'auto');
        const manual = actions.filter((a) => a.trigger === 'manual');

        if (!reducedMotion) {
          for (const action of auto) {
            const handler = ACTION_REGISTRY[action.type];
            if (!handler) continue;
            const cleanup = handler(ctx, action);
            if (cleanup) runningCleanupsRef.current.set(action.id, cleanup);
          }
        }

        for (const action of manual) {
          manualActionsRef.current.set(action.id, action);
        }

        setReady(true);
      };

      boot().catch((err) => console.error('[BabylonScene] boot failed:', err));

      return () => {
        cancelled = true;
        orbitDisposeRef.current();
        orbitDisposeRef.current = () => {};
        runningCleanupsRef.current.forEach((fn) => fn());
        runningCleanupsRef.current.clear();
        manualActionsRef.current.clear();
        contextRef.current = null;
        localGuard?.dispose();
        localManager?.dispose();
        engineControllerRef.current = null;
        sceneManagerRef.current = null;
        guardRef.current = null;
        setReady(false);
      };
    }, []);

    return (
      <div className="relative h-full w-full">
        <canvas
          ref={canvasRef}
          className="block h-full w-full"
          aria-label="Interactive 3D introduction scene"
        />
        {!ready && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="font-martianMono text-sm text-white/60">Loading scene…</span>
          </div>
        )}
      </div>
    );
  }
);

BabylonScene.displayName = 'BabylonScene';
export default BabylonScene;
