# Lied anlegen

## Route

`/songs/new`

Die Route ist im Songs-Modul als `path: 'new'` definiert. Sie verwendet zusätzlich zum übergeordneten `/songs`-Schutz einen `RoleGuard` mit `requiredRoles: ['contributor']`.

## Zweck

Die Seite legt einen neuen Song mit minimalen Pflichtdaten an. Sie erfasst nur Liednummer und Titel, erstellt daraus einen Firestore-Datensatz und leitet den Benutzer anschließend direkt auf die Bearbeitungsseite weiter, damit Text, Metadaten, Rechteinformationen und Anhänge ergänzt werden können.

## Datenquellen

- `SongService.list$()` liefert die vorhandenen Songs.
- `NewComponent.getFreeSongNumber()` ermittelt aus den vorhandenen Liednummern die erste freie positive Nummer.
- `SongService.new(songNumber, title)` erstellt den neuen Song.
- `SongDataService.add()` schreibt den Datensatz in die Collection `songs`.

Beim Erstellen setzt `SongService.new()` zusätzlich Standardwerte:

- `status: 'draft'`
- `legalType: 'open'`

## Wichtige UI-Elemente

Die Seite verwendet `app-page-frame` ohne Menü und eine Card mit der Überschrift `Neues Lied`. Die Card besitzt einen Zurück-Link zur Liedliste.

Das Formular besteht aus zwei Feldern:

- `Nummer`: numerische Liednummer, Pflichtfeld
- `Titel`: Songtitel, Pflichtfeld

Beim Initialisieren wird das Formular zurückgesetzt. Danach wird aus der Songliste automatisch die erste freie Liednummer eingetragen. Der Titel bleibt leer und muss vom Benutzer ausgefüllt werden.

## Aktionen

- `Anlegen`: liest die Formularwerte, erstellt den Song und navigiert nach `/songs/{newSongId}/edit`.
- Zurück-Link der Card: führt zurück zur Liedliste.

Wenn keine Nummer vorhanden ist, bricht `onSave()` ab. Eine explizite Prüfung auf doppelte Nummern findet in dieser Komponente nicht statt; die automatische Vorbelegung soll Kollisionen im normalen Ablauf vermeiden.

## Berechtigungen

Der Zugriff auf das Songs-Modul erfordert Authentifizierung und die Rolle `user`. Diese konkrete Route verlangt zusätzlich die Rolle `contributor`. Benutzer ohne diese Rolle sollen nicht auf die Anlegeseite gelangen.

## Relevante technische Hinweise

Das Formular ist ein reaktives Angular-Formular mit `FormGroup` und `Validators.required` für beide Felder. Die Komponente nutzt `take(1)` und `takeUntilDestroyed()`, um die vorhandene Songliste einmalig auszuwerten und die Subscription sauber zu beenden.

Die neue Song-ID kommt von Firestore. Nach erfolgreichem Anlegen wird nicht die Detailseite geöffnet, sondern bewusst die Bearbeitungsroute. Dadurch bleibt der Anlegeprozess kurz und die vollständige Pflege des Songs findet im Editor statt.
