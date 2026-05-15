# Seite: Veranstaltungsliste

## Route

`/shows`

Die Route ist der Standardpfad des Shows-Moduls. In `shows-routing.module.ts` ist kein eigener `canActivate`-Guard auf dieser Route definiert.

## Zweck

Die Veranstaltungsliste ist der Einstieg in den Veranstaltungsbereich. Sie trennt eigene, noch zu bearbeitende Veranstaltungen von bereits veröffentlichten Veranstaltungen und bietet für berechtigte Benutzer Filter sowie den Einstieg zur Neuanlage.

## Datenquellen

- `ShowService.list$()` liefert die für den aktuellen Benutzer sichtbaren Veranstaltungen.
- `ShowService.list$(false, true)` liefert eigene Veranstaltungen inklusive archivierter eigener Einträge.
- `ShowService.listPublicSince$(lastMonths)` fragt veröffentlichte, nicht archivierte Veranstaltungen serverseitig nach Zeitraum ab.
- Falls die serverseitige Abfrage keine Ergebnisse liefert, nutzt die Liste einen lokalen Fallback aus geladenen veröffentlichten und nicht archivierten Shows.
- `FilterStoreService.showFilter$` speichert Zeitraum, Ersteller, Veranstaltungstyp und Archiv-Filter.
- `UserService.user$` bestimmt den aktuellen Benutzer und dessen Rolle.
- `FilterComponent.owners$()` baut die Ersteller-Auswahl aus den in Shows verwendeten `owner`-IDs und `UserService.getUserbyId$()`.

## Wichtige UI-Elemente

- Seitenrahmen `app-page-frame` mit Titel `Veranstaltungen`.
- Sidebar mit `app-filter`, sichtbar für Rollen mit Sidebar-Zugriff.
- Karte `Meine Veranstaltungen` für eigene Entwürfe, nicht gemeldete veröffentlichte Veranstaltungen und optional archivierte Veranstaltungen.
- Karte `Veröffentlichte Veranstaltungen` für veröffentlichte, nicht archivierte Veranstaltungen.
- Listeneintraege zeigen Datum, Erstellername, übersetzten Veranstaltungstyp und optional ein Status-Badge.
- Button `Neue Veranstaltung anlegen`, der nach `/shows/new` führt.
- Hinweiszeile bei aktiven Filtern mit Anzahl der angezeigten Veranstaltungen und Aktion `Filter zurücksetzen`.

## Aktionen

- Veranstaltung öffnen: Klick auf einen Listeneintrag navigiert relativ zu `show.id`, also nach `/shows/:showId`.
- Neue Veranstaltung anlegen: nur über den Button in `Meine Veranstaltungen`.
- Filter ändern: Zeitraum, Ersteller, Veranstaltungstyp und Archiv-Anzeige werden direkt im `FilterStoreService` aktualisiert.
- Filter zurücksetzen: stellt den Standardfilter wieder her.

## Statuslogik

Der Standardfilter ist:

- Zeitraum: letzter Monat
- Ersteller: alle
- Veranstaltungstyp: alle
- Archiviert: aus

Öffentliche Veranstaltungen werden absteigend nach Datum sortiert und zusätzlich nach Ersteller und Veranstaltungstyp gefiltert. Der Zeitraum wird in 30-Tage-Monaten berechnet; `alle` nutzt den Wert `99999`.

Eigene Veranstaltungen erscheinen in `Meine Veranstaltungen`, wenn sie dem aktuellen Benutzer gehören und eine der folgenden Bedingungen erfüllen:

- nicht veröffentlicht
- `reportedType === 'pending'`
- archiviert und der Archiv-Filter ist aktiv

Status-Badges in `Meine Veranstaltungen`:

- `archiviert`, wenn `show.archived` gesetzt ist
- `nicht gemeldet`, wenn die Show veröffentlicht ist
- `unveröffentlicht`, wenn die Show nicht veröffentlicht ist

## Berechtigungen

- Die Route selbst hat im Shows-Routing keinen eigenen Guard.
- Sidebar und Filter sind nur sichtbar, wenn die Rolle `admin` oder `leader` enthält.
- Der Button `Neue Veranstaltung anlegen` ist per `RoleDirective` auf `leader` beschränkt.
- Benutzer ohne Sidebar-Zugriff sehen nur die veröffentlichten Veranstaltungen ohne Filterbereich.

## Technische Hinweise

- `ShowService.list$()` filtert archivierte Shows grundsaetzlich aus, lässt eigene archivierte Shows aber zu, wenn `includeOwnArchived` aktiv ist.
- `ShowDataService.listPublicSince$()` verwendet Firestore-Constraints `published == true`, optional `date >= startTimestamp` und `orderBy('date', 'desc')`; archivierte Shows werden danach clientseitig entfernt.
- Die Seite nutzt `combineLatest`, `switchMap`, `map` und `shareReplay`-basierte Streams; die Darstellung erfolgt komplett reaktiv über `AsyncPipe`.
- Filterwerte bleiben über `FilterStoreService` erhalten und werden sowohl in der Sidebar als auch für die Listenberechnung verwendet.
