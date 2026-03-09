import {enableProdMode, importProvidersFrom} from '@angular/core';

import {environment} from './environments/environment';
import {MAT_DATE_LOCALE} from '@angular/material/core';
import {bootstrapApplication, BrowserModule} from '@angular/platform-browser';
import {provideAnimations} from '@angular/platform-browser/animations';
import {AppRoutingModule} from './app/app-routing.module';
import {ServiceWorkerModule} from '@angular/service-worker';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {AppComponent} from './app/app.component';
import {getApp, initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {initializeFirestore, persistentLocalCache, persistentMultipleTabManager, provideFirestore} from '@angular/fire/firestore';
import {getAuth, provideAuth} from '@angular/fire/auth';
import {getStorage, provideStorage} from '@angular/fire/storage';
import {UserService} from './app/services/user/user.service';

declare global {
  interface Window {
    wgeneratorAdmin?: {
      rebuildSongUsage(): Promise<unknown>;
    };
  }
}

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      AppRoutingModule,
      ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: environment.production,
      }),
      FontAwesomeModule
    ),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => initializeFirestore(getApp(), {localCache: persistentLocalCache({tabManager: persistentMultipleTabManager()})})),
    provideStorage(() => getStorage()),
    {provide: MAT_DATE_LOCALE, useValue: 'de-DE'},
    provideAnimations(),
  ],
})
  .then(appRef => {
    const userService = appRef.injector.get(UserService);
    window.wgeneratorAdmin = {
      rebuildSongUsage: () => userService.rebuildSongUsage(),
    };
  })
  .catch(err => console.error(err));
