# Datenmodell

## Überblick

Die Anwendung speichert fachliche Daten in Firestore und Song-Anhänge in Firebase Storage. Firestore-Dokumente werden über AngularFire als Live-Observables gelesen; Dokument-IDs werden in den Services als `id` in die Objekte übernommen.

Zentrale Collections:

- `users`
- `songs`
- `shows`
- `guest`
- `global`

Subcollections:

- `songs/{songId}/files`
- `shows/{showId}/songs`

## `users/{uid}`

Benutzerprofile ergänzen Firebase Auth um Anwendungsdaten:

- `id`: Firestore-Dokument-ID, entspricht der Firebase-Auth-UID.
- `name`: Anzeigename.
- `role`: Semikolon-getrennte Rollenliste.
- `chordMode`: bevorzugte Akkorddarstellung.
- `songUsage`: Map von `songId` auf Nutzungszähler.

`songUsage` wird beim Hinzufügen oder Entfernen von Show-Songs inkrementell aktualisiert. Die Admin-Migration `rebuildSongUsage` kann die Werte aus Shows neu berechnen.

## `songs/{songId}`

Ein Song enthält Stammdaten, musikalische Angaben, rechtliche Angaben und Bearbeitungshistorie:

- `number`, `title`, `type`, `status`
- `key`, `tempo`, `text`, `flags`, `final`, `comment`
- `legalType`, `legalOwner`, `legalOwnerId`
- `artist`, `label`, `termsOfUse`, `origin`
- `edits`: Liste aus Bearbeitername und Timestamp

Typen:

- `type`: `Praise`, `Worship` oder `Misc`.
- `status`: `draft`, `set` oder `final`.
- `legalOwner`: `CCLI` oder `other`.
- `legalType`: `open` oder `allowed`.

Beim Aktualisieren eines Songs ergänzt `SongService` einen Eintrag in `edits`.

## `songs/{songId}/files/{fileId}`

Die Subcollection enthält Metadaten zu Dateien in Firebase Storage:

- `name`: Dateiname.
- `path`: Storage-Verzeichnis des Songs.
- `createdAt`: Erstellzeitpunkt.

`UploadService` lädt Dateien nach Firebase Storage hoch und schreibt anschließend das Metadaten-Dokument. `FileService` erzeugt Download-URLs und entfernt Dateien aus Storage und Firestore.

## `shows/{showId}`

Shows beschreiben Veranstaltungen und den Präsentationszustand:

- `showType`: Veranstaltungstyp.
- `date`: Firestore-Timestamp.
- `owner`: Benutzer-ID des Besitzers.
- `songIds`: denormalisierter Index der enthaltenen Ursprungssongs.
- `public`: Kennzeichen für öffentliche Show-Typen.
- `reportedType`: `null`, `pending`, `reported` oder `not-required`.
- `published`: Veröffentlichung in Listen.
- `archived`: Archivstatus.
- `order`: Reihenfolge der Show-Song-Dokument-IDs.
- `shareId`: Verweis auf ein Gastfreigabe-Dokument.

Präsentationsfelder:

- `presentationSongId`
- `presentationDynamicCaption`
- `presentationDynamicText`
- `presentationSection`
- `presentationZoom`
- `presentationBackground`

`presentationBackground` erlaubt `none`, `blue`, `green`, `leder`, `praise` und `bible`.

`ShowService` unterscheidet öffentliche und private Show-Typen. Beim Anlegen werden `owner`, leere `order`, leere `songIds` und `public` aus dem Show-Typ berechnet.

## `shows/{showId}/songs/{showSongId}`

Show-Songs sind Snapshots von Songs innerhalb einer Show. Sie erweitern das Song-Modell um showbezogene Felder:

- `songId`: ID des Ursprungssongs.
- `key`: aktuelle Tonart in der Show.
- `keyOriginal`: ursprüngliche Tonart.
- `chordMode`: Akkorddarstellung des Benutzers zum Zeitpunkt des Hinzufügens.
- `addedLive`: Kennzeichen für live hinzugefügte Songs.

Beim Hinzufügen kopiert `ShowSongService` die aktuellen Songdaten in die Subcollection, aktualisiert `users/{uid}.songUsage` und fügt die Ursprungssong-ID zu `shows/{showId}.songIds` hinzu. Beim Entfernen wird die Reihenfolge angepasst, der Nutzungszähler reduziert und `songIds` entfernt, wenn kein weiterer Show-Song denselben Ursprungssong nutzt.

## `guest/{guestId}`

Gastfreigaben sind öffentlich lesbare Snapshots einer Show:

- `showType`
- `date`
- `updatedAt`
- `songs`: Liste der freigegebenen Songs

`GuestShowService` erstellt oder aktualisiert das Gastdokument und schreibt die erzeugte `shareId` zurück an die Show. Die öffentliche URL hat das Format `/guest/{shareId}`.

## `global/config`

Globale Konfiguration:

- `ccliLicenseId`: CCLI-Lizenznummer.

`ConfigService` liest das Dokument gecacht.

## `global/static`

Laufzeitstatus der Anwendung:

- `currentShow`: ID der aktuell ausgewählten Show für die Präsentation.

`GlobalSettingsService` liest und schreibt dieses Dokument. Die Präsentationsauswahl setzt `currentShow`; Remote- und Monitoransicht verwenden den Wert zur Synchronisierung.

## Denormalisierung und Migrationen

Zwei Felder sind bewusst denormalisiert:

- `users/{uid}.songUsage` für Nutzungszähler pro Benutzer.
- `shows/{showId}.songIds` für schnelle Abfragen und Anzeigeinformationen zu verwendeten Songs.

Für beide Datenbestände existieren Admin-Migrationen im README. Sie sollten nach strukturellen Korrekturen oder historischen Datenproblemen manuell ausgeführt werden.
