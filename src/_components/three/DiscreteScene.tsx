// DiscreteLandingPage.tsx
'use client'; // Required for hooks and dynamic imports

import React, { useEffect, useRef, useCallback, useState, useMemo, Suspense } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { useDiscreteScroll } from '@/hooks/useDiscreteScrolling';
import useClickSpark from '@/hooks/useClickSpark';
import Section from './Section';
import landingConfig from '@/_components/three/landingConfigs.json';
import modelsConfig from '@/_components/three/objects.json';
import type { LandingConfig, Segment, ModelConfig } from '@/interfaces/types';
import type { ThreeSceneRef } from './ThreeScene';

type ModelKey = keyof typeof modelsConfig.models;

const isModelKey = (value: string): value is ModelKey => value in modelsConfig.models;

// Dynamically import ThreeScene with SSR disabled
const ThreeScene = dynamic(() => import('./ThreeScene'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-port-white/20 dark:bg-port-dark/20 z-10">
      <div className="text-port-dark dark:text-port-white">Loading 3D scene…</div>
    </div>
  ),
});

// ---- Helper: navSection → segment index ----
const SECTION_TO_INDEX = (landingConfig as LandingConfig).segments.reduce(
  (acc: Record<string, number>, seg: Segment, idx: number) => {
    if (seg.navSection && !(seg.navSection.toLowerCase() in acc)) {
      acc[seg.navSection.toLowerCase()] = idx;
    }
    if (seg.id && !(seg.id.toLowerCase() in acc)) {
      acc[seg.id.toLowerCase()] = idx;
    }
    return acc;
  },
  {}
);

/** Compute camera position to focus on a given model. */
const getFocusCameraFor = (key: ModelKey) => {
  const cfg = modelsConfig.models[key];
  if (!cfg) return null;
  const p = cfg.position ? { ...cfg.position, y: cfg.position.y + 200 } : { x: 0, y: 0, z: 0 };
  const scale = typeof cfg.scale === 'number' ? cfg.scale : 1;
  const dist = Math.max(80, Math.min(scale * 1.2, 220));
  return { x: p.x, y: p.y + dist * 0.25, z: p.z + dist };
};

// ---- Blinking cursor ----
const Cursor = () => (
  <motion.span
    animate={{ opacity: [1, 0, 1] }}
    transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
    className="font-bold ml-0.5"
  >
    |
  </motion.span>
);

// ---- FocusCard ----
interface FocusCardProps {
  cfg: ModelConfig['explicit'];
  onDismiss: () => void;
  navPath?: string;
  navSection?: string;
}

const FocusCard = ({ cfg, onDismiss, navPath, navSection }: FocusCardProps) => {
  const router = useRouter();
  const [typedIndex, setTypedIndex] = useState(0);
  const [typingDone, setTypingDone] = useState(false);

  useEffect(() => {
    if (!cfg?.brief) {
      setTypedIndex(0);
      setTypingDone(true);
      return;
    }
    setTypedIndex(0);
    setTypingDone(false);
    const interval = setInterval(() => {
      setTypedIndex((prev) => {
        if (prev < cfg.brief!.length) return prev + 1;
        clearInterval(interval);
        setTypingDone(true);
        return prev;
      });
    }, 25);
    return () => clearInterval(interval);
  }, [cfg?.brief]);

  const displayedText = cfg?.brief?.slice(0, typedIndex) ?? '';

  const handleNavigation = () => {
    if (navPath && navSection) {
      router.push(`${navPath}?scrollTo=${encodeURIComponent(navSection)}`);
    } else if (cfg?.link) {
      if (cfg.link.startsWith('http')) {
        window.open(cfg.link, '_blank');
      } else {
        router.push(cfg.link);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.97 }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-[15%] left-[5%] -translate-x-1/2 z-20 w-[min(400px,90vw)] pointer-events-auto"
    >
      <div className="p-0 md:p-1 gap-1">
        <p className="text-xs font-bold tracking-[0.18em] uppercase text-port-btn bg-port-white/80 dark:bg-port-dark/80 w-fit mb-2 px-2 py-1 rounded-btn shadow-card">
          {cfg?.label}
        </p>
        <p className="text-sm md:text-base text-port-dark dark:text-port-white leading-relaxed mb-2 bg-port-white/80 dark:bg-port-dark/80 w-fit p-2 rounded-card shadow-card">
          {displayedText}
          {!typingDone && <Cursor />}
        </p>
        {typingDone && (navPath || cfg?.link) && (
          <button
            onClick={handleNavigation}
            className="bg-port-btn text-port-white font-bold text-sm px-4 py-2 rounded-btn shadow-card transition-transform hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
          >
            {'Learn More'}
          </button>
        )}
      </div>
    </motion.div>
  );
};

// ---- Main Component ----
const DiscreteLandingPage = () => {
  const { segments } = landingConfig as LandingConfig;
  const sectionsRef = useRef<HTMLDivElement[]>([]);
  const threeSceneRef = useRef<ThreeSceneRef | null>(null);
  const { createSpark } = useClickSpark();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
    // ---- Scroll management ----
  const scrollToSection = useCallback((index: number) => {
    sectionsRef.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);
  const [sceneReady, setSceneReady] = useState(false);
  

    const { activeIndex, setActiveIndex } = useDiscreteScroll(
    segments.length,
    scrollToSection
  );
  const activeIndexRef = useRef(activeIndex);
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);
  // ---- Handle scrollTo from URL param ----
  useEffect(() => {
    const scrollTo = searchParams?.get('scrollTo');
    if (!scrollTo) return;
    const normalised = scrollTo.toLowerCase().trim();
    const targetIndex = SECTION_TO_INDEX[normalised];
    if (targetIndex !== undefined) {
      const id = setTimeout(() => {
        sectionsRef.current[targetIndex]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveIndex(targetIndex);
      }, 120);
      return () => clearTimeout(id);
    }
  }, [searchParams, setActiveIndex]);

  // ---- State ----
  const [focusedModelKey, setFocusedModelKey] = useState<ModelKey | null>(null);
  const focusedModelKeyRef = useRef(focusedModelKey);
  useEffect(() => {
    focusedModelKeyRef.current = focusedModelKey;
  }, [focusedModelKey]);

  const focusCameraPosition = useMemo(
    () => (focusedModelKey ? getFocusCameraFor(focusedModelKey) : null),
    [focusedModelKey]
  );

  const dismissFocus = useCallback(() => setFocusedModelKey(null), []);





  // ---- IntersectionObserver for active section ----
  useEffect(() => {
    const elementToIndex = new Map<HTMLDivElement, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const idx = elementToIndex.get(entry.target as HTMLDivElement);
          if (idx !== undefined && idx !== activeIndexRef.current) {
            setActiveIndex(idx);
            setFocusedModelKey(null);
          }
        }
      },
      { threshold: 0.55 }
    );
    sectionsRef.current.forEach((el, idx) => {
      if (el) {
        elementToIndex.set(el, idx);
        observer.observe(el);
      }
    });
    return () => observer.disconnect();
  }, [setActiveIndex]);

  // ---- Click handler for sparks and raycasting ----
  const handleContainerClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      createSpark(e.nativeEvent , document.body);
      if (threeSceneRef.current) {
        const key = threeSceneRef.current.raycastAt(e.clientX, e.clientY);
        if (key && isModelKey(key) && modelsConfig.models[key]?.explicit) {
          setFocusedModelKey((prev) => (prev === key ? null : key));
        } else if (!key && focusedModelKeyRef.current) {
          setFocusedModelKey(null);
        }
      }
    },
    [createSpark]
  );

  // ---- Determine active segment data ----
  const activeSegment = segments[activeIndex] ?? segments[0];
  const activeModelKeys = Array.isArray(activeSegment.modelKey)
    ? activeSegment.modelKey
    : [activeSegment.modelKey];

  const targetCamera = focusCameraPosition ?? activeSegment.cameraPosition;

  const focusedCfg = focusedModelKey ? modelsConfig.models[focusedModelKey] : null;
  const focusedExplicit = focusedCfg?.explicit ?? null;
  const focusedNavPath = focusedCfg?.navPath;
  const focusedNavSection = focusedCfg?.navSection;

  const handleSceneReady = useCallback(() => setSceneReady(true), []);

  return (
    <div
      onClick={handleContainerClick}
      className="relative h-screen max-w-[99vw] m-0 overflow-hidden overflow-x-hidden cursor-pointer"
    >
      {/* Loading overlay (shown until ThreeScene signals ready) */}
      {!sceneReady && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/10 dark:bg-white/10 pointer-events-none">
          <div className="text-center text-port-dark dark:text-port-white text-sm">
            Loading 3D scene…
          </div>
        </div>
      )}

      {/* 3D Scene (dynamic, SSR disabled) */}
      <ThreeScene
        ref={threeSceneRef}
        activeModelKeys={activeModelKeys}
        targetCamera={targetCamera}
        targetBgColor={activeSegment.sceneBackground}
        focusedModelKey={focusedModelKey}
        onLCPReady={handleSceneReady}
      />

      {/* Focus Card */}
      <AnimatePresence>
        {focusedExplicit && (
          <FocusCard
            cfg={focusedExplicit}
            onDismiss={dismissFocus}
            navPath={focusedNavPath}
            navSection={focusedNavSection}
          />
        )}
      </AnimatePresence>

      {/* Scroll‑snapping sections */}
      <div className="relative z-1 h-full overflow-y-auto [scroll-snap-type:y_mandatory]">
        {segments.map((segment: Segment, idx: number) => (
          <div
            key={segment.id}
            ref={(el: HTMLDivElement | null) => {
              if (el) sectionsRef.current[idx] = el;
            }}
            className="h-screen [scroll-snap-align:start]"
          >
            <Section data={segment} isActive={activeIndex === idx} index={idx} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscreteLandingPage;