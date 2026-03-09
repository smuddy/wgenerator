// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/testing';
import {getTestBed, TestBed} from '@angular/core/testing';
import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from '@angular/platform-browser-dynamic/testing';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {ActivatedRoute, provideRouter} from '@angular/router';
import {BehaviorSubject, of} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {provideNativeDateAdapter} from '@angular/material/core';
import {provideFirebaseApp, initializeApp} from '@angular/fire/app';
import {getApp, getApps} from '@angular/fire/app';
import {getAuth, provideAuth} from '@angular/fire/auth';
import {initializeFirestore, provideFirestore} from '@angular/fire/firestore';
import {getStorage, provideStorage} from '@angular/fire/storage';
import {environment} from './environments/environment';
import {DbService} from './app/services/db.service';

type req = {keys: () => {map: (context: req) => void}};

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

const routeParams$ = new BehaviorSubject<Record<string, unknown>>({});
const queryParams$ = new BehaviorSubject<Record<string, unknown>>({});

const defaultTestingProviders = [
  provideNoopAnimations(),
  provideNativeDateAdapter(),
  provideRouter([]),
  provideFirebaseApp(() => (getApps().some(app => app.name === 'wgenerator-tests') ? getApp('wgenerator-tests') : initializeApp(environment.firebase, 'wgenerator-tests'))),
  provideAuth(() => getAuth(getApp('wgenerator-tests'))),
  provideFirestore(() => initializeFirestore(getApp('wgenerator-tests'), {})),
  provideStorage(() => getStorage(getApp('wgenerator-tests'))),
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
      col: () => ({
        valueChanges: () => of([]),
        add: async () => ({id: 'test-id'}),
      }),
      doc: () => ({
        set: async () => void 0,
        update: async () => void 0,
        delete: async () => void 0,
        collection: () => ({
          valueChanges: () => of([]),
          add: async () => ({id: 'test-id'}),
        }),
      }),
    },
  },
];

const originalConfigureTestingModule = TestBed.configureTestingModule.bind(TestBed);
TestBed.configureTestingModule = ((moduleDef?: Parameters<typeof TestBed.configureTestingModule>[0]) =>
  originalConfigureTestingModule({
    ...moduleDef,
    providers: [...defaultTestingProviders, ...(moduleDef?.providers ?? [])],
  })) as typeof TestBed.configureTestingModule;
