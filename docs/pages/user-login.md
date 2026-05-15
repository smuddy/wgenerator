# Login

## Route

`/user/login`

## Zweck

Die Seite meldet bestehende Benutzer mit E-Mail-Adresse und Passwort an. Nach erfolgreicher Anmeldung wird der Benutzer zur Startseite weitergeleitet.

## Datenquellen

- `LoginComponent` verwaltet ein reaktives Formular mit den Feldern `user` und `pass`.
- `UserService.login(user, password)` delegiert an `UserSessionService.login`.
- `UserSessionService` verwendet Firebase Auth (`signInWithEmailAndPassword`) und lädt danach den zugehörigen Datensatz aus `users/{uid}`.

## UI

Die Ansicht zeigt das Anwendungslogo, zwei Eingabefelder und drei vollbreite Aktionsbuttons. Fehlercodes aus Firebase Auth werden über `AuthMessagePipe` in deutsche Meldungen übersetzt.

## Aktionen

- `Anmelden`: validiert das Formular, führt den Login aus, initialisiert bei Bedarf `songUsage` und navigiert bei Erfolg nach `/`.
- `Passwort zurücksetzen`: navigiert nach `/user/password`.
- `neuen Benutzer anlegen`: navigiert nach `/user/new`.
- `Enter` in einem Eingabefeld löst ebenfalls den Login aus.

## Rollen und Berechtigungen

Die Login-Seite ist öffentlich erreichbar. Die spätere Nutzbarkeit geschützter Bereiche hängt vom geladenen Benutzerdokument und dessen Rollen ab.

## Technische Hinweise

- Das Formular verlangt eine gültige E-Mail-Adresse und ein Passwort.
- Wenn Firebase Auth erfolgreich ist, aber kein passender Firestore-Benutzer existiert, liefert der Login keine Benutzer-ID zurück.
- Bekannte Fehlercodes wie `auth/user-not-found`, `auth/wrong-password` und `auth/invalid-email` werden lokalisiert angezeigt.
