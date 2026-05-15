# Seite: Veranstaltungsdetails

## Route

`/shows/:showId`

Die Route zeigt eine einzelne Veranstaltung anhand der URL-Variable `showId`. In `shows-routing.module.ts` ist kein eigener `canActivate`-Guard für diese Detailroute definiert.

## Zweck

Die Detailseite ist der zentrale Arbeitsbereich für eine Veranstaltung. Hier werden die Ablaufreihenfolge gepflegt, Lieder für diese Veranstaltung angepasst, Texte angezeigt, die Veranstaltung veröffentlicht oder archiviert, ein Gastlink erzeugt, die CCLI-Meldung abgeschlossen und ein DOCX-Dokument exportiert.

## Datenquellen

- `ActivatedRoute.params` liefert `showId`.
- `ShowService.read$(showId)` laedt das Show-Dokument.
- `ShowSongService.list$(showId)` laedt die Lieder aus der Subcollection `shows/{showId}/songs`.
- `SongService.list$()` wird nur für unveröffentlichte Shows geladen, damit weitere Lieder hinzugefügt werden können.
- `GuestShowService.share(show, songs)` erzeugt oder aktualisiert die Gastansicht für geteilte veröffentlichte Veranstaltungen.
- `DocxService.create(showId, options?)` laedt Show, Show-Songs, Besitzer und Konfiguration für den DOCX-Export.
- `UserService` wird beim Archivieren genutzt, um Song-Nutzungszaehler zu verringern oder wieder zu erhoehen.

## Wichtige UI-Elemente

- `app-page-frame` mit Titel `Veranstaltungen`.
- Hauptkarte mit Veranstaltungstyp, Datum und Status im Kopf.
- Metazeile mit öffentlich/geschlossen, Besitzername, Veröffentlichungs-Badge und CCLI-Melde-Badge für den Besitzer.
- Checkbox `Text anzeigen`.
- Icon-Aktionen für Textgroesse und Vollbild.
- Drag-and-drop-Liedliste mit `app-song`-Einträgen.
- `app-add-song` zum Hinzufügen weiterer Lieder bei unveröffentlichten Veranstaltungen.
- Vollbild-/Swiper-Ansicht mit Uhrzeit, nächstem Lied und Tastatursteuerung.
- Aktionsleiste für Archivierung, Veröffentlichung, Teilen, CCLI, Bearbeiten und DOCX-Download.

## Aktionen

- Reihenfolge ändern: Drag-and-drop aktualisiert `show.order`.
- Lied hinzufügen: nur bei unveröffentlichten Shows, über `app-add-song`.
- Tonart ändern: die Tonart eines Show-Songs wird direkt in der Show-Subcollection gespeichert.
- Liedtext für diese Veranstaltung bearbeiten: speichert nur den Text des Show-Songs, nicht den globalen Song.
- Lied entfernen: entfernt den Show-Song, passt `order` an und entfernt die Song-ID aus `songIds`, wenn kein weiteres Vorkommen desselben Songs in der Show existiert.
- Text anzeigen: blendet Liedtexte ein und aktiviert je nach Lied die Akkorddarstellung.
- Vollbild starten: aktiviert die Swiper-Ansicht, vergroessert den Text und nutzt Browser-Fullscreen.
- Vollbild verlassen: setzt Textgroesse und Fullscreen zurück.
- DOCX herunterladen: öffnet ein Menü mit zwei Exportvarianten.

## Veröffentlichung

Die Aktion `Veröffentlichen` setzt `published` auf `true`.

- Geschlossene bzw. nicht öffentliche Shows erhalten `reportedType: 'not-required'`.
- Öffentliche Shows werden auf CCLI-pflichtige Lieder geprüft.
- Wenn mindestens ein Show-Song `legalOwner === 'CCLI'` und eine `legalOwnerId` hat, wird `reportedType: 'pending'` gesetzt.
- Wenn keine CCLI-Meldung erforderlich ist, wird `reportedType: 'not-required'` gesetzt.

Die Aktion `Veröffentlichung zurückziehen` setzt `published` auf `false` und `reportedType` auf `null`.

Veröffentlichte Veranstaltungen sind in der Detailseite inhaltlich weitgehend gesperrt: Die Reihenfolge ist nicht per Drag-and-drop änderbar, es werden keine neuen Songs geladen, und die Bearbeiten-Aktion für Showkopf sowie Song-Bearbeitung stehen nicht zur Verfügung.

## Archivierung

Die Aktion `Archivieren` öffnet einen Bestätigungsdialog. Nach Bestätigung setzt die Seite `archived: true`.

Beim Archivieren wird für jeden geladenen Show-Song `UserService.decSongCount(songId)` aufgerufen. Beim Wiederherstellen setzt die Seite `archived: false` und ruft entsprechend `UserService.incSongCount(songId)` auf.

Archivierte Shows verschwinden aus den normalen Listen und können in der Veranstaltungsliste für eigene Veranstaltungen über den Archiv-Filter wieder sichtbar gemacht werden.

## CCLI-Meldung

Die CCLI-Aktion erscheint nur für veröffentlichte Shows mit `reportedType === 'pending'`.

Der Report-Dialog sammelt eindeutige CCLI-pflichtige Lieder aus der aktuellen Reihenfolge. Eindeutigkeit wird über `songId` oder ersatzweise `title:legalOwnerId` hergestellt. Für jedes Lied zeigt der Dialog Titel, CCLI-Nummer und einen Link zu `https://reporting.ccli.com/search?s={nummer}`.

Nach Klick auf `Alle CCLI-Titel wurden gemeldet` setzt die Seite `reportedType` auf `reported`.

## Teilen

Die Teilen-Aktion ist nur für veröffentlichte Shows sichtbar.

`GuestShowService.share()` schreibt die für Gaeste benötigten Daten in die Guest-Show-Datenquelle:

- `showType`
- `date`
- `updatedAt`
- geordnete Songliste

Wenn die Show noch keine `shareId` hat, wird ein neuer Guest-Show-Eintrag angelegt und die `shareId` im Show-Dokument gespeichert. Wenn bereits eine `shareId` existiert, wird die bestehende Gastansicht aktualisiert.

Der Share-Dialog zeigt den Link `/guest/{shareId}`, erzeugt einen QR-Code und bietet über Clipboard/Web Share API eine Teilen-Aktion an.

## DOCX-Export

Der Download-Button öffnet ein Menü mit zwei Varianten:

- `Ablauf für Lobpreisgruppe`: erstellt ein DOCX mit Songtexten und Akkorden entsprechend dem jeweiligen `chordMode`.
- `Handout mit Copyright Infos`: erstellt ein DOCX mit `chordMode: 'hide'` und Copyright-/Lizenzinformationen.

`DocxService` laedt die Bibliothek `docx` dynamisch, rendert die Songs in `show.order`, transponiert Texte über `TextRenderingService.parse()` und erzeugt den Download im Browser über einen temporaeren Blob-Link.

## Statuslogik

Der Seitenstatus im Kopf wird so berechnet:

- `veröffentlicht`, wenn `show.published` wahr ist
- `gemeldet`, wenn `show.reportedType === 'reported'`
- sonst `entwurf`

Badge-Typen:

- `reportedType: 'pending'` wird als Fehler-/Warnstatus dargestellt.
- `reportedType: 'reported'` wird als OK-Status dargestellt.
- `reportedType: 'not-required'` und fehlender Meldewert erhalten keinen hervorgehobenen Badge.
- `published` wird als OK-Status dargestellt, nicht veröffentlichte Shows ohne Hervorhebung.

## Berechtigungen

- Die Route selbst hat im Shows-Routing keinen eigenen Guard.
- Archivieren, Wiederherstellen, Veröffentlichen, Veröffentlichung zurückziehen, Teilen, CCLI-Meldung und Bearbeiten sind per `RoleDirective` auf `leader` und per `OwnerDirective` auf den Besitzer der Show beschränkt.
- Der DOCX-Download ist in der Aktionsleiste ohne diese Owner-/Leader-Einschränkung sichtbar.
- Die Bearbeiten-Aktion für den Showkopf erscheint nur bei unveröffentlichten Shows.

## Technische Hinweise

- `show$` und `songs$` werden mit `shareReplay({bufferSize: 1, refCount: true})` geteilt.
- Die Seite haelt `showSongs` als lokale Liste, weil Sortierung, Export, Teilen und CCLI-Meldung die geordnete Liste synchron benoetigen.
- `orderedShowSongs(show)` mappt `show.order` auf die geladenen Show-Songs und filtert fehlende Einträge aus.
- Keyboard-Navigation im Vollbild reagiert auf Pfeiltasten und steuert das Swiper-Element.
- `getSongKeyColumnWidth()` berechnet eine stabile Spaltenbreite für Tonart-Labels inklusive Transposition.
