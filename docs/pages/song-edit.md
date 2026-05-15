# Lied bearbeiten

## Route

`/songs/:songId/edit`

Die Route ist im Songs-Modul als `path: ':songId/edit'` definiert. Der übergeordnete `/songs`-Eintrag im App-Router verlangt Authentifizierung und die Rolle `user`. Die Edit-Route selbst definiert keinen zusätzlichen `canActivate`-Guard, verwendet aber `EditSongGuard` als `canDeactivate`-Guard.

## Zweck

Die Bearbeitungsseite bündelt die Pflege eines Songs. Sie erlaubt das Bearbeiten von Inhalt, musikalischen Angaben, rechtlichen Metadaten und Attributen, verwaltet Anhänge und zeigt die letzte Änderungshistorie. Sie ist die Anschlussseite nach dem Anlegen eines neuen Songs und die zentrale Stelle für spätere Songpflege.

## Aufbau

`EditComponent` ist eine Container-Komponente innerhalb eines `app-page-frame` ohne Menü. Sie rendert drei Teilbereiche:

- `EditSongComponent`: Formular für Songtext, Stammdaten und Rechtsinformationen.
- `EditFileComponent`: Upload und Verwaltung angehängter Dateien.
- `HistoryComponent`: Anzeige der letzten gespeicherten Änderungen.

Der Container hält über `ViewChild` eine Referenz auf `EditSongComponent`, damit der `EditSongGuard` beim Verlassen der Route ungespeicherte Formularänderungen prüfen kann.

## Datenquellen

- `SongService.read$(songId)` lädt den Song für Formular und Historie.
- `EditService.createSongForm(song)` erzeugt das reaktive Formular aus dem geladenen Song.
- `SongService.update$(songId, data)` speichert Änderungen und ergänzt einen Eintrag in `song.edits`.
- `UserService.currentUser()` liefert beim Speichern den Namen des aktuellen Benutzers für die Änderungshistorie.
- `FileDataService.read$(songId)` liest vorhandene Anhänge aus `songs/{songId}/files`.
- `UploadService` schreibt neue Dateien nach Firebase Storage unter `/attachments/{songId}` und speichert die Metadaten anschließend in Firestore.
- `FileService` löst Download-URLs auf und löscht Anhänge aus Storage sowie aus der Firestore-Subcollection.

## Wichtige UI-Elemente

Der Song-Editor zeigt eine Card mit der Überschrift `{Nummer} bearbeiten` und einem Zurück-Link zur Detailseite. Das Formular enthält:

- Titel
- Typ
- Tonart
- Tempo
- Status
- Songtext
- Kommentar
- Attribute als Chips
- rechtlicher Status
- Rechteinhaber
- Rechteinhaber-ID mit CCLI-Link, wenn der Rechteinhaber CCLI ist
- Künstler
- Verlag / Copyright
- Nutzungsbedingungen
- abweichende Quelle

Während das Songtextfeld fokussiert ist, zeigt die Seite eine Vorschau über `app-song-text` sowie Bearbeitungshinweise zum Aufbau von Strophen, Refrain, Bridge und Akkordzeilen. Akkordvalidierungsfehler werden unter `Akkordschreibweise korrigieren` mit Zeile, Meldung, betroffenem Token und optionalem Vorschlag angezeigt.

Der Dateibereich zeigt eine Upload-Auswahl, einen Upload-Button, während des Uploads einen Fortschrittsbalken und die vorhandenen Anhänge. Jeder Anhang kann geöffnet und über ein Papierkorb-Symbol gelöscht werden.

Die Historie zeigt vorhandene `song.edits` mit Benutzername und Datum.

## Aktionen

- `Speichern`: validiert das Formular, speichert die Rohwerte über `SongService.update$()`, markiert das Formular als unverändert und navigiert nach `/songs/:songId`.
- Attribut hinzufügen: Eingabe im Chip-Feld wird bei Enter, Komma oder Blur an die semikolongetrennte `flags`-Liste angehängt.
- Attribut entfernen: entfernt den Chip und schreibt die verbleibenden Attribute zurück in `flags`.
- Datei auswählen: übernimmt die aktuelle Dateiauswahl aus dem File-Input.
- Datei hochladen: lädt die erste ausgewählte Datei nach Firebase Storage und speichert danach die Dateimetadaten.
- Datei löschen: entfernt die Datei aus Firebase Storage und löscht den Firestore-Metadatensatz.
- Seite verlassen mit ungespeicherten Änderungen: öffnet einen Speicherdialog; bei Bestätigung wird vor der Navigation gespeichert.

## Berechtigungen

Der Zugriff auf das Songs-Modul erfordert Authentifizierung und die Rolle `user`. Die Edit-Route selbst erzwingt in `songs-routing.module.ts` keine `contributor`-Rolle. Der Einstieg aus der Detailseite ist allerdings nur für `contributor` sichtbar, weil der Button `Bearbeiten` rollenabhängig gerendert wird.

Für die Dokumentation ist deshalb wichtig: Die UI versteckt den regulären Einstieg für Nicht-Contributors, die Route selbst enthält aber keinen zusätzlichen Aktivierungs-Guard. Falls direkte URL-Aufrufe ebenfalls verhindert werden sollen, müsste die Route analog zu `/songs/new` mit einem `RoleGuard` erweitert werden.

## Relevante technische Hinweise

Die Akkordvalidierung wird bei jeder Änderung des Songtextes aktualisiert. `TextRenderingService.validateChordNotation()` erkennt unter anderem alternative Schreibweisen wie `is/es`, falsche Dur/Moll-Großschreibung, nicht normalisierte Suffixe, unbekannte Akkordtokens und Tabulatoren in Akkordzeilen. Validierungsfehler werden als Formularfehler `chordNotation` am Text-Control gesetzt; dadurch ist der Speichern-Button deaktiviert, solange der Text ungültig ist.

`SongService.update$()` liest vor dem Speichern den aktuellen Song, hängt einen neuen Historieneintrag mit Benutzername und `Timestamp.now()` an und schreibt anschließend die Änderungen. Dadurch wird die Historie nur bei Speichervorgängen über diesen Service erweitert.

Der Upload-Service ignoriert Upload-Fehler im aktuellen Stand bewusst im Error-Callback. Die UI zeigt Fortschritt und erfolgreiche Metadaten danach über die Dateiliste, aber keine eigene Fehlermeldung.

Der `EditSongGuard` schützt nur vor Navigation aus dem Angular-Router heraus. Er fragt `EditSongComponent.askForSave(nextState)` ab und navigiert nach dem Dialog selbst weiter. Bei nicht dirty Formularen wird die Navigation direkt erlaubt.
