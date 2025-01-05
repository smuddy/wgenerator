import {enableProdMode, importProvidersFrom} from '@angular/core';

import {environment} from './environments/environment';
import {MAT_DATE_LOCALE} from '@angular/material/core';
import {bootstrapApplication, BrowserModule} from '@angular/platform-browser';
import {provideAnimations} from '@angular/platform-browser/animations';
import {AppRoutingModule} from './app/app-routing.module';
import {ServiceWorkerModule} from '@angular/service-worker';
import {AngularFireModule} from '@angular/fire/compat';
import {AngularFirestoreModule} from '@angular/fire/compat/firestore';
import {AngularFireStorageModule} from '@angular/fire/compat/storage';
import {AngularFireDatabaseModule} from '@angular/fire/compat/database';
import {AngularFireAuthModule} from '@angular/fire/compat/auth';
import {AngularFireAuthGuardModule} from '@angular/fire/compat/auth-guard';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {AppComponent} from './app/app.component';

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
      AngularFireModule.initializeApp(environment.firebase),
      AngularFirestoreModule.enablePersistence({synchronizeTabs: true}),
      AngularFireStorageModule,
      AngularFireDatabaseModule,
      AngularFireAuthModule,
      AngularFireAuthGuardModule,
      FontAwesomeModule
    ),
    {provide: MAT_DATE_LOCALE, useValue: 'de-DE'},
    provideAnimations(),
    provideAnimations(),
  ],
}).catch(err => console.error(err));
