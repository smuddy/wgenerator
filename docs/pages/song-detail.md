# Lieddetails

## Route

`/songs/:songId`

Die Detailseite ist ein Child-Pfad des Songs-Moduls. Der übergeordnete `/songs`-Eintrag im App-Router verlangt Authentifizierung und die Rolle `user`. Die Detailroute selbst definiert keinen zusätzlichen `canActivate`-Guard.

## Zweck

Die Detailseite ist die primäre Leseseite für einen einzelnen Song. Sie zeigt Stammdaten, Liedtext, Akkorddarstellung, Kommentare, Attribute, Anhänge und nutzerbezogene Verwendungsinformationen. Außerdem bietet sie rollenabhängige Aktionen zum Bearbeiten, Löschen und zum Hinzufügen des Songs zu einer eigenen unveröffentlichten Veranstaltung.

## Datenquellen

- `SongService.read$(songId)` liest den Song aus der Collection `songs`.
- `FileDataService.read$(songId)` liest die Subcollection `songs/{songId}/files`.
- `UserService.user$` liefert den angemeldeten Benutzer, dessen bevorzugter `chordMode` für die Liedtextanzeige genutzt wird.
- `UserService.user$` liefert außerdem `songUsage`, aus dem die nutzerbezogene Verwendungsanzahl des Songs bestimmt wird.
- `ShowService.list$()` liefert Shows, um eigene Shows des Benutzers zu finden und unveröffentlichte Veranstaltungen für die Aktion `Zu Veranstaltung hinzufügen` anzubieten.
- `ShowSongService.new$()` erstellt beim Hinzufügen zu einer Show den Show-Song-Eintrag.

## Wichtige UI-Elemente

Die Seite verwendet `app-page-frame` ohne Menü. Im Content-Bereich liegt eine Detail-Card mit der Überschrift aus Liednummer und Titel sowie einem Zurück-Link zur Liste.

Für berechtigte Rollen werden Stammdaten angezeigt:

- Typ
- Tonart
- Tempo
- Status
- Rechteinhaber und Rechteinhaber-ID
- CCLI-Link, wenn `legalOwner === 'CCLI'` und eine `legalOwnerId` vorhanden ist
- Künstler
- Verlag
- Quelle
- Verwendungsanzahl mit Tooltip

Der Liedtext wird über `app-song-text` gerendert. Die Komponente erhält den Songtext, den Chord-Modus des Benutzers und `validateChordNotation=true`. Wenn `showSwitch` aktiv ist, kann die Akkordanzeige zwischen Ausblenden, nur erste Strophe und Anzeigen wechseln.

Attribute aus `song.flags` werden als Chips dargestellt. Der Kommentar wird als eigener Textblock angezeigt. Anhänge erscheinen in einer separaten Card `Anhänge`; jeder Anhang löst seine Firebase-Storage-Download-URL auf und wird als externer Link geöffnet.

## Aktionen

- `Bearbeiten`: navigiert nach `/songs/:songId/edit`.
- `Löschen`: löscht den Song über `SongService.delete(songId)` und navigiert anschließend zurück nach `/songs`.
- `Zu Veranstaltung hinzufügen`: erstellt einen Show-Song-Eintrag, hängt dessen ID an die Reihenfolge (`order`) der gewählten Show an und navigiert zur Show unter `/shows/:showId`.
- Akkordschalter im Songtext: wechselt den lokalen Chord-Modus der Anzeige.

## Berechtigungen

Der Seitenzugriff erfordert über die Parent-Route die Rolle `user`. Innerhalb der Seite gelten zusätzliche Rollen:

- `leader` und `contributor`: sehen Metadaten, Attribute, Kommentar und Verwendungsinformationen.
- `contributor`: sieht die Aktion `Bearbeiten`.
- `leader`: sieht `Zu Veranstaltung hinzufügen`, sofern unveröffentlichte Shows vorhanden sind.
- `admin`: sieht die Aktion `Löschen`.

## Relevante technische Hinweise

Die Song-ID wird aus den Routenparametern gelesen und in mehreren Observables verwendet. `song$`, `files$`, `songCount$`, `songUsageShows$` und `songUsageTooltip$` reagieren dadurch auf Parameteränderungen.

Die Verwendungsanzeige kombiniert zwei Quellen: den Zähler `user.songUsage[song.id]` und eine aus Shows berechnete Liste eigener Shows, deren `songIds` den Song enthalten. Der Tooltip zeigt entweder einen Leerzustand, einen Hinweis auf noch nicht indexierte Show-Zuordnungen oder eine datierte Liste der gefundenen Shows.

Anhänge sind Metadaten in Firestore und Binärdaten in Firebase Storage. Die Detailseite kann Anhänge nur öffnen; Upload und Löschen werden auf der Bearbeitungsseite erledigt.

Das Löschen fragt im aktuellen Komponentenstand keine Bestätigung ab. Dokumentations- und UI-Texte sollten deshalb deutlich machen, dass die Aktion direkt über den Service ausgeführt wird.
