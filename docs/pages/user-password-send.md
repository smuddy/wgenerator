# Passwort-Mail gesendet

## Route

`/user/password-send`

## Zweck

Die Seite bestätigt, dass eine E-Mail zum Setzen eines neuen Passworts gesendet wurde.

## Datenquellen

Die Seite lädt keine eigenen Daten. `PasswordSendComponent` rendert ausschließlich statischen Inhalt.

## UI

Die Ansicht besteht aus einer Karte mit dem Hinweis, dass die E-Mail gesendet wurde und einen Link zur Eingabe des neuen Passworts enthält.

## Aktionen

Die Seite bietet keine eigene Aktion. Die fachliche Aktion findet vorher auf `/user/password` statt.

## Rollen und Berechtigungen

Die Seite ist öffentlich erreichbar. Eine aktive Anmeldung oder Rolle ist nicht erforderlich.

## Technische Hinweise

- Es findet keine erneute Prüfung statt, ob die Reset-Mail tatsächlich zugestellt wurde.
- Die Route dient nur als Erfolgsziel nach `UserService.changePassword`.
