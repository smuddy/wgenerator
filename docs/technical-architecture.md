# Technische Architektur

## Überblick

Wgenerator ist eine Angular-Anwendung mit Firebase als Backend. Die App wird als Single Page Application gebaut und über Firebase Hosting ausgeliefert. Authentifizierung, Firestore und Storage werden über `@angular/fire` eingebunden.

Der Anwendungseinstieg liegt in `src/main.ts`; die fachlichen Bereiche werden über `src/app/app-routing.module.ts` lazy geladen. Der Standardpfad `/` leitet nach `/songs` weiter.

## Frontend-Struktur

Der fachliche Code liegt unter `src/app/modules`:

- `songs`: Liedliste, Lieddetails, Bearbeitung, Anhänge, Textdarstellung, Tonarten und Transposition.
- `shows`: Veranstaltungslisten, Show-Details, Bearbeitung, Song-Zuordnung, Archivierung, Veröffentlichung, Gastfreigaben und DOCX-Export.
- `presentation`: Auswahl, Fernsteuerung und Monitoransicht für Live-Präsentationen.
- `user`: Login, Logout, Registrierung, Passwort-Reset und Benutzerinformationen.
- `brand`: Start- und Hinweisbereich für neue oder noch nicht berechtigte Benutzer.
- `guest`: öffentliche Gastansicht für freigegebene Shows.

Gemeinsame Services liegen in `src/app/services`. Wiederverwendbare UI-Bausteine, Pipes, Guards und Direktiven liegen in `src/app/widget-modules`.

## Routing und Modulgrenzen

Die Hauptrouten sind:

- `/songs`: `SongsModule`, mit Authentifizierung und Rolle `user`.
- `/shows`: `ShowsModule`, mit Authentifizierung und Rolle `leader` oder `member`.
- `/presentation`: `PresentationModule`, mit Authentifizierung und Rolle `presenter`.
- `/user`: `UserModule`, teilweise öffentlich und teilweise per `AuthGuard` geschützt.
- `/brand`: `BrandModule`, öffentlich.
- `/guest`: `GuestModule`, öffentlich.

Zusätzliche Modulrouten schränken einzelne Aktionen ein. Beispielsweise benötigt `/songs/new` die Rolle `contributor` und `/shows/new` die Rolle `leader`.

## Datenzugriff

Der technische Firestore-Zugriff ist in `DbService` gekapselt. Der Service stellt Wrapper für Collections und Dokumente bereit:

- `col$` und `doc$` liefern Live-Observables mit `idField`.
- `add`, `set`, `update` und `delete` kapseln Schreiboperationen.
- Query-Constraints werden bei Bedarf an `col$` übergeben.

Fachservices bauen darauf auf:

- `SongDataService` und `SongService` verwalten `songs`.
- `FileDataService`, `FileService` und `UploadService` verwalten Firestore-Metadaten und Firebase-Storage-Dateien zu Songs.
- `ShowDataService`, `ShowService`, `ShowSongDataService` und `ShowSongService` verwalten Shows und deren eingebettete Show-Songs.
- `GuestShowDataService` und `GuestShowService` verwalten öffentliche Gastfreigaben.
- `UserSessionService`, `UserService` und `UserSongUsageService` verwalten Authentifizierung, Benutzerprofile, Rollen und Nutzungszähler.
- `ConfigService` und `GlobalSettingsService` lesen beziehungsweise schreiben Dokumente unter `global`.

Mehrere Datenströme werden mit `shareReplay` gecacht, um Firestore-Listener bei Navigationen wiederzuverwenden.

## Authentifizierung und Autorisierung

Firebase Auth liefert den Login-Status. `UserSessionService` verbindet den Auth-User mit dem Firestore-Dokument `users/{uid}`. Rollen werden im Feld `role` als Semikolon-getrennte Zeichenkette gespeichert.

`AuthGuard` schützt Routen, die einen Firebase-Login benötigen. `RoleGuard` liest `requiredRoles` aus der Route-Data-Konfiguration und erlaubt Zugriff, wenn der Benutzer mindestens eine passende Rolle besitzt. `admin` gilt in der Anwendung als übergeordnete Rolle.

Die Firestore-Regeln erlauben angemeldeten Benutzern breite Lese- und Schreibzugriffe auf fachliche Collections. Deshalb sind UI-Guards und Services fachlich wichtig, ersetzen aber keine feingranulare serverseitige Autorisierung.

## Präsentationsarchitektur

Die Präsentation wird über Firestore synchronisiert:

- `global/static.currentShow` enthält die aktuell ausgewählte Show.
- Das Show-Dokument enthält Präsentationsfelder wie `presentationSongId`, `presentationSection`, `presentationZoom`, `presentationBackground`, `presentationDynamicCaption` und `presentationDynamicText`.
- Die Remote-Ansicht schreibt diese Werte.
- Die Monitoransicht liest die Werte live und rendert den aktuellen Zustand.

Damit können mehrere Browserfenster über Firestore als gemeinsamen Zustand zusammenarbeiten.

## Firebase und Hosting

Die Firebase-Konfiguration wird über `src/environments/firebase.ts` importiert. `environment.ts` und `environment.prod.ts` unterscheiden `production`, nutzen aber dieselbe URL `https://worshipgenerator.web.app`.

`firebase.json` konfiguriert:

- Firestore-Regeln aus `firestore.rules`.
- Firestore-Indexdatei `firestore.indexes.json`.
- Hosting aus `dist/wgenerator/browser`.
- SPA-Rewrite auf `/index.html`.
- Cache-Header für HTML-Routen und statische JS/CSS-Dateien.
- Emulator-Ports für Firestore, Realtime Database und Hosting.

## Build, Tests und Qualität

Angular nutzt den Builder `@angular/build:application`. LESS ist als Component-Style-Sprache konfiguriert; globale Styles kommen aus `src/custom-theme.scss`, `src/styles/styles.less` und `src/styles/shadow.less`.

Unit-Tests laufen über den Angular Unit-Test-Builder mit Vitest und `src/test-vitest.ts` als Setup-Datei. Linting läuft über Angular ESLint.
