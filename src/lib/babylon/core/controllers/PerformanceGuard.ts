import { IEngineController } from '../interfaces/IEngineController';

export interface PerformanceGuardOptions {
  engineController: IEngineController;
  canvas: HTMLCanvasElement;
  onPause?: () => void;
  onResume?: () => void;
}

export class PerformanceGuard {
  private visibilityHandler: (() => void) | null = null;
  private observer: IntersectionObserver | null = null;
  private paused = false;

  constructor(private readonly opts: PerformanceGuardOptions) {}

  /** True when the user asked the OS for reduced motion. */
  static prefersReducedMotion(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  start(): void {
    this.visibilityHandler = () => {
      if (document.hidden) this.pause();
      else this.resume();
    };
    document.addEventListener('visibilitychange', this.visibilityHandler);

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) this.resume();
          else this.pause();
        }
      },
      { threshold: 0.1 }
    );
    this.observer.observe(this.opts.canvas);
  }

  pause(): void {
    if (this.paused) return;
    this.paused = true;
    this.opts.engineController.pauseRenderLoop();
    this.opts.onPause?.();
  }

  resume(): void {
    if (!this.paused) return;
    this.paused = false;
    this.opts.engineController.resumeRenderLoop();
    this.opts.onResume?.();
  }

  dispose(): void {
    if (this.visibilityHandler) {
      document.removeEventListener('visibilitychange', this.visibilityHandler);
      this.visibilityHandler = null;
    }
    this.observer?.disconnect();
    this.observer = null;
  }
}
