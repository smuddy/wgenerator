# Passwort zurücksetzen

## Route

`/user/password`

## Zweck

Die Seite fordert für eine E-Mail-Adresse eine Passwort-Zurücksetzung an.

## Datenquellen

- `PasswordComponent` verwaltet ein reaktives Formular mit dem Feld `user`.
- `UserService.changePassword(user)` delegiert an `UserSessionService.changePassword`.
- `UserSessionService` ruft Firebase Auth `sendPasswordResetEmail` mit `environment.url` als Rücksprung-URL auf.

## UI

Die Ansicht zeigt eine Karte `Passwort zurücksetzen`, ein E-Mail-Feld und den Button `neues Passwort anfordern`. Fehlercodes werden innerhalb der Button-Zeile angezeigt.

## Aktionen

- `neues Passwort anfordern`: validiert die E-Mail-Adresse, sendet die Reset-Mail und navigiert bei Erfolg nach `/user/password-send`.
- `Enter` im Eingabefeld löst dieselbe Aktion aus.
- Schließen über `closeLink="../"`: führt zurück zur übergeordneten Benutzerroute.

## Rollen und Berechtigungen

Die Seite ist öffentlich erreichbar. Eine aktive Anmeldung oder Rolle ist nicht erforderlich.

## Technische Hinweise

- Das Formular verlangt eine gültige E-Mail-Adresse.
- Firebase Auth entscheidet, ob die Adresse bekannt ist und ob eine Reset-Mail gesendet werden kann.
- Fehlercodes werden mit `AuthMessagePipe` lokalisiert; unbekannte Fehler werden als `Unbekannter Fehler` angezeigt.
