# Session Log

## 2026-05-14 17:20 [saved]
Goal: Improve song key filter readability.
Decisions:
- Use root-key controls with refinement because grouped enharmonic dropdowns were still awkward to change.
- Keep memory markdown files in `.dev/` because the user requested that location.
Rejected:
- Keep all sharp and flat variants as separate primary options.
- Use a grouped enharmonic dropdown that forces users through reset-like interaction.
Open:
- User will review the visual result.
## 2026-05-15 10:21 [saved]
Goal: Deutschsprachigen Contributor Guide für dieses Angular-Repository erstellen.
Decisions:
- `AGENTS.md` bleibt auf Deutsch, weil der Nutzer ausdrücklich deutsche Ausgabe verlangt hat.
- Guide nutzt Standard-Contributor-Struktur, weil der Nutzer konkrete Abschnitte vorgegeben hat.
- Firebase-Konfigurationshinweis bleibt enthalten, weil Builds eine ignorierte `firebase.ts` benötigen.
Rejected:
- Kein rein agenteninternes Minimal-AGENTS.md.
Open: Keine.

## 2026-05-15 10:55 [saved]
Goal: Deutsche Dokumentation sprachlich an Nutzererwartung anpassen.
Decisions:
- Korrekte Umlaute und `ß` sind Pflicht, weil deutsche Doku keine ASCII-Umschreibungen verwenden soll.
- Nutzeranleitungen verwenden sichtbare UI-Begriffe, weil technische Enums für Anwender ungeeignet sind.
- ASCII-Dateinamen bleiben für Links stabil, weil nur sichtbarer Dokumenttext korrigiert werden musste.
Rejected:
- Technische Rollenwerte wie `leader` in Nutzeranleitungen.
Open: Keine.

## 2026-05-15 10:48 [saved]
Goal: Anwenderhandbuch unter `man/` mit Seiten und Tutorials erstellen.
Decisions:
- `man/` ist rein anwenderorientiert, weil der Nutzer keine technische Beschreibung wollte.
- Seiten- und Tutorialdateien sind getrennt, weil Nachschlagen und Lernen unterschiedliche Nutzungssituationen sind.
- Wiki-Links verbinden Handbuchseiten, Tutorials und Berechtigungen, weil Anwender navigierend lernen sollen.
Rejected:
- Technische Implementierungsdetails im Anwenderhandbuch.
Open: Keine.

## 2026-05-15 10:35 [saved]
Goal: Ausführliche Projektdokumentation unter `docs/` erstellen.
Decisions:
- Dokumentation nach Seite und Querschnitt getrennt, weil Routen und Technik unabhängig gepflegt werden.
- `docs/index.md` ist zentrale Navigation, weil viele Einzeldokumente angelegt wurden.
- Parallele Agents wurden nach Fachbereichen eingesetzt, weil der Nutzer parallele Dokumentarbeit verlangte.
Rejected:
- Eine einzige große Projektdokumentation.
Open: Keine.
