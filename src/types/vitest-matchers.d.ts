import 'vitest';

declare module 'vitest' {
  interface Assertion<T = unknown> {
    toBeTrue(): T;
    toBeFalse(): T;
  }

  interface AsymmetricMatchersContaining {
    toBeTrue(): void;
    toBeFalse(): void;
  }
}
