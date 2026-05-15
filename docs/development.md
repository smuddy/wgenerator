# Entwicklungsworkflow

## Voraussetzungen

Das Projekt ist eine Angular-Anwendung mit Node.js-Abhängigkeiten aus `package.json`. Der CI-Workflow verwendet `node:20-bullseye`; lokale Entwicklung sollte daher eine kompatible Node-Version verwenden.

Installiere Abhängigkeiten mit:

```bash
npm ci -f
```

Die Option `-f` entspricht dem Gitea-CI-Workflow.

## Lokale Konfiguration

Für lokale Builds muss `src/environments/firebase.ts` existieren. Die Datei wird nicht versioniert und enthält die Firebase-Projektwerte.

Minimalstruktur:

```ts
export const firebase = {
  apiKey: '...',
  authDomain: '...',
  databaseURL: 'https://worshipgenerator.firebaseio.com',
  projectId: '...',
  storageBucket: '...',
  messagingSenderId: '...',
  appId: '...',
};
```

Ohne diese Datei schlagen Angular-Builds fehl, weil `environment.ts` und `environment.prod.ts` sie importieren.

## Entwicklungsserver

Starte die Anwendung lokal mit:

```bash
npm start
```

Der Befehl führt `ng serve` aus. In `angular.json` ist `development` die Standardkonfiguration für `serve`.

## Build-Varianten

Development-Build:

```bash
npm run build:dev
```

Production-Build:

```bash
npm run build
```

Der Production-Build nutzt `environment.prod.ts`, aktiviert Output-Hashing und schreibt nach `dist/wgenerator`. Firebase Hosting erwartet den Browser-Build unter `dist/wgenerator/browser`.

## Tests und Linting

Unit-Tests:

```bash
npm test
```

Linting mit automatischen Fixes:

```bash
npm run lint
```

Tests liegen als `*.spec.ts` neben den Implementierungen. Der Angular Unit-Test-Builder nutzt Vitest und lädt gemeinsame Testkonfiguration aus `src/test-vitest.ts`.

## Codeorganisation

Neue fachliche Funktionen sollten in das passende Feature-Modul unter `src/app/modules` einsortiert werden. Gemeinsame Services gehören nach `src/app/services`; wiederverwendbare UI-Komponenten, Pipes, Direktiven und Guards nach `src/app/widget-modules`.

Der bestehende Stil verwendet:

- TypeScript und Angular-Module mit lazy geladenen Feature-Modulen.
- Standalone-Komponenten dort, wo sie bereits im Code genutzt werden.
- LESS für Component-Styles.
- RxJS-Observables für Firestore-Livedaten.
- Services als fachliche Fassade über `DbService`.

## Datenzugriff in neuen Funktionen

Firestore-Zugriffe sollten über `DbService` oder vorhandene Fachservices erfolgen. Direkte AngularFire-Zugriffe sind nur sinnvoll, wenn der vorhandene Wrapper eine benötigte Operation nicht abbildet.

Bei neuen fachlichen Datenflüssen ist zu prüfen:

- ob ein Live-Observable oder ein einmaliger Promise-Zugriff benötigt wird,
- ob `shareReplay` sinnvoll ist, um Listener wiederzuverwenden,
- ob denormalisierte Felder wie `songUsage` oder `songIds` aktualisiert werden müssen,
- ob Firestore-Regeln und UI-Rollen die neue Aktion angemessen abdecken.

## Rollen und UI-Zugriff

Neue geschützte Routen sollten `AuthGuard` und bei Bedarf `RoleGuard` mit `requiredRoles` nutzen. Sichtbare Aktionen in Templates sollten über `*appRole` und bei besitzabhängigen Aktionen über `*appOwner` gesteuert werden.

Da Firestore-Regeln für fachliche Collections nur Login voraussetzen, müssen rollenbasierte Einschränkungen in Routing, UI und Services konsistent umgesetzt werden.

## Deployment-Ablauf

Für ein reguläres Deployment:

```bash
npm run deploy
```

Der Befehl baut die Production-Version und führt anschließend `firebase deploy` aus. Für einen Beta-Channel:

```bash
npm run deploy-beta
```

Vor Deployments sollten mindestens Build und relevante Tests lokal oder im CI erfolgreich sein.

## Manuelle Admin-Wartung

Das README beschreibt zwei manuelle Browser-Konsolenbefehle für Admins:

```js
await window.wgeneratorAdmin.rebuildSongUsage()
await window.wgeneratorAdmin.rebuildShowSongIds()
```

Diese Migrationen sind read-heavy und sollten bewusst ausgeführt werden, wenn historische Daten nachgezogen oder Indizes rekonstruiert werden müssen.
