'use client';
// ThreeScene.tsx
/**
 * ThreeScene.tsx – Performance‑optimised 3D canvas.
 *
 * LCP STRATEGY
 * 1. Priority models (marked `priority: true` in config) load immediately.
 * 2. Secondary models deferred via requestIdleCallback.
 * 3. Starts with LOW quality (pixelRatio=1, no shadows) and ramps to HIGH
 *    after priority models are visible → triggers onLCPReady.
 * 4. Render‑on‑demand: animation loop skips when nothing changes.
 * 5. Uses prefetched ArrayBuffers (fetch in idle time) to speed up GLTF parsing.
 */

import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import modelsConfigRaw from '@/_components/three/objects.json';
import type { ModelsConfig, ModelConfig } from '@/interfaces/types'

const modelsConfig = modelsConfigRaw as ModelsConfig;

// ---- Types for the component ref API ----
export interface ThreeSceneRef {
  triggerEffect: (key: string) => void;
  raycastAt: (clientX: number, clientY: number) => string | null;
}

interface ThreeSceneProps {
  /** Array of model keys that should be visible for the current section. */
  activeModelKeys: string[];
  /** Target camera position (Vector3‑compatible). */
  targetCamera: { x: number; y: number; z: number };
  /** Target background colour (string). */
  targetBgColor: string;
  /** Key of the model currently in focus (if any). */
  focusedModelKey: string | null;
  /** Callback when the scene is ready (LCP achieved). */
  onLCPReady?: () => void;
}

// ---- Constants ----
const GLOBAL_CAM = modelsConfig.global?.cameraPosition ?? { x: 0, y: 0, z: 10 };

// Lerp factors
const CAM_LERP = 0.035;
const BG_LERP = 0.040;
const OPA_LERP = 0.055;
const LOOK_LERP = 0.040;
const FOCUS_LERP = 0.060;
const FOCUS_SCALE = 1.5;
const SETTLE_SQ = 1e-4;

// Effects
const GLOW_COLOR = new THREE.Color(0x97e861);
const EFFECT_IN = 0.055;
const EFFECT_OUT = 0.032;
const SCALE_BOOST = 0.18;
const GLOW_PEAK = 0.9;
const PULSE_SPEED = 0.0018;
const PULSE_PEAK = 0.22;

// Quality tiers
const QUALITY = {
  LOW: { pixelRatio: 1, shadows: false },
  HIGH: { pixelRatio: Math.min(window.devicePixelRatio ?? 1, 2), shadows: true },
};

const ThreeScene = forwardRef<ThreeSceneRef, ThreeSceneProps>(
  ({ activeModelKeys, targetCamera, targetBgColor, focusedModelKey, onLCPReady }, ref) => {
    // ---- Refs ----
    const containerRef = useRef<HTMLDivElement | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const frameIdRef = useRef<number | null>(null);
    const initedRef = useRef(false);
    const mountedRef = useRef(true);

    // Model state
    const modelsRef = useRef<Record<string, THREE.Group>>({});
    const opacitiesRef = useRef<Record<string, number>>({});
    const focusScalesRef = useRef<Record<string, number>>({});
    const clickEffectsRef = useRef<Record<string, { t: number; phase: 'in' | 'out' }>>({});

    // Camera and background targets
    const targetCamRef = useRef(new THREE.Vector3(GLOBAL_CAM.x, GLOBAL_CAM.y, GLOBAL_CAM.z));
    const targetBgRef = useRef(new THREE.Color(targetBgColor ?? '#eef7ec'));
    const activeKeysRef = useRef(activeModelKeys);
    const focusedKeyRef = useRef(focusedModelKey ?? null);

    // Look‑at target (for focusing)
    const currentLookAtRef = useRef(new THREE.Vector3(0, 0, 0));
    const targetLookAtRef = useRef(new THREE.Vector3(0, 0, 0));

    // LCP & quality
    const lcpFiredRef = useRef(false);
    const priorityLoadedCount = useRef(0);
    const qualityRampedRef = useRef(false);
    const dirtyRef = useRef(true); // triggers re‑render

    // Pre‑fetched buffers
    const prefetchedBuffers = useRef<Record<string, ArrayBuffer>>({});
    const raycaster = useRef(new THREE.Raycaster());

    // ---- Prop sync (no effect on mount, only updates) ----
    useEffect(() => {
      activeKeysRef.current = Array.isArray(activeModelKeys) ? activeModelKeys : [activeModelKeys];
      if (targetCamera) targetCamRef.current.set(targetCamera.x, targetCamera.y, targetCamera.z);
      if (targetBgColor) targetBgRef.current.set(targetBgColor);
      dirtyRef.current = true;
    }, [activeModelKeys, targetCamera, targetBgColor]);

    useEffect(() => {
      focusedKeyRef.current = focusedModelKey ?? null;
      dirtyRef.current = true;
    }, [focusedModelKey]);

    // ---- Imperative API (exposed via ref) ----
    useImperativeHandle(ref, () => ({
      triggerEffect: (key: string) => {
        clickEffectsRef.current[key] = { t: 0, phase: 'in' };
        dirtyRef.current = true;
      },
      raycastAt: (clientX: number, clientY: number) => {
        const camera = cameraRef.current;
        const renderer = rendererRef.current;
        if (!camera || !renderer) return null;

        const mouse = new THREE.Vector2(
          (clientX / window.innerWidth) * 2 - 1,
          -(clientY / window.innerHeight) * 2 + 1
        );

        raycaster.current.setFromCamera(mouse, camera);

        const meshes: THREE.Mesh[] = [];
        const meshToKey = new Map<string, string>();

        Object.entries(modelsRef.current).forEach(([key, model]) => {
          if (!model || !model.visible) return;
          const cfg = modelsConfig.models[key];
          if (!cfg?.explicit) return;
          if ((opacitiesRef.current[key] ?? 0) < 0.3) return;
          model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              meshes.push(child);
              meshToKey.set(child.uuid, key);
            }
          });
        });

        const intersects = raycaster.current.intersectObjects(meshes, false);
        if (!intersects.length) return null;
        return meshToKey.get(intersects[0].object.uuid) ?? null;
      },
    }));

    // ---- One‑time setup ----
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      mountedRef.current = true;

      // Dynamic priority list (based on config)
      const priorityKeys = Object.keys(modelsConfig.models).filter(
        (key) => modelsConfig.models[key]?.priority === true
      );

      // Pre‑fetch priority models using fetch + idle callback
      const priorityPaths = priorityKeys
        .map((key) => {
          const path = modelsConfig.models[key]?.path;
          return path ? { key, path } : null;
        })
        .filter((entry): entry is { key: string; path: string } => entry !== null);

      const fetchBuffer = ({ key, path }: { key: string; path: string }) => {
        if (typeof window === 'undefined') return;
        fetch(path)
          .then((res) => res.arrayBuffer())
          .then((buffer) => {
            if (mountedRef.current) {
              prefetchedBuffers.current[key] = buffer;
              dirtyRef.current = true;
            }
          })
          .catch((err) => console.warn(`[ThreeScene] Prefetch failed for ${key}:`, err));
      };

      if (typeof window !== 'undefined') {
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(() => priorityPaths.forEach(fetchBuffer), { timeout: 2000 });
        } else {
          setTimeout(() => priorityPaths.forEach(fetchBuffer), 100);
        }
      }

      // ---- Scene initialisation ----
      const initScene = (width: number, height: number) => {
        if (initedRef.current || !mountedRef.current) return;
        initedRef.current = true;

        const scene = new THREE.Scene();
        scene.background = targetBgRef.current.clone();
        sceneRef.current = scene;

        const aspect = width / height;
        const camera = new THREE.PerspectiveCamera(
          aspect >= 1 ? 50 : 80,
          aspect,
          0.1,
          2000
        );
        camera.position.copy(targetCamRef.current);
        camera.lookAt(0, 0, 0);
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setSize(width, height);
        renderer.setPixelRatio(QUALITY.LOW.pixelRatio);
        renderer.shadowMap.enabled = QUALITY.LOW.shadows;
        renderer.shadowMap.type = THREE.PCFShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.1;
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // ---- Lighting ----
        const ambient = new THREE.AmbientLight(0xffffff, 0.7);
        ambient.name = 'ambient';
        scene.add(ambient);

        const sun = new THREE.DirectionalLight(0xfff4e0, 1.2);
        sun.position.set(3, 6, 4);
        sun.castShadow = false;
        sun.name = 'sun';
        scene.add(sun);

        // ---- Quality ramp ----
        const rampToHighQuality = () => {
          if (qualityRampedRef.current || !mountedRef.current) return;
          qualityRampedRef.current = true;

          renderer.setPixelRatio(QUALITY.HIGH.pixelRatio);
          renderer.shadowMap.enabled = QUALITY.HIGH.shadows;
          const sunLight = scene.getObjectByName('sun');
          if (sunLight) sunLight.castShadow = true;

          const fill = new THREE.PointLight(0xd0e8ff, 0.5);
          fill.position.set(-3, 2, -2);
          scene.add(fill);
          const rim = new THREE.PointLight(0x88ffcc, 0.3);
          rim.position.set(0, -1, 3);
          scene.add(rim);

          dirtyRef.current = true;
        };

        // ---- Model loading ----
        const loader = new GLTFLoader();
        const defaults = modelsConfig.default ?? {};

        const loadModel = (key: string, cfg: ModelConfig) => {
          if (!cfg.path) return;

          opacitiesRef.current[key] = 0;
          focusScalesRef.current[key] = 1.0;

          const onLoaded = (gltf: THREE.GLTF) => {
            if (!mountedRef.current) return;
            const model = gltf.scene;

            // Apply transform
            const p = cfg.position as { x?: number; y?: number; z?: number } | undefined;
            model.position.set(p?.x ?? 0, p?.y ?? 0, p?.z ?? 0);
            const r = cfg.rotation as { x?: number; y?: number; z?: number } | undefined;
            model.rotation.set(r?.x ?? 0, r?.y ?? 0, r?.z ?? 0);
            const s = cfg.scale ?? 1;
            if (typeof s === 'number') model.scale.setScalar(s);
            else {
              const scale = s as { x?: number; y?: number; z?: number };
              model.scale.set(scale.x ?? 1, scale.y ?? 1, scale.z ?? 1);
            }
            if (cfg.flipX) model.scale.x *= -1;
            if (cfg.flipY) model.scale.y *= -1;
            if (cfg.flipZ) model.scale.z *= -1;
            if (cfg.tilt) {
              const t = cfg.tilt as { x?: number; y?: number; z?: number };
              model.rotation.set(
                t.x ?? 0,
                t.y ?? 0,
                t.z ?? 0
              );
            }

            const initialActive = Array.isArray(activeModelKeys)
              ? activeModelKeys
              : [activeModelKeys];
            const startOpacity = initialActive.includes(key) ? 1 : 0;
            opacitiesRef.current[key] = startOpacity;

            model.traverse((child) => {
              if (!child.isMesh) return;
              child.castShadow = cfg.castShadow ?? true;
              child.receiveShadow = cfg.receiveShadow ?? false;
              const prepareMat = (m: THREE.Material) => {
                const mat = m.clone();
                mat.transparent = true;
                mat.opacity = startOpacity;
                if (cfg.material) Object.assign(mat, cfg.material);
                return mat;
              };
              child.material = Array.isArray(child.material)
                ? child.material.map(prepareMat)
                : prepareMat(child.material);
            });

            model.visible = startOpacity > 0;
            modelsRef.current[key] = model;
            scene.add(model);
            dirtyRef.current = true;

            // LCP check
            if (priorityKeys.includes(key)) {
              priorityLoadedCount.current += 1;
              if (priorityLoadedCount.current >= priorityKeys.length && !lcpFiredRef.current) {
                lcpFiredRef.current = true;
                requestAnimationFrame(() => {
                  rampToHighQuality();
                  onLCPReady?.();
                });
              }
            }
          };

          const onError = (err: unknown) => console.error(`ThreeScene: Failed to load ${key}`, err);
          const resourcePath = cfg.path.replace(/[^/]*$/, '');

          const cached = prefetchedBuffers.current[key];
          if (cached) {
            loader.parse(cached, resourcePath, onLoaded, onError);
            delete prefetchedBuffers.current[key];
          } else {
            loader.load(cfg.path, onLoaded, undefined, onError);
          }
        };

        // Load priority now, secondary later
        const allEntries = Object.entries(modelsConfig.models);
        const priorityList = allEntries.filter(([k]) => priorityKeys.includes(k));
        const secondaryList = allEntries.filter(([k]) => !priorityKeys.includes(k));

        priorityList.forEach(([key, cfg]) => loadModel(key, { ...defaults, ...cfg }));

        const scheduleSecondary = () => {
          const load = () => {
            if (!mountedRef.current) return;
            secondaryList.forEach(([key, cfg]) => loadModel(key, { ...defaults, ...cfg }));
          };
          if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
            window.requestIdleCallback(load, { timeout: 2000 });
          } else {
            setTimeout(load, 600);
          }
        };
        scheduleSecondary();

        // ---- Render loop ----
        const animate = () => {
          if (!mountedRef.current) return;
          frameIdRef.current = requestAnimationFrame(animate);

          let isDirty = dirtyRef.current;

          // Check if camera or look‑at moved
          if (!isDirty) {
            isDirty = camera.position.distanceToSquared(targetCamRef.current) > SETTLE_SQ;
          }
          if (!isDirty) {
            isDirty = currentLookAtRef.current.distanceToSquared(targetLookAtRef.current) > SETTLE_SQ;
          }
          // Check if any model opacity, focus, auto‑rotate, or effect changed
          if (!isDirty) {
            for (const key of Object.keys(modelsRef.current)) {
              const cfg = modelsConfig.models[key] ?? {};
              const isActive = activeKeysRef.current.includes(key);
              const targetOpa = isActive ? 1 : 0;
              const currOpa = opacitiesRef.current[key] ?? 0;
              if (Math.abs(currOpa - targetOpa) > SETTLE_SQ) {
                isDirty = true;
                break;
              }
              if (isActive && cfg.autoRotate) {
                isDirty = true;
                break;
              }
              if (clickEffectsRef.current[key]) {
                isDirty = true;
                break;
              }
              const isFocused = focusedKeyRef.current === key;
              const targetFocus = isFocused ? FOCUS_SCALE : 1.0;
              const currFocus = focusScalesRef.current[key] ?? 1.0;
              if (Math.abs(currFocus - targetFocus) > 0.001) {
                isDirty = true;
                break;
              }
              if (cfg.explicit && isActive && !isFocused) {
                isDirty = true;
                break;
              }
            }
          }

          if (!isDirty) return;
          dirtyRef.current = false;

          // Update look‑at target
          const focusedKey = focusedKeyRef.current;
          if (focusedKey) {
            const fp = modelsConfig.models[focusedKey]?.position ?? { x: 0, y: 0, z: 0 };
            targetLookAtRef.current.set(fp.x, fp.y, fp.z);
          } else {
            targetLookAtRef.current.set(0, 0, 0);
          }

          const lookMoving = currentLookAtRef.current.distanceToSquared(targetLookAtRef.current) > SETTLE_SQ;
          if (lookMoving) {
            currentLookAtRef.current.lerp(targetLookAtRef.current, LOOK_LERP);
            dirtyRef.current = true;
          }

          const camMoving = camera.position.distanceToSquared(targetCamRef.current) > SETTLE_SQ;
          if (camMoving || lookMoving) {
            if (camMoving) camera.position.lerp(targetCamRef.current, CAM_LERP);
            camera.lookAt(currentLookAtRef.current);
            dirtyRef.current = true;
          }

          scene.background.lerp(targetBgRef.current, BG_LERP);

          const activeKeys = activeKeysRef.current;
          Object.keys(modelsRef.current).forEach((key) => {
            const model = modelsRef.current[key];
            if (!model) return;

            const cfg = modelsConfig.models[key] ?? {};
            const isActive = activeKeys.includes(key);
            const isFocused = focusedKey === key;
            const targetOpa = isActive ? 1 : 0;
            const prevOpa = opacitiesRef.current[key] ?? 0;
            const opaSettled = Math.abs(prevOpa - targetOpa) < SETTLE_SQ;

            if (!opaSettled) {
              const nextOpa = prevOpa + (targetOpa - prevOpa) * OPA_LERP;
              opacitiesRef.current[key] = nextOpa;
              model.visible = nextOpa > 0.0005;
              model.traverse((child) => {
                if (!child.isMesh) return;
                const applyOpa = (m: THREE.Material) => {
                  m.opacity = nextOpa;
                };
                Array.isArray(child.material)
                  ? child.material.forEach(applyOpa)
                  : applyOpa(child.material);
              });
              dirtyRef.current = true;
            }

            // Auto‑rotate
            if (isActive && !isFocused && cfg.autoRotate) {
              model.rotation.y += (cfg.autoRotateSpeed ?? 0.3) * 0.05;
              dirtyRef.current = true;
            }

            // Click effect (pulse + glow)
            const effect = clickEffectsRef.current[key];
            if (effect) {
              if (effect.phase === 'in') {
                effect.t = Math.min(1, effect.t + EFFECT_IN);
                if (effect.t >= 1) effect.phase = 'out';
              } else {
                effect.t = Math.max(0, effect.t - EFFECT_OUT);
                if (effect.t <= 0) delete clickEffectsRef.current[key];
              }

              if (clickEffectsRef.current[key]) {
                const pulse = Math.sin(effect.t * Math.PI);
                const scaleFactor = 1 + pulse * SCALE_BOOST;
                const base = cfg.scale ?? 1;
                const focusMult = focusScalesRef.current[key] ?? 1;
                if (typeof base === 'number') {
                  model.scale.setScalar(base * focusMult * scaleFactor);
                  if (cfg.flipX) model.scale.x *= -1;
                  if (cfg.flipY) model.scale.y *= -1;
                  if (cfg.flipZ) model.scale.z *= -1;
                }
                model.traverse((child) => {
                  if (!child.isMesh) return;
                  const applyGlow = (m: THREE.Material) => {
                    if (!('emissive' in m)) return;
                    const mat = m as THREE.MeshStandardMaterial;
                    mat.emissive.lerp(GLOW_COLOR, pulse * 0.4);
                    mat.emissiveIntensity = pulse * GLOW_PEAK;
                  };
                  Array.isArray(child.material)
                    ? child.material.forEach(applyGlow)
                    : applyGlow(child.material);
                });
                dirtyRef.current = true;
              }
            } else {
              // Focus scaling
              const targetFocusMult = isFocused ? FOCUS_SCALE : 1.0;
              const prevFocusMult = focusScalesRef.current[key] ?? 1.0;
              const focusSettled = Math.abs(prevFocusMult - targetFocusMult) < 0.001;
              if (!focusSettled) {
                const nextFocusMult = prevFocusMult + (targetFocusMult - prevFocusMult) * FOCUS_LERP;
                focusScalesRef.current[key] = nextFocusMult;
                const base = cfg.scale ?? 1;
                if (typeof base === 'number') {
                  model.scale.setScalar(base * nextFocusMult);
                  if (cfg.flipX) model.scale.x *= -1;
                  if (cfg.flipY) model.scale.y *= -1;
                  if (cfg.flipZ) model.scale.z *= -1;
                }
                dirtyRef.current = true;
              }

              // Emissive pulse for interactive models
              model.traverse((child) => {
                if (!child.isMesh) return;
                const applyEmissive = (m: THREE.Material) => {
                  if (!('emissive' in m)) return;
                  const mat = m as THREE.MeshStandardMaterial;
                  if (cfg.explicit && isActive && !isFocused) {
                    const t = Date.now() * PULSE_SPEED;
                    const pulse = Math.sin(t) * 0.5 + 0.5;
                    mat.emissive.copy(GLOW_COLOR);
                    mat.emissiveIntensity = pulse * PULSE_PEAK;
                    dirtyRef.current = true;
                  } else {
                    if (mat.emissiveIntensity === 0) return;
                    mat.emissiveIntensity = Math.max(0, mat.emissiveIntensity - 0.04);
                    if (mat.emissiveIntensity === 0) mat.emissive.set(0, 0, 0);
                    dirtyRef.current = true;
                  }
                };
                Array.isArray(child.material)
                  ? child.material.forEach(applyEmissive)
                  : applyEmissive(child.material);
              });
            }
          });

          renderer.render(scene, camera);
        };

        animate();
      };

      // ---- Resize Observer ----
      const ro = new ResizeObserver((entries) => {
        if (!mountedRef.current) return;
        for (const { contentRect } of entries) {
          const { width, height } = contentRect;
          if (width === 0 || height === 0) continue;
          if (!initedRef.current) {
            initScene(width, height);
          } else {
            const cam = cameraRef.current;
            const renderer = rendererRef.current;
            if (cam && renderer) {
              cam.aspect = width / height;
              cam.updateProjectionMatrix();
              renderer.setSize(width, height);
              dirtyRef.current = true;
            }
          }
        }
      });
      ro.observe(container);

      // ---- Cleanup ----
      return () => {
        mountedRef.current = false;
        ro.disconnect();
        if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);

        // Dispose geometries and materials
        Object.values(modelsRef.current).forEach((model) => {
          model?.traverse((child) => {
            if (!child.isMesh) return;
            child.geometry?.dispose();
            const mats = Array.isArray(child.material) ? child.material : [child.material];
            mats.forEach((m) => {
              m?.map?.dispose();
              m?.dispose();
            });
          });
        });

        modelsRef.current = {};
        opacitiesRef.current = {};
        focusScalesRef.current = {};
        prefetchedBuffers.current = {};

        const dom = rendererRef.current?.domElement;
        if (dom && container.contains(dom)) container.removeChild(dom);
        rendererRef.current?.dispose();

        sceneRef.current = null;
        initedRef.current = false;
      };
    }, []); // empty dependency: run once on mount

    return (
      <div
        ref={containerRef}
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100vh',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
    );
  }
);

ThreeScene.displayName = 'ThreeScene';
export default ThreeScene;