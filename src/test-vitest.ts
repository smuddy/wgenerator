import {expect, vi} from 'vitest';

import 'zone.js/testing';
import {TestBed} from '@angular/core/testing';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {ActivatedRoute, provideRouter} from '@angular/router';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {provideNativeDateAdapter} from '@angular/material/core';
import {getApp, getApps, initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {getAuth, provideAuth} from '@angular/fire/auth';
import {initializeFirestore, provideFirestore} from '@angular/fire/firestore';
import {getStorage, provideStorage} from '@angular/fire/storage';
import {environment} from './environments/environment';
import {DbService} from './app/services/db.service';

type TestingModuleDefinition = Parameters<typeof TestBed.configureTestingModule>[0];
type TestingProviderList = NonNullable<NonNullable<TestingModuleDefinition>['providers']>;
type CollectionStub = {
  valueChanges: () => Observable<unknown[]>;
  add: () => Promise<{id: string}>;
};
type DocumentStub = {
  set: () => Promise<void>;
  update: () => Promise<void>;
  delete: () => Promise<void>;
  collection: () => CollectionStub;
};

type MockFunction = ReturnType<typeof vi.fn> & {
  and: {
    returnValue: (value: unknown) => MockFunction;
    resolveTo: (value: unknown) => MockFunction;
    rejectWith: (value: unknown) => MockFunction;
    callFake: (fn: (...args: unknown[]) => unknown) => MockFunction;
    callThrough: () => MockFunction;
  };
  calls: {
    argsFor: (index: number) => unknown[];
    mostRecent: () => {args: unknown[]};
  };
};

const routeParams$ = new BehaviorSubject<Record<string, unknown>>({});
const queryParams$ = new BehaviorSubject<Record<string, unknown>>({});
const defaultFirebaseApp = getApps().length > 0 ? getApp() : initializeApp(environment.firebase);

const defaultTestingProviders: TestingProviderList = [
  provideNoopAnimations(),
  provideNativeDateAdapter(),
  provideRouter([]),
  provideFirebaseApp(() => defaultFirebaseApp),
  provideAuth(() => getAuth(defaultFirebaseApp)),
  provideFirestore(() => initializeFirestore(defaultFirebaseApp, {})),
  provideStorage(() => getStorage(defaultFirebaseApp)),
  {
    provide: ActivatedRoute,
    useValue: {
      snapshot: {params: {}, queryParams: {}, data: {}},
      params: routeParams$.asObservable(),
      queryParams: queryParams$.asObservable(),
      data: of({}),
      fragment: of(null),
    },
  },
  {provide: MAT_DIALOG_DATA, useValue: {}},
  {provide: MatDialogRef, useValue: {close: () => void 0}},
  {
    provide: DbService,
    useValue: {
      col$: () => of([]),
      doc$: () => of(null),
      col: (): CollectionStub => ({
        valueChanges: () => of([]),
        add: () => Promise.resolve({id: 'test-id'}),
      }),
      doc: (): DocumentStub => ({
        set: () => Promise.resolve(),
        update: () => Promise.resolve(),
        delete: () => Promise.resolve(),
        collection: (): CollectionStub => ({
          valueChanges: () => of([]),
          add: () => Promise.resolve({id: 'test-id'}),
        }),
      }),
    },
  },
];

const originalConfigureTestingModule = TestBed.configureTestingModule.bind(TestBed);
const configureTestingModule: typeof TestBed.configureTestingModule = moduleDef => {
  const extraProviders: TestingProviderList = moduleDef?.providers ?? [];
  const mergedModuleDef: TestingModuleDefinition = moduleDef ? {...moduleDef} : {};
  mergedModuleDef.providers = defaultTestingProviders.concat(extraProviders);

  return originalConfigureTestingModule(mergedModuleDef);
};
TestBed.configureTestingModule = configureTestingModule;

function decorateMock<T extends ReturnType<typeof vi.fn>>(mock: T): T & MockFunction {
  const decorated = mock as T & MockFunction;

  Object.defineProperty(decorated, 'and', {
    configurable: true,
    get: () => ({
      returnValue(value: unknown) {
        decorated.mockReturnValue(value);
        return decorated;
      },
      resolveTo(value: unknown) {
        decorated.mockResolvedValue(value);
        return decorated;
      },
      rejectWith(value: unknown) {
        decorated.mockRejectedValue(value);
        return decorated;
      },
      callFake(fn: (...args: unknown[]) => unknown) {
        decorated.mockImplementation(fn);
        return decorated;
      },
      callThrough() {
        return decorated;
      },
    }),
  });

  Object.defineProperty(decorated, 'calls', {
    configurable: true,
    get: () => ({
      argsFor(index: number) {
        return decorated.mock.calls[index] ?? [];
      },
      mostRecent() {
        const args = decorated.mock.lastCall ?? [];
        return {args};
      },
    }),
  });

  return decorated;
}

function createSpy(name?: string): MockFunction {
  const spy = decorateMock(vi.fn());
  if (name) {
    spy.mockName(name);
  }

  return spy;
}

function createSpyObj<T>(
  baseName: string,
  methodNames: string[] | Record<string, unknown>,
  propertyValues?: Record<string, unknown>
): T {
  const result: Record<string, unknown> = {};
  const methods = Array.isArray(methodNames) ? methodNames : Object.keys(methodNames);

  for (const methodName of methods) {
    result[methodName] = createSpy(`${baseName}.${methodName}`);
  }

  if (!Array.isArray(methodNames)) {
    for (const [key, value] of Object.entries(methodNames)) {
      (result[key] as MockFunction).and.returnValue(value);
    }
  }

  if (propertyValues) {
    for (const [key, value] of Object.entries(propertyValues)) {
      result[key] = value;
    }
  }

  return result as T;
}

function spyOnCompat<T extends object, K extends keyof T>(object: T, methodName: K): MockFunction {
  const spy = vi.spyOn(object as Record<PropertyKey, (...args: unknown[]) => unknown>, methodName as PropertyKey);
  return decorateMock(spy as unknown as ReturnType<typeof vi.fn>);
}

function expectAsyncCompat<T>(value: Promise<T>) {
  return {
    async toBeResolvedTo(expected: T) {
      await expect(value).resolves.toEqual(expected);
    },
    async toBeRejectedWithError(expected?: string | RegExp | Error) {
      if (expected instanceof Error) {
        await expect(value).rejects.toThrowError(expected.message);
      } else if (expected !== undefined) {
        await expect(value).rejects.toThrowError(expected);
      } else {
        await expect(value).rejects.toThrowError();
      }
    },
  };
}

expect.extend({
  toBeTrue(received: unknown) {
    return {
      pass: received === true,
      message: () => `expected ${String(received)} to be true`,
    };
  },
  toBeFalse(received: unknown) {
    return {
      pass: received === false,
      message: () => `expected ${String(received)} to be false`,
    };
  },
});

Object.assign(globalThis, {
  spyOn: spyOnCompat,
  expectAsync: expectAsyncCompat,
  jasmine: {
    createSpy,
    createSpyObj,
    any: expect.any,
    anything: expect.anything,
    objectContaining: expect.objectContaining,
    stringMatching: expect.stringMatching,
  },
});
