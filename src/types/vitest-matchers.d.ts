import 'vitest';

declare module 'vitest' {
  interface Assertion<T = any> {
    toBeTrue(): T;
    toBeFalse(): T;
  }

  interface AsymmetricMatchersContaining {
    toBeTrue(): void;
    toBeFalse(): void;
  }
}
