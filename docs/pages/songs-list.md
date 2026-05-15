# Liedliste

## Route

`/songs`

Die Route liegt im Songs-Modul als leerer Child-Pfad (`path: ''`). Der übergeordnete App-Router lädt das Modul unter `/songs`, schützt es mit `AuthGuard` und `RoleGuard` und verlangt die Rolle `user`. Vor dem Anzeigen der Seite lädt `SongListResolver` einmalig die vollständig geladene Songliste.

## Zweck

Die Liedliste ist der zentrale Einstieg in die Songdatenbank. Sie zeigt alle Songs nach Liednummer sortiert, ermöglicht das schnelle Auffinden über Suche und Filter und macht wichtige Pflegehinweise direkt in der Liste sichtbar. Von hier aus wechseln Benutzer in die Detailseite eines Songs oder, mit entsprechender Berechtigung, in den Anlegeprozess.

## Datenquellen

- `SongListResolver` nutzt `SongService.listLoaded$()` und wartet mit `take(1)` auf die erste geladene Liste aus Firestore.
- `SongService` delegiert die Datenzugriffe an `SongDataService`, das die Collection `songs` über `DbService.col$<Song>('songs')` liest und per `shareReplay` cacht.
- Die aktuellen Filterwerte kommen aus `FilterStoreService.songFilter$`.
- Die Textsuche läuft über `searchSongs`; zusätzliche Filter werden in `SongListComponent.filter()` geprüft.
- `TextRenderingService.validateChordNotation()` validiert den Songtext jedes sichtbaren Listeneintrags auf Akkordschreibweisen.

## Wichtige UI-Elemente

Die Seite verwendet `app-page-frame` mit dem Titel `Lieder`. Im Sidebar-Bereich befindet sich `app-filter`; der Hauptbereich enthält eine Liste in einer Card.

Jeder Listeneintrag zeigt:

- Liednummer
- Titel
- Status- und Warnsymbole
- Tonart

Wenn ein Filter aktiv ist, erscheint oberhalb der Liste ein Hinweis mit der Anzahl gefundener Lieder und der Aktion `Filter zurücksetzen`. Zusätzlich setzt `menuBadge` am Page-Frame ein optisches Signal, dass die Liste gefiltert ist.

Die Filterkomponente bietet:

- Freitextsuche nach Titel oder Text
- Filter nach Songtyp (`Praise`, `Worship`, `Misc`)
- Tonartfilter nach Grundton, Vorzeichen und Dur/Moll
- Option `Parallele Tonart einschließen`
- Filter nach rechtlichem Status
- Filter nach Attributen aus den im Bestand vorhandenen `flags`

Nicht passende Tonart-Grundtöne werden deaktiviert, wenn im aktuellen Songbestand keine passende Tonart existiert.

## Aktionen

- Klick auf einen Listeneintrag navigiert relativ zur Song-ID, also auf `/songs/:songId`.
- `Filter zurücksetzen` leert die gespeicherten Songfilter im `FilterStoreService`.
- `Neuen Song anlegen` navigiert auf `/songs/new`.

## Berechtigungen

Der Zugriff auf das Songs-Modul erfordert Authentifizierung und die Rolle `user`. Innerhalb der Liedliste sind zusätzliche Informationen rollenabhängig:

- `contributor`: sieht Statusindikatoren für `draft`, `set` und `final`.
- `contributor`: sieht den Button `Neuen Song anlegen`.
- Rechtliche Warnungen für Songs mit `legalType === 'open'` werden unabhängig vom Contributor-Status am Eintrag angezeigt.

## Relevante technische Hinweise

Die Liste sortiert Songs clientseitig nach `number`. Der Resolver verwendet die geladene Songliste ohne `startWith([])`, damit die Route erst nach der ersten echten Firestore-Antwort angezeigt wird. Die spätere Filterung kombiniert `combineLatest` aus Filterstore und Routendaten.

Die Akkordvalidierung wird pro gefiltertem Song ausgeführt und markiert betroffene Titel mit einem Stern. Die Validierung verändert keine Daten; sie dient nur als Hinweis für Pflegebedarf.

Der Tonartfilter basiert auf `matchesKeyFilter()` aus `key.helper.ts`. Er unterstützt Dur/Moll, `#`/`b`-Varianten und optional parallele Tonarten. Die Filterwerte bleiben im zentralen Filterstore erhalten und werden beim erneuten Öffnen der Seite wieder in das Formular übernommen.
