# Seite: Präsentationssteuerung

## Route

`/presentation/remote`

Dies ist die Standardseite des Presentation-Moduls. Ein Aufruf von `/presentation` leitet auf diese Route weiter.

## Zweck

Die Remote-Seite ist die Live-Bedienoberfläche für das Präsentationsteam. Sie bestimmt, welche Folie der Monitor zeigt, welche Hintergrundgrafik aktiv ist, wie groß der Text dargestellt wird und welcher freie Text live eingeblendet werden soll.

## Datenfluss

Die `RemoteComponent` liest zuerst `global/static.currentShow` über `GlobalSettingsService.get$`. Sobald eine aktuelle Show vorhanden ist, lädt sie:

- die Show über `ShowService.read$(showId)`
- die zugeordneten Show-Songs über `ShowSongService.list$(showId)`
- die verfügbaren Songs für das Live-Hinzufügen über `SongService.list$()`

Die Show-Songs werden mit `TextRenderingService.parse(song.text, null, false)` in Präsentationsabschnitte zerlegt. Für die Anzeige nutzt die Remote nur die Song-IDs, Titel und geparsten Abschnitte. Die sichtbare Reihenfolge folgt `show.order`; Songs, die nicht in dieser Reihenfolge stehen, werden in der Abschnittsliste nicht gerendert.

Änderungen schreibt die Remote direkt auf das aktuelle Show-Dokument. Freier Text wird über Subjects gesammelt und mit `debounceTime(1000)` verzögert gespeichert, damit beim Tippen nicht jeder Tastendruck sofort einen Schreibvorgang auslöst.

## UI-Bedienung

Oben zeigt die Karte den Veranstaltungstyp und das Datum der aktiven Show. Über das Ordner-Symbol gelangt man zur Auswahlseite `/presentation/select`.

Die Bedienfläche enthält feste Ziele und die nach Show-Reihenfolge sortierten Songs:

- `Veranstaltung`: setzt `presentationSongId` auf `title` und zeigt auf dem Monitor die Titelfolie.
- `Leer`: setzt `presentationSongId` auf `empty` und zeigt eine leere Präsentationsfläche.
- Songtitel: setzt die Song-ID mit `presentationSection: -1`; der Monitor lädt den Song, ohne einen konkreten Abschnitt auszuwählen.
- Songabschnitt: setzt die Song-ID und den Abschnittsindex. Angezeigt werden Abschnittstyp, Abschnittsnummer und die erste Textzeile des Abschnitts.
- `Freier Text`: setzt `presentationSongId` auf `dynamicText`. Überschrift und Text werden über die Eingabefelder darunter gepflegt.

Am unteren Rand befinden sich die Live-Einstellungen:

- `Präsentation starten` öffnet `/presentation/monitor`.
- `Hintergrund` setzt `presentationBackground`.
- Der Slider setzt `presentationZoom` im Bereich von 10 bis 100 in Schritten von 2.

Zusätzlich bindet die Seite `app-add-song` mit `addedLive="true"` ein. Damit können Songs während der Präsentation zur Show hinzugefügt werden; die Remote bekommt die aktualisierte Show-Song-Liste anschließend über die Live-Datenströme.

## Zusammenspiel von Remote und Monitor

Remote und Monitor kommunizieren nicht direkt miteinander. Die Remote schreibt den gewünschten Präsentationszustand auf die aktive Show, der Monitor liest dieselben Felder live und rendert daraus die Ausgabe.

Für den Betrieb bedeutet das:

- Die Auswahlseite setzt `global/static.currentShow`.
- Die Remote liest diese Show, zeigt deren Songs und schreibt Präsentationsbefehle auf das Show-Dokument.
- Der Monitor liest dieselbe Show und aktualisiert seine Anzeige, sobald sich die Live-Felder ändern.

Dadurch kann die Remote auf einem Bediengerät laufen, während der Monitor auf einem Beamer- oder Display-Gerät geöffnet ist.

## Live-Felder auf der Show

Die Remote pflegt folgende Felder aus `Show`:

- `presentationSongId`: aktiver Inhalt. Besondere Werte sind `title`, `empty` und `dynamicText`; ansonsten enthält das Feld eine Show-Song-ID.
- `presentationSection`: Index des aktiven Liedabschnitts. Bei Titeln, Leerseite, freiem Text oder Songtitel-Auswahl wird `-1` verwendet.
- `presentationDynamicCaption`: Überschrift des freien Textes.
- `presentationDynamicText`: Inhalt des freien Textes; Zeilenumbrüche werden vom Monitor erhalten.
- `presentationZoom`: Schriftgröße für den Monitor.
- `presentationBackground`: Hintergrundmodus. Unterstützt sind `none`, `blue`, `green`, `leder`, `praise` und `bible`.

## Technische Besonderheiten

Die Komponente nutzt `ChangeDetectionStrategy.OnPush` und ruft nach Live-Updates `markForCheck()` auf. Subscriptions werden über `destroy$` mit `takeUntil` beendet.

Der aktive Show-Kontext wird aus `GlobalSettingsService` abgeleitet und mit `distinctUntilChanged()` stabilisiert. Sobald sich `currentShow` ändert, laden Show und Show-Songs automatisch neu.

Die Remote ist tastaturbedienbar: auswählbare Folien reagieren neben Klicks auch auf `Enter` und `Space` und sind als `role="button"` mit `tabindex="0"` ausgezeichnet.
