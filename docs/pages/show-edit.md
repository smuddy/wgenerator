# Seite: Veranstaltung bearbeiten

## Route

`/shows/:showId/edit`

Die Route bearbeitet den Showkopf einer bestehenden Veranstaltung anhand der URL-Variable `showId`. In `shows-routing.module.ts` ist für diese Route kein eigener `canActivate`-Guard definiert.

## Zweck

Die Seite ändert Datum und Veranstaltungstyp einer vorhandenen Veranstaltung. Sie ist für Korrekturen an den Kopfdaten gedacht; Songauswahl, Reihenfolge, Texte, Veröffentlichung, Archivierung, Teilen, CCLI-Meldung und DOCX-Export werden auf der Detailseite verwaltet.

## Datenquellen

- `ActivatedRoute.params` liefert `showId`.
- `ShowService.read$(showId)` laedt die Show einmalig.
- `ShowService.SHOW_TYPE_PUBLIC` und `ShowService.SHOW_TYPE_PRIVATE` liefern die auswählbaren Typen.
- `ShowService.update$(id, data)` speichert die Änderungen.
- `ShowDataService.update()` schreibt die Aktualisierung in `shows/{id}`.

`EditComponent` haelt außerdem `ShowDataService.list$` als `shows$`, nutzt diesen Stream in der aktuellen Vorlage aber nicht sichtbar.

## Wichtige UI-Elemente

- `app-page-frame` mit Titel `Veranstaltungen`.
- Karte `Veranstaltung ändern` mit Rücksprung zur Detailseite `/shows/{id}`.
- Formularfeld `Art der Veranstaltung` als gruppierte Auswahl.
- Formularfeld `Datum` mit Material-Datepicker.
- Button `Speichern`.

## Aktionen

- Seite laden: liest die Show und befüllt das Formular mit `id`, `date` und `showType`.
- Speichern: markiert alle Felder als berührt, prüft Pflichtfelder und aktualisiert Datum sowie Typ.
- Nach dem Speichern: Navigation zurück nach `/shows/{id}`.

## Statuslogik

Beim Initialisieren wird das Formular zuerst zurückgesetzt und danach einmalig aus der geladenen Show befüllt. Das Speichern bricht ab, wenn das Formular ungültig ist oder `id`, `date` oder `showType` fehlen.

Beim Speichern wird nur Folgendes geändert:

- `date` als Firestore `Timestamp.fromDate(date)`
- `showType`

Die Seite ändert keine Werte für `published`, `reportedType`, `archived`, `order`, `songIds` oder `shareId`.

## Berechtigungen

- Die Route selbst hat im Shows-Routing keinen eigenen Guard.
- Der Einstieg zur Bearbeitungsseite ist auf der Detailseite nur für `leader`, den Besitzer der Show und unveröffentlichte Shows sichtbar.
- Direkte URL-Aufrufe werden auf Komponentenebene nicht zusätzlich durch `RoleDirective` oder `OwnerDirective` abgefangen.

## Technische Hinweise

- Das Formular ist ein Reactive Form mit den Controls `id`, `date` und `showType`.
- Die Show wird mit `take(1)` nur einmal in das Formular übernommen.
- Die Typauswahl verwendet dieselben Konstanten wie die Neuanlage und zeigt die Werte über `ShowTypePipe` an.
- Änderungen am Feld `showType` berechnen `public` nicht neu; gespeichert wird nur der Typ. Falls der Öffentlich-/Privat-Status nach Typwechsel relevant ist, muss diese Logik separat berücksichtigt werden.
