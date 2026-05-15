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
