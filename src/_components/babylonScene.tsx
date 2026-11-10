import React, {
  useRef,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";

// ============================================================================
// Types
// ============================================================================

interface Vector3Like {
  x: number;
  y: number;
  z: number;
}

/**
 * Config-driven description of a single scenario/action to run against the
 * scene once it's built. `type` is looked up in ACTION_REGISTRY below, and
 * `params` are handler-specific (validated/defaulted inside each handler).
 */
interface ActionConfig {
  id: string;
  type: string; // key into ACTION_REGISTRY, e.g. "cameraOrbit"
  params: Record<string, number | string | boolean>;
  /**
   * 'auto'   (default) — runs as soon as the scene finishes building, same
   *          behavior as before.
   * 'manual' — registered but not started. Fire it later via the ref API
   *          (see BabylonSceneHandle) in response to a click, scroll,
   *          intersection observer, etc.
   */
  trigger?: "auto" | "manual";
}

/**
 * Imperative API exposed via ref. This is the "consume based on events"
 * surface — anything outside this component (a click handler, a scroll
 * listener, another effect) holds a ref to <BabylonScene /> and calls
 * these methods, instead of reaching into Babylon internals directly.
 */
export interface BabylonSceneHandle {
  /** Starts a 'manual' action by id. No-op if already running or unknown. */
  triggerAction: (actionId: string) => void;
  /** Stops a running action (auto or manual) by id, if it has a cleanup. */
  stopAction: (actionId: string) => void;
  /** True once engine/scene/camera/meshes/lights exist and actions can run. */
  isReady: () => boolean;
}

interface SceneConfig {
  engine: { antialias: boolean; adaptToDeviceRatio: boolean };
  scene: { clearColor: { r: number; g: number; b: number; a: number } };
  camera: {
    type: "arcRotate" | "free";
    alpha: number;
    beta: number;
    radius: number;
    target: Vector3Like;
    fov: number;
    minZ: number;
    maxZ: number;
  };
  lights: Array<{
    type: "hemispheric" | "directional";
    name: string;
    direction: Vector3Like;
    intensity: number;
    diffuse?: { r: number; g: number; b: number };
  }>;
  models: Array<{
    name: string;
    fileName: string;
    position: Vector3Like;
    rotation: Vector3Like;
    scaling: Vector3Like;
    /** false → orbits the world origin like a particle (see applyOrbitMotion).
     *  true  → stays exactly where placed. */
    isStill?: boolean;
    /** Optional per-model override for orbit angular speed (radians/frame).
     *  Falls back to DEFAULT_ORBIT_SPEED when omitted. */
    orbitSpeed?: number;
    emissionColor?: { r: number; g: number; b: number };
  }>;
  actions?: ActionConfig[]; // NEW: config-driven scenarios (action1, action2, action3, ...)
}

/**
 * Shared context every action handler receives. Keeping this as a single
 * bundle (rather than passing scene/camera/maps separately everywhere) is
 * what keeps the handlers below DRY and easy to add to.
 */
interface ActionContext {
  scene: BABYLON.Scene;
  camera: BABYLON.Camera;
  meshes: Map<string, BABYLON.AbstractMesh>;
  lights: Map<string, BABYLON.Light>;
}

/**
 * A handler runs the action's logic and optionally returns a cleanup
 * function. Continuous/per-frame camera actions (orbit, zoom) return a
 * cleanup that unhooks their observer; one-shot actions (camera focus)
 * return nothing since there's nothing to tear down.
 */
type ActionHandler = (
  ctx: ActionContext,
  action: ActionConfig,
) => (() => void) | void;

// ============================================================================
// Particle-orbit motion (driven by model config, NOT the action system)
// ----------------------------------------------------------------------------
// This is intentionally separate from ACTION_REGISTRY below: it's a
// per-model rendering behavior read straight off each model's `isStill`
// flag in scene-config.json, not a named scenario dispatched by id/type.
// ============================================================================

const DEFAULT_ORBIT_SPEED = 0.003; // radians/frame, used when a model has no orbitSpeed override

/**
 * Orbits every model with `isStill: false` around the world origin (0,0,0),
 * like particles circling a center point — a circle in the XZ plane at the
 * model's original height (y), with radius equal to the model's initial
 * distance from the origin.
 *
 * - `isStill: true` models are left completely untouched.
 * - A model already sitting at the origin (radius 0) is skipped — there's
 *   no meaningful orbit to compute for a point with no offset.
 *
 * Returns a single dispose function that unhooks every observer this
 * created, so the caller can tear all of them down in one call.
 */
function applyOrbitMotion(
  scene: BABYLON.Scene,
  meshMap: Map<string, BABYLON.AbstractMesh>,
  models: SceneConfig["models"],
): () => void {
  const cleanups: Array<() => void> = [];

  for (const modelCfg of models) {
    if (modelCfg.isStill) continue;

    const mesh = meshMap.get(modelCfg.name);
    if (!mesh) continue;

    const radius = Math.sqrt(
      modelCfg.position.x ** 2 + modelCfg.position.z ** 2,
    );
    if (radius === 0) continue; // dead center — nothing to orbit around

    const height = modelCfg.position.y;
    const speed = modelCfg.orbitSpeed ?? DEFAULT_ORBIT_SPEED;
    let angle = Math.atan2(modelCfg.position.z, modelCfg.position.x);

    const observer = scene.onBeforeRenderObservable.add(() => {
      angle += speed;
      mesh.position.x = radius * Math.cos(angle);
      mesh.position.z = radius * Math.sin(angle);
      mesh.position.y = height;
    });

    cleanups.push(() => scene.onBeforeRenderObservable.remove(observer));
  }

  return () => cleanups.forEach((fn) => fn());
}

// ============================================================================
// Scenario implementations — all camera behavior
// ----------------------------------------------------------------------------
// Each scenario is a small, self-contained function that moves the camera
// only; none of them touch meshes or lights anymore. To add a new one:
//   1. Write the handler below (following the same shape as the others).
//   2. Register it in ACTION_REGISTRY under whatever `type` string the
//      config JSON will use.
// That's the only coupling point between config and code, which is what
// keeps this DRY as more scenarios get added.
// ============================================================================

/**
 * Action — "cameraOrbit"
 * Continuously rotates the ArcRotateCamera's `alpha`, i.e. orbits the
 * camera itself around whatever it's currently targeting.
 *
 * params:
 *   speed (number, default 0.003) — radians added to alpha per frame
 */
function actionCameraOrbit(
  ctx: ActionContext,
  action: ActionConfig,
): (() => void) | void {
  if (!(ctx.camera instanceof BABYLON.ArcRotateCamera)) {
    console.warn(
      `[actionCameraOrbit] camera is not an ArcRotateCamera; skipping (action: ${action.id})`,
    );
    return;
  }
  const camera = ctx.camera;
  const speed =
    typeof action.params.speed === "number" ? action.params.speed : 0.003;

  const observer = ctx.scene.onBeforeRenderObservable.add(() => {
    camera.alpha += speed;
    // Keep the focus point pinned to the origin — same fixed target every
    // frame, regardless of any drift from user panning.
    camera.target.set(0, 0, 0);
  });

  return () => ctx.scene.onBeforeRenderObservable.remove(observer);
}

/**
 * Action — "cameraLerp"
 * Smoothly animates the ArcRotateCamera's alpha/beta/radius (i.e. where the
 * camera sits) to new values, while always easing its target back to the
 * world origin — every cameraLerp shares the same fixed focus point, only
 * the vantage point around it changes. One-shot: nothing to clean up once
 * the animation finishes.
 *
 * params:
 *   alpha    (number, radians, default: current alpha)  — end alpha
 *   beta     (number, radians, default: current beta)   — end beta
 *   radius   (number, default: current radius)          — end radius
 *   duration (number, ms, default 1000)                 — animation length
 */
function actionCameraLerp(ctx: ActionContext, action: ActionConfig): void {
  if (!(ctx.camera instanceof BABYLON.ArcRotateCamera)) {
    console.warn(
      `[actionCameraLerp] camera is not an ArcRotateCamera; skipping (action: ${action.id})`,
    );
    return;
  }
  const camera = ctx.camera;
  const duration =
    typeof action.params.duration === "number" ? action.params.duration : 1000;
  const fps = 60;
  const totalFrames = Math.max(1, Math.round((duration / 1000) * fps));

  const alphaEnd =
    typeof action.params.alpha === "number"
      ? action.params.alpha
      : camera.alpha;
  const betaEnd =
    typeof action.params.beta === "number" ? action.params.beta : camera.beta;
  const radiusEnd =
    typeof action.params.radius === "number"
      ? action.params.radius
      : camera.radius;
  const origin = BABYLON.Vector3.Zero();

  // Ease the target back to the origin in lockstep with the position
  // change, in case it had drifted (e.g. from user panning).
  BABYLON.Animation.CreateAndStartAnimation(
    `cameraLerp-target-${action.id}`,
    camera,
    "target",
    fps,
    totalFrames,
    camera.target.clone(),
    origin,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
  );
  BABYLON.Animation.CreateAndStartAnimation(
    `cameraLerp-alpha-${action.id}`,
    camera,
    "alpha",
    fps,
    totalFrames,
    camera.alpha,
    alphaEnd,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
  );
  BABYLON.Animation.CreateAndStartAnimation(
    `cameraLerp-beta-${action.id}`,
    camera,
    "beta",
    fps,
    totalFrames,
    camera.beta,
    betaEnd,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
  );
  BABYLON.Animation.CreateAndStartAnimation(
    `cameraLerp-radius-${action.id}`,
    camera,
    "radius",
    fps,
    totalFrames,
    camera.radius,
    radiusEnd,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
  );
}

/**
 * Action — "cameraZoom"
 * Oscillates the ArcRotateCamera's `radius` between min/max on a sine wave
 * — a breathing dolly in/out. No mesh/light target needed; purely a
 * camera move.
 *
 * params:
 *   min   (number, default: current radius - 10) — closest distance
 *   max   (number, default: current radius + 10) — farthest distance
 *   speed (number, default 0.02)                 — phase increment per frame
 */
function actionCameraZoom(
  ctx: ActionContext,
  action: ActionConfig,
): (() => void) | void {
  if (!(ctx.camera instanceof BABYLON.ArcRotateCamera)) {
    console.warn(
      `[actionCameraZoom] camera is not an ArcRotateCamera; skipping (action: ${action.id})`,
    );
    return;
  }
  const camera = ctx.camera;
  const baseRadius = camera.radius;
  const min =
    typeof action.params.min === "number"
      ? action.params.min
      : Math.max(1, baseRadius - 10);
  const max =
    typeof action.params.max === "number" ? action.params.max : baseRadius + 10;
  const speed =
    typeof action.params.speed === "number" ? action.params.speed : 0.02;

  let phase = 0;
  const observer = ctx.scene.onBeforeRenderObservable.add(() => {
    phase += speed;
    camera.radius = min + ((Math.sin(phase) + 1) / 2) * (max - min);
    // Same fixed focus point as every other camera action — origin, always.
    camera.target.set(0, 0, 0);
  });

  return () => ctx.scene.onBeforeRenderObservable.remove(observer);
}

/**
 * Single source of truth mapping a config `type` string to its handler.
 * This is the only place scenario names/strings live — add a new entry
 * here whenever a new scenario function is written above.
 */
const ACTION_REGISTRY: Record<string, ActionHandler> = {
  cameraOrbit: actionCameraOrbit,
  cameraLerp: actionCameraLerp,
  cameraZoom: actionCameraZoom,
};

// Note: dispatching a single action (auto-run at load, or manual via
// triggerAction) is handled inline in the component below, keyed by
// action id in runningCleanupsRef — that's what lets stopAction(id) and
// triggerAction(id) target one specific running action rather than all of
// them at once.

// ============================================================================
// Component
// ============================================================================

const BabylonScene = forwardRef<
  BabylonSceneHandle,
  { children?: React.ReactNode }
>((props, ref) => {
  const { children } = props;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [config, setConfig] = useState<SceneConfig | null>(null);

  // --- Extracted state, kept in refs instead of useState ---
  // Refs (not state) because these hold live, mutable Babylon objects.
  // Putting them in state would either do nothing or force a re-render
  // every frame; refs let event handlers reach them without either problem.
  const contextRef = useRef<ActionContext | null>(null);
  // Config for every 'manual' action, keyed by id, so triggerAction(id) can
  // look up target/params/type without re-reading the JSON.
  const manualActionsRef = useRef<Map<string, ActionConfig>>(new Map());
  // Cleanup fns for whatever's currently running (auto or manual), keyed by
  // action id, so stopAction(id) and unmount cleanup both have a single
  // place to look.
  const runningCleanupsRef = useRef<Map<string, () => void>>(new Map());
  // Dispose fn for the particle-orbit observers (see applyOrbitMotion) —
  // separate from runningCleanupsRef since orbit motion isn't an action.
  const orbitDisposeRef = useRef<() => void>(() => {});

  // Exposes a small, intentional surface to parents/consumers via ref,
  // instead of forwarding the raw scene/camera/mesh objects.
  useImperativeHandle(
    ref,
    () => ({
      isReady: () => contextRef.current !== null,
      triggerAction: (actionId: string) => {
        const ctx = contextRef.current;
        if (!ctx) {
          console.warn(
            `[BabylonScene] triggerAction("${actionId}") called before the scene was ready`,
          );
          return;
        }
        if (runningCleanupsRef.current.has(actionId)) return; // already running

        const action = manualActionsRef.current.get(actionId);
        if (!action) {
          console.warn(
            `[BabylonScene] no manual action registered with id "${actionId}"`,
          );
          return;
        }

        const handler = ACTION_REGISTRY[action.type];
        if (!handler) {
          console.warn(
            `[BabylonScene] no handler registered for action type "${action.type}"`,
          );
          return;
        }

        const cleanup = handler(ctx, action);
        if (cleanup) runningCleanupsRef.current.set(actionId, cleanup);
      },
      stopAction: (actionId: string) => {
        const cleanup = runningCleanupsRef.current.get(actionId);
        if (cleanup) {
          cleanup();
          runningCleanupsRef.current.delete(actionId);
        }
      },
    }),
    [],
  );

  // 1. Fetch the config from public/assets/
  useEffect(() => {
    fetch("/assets/scene-config.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load config");
        return res.json();
      })
      .then((data) => setConfig(data))
      .catch((err) => console.error("Config load error:", err));
  }, []);

  // 2. Build the scene once the config is available
  useEffect(() => {
    if (!canvasRef.current || !config) return;

    const canvas = canvasRef.current;
    const engine = new BABYLON.Engine(canvas, config.engine.antialias, {
      adaptToDeviceRatio: config.engine.adaptToDeviceRatio,
    });

    const scene = new BABYLON.Scene(engine);
    const { clearColor } = config.scene;
    scene.clearColor = new BABYLON.Color4(
      clearColor.r,
      clearColor.g,
      clearColor.b,
      clearColor.a,
    );

    // --- Camera ---
    const camCfg = config.camera;
    let camera: BABYLON.Camera;
    if (camCfg.type === "arcRotate") {
      camera = new BABYLON.ArcRotateCamera(
        "camera",
        camCfg.alpha,
        camCfg.beta,
        camCfg.radius,
        new BABYLON.Vector3(camCfg.target.x, camCfg.target.y, camCfg.target.z),
        scene,
      );
    } else {
      camera = new BABYLON.FreeCamera("camera", BABYLON.Vector3.Zero(), scene);
    }
    camera.fov = camCfg.fov;
    camera.minZ = camCfg.minZ;
    camera.maxZ = camCfg.maxZ;
    camera.attachControl(canvas, true);

    // --- Lights --- (tracked in a map so config-driven actions can target them by name)
    const lightMap = new Map<string, BABYLON.Light>();
    config.lights.forEach((lightCfg) => {
      const dir = new BABYLON.Vector3(
        lightCfg.direction.x,
        lightCfg.direction.y,
        lightCfg.direction.z,
      );
      let light: BABYLON.Light;
      switch (lightCfg.type) {
        case "hemispheric":
          light = new BABYLON.HemisphericLight(lightCfg.name, dir, scene);
          break;
        case "directional":
          light = new BABYLON.DirectionalLight(lightCfg.name, dir, scene);
          break;
        default:
          throw new Error(`Unsupported light type: ${lightCfg.type}`);
      }
      light.intensity = lightCfg.intensity;
      if (lightCfg.diffuse) {
        light.diffuse = new BABYLON.Color3(
          lightCfg.diffuse.r,
          lightCfg.diffuse.g,
          lightCfg.diffuse.b,
        );
      }
      lightMap.set(lightCfg.name, light);
    });

    // Tracks whether the effect was cleaned up before async model loading finished,
    // so we don't register actions (or their observers) on a disposed scene.
    let cancelled = false;

    // Load Models (all from /assets/models/), tracked in a map so actions can target them by name
    const loadModels = async () => {
      const baseUrl = "/assets/models/";
      const meshMap = new Map<string, BABYLON.AbstractMesh>();

      for (const modelCfg of config.models) {
        try {
          const result = await BABYLON.SceneLoader.ImportMeshAsync(
            "",
            baseUrl,
            modelCfg.fileName,
            scene,
          );
          const root = result.meshes[0];
          if (root) {
            root.position.set(
              modelCfg.position.x,
              modelCfg.position.y,
              modelCfg.position.z,
            );
            root.rotation.set(
              modelCfg.rotation.x,
              modelCfg.rotation.y,
              modelCfg.rotation.z,
            );
            root.scaling.set(
              modelCfg.scaling.x,
              modelCfg.scaling.y,
              modelCfg.scaling.z,
            );
            meshMap.set(modelCfg.name, root);

            // --- Emission setup ---
            // `root` (result.meshes[0]) is the placeholder transform node
            // ImportMeshAsync returns for the hierarchy — it has no
            // geometry and no material of its own, so setting emission on
            // it is invisible. The actual renderable meshes are its
            // children in `result.meshes`, each carrying its own material
            // (often shared/cached by the glTF loader across instances),
            // so we walk all of them and clone before mutating.
            if (modelCfg.emissionColor) {
              const emissive = new BABYLON.Color3(
                modelCfg.emissionColor.r ?? 0,
                modelCfg.emissionColor.g ?? 0,
                modelCfg.emissionColor.b ?? 0,
              );
              for (const mesh of result.meshes) {
                if (!(mesh instanceof BABYLON.Mesh) || !mesh.material) continue;
                // Clone rather than mutate in place: materials can be
                // shared/cached across meshes (and across separately
                // loaded models), so mutating directly could bleed this
                // model's emission color onto unrelated meshes.

                //Adding boderlines
                const sol = new BABYLON.SelectionOutlineLayer(
                  "outliner",
                  scene,
                );
                // mesh.renderOutline = true;
                // mesh.outlineColor = new BABYLON.Color3(0, 0.1, 0.2);
                // mesh.outlineWidth = 0.01;
                // mesh.enableEdgesRendering();
                // mesh.edgesWidth = 20.0; // Thickness of the outline
                mesh.edgesColor = new BABYLON.Color4(0, 0.1, 0.2, 1); // Blue outline
                const mat = mesh.material.clone(`${mesh.name}-emissive-mat`);
                if (
                  mat instanceof BABYLON.PBRMaterial ||
                  mat instanceof BABYLON.StandardMaterial
                ) {
                  mat.emissiveColor = emissive;
                }
                mesh.material = mat;
              }
            }
          }
        } catch (error) {
          console.error(`Failed to load ${modelCfg.fileName}:`, error);
        }
      }

      if (cancelled) return;

      // 3a. Particle-orbit motion for isStill:false models — independent of
      // the action system, driven straight off each model's config.
      orbitDisposeRef.current = applyOrbitMotion(scene, meshMap, config.models);

      // 3b. Make the live context available to event-driven callers (see
      // useImperativeHandle above) and split actions by trigger mode.
      const ctx: ActionContext = {
        scene,
        camera,
        meshes: meshMap,
        lights: lightMap,
      };
      contextRef.current = ctx;

      const autoActions = (config.actions ?? []).filter(
        (a) => (a.trigger ?? "auto") === "auto",
      );
      const manualActions = (config.actions ?? []).filter(
        (a) => a.trigger === "manual",
      );

      // Auto actions: same behavior as before, run immediately.
      for (const action of autoActions) {
        const handler = ACTION_REGISTRY[action.type];
        if (!handler) {
          console.warn(
            `[loadModels] no handler for action type "${action.type}" (id: ${action.id})`,
          );
          continue;
        }
        const cleanup = handler(ctx, action);
        if (cleanup) runningCleanupsRef.current.set(action.id, cleanup);
      }

      // Manual actions: just registered for later, fired via ref.triggerAction(id).
      for (const action of manualActions) {
        manualActionsRef.current.set(action.id, action);
      }
    };

    loadModels();

    // --- Render Loop ---
    engine.runRenderLoop(() => scene.render());

    // --- Resize ---
    const handleResize = () => engine.resize();
    window.addEventListener("resize", handleResize);

    // --- Cleanup ---
    return () => {
      cancelled = true;
      orbitDisposeRef.current();
      orbitDisposeRef.current = () => {};
      runningCleanupsRef.current.forEach((cleanup) => cleanup());
      runningCleanupsRef.current.clear();
      manualActionsRef.current.clear();
      contextRef.current = null;
      window.removeEventListener("resize", handleResize);
      engine.dispose();
    };
  }, [config]); // re-run when config loads

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100vh", display: "block" }}
    >
      {children}
    </canvas>
  );
});

BabylonScene.displayName = "BabylonScene";

export default BabylonScene;
