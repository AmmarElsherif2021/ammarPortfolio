'use client';
// ThreeDisplayer.tsx
//
// Renders a Three.js scene from a declarative config (primitives + GLTF models).
//
// New in this version
// --------------------
// 1. A large central "Start" button kicks off an automatic camera tour.
// 2. The tour visits every model that has an `explicit` block, ordered by
//    that model's `idx`, pausing on each one for `explicitIntervalMs` and
//    showing its title / description / link in an overlay card.
// 3. Any manual camera interaction (drag / zoom / pan via OrbitControls)
//    immediately pauses the tour and hides the explicit overlay. The tour
//    silently resumes from the next stop after `resumeAfterIdleMs` of
//    inactivity, unless the user has paused it permanently via the button.
//
// All new behaviour is additive — passing a config with no `explicit`
// entries renders exactly as before (no button, no overlay, no tour).

import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  CSSProperties,
} from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// ------------------------------------------------------------------
// Types – generic model config (future‑proof)
// ------------------------------------------------------------------

/** Rich content shown in the overlay card when the camera visits a model. */
export interface ExplicitContent {
  title: string;
  description: string;
  /** Optional URL rendered as a link (e.g. project repo / live demo). */
  link?: string;
  /** Allow extra fields (image, tags, etc.) without breaking typing. */
  [key: string]: any;
}

/**
 * A single model entry. All fields are optional – you can add any
 * future attribute (e.g. custom shaders, animations, etc.) and it
 * will simply be ignored if the component doesn't understand it.
 */
export interface ModelConfig {
  // ── Known attributes (typed for safety) ──
  id?: string;
  /** Ordering key for the auto camera tour (lower = visited first). */
  idx?: number;
  /** Optional rich content. Presence of this field opts the model into the tour. */
  explicit?: ExplicitContent;
  /** Geometry type: 'box' | 'sphere' | 'glb' (default if url is present) */
  geometry?: string;
  /** For box/sphere: [width, height, depth] or [radius, radius, radius] (sphere uses first element) */
  size?: [number, number?, number?];
  /** Hex color string for primitives (ignored for GLTF) */
  color?: string;
  /** Render primitive as wireframe */
  wireframe?: boolean;
  /** URL for a GLTF model (required when geometry is 'glb') */
  url?: string;
  /** World position [x, y, z] – defaults to [0,0,0] */
  position?: [number, number, number];
  /** Euler rotation [x, y, z] – overrides tilt if present */
  rotation?: [number, number, number];
  /** Tilt around the X axis – added to rotation.x (default 0) */
  tilt?: number;
  /** Uniform scale (number) or per‑axis [x, y, z] – defaults to 1 */
  scale?: number | [number, number, number];
  /** Rotation speed around X and Y (radians per second) */
  rotationSpeed?: { x: number; y: number };
  /** Play all embedded animations (GLTF only) */
  playAnimation?: boolean;
  /** Material options – e.g. { mode: 'original' } preserves GLTF materials */
  material?: { mode?: string; [key: string]: any };

  // ── Allow any other future properties without errors ──
  [key: string]: any;
}

/**
 * Optional random splatter configuration – creates many primitives
 * scattered randomly within a given range.
 */
export interface SplatterConfig {
  /** Number of objects to create */
  count: number;
  /** 'box' or 'sphere' (default 'box') */
  type?: 'box' | 'sphere';
  /** Size range – one random value chosen between min and max */
  sizeRange?: [number, number];
  /** List of hex colors to pick from randomly */
  colorPalette?: string[];
  /** Objects will be placed inside [-spread, spread] on each axis */
  spread?: number;
}

/** Top‑level config – you can mix manual models and splatter */
export interface Config {
  /** Array of explicitly defined models (your JSON goes here) */
  models?: ModelConfig[];
  /** Generate scattered objects automatically */
  splatter?: SplatterConfig;
}

/** Props for the ThreeDisplayer component */
export interface ThreeDisplayerProps {
  config?: Config;
  /** Extra CSS for the container <div> */
  style?: CSSProperties;
  /** Initial camera position [x, y, z] – default [0, 2, 10] */
  initialCameraPosition?: [number, number, number];
  /** Point the camera looks at – default [0, 0, 0] */
  initialCameraTarget?: [number, number, number];
  /** How long the camera lingers on each explicit stop, in ms (default 4000) */
  explicitIntervalMs?: number;
  /** Idle time after manual interaction before the tour auto‑resumes, in ms (default 5000) */
  resumeAfterIdleMs?: number;
  /** Duration of the camera fly‑to animation between stops, in ms (default 1200) */
  cameraTransitionMs?: number;
}

// ------------------------------------------------------------------
// Small helpers
// ------------------------------------------------------------------

/** Cubic ease‑in‑out – smooths the camera fly‑to animation. */
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// ------------------------------------------------------------------
// Component
// ------------------------------------------------------------------
export default function ThreeDisplayer({
  config,
  style,
  initialCameraPosition = [0, -20, 50],
  initialCameraTarget = [0, 0, 0],
  explicitIntervalMs = 4000,
  resumeAfterIdleMs = 5000,
  cameraTransitionMs = 3200,
}: ThreeDisplayerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // ── React‑visible state (drives the UI overlay only — never read inside
  //    the animation loop directly; the loop reads refs for perf/closure safety) ──
  const [tourStarted, setTourStarted] = useState(false);
  const [tourPaused, setTourPaused] = useState(false); // true while user is interacting / idling
  const [activeExplicit, setActiveExplicit] = useState<ExplicitContent | null>(null);
  const [hasExplicitStops, setHasExplicitStops] = useState(false);

  // Mirrors of the above, safe to read from inside the rAF loop / event handlers
  // without re‑subscribing effects every render.
  const tourStartedRef = useRef(false);
  const tourPausedRef = useRef(false);

  useEffect(() => {
    tourStartedRef.current = tourStarted;
  }, [tourStarted]);
  useEffect(() => {
    tourPausedRef.current = tourPaused;
  }, [tourPaused]);

  useEffect(() => {
    // Guard: nothing to render
    if (!containerRef.current) return;
    const hasModels = config?.models && config.models.length > 0;
    const hasSplatter = config?.splatter && config.splatter.count > 0;
    if (!hasModels && !hasSplatter) return;

    const container = containerRef.current;

    // ─── scene, camera, renderer ──────────────────────────────
    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(...initialCameraPosition);

    // Orbit controls – rotate / zoom / pan with mouse / touch
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(...initialCameraTarget);
    controls.enableDamping = true; // smooth motion
    controls.dampingFactor = 0.05;
    controls.update();

    // ─── lights ───────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 10, 5);
    scene.add(dirLight);

    // ─── enable GLTF caching to avoid duplicate network loads ──
    THREE.Cache.enabled = true;

    // ─── loaders & clock ─────────────────────────────────────
    const gltfLoader = new GLTFLoader();
    const clock = new THREE.Clock(); // single source of truth for elapsed time

    // Collection of all objects that need per‑frame updates
    const entries: {
      model: THREE.Object3D;
      mixer: THREE.AnimationMixer | null; // for GLTF animations
      rotationSpeed: { x: number; y: number } | null;
    }[] = [];

    let disposed = false; // prevents async callbacks after cleanup

    // ════════════════════════════════════════════════════════════
    // CAMERA TOUR STATE (lives entirely inside this effect/closure)
    // ════════════════════════════════════════════════════════════

    /** Models with an `explicit` block, sorted by idx ascending. Built once models finish loading/registering. */
    type TourStop = { position: [number, number, number]; explicit: ExplicitContent; idx: number };
    const tourStops: TourStop[] = [];

    let tourTimerId: ReturnType<typeof setTimeout> | null = null;
    let idleResumeTimerId: ReturnType<typeof setTimeout> | null = null;
    let currentStopIndex = -1;

    // Camera fly‑to animation state (read each frame; null when not animating)
    let flight: {
      fromPos: THREE.Vector3;
      toPos: THREE.Vector3;
      fromTarget: THREE.Vector3;
      toTarget: THREE.Vector3;
      startTime: number; // ms, from performance.now()
    } | null = null;

    function clearTourTimer() {
      if (tourTimerId !== null) {
        clearTimeout(tourTimerId);
        tourTimerId = null;
      }
    }

    function clearIdleResumeTimer() {
      if (idleResumeTimerId !== null) {
        clearTimeout(idleResumeTimerId);
        idleResumeTimerId = null;
      }
    }

    /** Kick off (or resume) a fly‑to animation toward a tour stop and schedule the next hop. */
    function flyToStop(stopIndex: number) {
      if (disposed || tourStops.length === 0) return;
      currentStopIndex = stopIndex % tourStops.length;
      const stop = tourStops[currentStopIndex];

      // Frame the model: stand back along +Z/+Y from the model's own position
      // rather than jumping the camera literally onto it.
      const target = new THREE.Vector3(...stop.position);
      const offset = new THREE.Vector3(0, 1.5, 6);
      const destination = target.clone().add(offset);

      flight = {
        fromPos: camera.position.clone(),
        toPos: destination,
        fromTarget: controls.target.clone(),
        toTarget: target,
        startTime: performance.now(),
      };

      setActiveExplicit(stop.explicit);

      // Schedule the next stop after the camera settles + dwell time.
      clearTourTimer();
      tourTimerId = setTimeout(() => {
        if (disposed || tourPausedRef.current) return;
        flyToStop(currentStopIndex + 1);
      }, cameraTransitionMs + explicitIntervalMs);
    }

    function pauseTour() {
      clearTourTimer();
      clearIdleResumeTimer();
      setTourPaused(true);
      setActiveExplicit(null);
    }

    /** Called on any manual OrbitControls interaction while the tour is running. */
    function handleUserInteraction() {
      if (!tourStartedRef.current) return; // tour never started — nothing to pause
      pauseTour();

      // Auto‑resume from the *next* stop after a period of inactivity.
      clearIdleResumeTimer();
      idleResumeTimerId = setTimeout(() => {
        if (disposed) return;
        setTourPaused(false);
        flyToStop(currentStopIndex + 1);
      }, resumeAfterIdleMs);
    }

    controls.addEventListener('start', handleUserInteraction);

    // ─── helper: create a primitive (box or sphere) ──────────
    function createPrimitive(cfg: ModelConfig): THREE.Mesh | null {
      const {
        geometry,
        size: rawSize,
        color = '#ffffff',
        wireframe = false,
        position = [0, 0, 0],
        tilt = 0,
        scale = 1,
      } = cfg;

      let geo: THREE.BufferGeometry;
      if (geometry === 'box') {
        const [w = 1, h = 1, d = 1] = rawSize ?? [1, 1, 1];
        geo = new THREE.BoxGeometry(w, h, d);
      } else if (geometry === 'sphere') {
        const radius = rawSize?.[0] ?? 1;
        geo = new THREE.SphereGeometry(radius, 32, 16);
      } else {
        return null;
      }

      const mat = new THREE.MeshStandardMaterial({ color, wireframe });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...position);
      mesh.rotation.x = tilt; // tilt is added to X rotation
      if (Array.isArray(scale)) {
        mesh.scale.set(...scale);
      } else {
        mesh.scale.setScalar(scale);
      }
      return mesh;
    }

    /** Register a model's position as a tour stop if it carries `explicit`, then re‑sort by idx. */
    function registerTourStopIfExplicit(entry: ModelConfig, position: [number, number, number]) {
      if (!entry.explicit) return;
      tourStops.push({
        position,
        explicit: entry.explicit,
        idx: entry.idx ?? Number.MAX_SAFE_INTEGER, // entries without idx sort last
      });
      tourStops.sort((a, b) => a.idx - b.idx);
      setHasExplicitStops(true);
    }

    // ─── process manual models ──────────────────────────────
    if (config.models) {
      for (const entry of config.models) {
        const geometry = entry.geometry ?? (entry.url ? 'glb' : undefined);

        // 1) Primitive
        if (geometry === 'box' || geometry === 'sphere') {
          const mesh = createPrimitive(entry);
          if (mesh) {
            scene.add(mesh);
            entries.push({
              model: mesh,
              mixer: null,
              rotationSpeed: entry.rotationSpeed ?? null,
            });
            registerTourStopIfExplicit(entry, entry.position ?? [0, 0, 0]);
          }
          continue;
        }

        // 2) GLTF model
        if (geometry === 'glb' && entry.url) {
          gltfLoader.load(
            entry.url,
            (gltf) => {
              if (disposed) return;
              const model = gltf.scene;

              const {
                position = [0, 0, 0],
                rotation,
                tilt = 0,
                scale = 1,
              } = entry;

              model.position.set(...position);
              if (rotation) {
                model.rotation.set(...rotation);
              } else {
                model.rotation.x = tilt;
              }
              if (Array.isArray(scale)) {
                model.scale.set(...scale);
              } else {
                model.scale.setScalar(scale);
              }

              scene.add(model);

              // Optional animation mixer
              let mixer: THREE.AnimationMixer | null = null;
              if (entry.playAnimation && gltf.animations.length > 0) {
                mixer = new THREE.AnimationMixer(model);
                gltf.animations.forEach((clip) => mixer!.clipAction(clip).play());
              }

              entries.push({
                model,
                mixer,
                rotationSpeed: entry.rotationSpeed ?? null,
              });

              // Tour stops register once the model has actually loaded, since
              // its final world position is only known at this point.
              registerTourStopIfExplicit(entry, position);
            },
            undefined,
            (err) => console.error(`[ThreeDisplayer] Failed to load ${entry.id ?? entry.url}`, err)
          );
        }
      }
    }

    // ─── process splatter (if present) ─────────────────────
    if (config.splatter) {
      const {
        count,
        type = 'box',
        sizeRange = [0.5, 2],
        colorPalette,
        spread = 5,
      } = config.splatter;

      for (let i = 0; i < count; i++) {
        const randomSize = sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]);
        const px = (Math.random() - 0.5) * 2 * spread;
        const py = (Math.random() - 0.5) * 2 * spread;
        const pz = (Math.random() - 0.5) * 2 * spread;
        const randomColor =
          colorPalette && colorPalette.length > 0
            ? colorPalette[Math.floor(Math.random() * colorPalette.length)]
            : '#ffffff';

        const cfg: ModelConfig = {
          geometry: type,
          size: type === 'box' ? [randomSize, randomSize, randomSize] : [randomSize],
          color: randomColor,
          wireframe: false,
          position: [px, py, pz],
          tilt: 0,
          scale: 1,
        };
        const mesh = createPrimitive(cfg);
        if (mesh) {
          scene.add(mesh);
          entries.push({ model: mesh, mixer: null, rotationSpeed: null });
        }
      }
    }

    // ─── animation loop (delta clamped to avoid huge jumps) ──
    let animId: number;

    // Closure variable replaces the fragile `(animate as any)._lastElapsed`
    // and is initialised so the first frame’s delta is effectively 0.
    let lastElapsed = clock.getElapsedTime();

    function animate() {
      animId = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();
      let delta = elapsed - lastElapsed;

      // Clamp to prevent multi‑second jumps (e.g. after tab backgrounding).
      if (delta > 0.1) delta = 0.1;
      lastElapsed = elapsed;

      for (const entry of entries) {
        // Update GLTF animations
        entry.mixer?.update(delta);

        // Apply rotation speed (rad/s)
        if (entry.rotationSpeed) {
          entry.model.rotation.x += entry.rotationSpeed.x * delta;
          entry.model.rotation.y += entry.rotationSpeed.y * delta;
        }
      }

      // Drive the camera fly‑to animation, if one is in progress.
      if (flight) {
        const now = performance.now();
        const t = Math.min(1, (now - flight.startTime) / cameraTransitionMs);
        const eased = easeInOutCubic(t);

        camera.position.lerpVectors(flight.fromPos, flight.toPos, eased);
        controls.target.lerpVectors(flight.fromTarget, flight.toTarget, eased);

        if (t >= 1) {
          flight = null; // animation complete
        }
      }

      controls.update(); // needed for damping
      renderer.render(scene, camera);
    }
    animate();

    // ─── window resize ─────────────────────────────────────
    function onResize() {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', onResize);

    // ─── expose tour controls to the React layer (button click) ──────
    // Stashed on the container's dataset-free ref via a plain object so the
    // "Start" button (rendered by React, outside this effect) can trigger it.
    (container as any).__startTour = () => {
      if (tourStops.length === 0) return; // nothing to tour
      setTourStarted(true);
      setTourPaused(false);
      flyToStop(0);
    };

    // ─── cleanup ───────────────────────────────────────────
    return () => {
      disposed = true;
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      controls.removeEventListener('start', handleUserInteraction);
      clearTourTimer();
      clearIdleResumeTimer();

      for (const { model, mixer } of entries) {
        mixer?.stopAllAction();
        scene.remove(model);
        model.traverse((child) => {
          if (!(child as THREE.Mesh).isMesh) return;
          const mesh = child as THREE.Mesh;
          mesh.geometry?.dispose();
          const materials = Array.isArray(mesh.material)
            ? mesh.material
            : [mesh.material];
          materials.forEach((m) => m?.dispose());
        });
      }

      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      controls.dispose();
    };
  }, [
    config,
    initialCameraPosition,
    initialCameraTarget,
    explicitIntervalMs,
    resumeAfterIdleMs,
    cameraTransitionMs,
  ]);

  /** Handler for the "Start" button — delegates into the Three.js effect via the stashed fn. */
  const handleStartClick = useCallback(() => {
    const container = containerRef.current as any;
    container?.__startTour?.();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative', ...style }}
    >
      {/* ── Start button: only shown before the tour has begun ── */}
      {!tourStarted && hasExplicitStops && (
        <button
          onClick={handleStartClick}
          aria-label="Start tour"
          style={startButtonStyle}
        >
          ▶ Start
        </button>
      )}

      {/* ── Explicit content overlay: shown only while a tour stop is active and not paused ── */}
      {tourStarted && !tourPaused && activeExplicit && (
        <div style={overlayCardStyle}>
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{activeExplicit.title}</h3>
          <p style={{ margin: '0.5rem 0', fontSize: '0.9rem', opacity: 0.85 }}>
            {activeExplicit.description}
          </p>
          {activeExplicit.link && (
            <a
              href={
                activeExplicit.link.startsWith('http')
                  ? activeExplicit.link
                  : `https://${activeExplicit.link}`
              }
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: '0.85rem', color: '#7ad6ff' }}
            >
              {activeExplicit.link}
            </a>
          )}
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------------
// Inline styles (kept local — swap for your design system as needed)
// ------------------------------------------------------------------

const startButtonStyle: CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  padding: '1rem 2.5rem',
  fontSize: '1.25rem',
  fontWeight: 600,
  borderRadius: '999px',
  border: 'none',
  cursor: 'pointer',
  background: 'rgba(0, 160, 147, 0.9)', // brand teal-green
  color: '#ffffff',
  letterSpacing: '0.03em',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
  zIndex: 10,
};

const overlayCardStyle: CSSProperties = {
  position: 'absolute',
  left: '1.5rem',
  bottom: '1.5rem',
  maxWidth: '320px',
  padding: '1rem 1.25rem',
  borderRadius: '12px',
  background: 'rgba(20, 20, 24, 0.75)',
  backdropFilter: 'blur(8px)',
  color: '#ffffff',
  zIndex: 10,
  pointerEvents: 'auto',
};