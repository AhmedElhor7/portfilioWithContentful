type IntersectionCallback = (entries: IntersectionObserverEntry[], observer: unknown) => void;

/**
 * Controllable IntersectionObserver stand-in: tests decide when an element
 * "enters" the viewport so scroll reveals can be asserted deterministically.
 */
class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = [];

  readonly root: Element | null = null;
  readonly rootMargin: string = "0px";
  readonly thresholds: readonly number[] = [];
  readonly targets = new Set<Element>();

  private readonly callback: IntersectionCallback;

  constructor(callback: IntersectionCallback) {
    this.callback = callback;
    MockIntersectionObserver.instances.push(this);
  }

  observe(target: Element): void {
    this.targets.add(target);
  }

  unobserve(target: Element): void {
    this.targets.delete(target);
  }

  disconnect(): void {
    this.targets.clear();
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  /** Simulates the observer firing for every observed element. */
  trigger(isIntersecting = true): void {
    if (this.targets.size === 0) return;

    const now = Date.now();
    const entries = [...this.targets].map((target) => {
      const rect = target.getBoundingClientRect();

      return {
        target,
        isIntersecting,
        intersectionRatio: isIntersecting ? 1 : 0,
        boundingClientRect: rect,
        intersectionRect: rect,
        rootBounds: null,
        time: now,
      } as IntersectionObserverEntry;
    });

    this.callback(entries, this);
  }
}

/** Every observer created since the last reset, in creation order. */
export function getIntersectionObservers(): MockIntersectionObserver[] {
  return MockIntersectionObserver.instances;
}

/** Clears the registry between tests. */
export function resetIntersectionObservers(): void {
  MockIntersectionObserver.instances = [];
}

export { MockIntersectionObserver };
