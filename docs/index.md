# Projektdokumentation

`wgenerator` ist eine Angular-Anwendung zur Verwaltung von Liedern, Veranstaltungen und Live-Präsentationen. Die Dokumentation ist nach fachlichen Seiten und technischen Querschnittsthemen getrennt, damit Änderungen an einer Route oder einem Modul gezielt nachvollzogen werden können.

## Einstieg

- [Technischer Aufbau](technical-architecture.md)
- [Datenmodell](data-model.md)
- [Rollen und Berechtigungen](roles-and-permissions.md)
- [Betrieb und Konfiguration](operations.md)
- [Entwicklung und Qualitätssicherung](development.md)

## Seitendokumentation

### Lieder

- [Liedliste](pages/songs-list.md)
- [Lieddetails](pages/song-detail.md)
- [Lied anlegen](pages/song-new.md)
- [Lied bearbeiten](pages/song-edit.md)

### Veranstaltungen

- [Veranstaltungsliste](pages/shows-list.md)
- [Veranstaltungsdetails](pages/show-detail.md)
- [Veranstaltung anlegen](pages/show-new.md)
- [Veranstaltung bearbeiten](pages/show-edit.md)

### Präsentation

- [Präsentation auswählen](pages/presentation-select.md)
- [Präsentationssteuerung](pages/presentation-remote.md)
- [Präsentationsmonitor](pages/presentation-monitor.md)

### Benutzer

- [Login](pages/user-login.md)
- [Benutzerprofil](pages/user-info.md)
- [Benutzer anlegen](pages/user-new.md)
- [Passwort zurücksetzen](pages/user-password.md)
- [Passwort-E-Mail gesendet](pages/user-password-send.md)
- [Logout](pages/user-logout.md)

### Öffentlich zugängliche Seiten

- [Branding](pages/brand.md)
- [Neue Benutzer ohne Rollen](pages/brand-new-user.md)
- [Gastansicht](pages/guest.md)

## Fachlicher Ablauf

Lieder werden in der Lieddatenbank gepflegt. Eine Leitung erstellt daraus Veranstaltungen, sortiert Songs, veröffentlicht Abläufe und teilt optional eine Gastansicht. Das Präsentationsteam wählt eine aktuelle Veranstaltung aus und steuert Folien, Hintergründe, freien Text und Zoom live über die Remote-Seite. Der Monitor liest diese Zustände in Echtzeit und rendert die Ausgabe für Beamer oder Display.
