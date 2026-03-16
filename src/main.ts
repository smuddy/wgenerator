import {enableProdMode, importProvidersFrom, inject, provideZoneChangeDetection} from '@angular/core';

import {environment} from './environments/environment';
import {MAT_DATE_LOCALE} from '@angular/material/core';
import {bootstrapApplication, BrowserModule} from '@angular/platform-browser';
import {provideAnimations} from '@angular/platform-browser/animations';
import {AppRoutingModule} from './app/app-routing.module';
import {ServiceWorkerModule} from '@angular/service-worker';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {AppComponent} from './app/app.component';
import {FirebaseApp, provideFirebaseApp} from '@angular/fire/app';
import {provideFirestore} from '@angular/fire/firestore';
import {provideAuth} from '@angular/fire/auth';
import {provideStorage} from '@angular/fire/storage';
import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getStorage} from 'firebase/storage';
import {initializeFirestore, persistentLocalCache, persistentMultipleTabManager} from 'firebase/firestore';
import {UserService} from './app/services/user/user.service';

declare global {
  interface Window {
    wgeneratorAdmin?: {
      rebuildSongUsage(): Promise<unknown>;
      rebuildShowSongIds(): Promise<unknown>;
    };
  }
}

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),
    importProvidersFrom(
      BrowserModule,
      AppRoutingModule,
      ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: environment.production,
      }),
      FontAwesomeModule
    ),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth(inject(FirebaseApp))),
    provideFirestore(() =>
      initializeFirestore(inject(FirebaseApp), {
        localCache: persistentLocalCache({tabManager: persistentMultipleTabManager()}),
      })
    ),
    provideStorage(() => getStorage(inject(FirebaseApp))),
    {provide: MAT_DATE_LOCALE, useValue: 'de-DE'},
    provideAnimations(),
  ],
})
  .then(appRef => {
    const userService = appRef.injector.get(UserService);
    window.wgeneratorAdmin = {
      rebuildSongUsage: () => userService.rebuildSongUsage(),
      rebuildShowSongIds: async () => {
        console.info('[wgeneratorAdmin] rebuildShowSongIds started');
        const result = await userService.rebuildShowSongIds(progress => {
          console.info(`[wgeneratorAdmin] rebuildShowSongIds ${progress.processed}/${progress.total} shows processed`, {
            showId: progress.showId,
            showSongsProcessed: progress.showSongsProcessed,
          });
        });
        console.info('[wgeneratorAdmin] rebuildShowSongIds finished', result);
        return result;
      },
    };
  })
  .catch(err => console.error(err));
