import {enableProdMode, importProvidersFrom, inject, provideZoneChangeDetection} from '@angular/core';

import {environment} from './environments/environment';
import {MAT_DATE_LOCALE} from '@angular/material/core';
import {bootstrapApplication, BrowserModule} from '@angular/platform-browser';
import {provideAnimations} from '@angular/platform-browser/animations';
import {AppRoutingModule} from './app/app-routing.module';
import {ServiceWorkerModule} from '@angular/service-worker';
import {AppComponent} from './app/app.component';
import {FirebaseApp, provideFirebaseApp} from '@angular/fire/app';
import {provideFirestore} from '@angular/fire/firestore';
import {provideAuth} from '@angular/fire/auth';
import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {initializeFirestore, persistentLocalCache, persistentMultipleTabManager} from 'firebase/firestore';
import {AdminService} from './app/services/admin/admin.service';

declare global {
  interface Window {
    wgeneratorAdmin?: {
      downloadSongs(): Promise<unknown>;
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
      })
    ),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth(inject(FirebaseApp))),
    provideFirestore(() =>
      initializeFirestore(inject(FirebaseApp), {
        localCache: persistentLocalCache({tabManager: persistentMultipleTabManager()}),
      })
    ),
    {provide: MAT_DATE_LOCALE, useValue: 'de-DE'},
    provideAnimations(),
  ],
})
  .then(appRef => {
    const adminService = appRef.injector.get(AdminService);
    window.wgeneratorAdmin = {
      downloadSongs: async () => {
        console.info('[wgeneratorAdmin] downloadSongs started');
        const result = await adminService.downloadSongs();
        console.info('[wgeneratorAdmin] downloadSongs finished', result);
        return result;
      },
      rebuildSongUsage: () => adminService.rebuildSongUsage(),
      rebuildShowSongIds: async () => {
        console.info('[wgeneratorAdmin] rebuildShowSongIds started');
        const result = await adminService.rebuildShowSongIds(progress => {
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
