type SpyAnd = {
  returnValue(value?: unknown): jasmine.Spy;
  resolveTo(value?: unknown): jasmine.Spy;
  rejectWith(value?: unknown): jasmine.Spy;
  callFake(fn: (...args: any[]) => unknown): jasmine.Spy;
  callThrough(): jasmine.Spy;
};

type SpyCalls = {
  argsFor(index: number): any[];
  mostRecent(): {args: any[]};
};

declare global {
  function spyOn<T = any>(object: T, methodName: any): jasmine.Spy;
  function expectAsync<T>(value: Promise<T>): {
    toBeResolvedTo(expected: T): Promise<void>;
    toBeRejectedWithError(expected?: string | RegExp | Error): Promise<void>;
  };

  namespace jasmine {
    type Spy<T extends (...args: any[]) => any = (...args: any[]) => any> = T & ReturnType<typeof import('vitest')['vi']['fn']> & {
      and: SpyAnd;
      calls: SpyCalls;
    };

    type SpyObj<T> = {
      [K in keyof T]: T[K] extends (...args: any[]) => any ? Spy<T[K]> : T[K];
    };

    function createSpy(name?: string): Spy;
    function createSpyObj<T>(
      baseName: string,
      methodNames: string[] | Record<string, unknown>,
      propertyValues?: Record<string, unknown>
    ): SpyObj<T>;
    function any(expectedClass: unknown): unknown;
    function anything(): unknown;
    function objectContaining<T>(value: Partial<T>): unknown;
    function stringMatching(value: string | RegExp): unknown;
  }
}

export {};
