# Seite: Präsentation auswählen

## Route

`/presentation/select`

Die Route gehört zum Presentation-Modul. Der leere Presentation-Pfad leitet auf `/presentation/remote` weiter; die Auswahlseite wird über den Ordner-Button der Remote-Steuerung geöffnet.

## Zweck

Die Seite legt fest, welche Veranstaltung live präsentiert wird. Sie ist der Einstiegspunkt, wenn das Präsentationsteam vor oder während einer Veranstaltung auf eine andere Show wechseln muss.

## Datenfluss

Die `SelectComponent` lädt Shows über `ShowService.list$(true)`. Dadurch werden veröffentlichte Veranstaltungen angezeigt; eigene unveröffentlichte Shows werden in diesem Modus nicht zusätzlich eingeblendet. Anschließend filtert die Komponente clientseitig auf Shows, deren Datum neuer ist als ein Monat vor dem aktuellen Zeitpunkt.

Die Liste wird nach Datum sortiert und zeigt pro Eintrag den Besitzer, den übersetzten Veranstaltungstyp und das Datum. Bei der Auswahl einer Show passieren zwei Schreibvorgänge:

- `GlobalSettingsService.set({currentShow: show.id})` schreibt die aktive Show in das globale Dokument `global/static`.
- `ShowService.update$(show.id, {presentationSongId: 'title'})` setzt die Präsentation der gewählten Show auf die Titelfolie.

Danach navigiert die Seite nach `/presentation/remote`.

## UI-Bedienung

Die Seite zeigt eine Karte mit der Überschrift `Bitte eine Veranstaltung auswählen`. Wenn keine passende Veranstaltung vorhanden ist, erscheint der Hinweis `Es ist derzeit keine Veranstaltung vorhanden`.

Jede verfügbare Veranstaltung wird als vollbreiter Button dargestellt. Ein Klick auf einen Eintrag aktiviert diese Show global und öffnet direkt die Remote-Steuerung. Die Seite besitzt kein eigenes Menü.

## Zusammenspiel von Remote und Monitor

Die Auswahlseite steuert nicht direkt den Monitor. Sie bestimmt aber über `global/static.currentShow`, welche Show Remote und Monitor anschließend beobachten. Da beide Seiten denselben globalen Wert lesen, wechseln Remote-Steuerung und Monitor auf dieselbe Veranstaltung, sobald die Auswahl gespeichert ist.

Das zusätzliche Setzen von `presentationSongId` auf `title` sorgt dafür, dass der Monitor nach dem Wechsel nicht versehentlich den zuletzt aktiven Liedabschnitt oder freien Text der Show anzeigt, sondern mit der Veranstaltungsfolie startet.

## Live-Felder auf der Show

Die Auswahlseite schreibt nur ein Präsentationsfeld auf der Show:

- `presentationSongId`: wird beim Auswählen auf `title` gesetzt.

Alle weiteren Live-Felder werden anschließend über die Remote-Steuerung gepflegt:

- `presentationSection`
- `presentationDynamicCaption`
- `presentationDynamicText`
- `presentationZoom`
- `presentationBackground`

## Technische Besonderheiten

Die aktive Show liegt nicht im lokalen Komponentenstatus, sondern im globalen Settings-Dokument. Das macht den Wechsel geräteübergreifend sichtbar: Ein Gerät kann die Show auswählen, während ein anderes Gerät bereits den Monitor geöffnet hat.

Die Showliste wird über RxJS im Template mit `AsyncPipe` angezeigt. Die Komponente blendet den Inhalt beim Initialisieren über den `fade`-Trigger ein.
