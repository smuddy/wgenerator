# Rollen und Berechtigungen

## Rollenmodell

Die Anwendung definiert Rollen in `src/app/services/user/roles.ts`:

- `admin`
- `user`
- `member`
- `leader`
- `presenter`
- `contributor`
- `none`

Ein Benutzerprofil liegt in Firestore unter `users/{uid}`. Das Feld `role` enthält eine oder mehrere Rollen als Semikolon-getrennte Zeichenkette, zum Beispiel `leader;presenter`. Neue Benutzer werden mit Name, Akkordmodus und leerem `songUsage` angelegt; Rollen werden anschließend über die Benutzerverwaltung vergeben.

## Authentifizierung

Firebase Auth verwaltet die Anmeldung. `UserSessionService` beobachtet `authState`, liest das zugehörige Benutzerprofil aus `users/{uid}` und stellt daraus `user$`, `userId$`, `loggedIn$` und Benutzerlisten bereit.

Beim Login initialisiert der Service fehlende `songUsage`-Daten mit einem leeren Objekt. Passwort-Reset-Mails werden über Firebase Auth mit der in `environment.url` konfigurierten Rücksprung-URL versendet.

## Routenberechtigungen

`AuthGuard` leitet nicht angemeldete Benutzer nach `/user/login` um. `RoleGuard` prüft die in der Route definierten `requiredRoles`; Benutzer mit `admin` werden immer zugelassen.

Die Hauptrouten sind wie folgt geschützt:

- `/songs`: Login und Rolle `user`.
- `/shows`: Login und Rolle `leader` oder `member`.
- `/presentation`: Login und Rolle `presenter`.
- `/user/info`: Login.
- `/user/login`, `/user/new`, `/user/password` und `/user/password-send`: öffentlich.
- `/brand`: öffentlich.
- `/guest`: öffentlich.

Zusätzliche Modulrechte:

- `/songs/new`: Rolle `contributor`.
- `/shows/new`: Rolle `leader`.

Wenn ein Benutzer keine passende Rolle besitzt, leitet `RoleGuard` auf eine rollenabhängige Standardroute um. Benutzer ohne Rollen landen auf `/brand/new-user`.

## Template- und Aktionsrechte

`RoleDirective` (`*appRole`) blendet UI-Elemente anhand der Benutzerrollen ein oder aus. `admin` erhält auch hier umfassenden Zugriff. Die Rollenprüfung wertet die Semikolon-getrennte Rollenliste aus.

`OwnerDirective` (`*appOwner`) begrenzt Aktionen auf Besitzer fachlicher Objekte, insbesondere bei Shows. Dadurch kann die Oberfläche zwischen eigenen und fremden Shows unterscheiden.

Diese Direktiven steuern die sichtbaren Aktionen in der Oberfläche. Fachliche Services prüfen zusätzlich einzelne Voraussetzungen, zum Beispiel ob ein aktueller Benutzer vorhanden ist.

## Firestore-Regeln

Die serverseitigen Regeln in `firestore.rules` sind bewusst grob:

- `users/{uid}`: Benutzer dürfen ihr eigenes Dokument erstellen und schreiben; Admins dürfen Benutzer schreiben und listen; angemeldete Benutzer dürfen Benutzerdaten lesen.
- `guest/{guestId}`: Lesen ist öffentlich, Schreiben benötigt Login.
- `songs`, `songs/{song}/files`, `shows`, `shows/{show}/songs` und `global`: Lesen und Schreiben benötigt Login.

Die Regeln unterscheiden bei den fachlichen Collections nicht nach Rollen. Rollenbasierte Zugriffskontrolle findet daher primär in Angular-Routing, Direktiven und Services statt.

## Administrative Funktionen

Einige Wartungsfunktionen verlangen in den Services explizit die Rolle `admin`:

- `UserSongUsageService.rebuildSongUsage()` baut `users/{uid}.songUsage` aus allen nicht archivierten Shows neu auf.
- `ShowSongIndexService.rebuildShowSongIds()` schreibt den `songIds`-Index aller Shows neu.

Beide Funktionen sind für manuelle Migrationen vorgesehen und werden im README über `window.wgeneratorAdmin` beschrieben.
