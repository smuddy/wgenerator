# Benutzer anlegen

## Route

`/user/new`

## Zweck

Die Seite erstellt einen neuen Benutzeraccount. Sie ist für die Selbstregistrierung gedacht und vergibt noch keine fachlichen Rollen.

## Datenquellen

- `NewComponent` verwaltet ein reaktives Formular mit `email`, `name` und `password`.
- `UserService.createNewUser(email, name, password)` delegiert an `UserSessionService.createNewUser`.
- `UserSessionService` erstellt den Firebase-Auth-Benutzer und legt anschließend `users/{uid}` in Firestore an.

## UI

Die Ansicht besteht aus einer Karte mit den Feldern Name, E-Mail-Adresse und Passwort sowie einem Button `Benutzer anlegen`. Fehlercodes werden über `AuthMessagePipe` angezeigt.

## Aktionen

- `Benutzer anlegen`: validiert das Formular, erstellt den Auth-Account, schreibt das Firestore-Benutzerdokument und navigiert danach zu `/brand/new-user`.
- Schließen über `closeLink="../"`: führt zurück zur übergeordneten Benutzerroute.

## Rollen und Berechtigungen

Die Seite ist öffentlich erreichbar. Neue Benutzer erhalten initial keine Rolle. Das angelegte Dokument enthält `name`, `chordMode: 'onlyFirst'` und `songUsage: {}`; ein Administrator muss später passende Rollen vergeben.

## Technische Hinweise

- Das Passwort muss mindestens sechs Zeichen lang sein.
- Firebase-Fehler wie `auth/email-already-in-use`, `auth/invalid-email` und `auth/weak-password` werden in deutsche Meldungen übersetzt.
- Nach der Registrierung ist der Benutzer durch Firebase Auth angemeldet, befindet sich aber ohne Rollen im Freischaltungszustand.
