import { useEffect, useRef, useCallback } from 'react';

// ---- Web Component definition (vanilla JS class, but with type annotations) ----

/**
 * ClickSpark custom element – renders a burst of lines at click/touch position.
 * It listens to 'click' events on its parent and animates.
 */
class ClickSparkElement extends HTMLElement {
  private svg: SVGSVGElement | null = null;
  private _parent: HTMLElement | null = null;
  private shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback(): void {
    this.shadow.innerHTML = this.createSparkHTML();
    this.svg = this.shadow.querySelector('svg');
    this._parent = this.parentNode as HTMLElement;
    if (this._parent) {
      this._parent.addEventListener('click', this);
    }
  }

  disconnectedCallback(): void {
    if (this._parent) {
      this._parent.removeEventListener('click', this);
      this._parent = null;
    }
  }

  // Handles both mouse and touch events via the 'click' event (or manually triggered)
  handleEvent(e: MouseEvent | TouchEvent): void {
    this.setSparkPosition(e);
    this.animateSpark();
  }

  private animateSpark(): void {
    if (!this.svg) return;
    const sparks = [...this.svg.children] as SVGLineElement[];
    if (sparks.length === 0) return;

    const size = parseInt(sparks[0].getAttribute('y1') || '30', 10);
    const offset = size / 2 + 'px';

    const keyframes = (i: number): Keyframe[] => {
      const deg = `calc(${i} * (360deg / ${sparks.length}))`;
      return [
        {
          strokeDashoffset: size * 3,
          transform: `rotate(${deg}) translateY(${offset})`,
        },
        {
          strokeDashoffset: size,
          transform: `rotate(${deg}) translateY(0)`,
        },
      ];
    };

    const options: KeyframeAnimationOptions = {
      duration: 1000,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
      fill: 'forwards',
    };

    sparks.forEach((spark, i) => {
      spark.animate(keyframes(i), options);
    });
  }

  private setSparkPosition(e: MouseEvent | TouchEvent): void {
    if (!this._parent) return;
    const rect = this._parent.getBoundingClientRect();

    let clientX: number, clientY: number;
    if (e instanceof TouchEvent) {
      // Use the first touch point (or changedTouches for touchend)
      const touch = e.touches[0] || e.changedTouches[0];
      if (!touch) return;
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const sparkSize = 150;
    this.style.left = `${x - sparkSize / 2}px`;
    this.style.top = `${y - sparkSize / 2}px`;
  }

  private createSparkHTML(): string {
    return `
      <style>
        :host {
          position: absolute;
          pointer-events: none;
          z-index: 1000;
        }
      </style>
      <svg width="150" height="150" viewBox="0 0 100 100" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" stroke="var(--click-spark-color, #166f44)" transform="rotate(-20)">
        ${Array.from(
          { length: 8 },
          () =>
            `<line x1="50" y1="30" x2="50" y2="4" stroke-dasharray="30" stroke-dashoffset="30" style="transform-origin: center" />`
        ).join('')}
      </svg>
    `;
  }
}

// ---- Custom element registration (only once) ----
let isRegistered = false;

const defineClickSparkElement = (): void => {
  if (isRegistered || customElements.get('click-spark')) return;
  customElements.define('click-spark', ClickSparkElement);
  isRegistered = true;
};

// ---- Hook interface ----
interface UseClickSparkReturn {
  createSpark: (event: MouseEvent | TouchEvent, container: HTMLElement) => void;
  cleanupSparks: () => void;
}

/**
 * useClickSpark
 *
 * Provides a function to create a spark effect at the click/touch position.
 * The spark is a web component that animates and auto‑removes.
 */
export const useClickSpark = (): UseClickSparkReturn => {
  const sparkElementsRef = useRef<Set<ClickSparkElement>>(new Set());

  // Register the custom element once on mount
  useEffect(() => {
    defineClickSparkElement();
  }, []);

  const createSpark = useCallback(
    (event: MouseEvent | TouchEvent, container: HTMLElement): void => {
      if (!container) return;

      const spark = document.createElement('click-spark') as ClickSparkElement;
      // Set the spark colour (could be customised)
      spark.style.setProperty('--click-spark-color', '#97e861ff');

      container.appendChild(spark);
      sparkElementsRef.current.add(spark);

      // For touch events, we need to ensure the event carries the right coordinates.
      // The web component's handleEvent will read from the event directly.
      // We trigger it manually after a tiny delay to let the DOM attach.
      setTimeout(() => {
        spark.handleEvent(event);
      }, 20);

      // Remove spark after animation completes
      setTimeout(() => {
        if (spark.parentNode) {
          spark.parentNode.removeChild(spark);
        }
        sparkElementsRef.current.delete(spark);
      }, 700);
    },
    []
  );

  const cleanupSparks = useCallback(() => {
    sparkElementsRef.current.forEach((spark) => {
      if (spark.parentNode) {
        spark.parentNode.removeChild(spark);
      }
    });
    sparkElementsRef.current.clear();
  }, []);

  return { createSpark, cleanupSparks };
};

export default useClickSpark;
