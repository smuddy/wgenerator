# Benutzerprofil

## Route

`/user/info`

## Zweck

Die Seite zeigt das Profil des angemeldeten Benutzers, dessen Rollen und persönliche Anzeigeeinstellungen. Administratoren sehen zusätzlich die Benutzerverwaltung.

## Datenquellen

- `InfoComponent` liest den aktuellen Benutzer über `UserService.user$`.
- Änderungen an Benutzerdaten werden über `UserService.update$(uid, data)` in `users/{uid}` gespeichert.
- Die Admin-Liste verwendet `UsersComponent`, `UserComponent` und `UserService.list$()` für alle Benutzer.

## UI

Im Profilbereich werden Begrüßung, Rollenanzeige und die bevorzugte Akkordanzeige dargestellt. Die Akkordanzeige ist ein Auswahlfeld mit den Werten leer, `hide`, `onlyFirst` und `show`.

Für Administratoren erscheint zusätzlich eine Karte `registrierte Benutzer`. Jeder Listeneintrag kann angeklickt werden und wechselt dann in einen Bearbeitungsmodus mit Namensfeld und Mehrfachauswahl für Rollen.

## Aktionen

- Akkordmodus ändern: speichert `chordMode` direkt am aktuellen Benutzer.
- Abmelden: navigiert nach `../logout`.
- Benutzer bearbeiten: Administratoren können Namen und Rollen einzelner Benutzer ändern.
- Bearbeitung schließen: beendet den Bearbeitungsmodus des Benutzerlisteneintrags.

## Rollen und Berechtigungen

Die Route ist durch `AuthGuard` geschützt und setzt einen angemeldeten Benutzer voraus. Die Benutzerverwaltung wird über `*appRole="['admin']"` nur für Administratoren angezeigt. In `RoleDirective` gilt `admin` als Vollberechtigung; andere Rollen werden gegen die angeforderte Rollenliste geprüft.

## Technische Hinweise

- Rollen werden als semikolongetrennter String im Feld `role` gespeichert und für die UI in Arrays umgewandelt.
- Verfügbare Rollen kommen aus `ROLE_TYPES`: `admin`, `user`, `member`, `leader`, `presenter`, `contributor`.
- Die Rollenanzeige nutzt `RolePipe`; bei fehlenden Rollen erscheint ein Warnhinweis.
- Die Methode `transdormUserRoles` enthält einen Schreibfehler im Namen, ist aber die aktuell verwendete UI-Hilfsmethode.
