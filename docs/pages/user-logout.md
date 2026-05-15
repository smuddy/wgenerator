# Abmelden

## Route

`/user/logout`

## Zweck

Die Seite beendet die aktuelle Benutzersitzung und leitet danach zur Startseite weiter.

## Datenquellen

- `LogoutComponent` nutzt `UserService.logout()`.
- `UserService.logout()` delegiert an `UserSessionService.logout`.
- `UserSessionService` ruft Firebase Auth `signOut` auf.

## UI

Die Komponente hat aktuell kein sichtbares Template. Sie dient als technische Navigationsroute für den Logout-Vorgang.

## Aktionen

- Nach Initialisierung der View wird der Benutzer abgemeldet.
- Nach erfolgreichem Logout navigiert die Komponente nach `/`.

## Rollen und Berechtigungen

Die Route ist nicht durch einen Guard geschützt. Ist kein Benutzer angemeldet, läuft der Logout-Aufruf trotzdem über Firebase Auth und die anschließende Weiterleitung bleibt gleich.

## Technische Hinweise

- Der Logout wird in `ngAfterViewInit` gestartet.
- Der asynchrone Ablauf wird bewusst ohne sichtbaren Zwischenzustand ausgeführt.
- Fehlerbehandlung oder Fehlermeldungen sind in der Komponente nicht implementiert.
