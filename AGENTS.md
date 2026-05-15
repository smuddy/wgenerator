# Repository Guidelines

## Projektstruktur & Modulorganisation

Dies ist eine Angular-Anwendung. Der Hauptcode liegt in `src/app`, Feature-Bereiche liegen unter `src/app/modules` (`songs`, `shows`, `guest`, `presentation`, `user`, `brand`). Gemeinsame Services befinden sich in `src/app/services`; wiederverwendbare UI-Komponenten, Pipes, Direktiven und Guards liegen in `src/app/widget-modules`. Statische Assets und PWA-Icons liegen in `src/assets` sowie in den `src/*icon*`-Dateien. Globale Styles stehen in `src/styles` und `src/custom-theme.scss`. Unit-Tests liegen neben den Implementierungen als `*.spec.ts`.

## Build-, Test- und Entwicklungsbefehle

- `npm start` oder `ng serve`: startet den lokalen Angular-Dev-Server.
- `npm run build:dev`: erstellt einen Development-Build.
- `npm run build`: erstellt einen Production-Build in `dist/wgenerator`.
- `npm test`: führt Angular-Unit-Tests mit dem Vitest-Runner aus.
- `npm run lint`: führt Angular ESLint aus und wendet automatische Fixes an.
- `npm run deploy`: baut die Production-Version und deployt über Firebase.

Nutze `npm ci -f` für eine saubere Dependency-Installation wie im Gitea-CI-Workflow.

## Coding Style & Namenskonventionen

Verwende TypeScript, vorhandene Angular-Standalone-Konventionen und LESS für generierte Component-Styles. Die Formatierung wird über `.editorconfig` und `.prettierrc` gesteuert: 2 Leerzeichen Einrückung, keine Tabs, Semikolons, Single Quotes, keine Leerzeichen in geschweiften Klammern und Trailing Commas, soweit in ES5 gültig. Angular-Selektoren müssen den Prefix `app` nutzen: Components als kebab-case-Elemente, Direktiven als camelCase-Attribute.

## Testrichtlinien

Tests nutzen Vitest über Angulars `@angular/build:unit-test`-Builder. Lege Specs direkt neben die getestete Datei und nutze das Suffix `*.spec.ts`. Gemeinsame Angular-Testdefaults und Jasmine-Kompatibilitätshelfer sind in `src/test-vitest.ts` konfiguriert; nutze diese Helfer statt Provider in einzelnen Specs zu duplizieren. Führe vor Behaviour-Änderungen `npm test` aus.

## Commit- & Pull-Request-Richtlinien

Die jüngsten Commits nutzen kurze, imperative Nachrichten in Kleinschreibung, zum Beispiel `fix css issues` oder `optimize song filter`. Halte Commits auf eine Änderung fokussiert. Pull Requests sollten eine kurze Zusammenfassung, Test- oder Build-Ergebnisse, verlinkte Issues oder Tasks bei Bedarf und Screenshots für sichtbare UI-Änderungen enthalten.

## Sicherheit & Konfiguration

`src/environments/firebase.ts` wird von Git ignoriert, aber von `environment.ts` und Production-Builds benötigt. CI erzeugt die Datei aus Secrets; lokale Entwickler brauchen eine eigene Kopie mit Firebase-Projektwerten. Committe keine Secrets und keinen generierten Build-Output.

## Deutsche Dokumentation

Deutschsprachige Markdown-Dokumentation muss korrekte Umlaute und `ß` verwenden, nicht ASCII-Umschreibungen wie `ae`, `oe`, `ue` oder `ss`. Nutzeranleitungen müssen die sichtbaren Begriffe aus der Oberfläche verwenden, nicht technische Enum-Werte. Beispiel: `Benutzer`, `Lobpreisleiter`, `Präsentator` und `nur den Liedtext anzeigen` statt `user`, `leader`, `presenter` oder `hide`.
