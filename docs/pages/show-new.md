# Seite: Veranstaltung anlegen

## Route

`/shows/new`

Die Route ist im Shows-Routing mit `RoleGuard` geschuetzt und verlangt die Rolle `leader`.

## Zweck

Die Seite erstellt den Kopf einer neuen Veranstaltung. Nach der Anlage wird direkt zur Detailseite navigiert, wo Lieder hinzugefügt und der weitere Ablauf gepflegt werden.

## Datenquellen

- `ShowService.SHOW_TYPE_PUBLIC` und `ShowService.SHOW_TYPE_PRIVATE` liefern die auswählbaren Veranstaltungstypen.
- `ShowService.new$(data)` erstellt das Show-Dokument.
- `UserService.user$` wird innerhalb von `ShowService.new$()` verwendet, um den Besitzer zu setzen.
- `ShowDataService.add()` schreibt die neue Show in die Firestore-Collection `shows`.

`NewComponent` haelt außerdem `ShowDataService.list$` als `shows$`, nutzt diesen Stream in der aktuellen Vorlage aber nicht sichtbar.

## Wichtige UI-Elemente

- `app-page-frame` mit Titel `Veranstaltungen`.
- Karte `Neue Veranstaltung` mit Rücksprung nach `/shows`.
- Formularfeld `Art der Veranstaltung` als gruppierte Auswahl.
- Formularfeld `Datum` mit Material-Datepicker.
- Button `Anlegen`.

## Aktionen

- Formular ausfuellen: Typ und Datum sind Pflichtfelder.
- Anlegen: markiert alle Felder als berührt, prüft die Formularvaliditaet und ruft `ShowService.new$()` auf.
- Nach erfolgreicher Anlage: Navigation zu `/shows/{id}`.

## Statuslogik

Beim Initialisieren wird das Formular zurückgesetzt. Das Speichern bricht ab, wenn Pflichtfelder fehlen oder kein Benutzer ermittelt werden kann.

`ShowService.new$()` ergänzt die eingegebenen Daten um:

- `owner`: ID des aktuellen Benutzers
- `order: []`
- `songIds: []`
- `public`: abgeleitet daraus, ob `showType` in `SHOW_TYPE_PUBLIC` enthalten ist

Veröffentlichungs-, Melde- und Archivstatus werden auf dieser Seite nicht direkt gesetzt.

## Berechtigungen

- Zugriff auf die Route erfordert `leader`.
- Die Seite selbst enthält keine zusätzliche Owner-Prüfung, da die Show erst beim Speichern für den aktuellen Benutzer erzeugt wird.

## Technische Hinweise

- Das Formular ist ein typisiertes Reactive Form mit `FormControl<Date | null>` und `FormControl<string | null>`.
- Die Auswahl trennt öffentliche und private Veranstaltungstypen in `mat-optgroup`.
- Die Anzeige der Typen erfolgt über `ShowTypePipe`.
- `ShowService.new$()` gibt `null` zurück, wenn kein `showType` oder kein Benutzer vorhanden ist; die Navigation nutzt dann defensiv einen leeren String.
