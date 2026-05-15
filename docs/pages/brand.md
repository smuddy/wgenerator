# Branding

## Route

`/brand`

## Zweck

Die Seite zeigt eine einfache Markenansicht mit Logo und Copyright-Hinweis.

## Datenquellen

Die Seite lädt keine fachlichen Daten. `BrandComponent` rendert nur statische Inhalte und `LogoComponent`.

## UI

Die Ansicht besteht aus dem Logo und dem Copyright-Text `© 2019 - 2026 - Benjamin Ifland`.

## Aktionen

Die Seite bietet keine interaktiven Aktionen.

## Rollen und Berechtigungen

Die Seite ist öffentlich erreichbar und hat keinen Guard.

## Technische Hinweise

- `BrandComponent` ist als Standalone-Import im `BrandModule` eingebunden.
- Die Komponente wird in `/brand/new-user` wiederverwendet, damit der Freischaltungszustand dieselbe Markenansicht nutzt.
