# Gastansicht

## Route

`/guest/:id`

## Zweck

Die Gastansicht zeigt eine öffentlich geteilte Version einer Veranstaltung. Sie richtet sich an externe Personen ohne Login und stellt Veranstaltungstyp, Datum und Liedtexte bereit.

## Datenquellen

- `GuestComponent` liest die Routen-ID aus `ActivatedRoute.params`.
- `GuestShowDataService.read(id)` lädt den initialen Datensatz aus der Firestore-Collection `guest`.
- `GuestShowDataService.read$(id)` abonniert anschließend Live-Updates für denselben Datensatz.
- `GuestShowService.share(show, songs)` erstellt oder aktualisiert Gastdatensätze aus einer Veranstaltung und erzeugt die URL `/guest/{shareId}`.

## UI

Die geladene Veranstaltung zeigt links den übersetzten Veranstaltungstyp und rechts das Datum im Format `dd.MM.yyyy`. Die Songs werden in einem Swiper dargestellt. Jede Folie enthält Titel, optional Künstler und den Liedtext über `SongTextComponent`.

Für Lade-, Fehler- und Nicht-gefunden-Zustände zeigt die Seite einfache Meldungen.

## Aktionen

Die Gastseite selbst bietet keine Bearbeitungsaktionen. Benutzer können durch die Song-Folien wischen; Aktualisierungen am geteilten Datensatz erscheinen über das Live-Abonnement.

## Rollen und Berechtigungen

Die Route ist öffentlich erreichbar und nicht durch Authentifizierung geschützt. Zugriffsschutz erfolgt ausschließlich über die Kenntnis der Share-ID in der URL.

## Technische Hinweise

- Der Zustand der Seite ist als `GuestShowState` modelliert: `loading`, `loaded`, `not-found` oder `error`.
- Datumswerte werden normalisiert und unterstützen `Date`, Firestore-Timestamps mit `toDate`, Objekte mit `seconds`, Strings und Zahlen.
- Falls der initiale Ladevorgang keinen Datensatz findet, wird `not-found` angezeigt.
- Fehler beim initialen Laden oder bei Live-Aktualisierungen führen zu einer Fehlermeldung.
- `ensureSwiperElement()` registriert das Web Component für den Swiper.
