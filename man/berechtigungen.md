# Berechtigungen und Rollen
[Zurück zur Übersicht](index.md) | [Zu den Tutorials](tutorials/index.md)

## Zweck

Berechtigungen steuern, welche Bereiche und Aktionen du im Worshipgenerator nutzen kannst. Sie sorgen dafür, dass jede Person nur die Funktionen sieht, die sie für ihre Aufgabe braucht.

## Grundprinzip

Ein Benutzerkonto kann eine oder mehrere Rollen haben. Rollen können kombiniert werden. Eine Person kann zum Beispiel Lieder pflegen, Veranstaltungen vorbereiten und Präsentationen starten, wenn sie dafür mehrere Rollen erhalten hat.

Neue Benutzer haben zunächst keine Rollen. Ein Administrator muss ihnen die passenden Berechtigungen zuweisen.

## Rollen in einfacher Sprache

### Keine Berechtigung

Diese Person hat ein Konto, ist aber noch nicht freigeschaltet.

Typische Situation:

- neues Konto wurde gerade angelegt
- Benutzer sieht den Hinweis, dass noch keine Berechtigungen zugeteilt wurden
- geschützte Arbeitsbereiche sind noch nicht nutzbar

### Benutzer

Diese Rolle erlaubt den Zugriff auf den Liederbereich.

Typische Aktionen:

- Liedliste öffnen
- Lieddetails ansehen
- Liedtexte und vorhandene Informationen lesen
- Lieder für die eigene Arbeit suchen

### Mitarbeiter

Diese Rolle ist für Personen gedacht, die Lieddaten mitpflegen.

Typische Aktionen:

- neue Lieder anlegen
- vorhandene Lieder bearbeiten
- ergänzende Angaben zu Liedern pflegen
- bei Lieddetails zusätzliche Bearbeitungsinformationen sehen

### Lobpreisgruppe

Diese Rolle ist für Teammitglieder gedacht, die Veranstaltungen sehen und mit vorbereiteten Abläufen arbeiten.

Typische Aktionen:

- Veranstaltungsliste öffnen
- Veranstaltungsdetails ansehen
- Lieder einer Veranstaltung nachvollziehen
- sich auf einen Einsatz vorbereiten

### Lobpreisleiter

Diese Rolle ist für Personen gedacht, die Veranstaltungen planen und verantworten.

Typische Aktionen:

- neue Veranstaltungen anlegen
- Veranstaltungen bearbeiten
- Lieder zu Veranstaltungen hinzufügen oder ordnen
- eigene Veranstaltungen verwalten
- Gastansichten für Veranstaltungen teilen
- auf leitungsbezogene Aktionen in Liedern und Veranstaltungen zugreifen

### Präsentator

Diese Rolle ist für Personen gedacht, die während einer Veranstaltung die Präsentation bedienen.

Typische Aktionen:

- Präsentationsbereich öffnen
- eine Veranstaltung für die Präsentation auswählen
- Präsentation starten
- Präsentation steuern
- Präsentationsmonitor nutzen

### Administrator

Diese Rolle ist für Personen gedacht, die Benutzer und Berechtigungen verwalten.

Typische Aktionen:

- Benutzerprofil mit Benutzerverwaltung öffnen
- registrierte Benutzer sehen
- Namen von Benutzern korrigieren
- Rollen vergeben oder entfernen
- alle rollenabhängigen Bereiche nutzen

## Öffentliche Seiten

Einige Seiten benötigen keine Anmeldung:

- [Anmelden](pages/anmelden.md)
- [Benutzer anlegen](pages/benutzer-anlegen.md)
- [Passwort zurücksetzen](pages/passwort-zuruecksetzen.md)
- [Passwort-Mail gesendet](pages/passwort-mail-gesendet.md)
- [Branding](pages/branding.md)
- [Gastansicht](pages/gastansicht.md)

Die Gastansicht ist öffentlich, aber nur über den passenden Link sinnvoll nutzbar.

## Geschützte Bereiche

Für diese Bereiche brauchst du eine Anmeldung und passende Rollen:

- Lieder: Berechtigung **Benutzer**
- Lieder anlegen oder bearbeiten: Berechtigung **Mitarbeiter**
- Veranstaltungen ansehen: Berechtigung **Lobpreisleiter** oder **Lobpreisgruppe**
- Veranstaltungen anlegen: Berechtigung **Lobpreisleiter**
- Präsentation nutzen: Berechtigung **Präsentator**
- Benutzer verwalten: Berechtigung **Administrator**

## Rollen prüfen

Deine eigenen Rollen siehst du im [Benutzerprofil](pages/benutzerprofil.md). Dort werden sie in verständlicher Sprache angezeigt, zum Beispiel Lobpreisleiter oder Präsentator.

Wenn du einen Bereich nicht öffnen kannst oder eine erwartete Schaltfläche fehlt, fehlt dir wahrscheinlich die passende Rolle. Wende dich dann an einen Administrator.

## Rollen vergeben

Nur Administratoren können Rollen vergeben.

1. Als Administrator anmelden.
2. Das [Benutzerprofil](pages/benutzerprofil.md) öffnen.
3. Im Bereich `registrierte Benutzer` den gewünschten Benutzer auswählen.
4. Eine oder mehrere Rollen auswählen.
5. Die Bearbeitung schließen.

## Hinweise

- Vergib nur Rollen, die eine Person wirklich für ihre Aufgabe braucht.
- Für viele Aufgaben ist eine Kombination mehrerer Rollen sinnvoll.
- `Administrator` umfasst weitreichende Rechte und sollte sparsam vergeben werden.
- Ein neues Konto ohne Rollen ist normal und muss erst freigeschaltet werden.
- Sichtbare Menüpunkte und Aktionen können je nach Rolle unterschiedlich sein.

## Links

- [Benutzerprofil](pages/benutzerprofil.md)
- [Benutzer anlegen](pages/benutzer-anlegen.md)
- [Neuer Benutzer ohne Rollen](pages/neuer-benutzer-ohne-rollen.md)
- [Gastansicht](pages/gastansicht.md)
