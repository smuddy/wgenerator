# Neuer Benutzer ohne Rollen

## Route

`/brand/new-user`

## Zweck

Die Seite begrüßt neu registrierte Benutzer, die noch keine Berechtigungen erhalten haben. Sie macht sichtbar, dass der Account existiert, aber noch administrative Freischaltung benötigt.

## Datenquellen

- `NewUserComponent` liest den aktuellen Benutzer über `UserService.user$`.
- Die angezeigte Person stammt aus dem Firestore-Dokument `users/{uid}`.

## UI

Die Ansicht zeigt `BrandComponent`, die Begrüßung `WILLKOMMEN`, den Namen des aktuellen Benutzers und den Hinweis, dass noch keine Berechtigungen zugeteilt wurden.

## Aktionen

Die Seite bietet keine eigene Aktion. Der nächste fachliche Schritt ist die Rollenvergabe durch einen Administrator auf `/user/info`.

## Rollen und Berechtigungen

Die Route ist öffentlich konfiguriert, zeigt den personalisierten Inhalt aber nur, wenn `UserService.user$` einen Benutzer liefert. Sie ist für angemeldete Benutzer ohne Rollen gedacht.

## Technische Hinweise

- Nach erfolgreicher Selbstregistrierung navigiert `UserSessionService.createNewUser` zu dieser Route.
- Die Seite prüft Rollen nicht selbst und vergibt keine Rechte.
- Wenn kein Benutzer aus `user$` kommt, wird nur das Branding angezeigt.
