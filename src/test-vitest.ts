import 'zone.js/testing';
import {TestBed} from '@angular/core/testing';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {ActivatedRoute, provideRouter} from '@angular/router';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {provideNativeDateAdapter} from '@angular/material/core';
import {Auth} from '@angular/fire/auth';
import {Firestore} from '@angular/fire/firestore';
import {Storage} from '@angular/fire/storage';
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

const routeParams$ = new BehaviorSubject<Record<string, unknown>>({});
const queryParams$ = new BehaviorSubject<Record<string, unknown>>({});

const defaultTestingProviders: TestingProviderList = [
  provideNoopAnimations(),
  provideNativeDateAdapter(),
  provideRouter([]),
  {provide: Auth, useValue: {}},
  {provide: Firestore, useValue: {}},
  {provide: Storage, useValue: {}},
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
