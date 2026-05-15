# Seite: Präsentationsmonitor

## Route

`/presentation/monitor`

Die Route öffnet die Vollbildausgabe für Beamer oder Display. Sie wird typischerweise über den Button `Präsentation starten` auf `/presentation/remote` geöffnet.

## Zweck

Der Monitor rendert den aktuellen Präsentationszustand der aktiven Show. Er zeigt Titelfolie, leere Fläche, freien Text oder Liedabschnitte und ergänzt bei Liedern die rechtlichen Angaben.

## Datenfluss

Die `MonitorComponent` liest `global/static.currentShow` über `GlobalSettingsService.get$`. Aus dieser ID lädt sie die Show über `ShowService.read$(showId)` und übernimmt daraus die Live-Felder für Anzeigezustand, Datum, Veranstaltungstyp, Zoom, Hintergrund und freien Text.

Für Song-Inhalte beobachtet der Monitor `presentationSongId`. Bei `title`, `dynamicText` oder fehlender Song-ID wird kein Song gesetzt. Bei anderen Werten lädt er den passenden Show-Song über `ShowSongService.read$(showId, presentationSongId)`.

Konfigurationsdaten für rechtliche Hinweise kommen aus `ConfigService.get$()`. Die Komponente `app-legal` nutzt diese Daten unter anderem für die CCLI-Lizenznummer.

## UI-Anzeige

Beim Initialisieren ruft der Monitor `openFullscreen()` auf. Die Anzeige liegt als fixierte Vollbildfläche über der Anwendung und blendet den Mauszeiger aus.

Der Monitor kennt folgende Zustände:

- `title`: zeigt den übersetzten Veranstaltungstyp und das Datum.
- `empty`: zeigt die leere Präsentationsfläche mit Logo beziehungsweise Hintergrund.
- `dynamicText`: zeigt `presentationDynamicCaption` und `presentationDynamicText`.
- Show-Song-ID: rendert `app-song-text` mit Songtitel, Liedtext und aktivem Abschnitt.

Bei Songs werden Akkorde ausgeblendet (`chordMode="hide"`), Kommentare nicht angezeigt und die interne Abschnittsnavigation des Song-Text-Widgets deaktiviert. Der aktive Abschnitt kommt aus `presentationSection`.

## Zusammenspiel von Remote und Monitor

Der Monitor ist ein reiner Live-Reader. Alle Bedienhandlungen erfolgen in der Remote-Steuerung; der Monitor reagiert auf die Felder, die dort auf der aktiven Show gespeichert werden.

Wenn die Remote `presentationSongId`, `presentationSection`, `presentationZoom`, `presentationBackground`, `presentationDynamicCaption` oder `presentationDynamicText` ändert, aktualisiert der Monitor seine Darstellung über die abonnierten Datenströme. Beim Wechsel der aktiven Show über `/presentation/select` liest der Monitor die neue `currentShow` aus den globalen Settings und richtet die Ausgabe darauf aus.

## Live-Felder auf der Show

Der Monitor wertet folgende Felder aus:

- `presentationSongId`: entscheidet über Titelfolie, Leerseite, freien Text oder Songanzeige.
- `presentationSection`: bestimmt den aktiven Abschnitt im Songtext.
- `presentationDynamicCaption`: Überschrift für den freien Text.
- `presentationDynamicText`: Inhalt für den freien Text; Zeilenumbrüche bleiben durch die Monitor-Styles erhalten.
- `presentationZoom`: wird als Pixelwert auf die Vollbildfläche gesetzt.
- `presentationBackground`: schaltet die Hintergrundgrafik.

Zusätzlich nutzt er `showType` und `date` für die Titelfolie.

## Hintergründe

`presentationBackground` unterstützt diese Werte:

- `none`: schwarzer Hintergrund ohne Bild.
- `blue`: `assets/bg-dark-blue.jpg`
- `green`: `assets/bg-dark-green.jpg`
- `leder`: `assets/bg-leder.jpg`
- `praise`: `assets/bg-praise.jpg`
- `bible`: `assets/bg-bible.jpg`

Die Bildhintergründe werden vollflächig gerendert, weich eingeblendet und je nach Motiv mit Blur und reduzierter Deckkraft versehen. Bei aktivem Bildhintergrund wird das Logo in Songzuständen vollständig ausgeblendet.

## Rechtliche Angaben

Bei Songanzeige rendert `app-legal` die verfügbaren Metadaten des Songs:

- Künstler
- Label
- Nutzungsbedingungen
- Herkunft
- Liednummer beziehungsweise CCLI-Liednummer

Wenn `song.legalOwner` den Wert `CCLI` hat und Konfiguration geladen ist, wird zusätzlich die CCLI-Lizenznummer aus `ConfigService` angezeigt.

## Technische Besonderheiten

Songwechsel werden um 600 ms verzögert. Vor dem Umschalten setzt die Komponente intern `songId` auf `empty`, damit die `songSwitch`-Animation sauber zwischen den Zuständen wechseln kann. Ein laufender Timeout wird beim nächsten Wechsel oder beim Zerstören der Komponente abgebrochen.

Die Show-Daten werden mit `shareReplay(1)` geteilt, damit die separaten Streams für allgemeine Präsentationsdaten und Song-Ladevorgänge dieselbe Show-Quelle verwenden. Subscriptions werden über `destroy$` beendet.
