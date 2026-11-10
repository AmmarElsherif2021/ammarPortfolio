'use client'
import { useEffect, useState, useCallback, useRef } from "react";

/**
 * useDiscreteScroll
 *
 * A hook that enables discrete (snap) scrolling via wheel, keyboard, and touch.
 * It prevents rapid successive navigations using a cooldown flag stored in a ref.
 *
 * @param sectionsCount - total number of sections (pages)
 * @param scrollToIndex - function to programmatically scroll to a given index
 * @returns { activeIndex, setActiveIndex, isScrolling }
 */
export const useDiscreteScroll = (
  sectionsCount: number,
  scrollToIndex: (index: number) => void
) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  // Refs for values that are accessed inside event handlers
  const activeIndexRef   = useRef<number>(0);
  const isScrollingRef   = useRef<boolean>(false);
  const touchStartRef    = useRef<number>(0);
  const scrollToIndexRef = useRef<(index: number) => void>(scrollToIndex);
  const sectionsCountRef = useRef<number>(sectionsCount);

  // Keep refs in sync with current values without re‑subscribing listeners
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    scrollToIndexRef.current = scrollToIndex;
  }, [scrollToIndex]);

  useEffect(() => {
    sectionsCountRef.current = sectionsCount;
  }, [sectionsCount]);

  // Stable navigation function – uses refs so it never becomes stale
  const navigate = useCallback((delta: number) => {
    if (isScrollingRef.current) return;

    const next = activeIndexRef.current + delta;
    if (next < 0 || next >= sectionsCountRef.current) return;

    isScrollingRef.current = true;
    scrollToIndexRef.current(next);
    setActiveIndex(next);

    // Cooldown matches CSS smooth‑scroll duration (~650 ms)
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 650);
  }, []); // stable for the entire component lifetime

  // Register DOM event listeners exactly once
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 15) return; // ignore trackpad micro‑nudges
      e.preventDefault();
      navigate(e.deltaY > 0 ? 1 : -1);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        navigate(1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        navigate(-1);
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartRef.current = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      const delta = touchStartRef.current - e.touches[0].clientY;
      if (Math.abs(delta) < 20) return;
      e.preventDefault();
      navigate(delta > 0 ? 1 : -1);
      // Reset so continued dragging does not fire again immediately
      touchStartRef.current = e.touches[0].clientY;
    };

    window.addEventListener("wheel",      onWheel,      { passive: false });
    window.addEventListener("keydown",    onKeyDown);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove",  onTouchMove,  { passive: false });

    return () => {
      window.removeEventListener("wheel",      onWheel);
      window.removeEventListener("keydown",    onKeyDown);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove",  onTouchMove);
    };
  }, [navigate]); // navigate is stable → effect runs once

  return {
    activeIndex,
    setActiveIndex,
    isScrolling: isScrollingRef, // the ref itself, so callers can read .current
  };
};