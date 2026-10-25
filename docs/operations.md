# Betrieb und Konfiguration

## Lokale Einrichtung

Abhängigkeiten werden wie im CI-Workflow installiert:

```bash
npm ci -f
```

Der lokale Entwicklungsserver startet mit:

```bash
npm start
```

`npm start` führt `ng serve` aus. Die Standard-Serve-Konfiguration ist `development`.

## Abhängigkeiten und Sicherheitsupdates

Build, Entwicklungsserver und Tests verwenden direkt `@angular/build`. Der ältere
Wrapper `@angular-devkit/build-angular` wird nicht benötigt. `less` ist als
Entwicklungsabhängigkeit erforderlich, damit die LESS-Styles kompiliert werden.

Stand 25. Oktober 2026 ist Firebase auf `12.18.0` festgesetzt, weil `12.19.0`
unvollständige Typdefinitionen für `Temporal.Instant` enthält. Bei einem späteren
Firebase-Update muss dieser Compilerfehler erneut geprüft werden.

Die `overrides` in `package.json` haben folgende Gründe:

- `@firebase/app`: eine gemeinsame App-Instanz für alle Firebase-Dienste;
  unterschiedliche Versionen können zu „Service firestore is not available“ führen.
- Firestore → `@grpc/grpc-js`: Sicherheitsupdate innerhalb der Hauptversion 1.
- Angular Build → `undici`: Sicherheitsupdate innerhalb der Hauptversion 7.
- gaxios 6 → `uuid`: Version 11 enthält die Sicherheitskorrektur und unterstützt
  weiterhin CommonJS sowie den von gaxios verwendeten `v4`-Aufruf.
- `qs`: Sicherheitsupdate innerhalb der Hauptversion 6.

Bei Updates der übergeordneten Pakete prüfen, ob diese Overrides entfernt werden
können. Danach `npm test -- --watch=false`, `npm run build:dev` und `npm audit`
ausführen.

Es verbleiben drei moderate Audit-Meldungen aus derselben Kette:
`firebase-tools` → `@google-cloud/pubsub` → `@opentelemetry/core`.
Firebase CLI 15.34.1 verlangt noch Pub/Sub 5; die korrigierte OpenTelemetry-Version
2.8 liegt außerhalb dessen Abhängigkeitsbereichs. Ein erzwungener Wechsel auf
Pub/Sub 6 oder OpenTelemetry 2 ist ohne Prüfung der CLI-Kompatibilität keine
geeignete Korrektur. `npm audit fix --force` schlägt stattdessen ein Downgrade der
Firebase CLI vor und sollte dafür nicht verwendet werden.

## Firebase-Konfiguration

`src/environments/environment.ts` und `src/environments/environment.prod.ts` importieren beide `src/environments/firebase.ts`. Diese Datei ist nicht versioniert und muss lokal vorhanden sein. In CI wird sie aus Secrets erzeugt.

Beispielstruktur:

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

Die Anwendung nutzt `environment.url` für Rücksprung-URLs, zum Beispiel beim Passwort-Reset. Aktuell zeigt sowohl Development als auch Production auf `https://worshipgenerator.web.app`.

## Firebase Hosting und Emulatoren

`firebase.json` veröffentlicht den Production-Build aus `dist/wgenerator/browser`. Alle Routen werden per Rewrite auf `/index.html` geleitet, damit Angular-Routing direkt auf Hosting funktioniert.

Cache-Verhalten:

- HTML-/SPA-Routen ohne Dateiendung: `Cache-Control: max-age=1`.
- JS- und CSS-Dateien: `Cache-Control: max-age=846000`.

Konfigurierte Emulator-Ports:

- Firestore: `8080`
- Realtime Database: `9000`
- Hosting: `5000`

## Build, Test und Lint

Wichtige Befehle:

```bash
npm run build:dev
npm run build
npm test
npm run lint
```

- `npm run build:dev` baut mit Development-Konfiguration, ohne Optimierung und mit Source Maps.
- `npm run build` baut die Production-Version mit File-Replacement auf `environment.prod.ts` und Output-Hashing.
- `npm test` führt Unit-Tests mit Vitest aus.
- `npm run lint` führt Angular ESLint aus und wendet automatische Fixes an.

Production-Budgets sind in `angular.json` definiert: initiale Warnung ab `500kB`, Fehler ab `10MB`; Component-Styles warnen ab `40kB` und schlagen ab `80kB` fehl.

## CI

Der Gitea-Workflow `.gitea/workflows/angular-build.yml` läuft bei Pushes auf den Branch `dev` in einem `node:20-bullseye`-Container.

Die Pipeline:

1. checkt den Code aus,
2. installiert Abhängigkeiten mit `npm ci -f`,
3. erzeugt `src/environments/firebase.ts` aus Secrets,
4. führt `npm run build` aus.

Die Pipeline deployt nicht automatisch.

## Deployment

Production-Build:

```bash
npm run build
```

Deployment nach Firebase:

```bash
npm run deploy
```

Beta-Deployment in einen Firebase-Hosting-Channel:

```bash
npm run deploy-beta
```

`npm run deploy` baut zuerst die Production-Version und führt anschließend `firebase deploy` aus. Für lokale Deployments muss die Firebase CLI authentifiziert sein und Zugriff auf das Zielprojekt besitzen.

## Manuelle Migrationen

Das README dokumentiert zwei Admin-Migrationen, die im Browser mit einem angemeldeten Admin-Benutzer über `window.wgeneratorAdmin` ausgeführt werden:

```js
await window.wgeneratorAdmin.rebuildSongUsage()
await window.wgeneratorAdmin.rebuildShowSongIds()
```

`rebuildSongUsage` rekonstruiert die Song-Nutzungszähler unter `users/{uid}.songUsage` aus nicht archivierten Shows und deren Show-Songs.

`rebuildShowSongIds` rekonstruiert den `songIds`-Index auf Show-Dokumenten aus `shows/{showId}/songs`.

Beide Migrationen lesen viele Dokumente und sind als manuelle Wartungsoperationen gedacht.
