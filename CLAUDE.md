\# CLAUDE.md — powerofmind



\## Cel repo

Statyczna, wielostronicowa strona landingowa klientki (powerofmind).

Każda podstrona to osobna historia tematu. Index sprzedaje i przekierowuje do historii.

Priorytet: zgodność techniczna, czysta architektura, możliwość rozbudowy, działający formularz i popup.



\## Kontekst biznesowy

@PRD.md

@context.md



\## Architektura i stos

@architecture.md



\## Mapa katalogów

\- site/ — pliki strony (HTML, CSS, JS, assety)

&#x20; - index.html — landing sprzedażowy

&#x20; - stories/ — podstrony-historie (jedna historia = jeden plik lub folder)

&#x20; - assets/ — CSS, JS, obrazy, fonty

&#x20; - components/ — powtarzalne fragmenty HTML (nagłówek, stopka, formularz, popup)

\- docs/ — audity, plany, decyzje

\- .claude/rules/ — reguły specjalistyczne

\- .claude/skills/ — skille CC



\## Kluczowe komendy

Brak build stepu (czysty static). Lokalny serwer:

&#x20; npx serve site/   albo   python -m http.server -d site/



\## Standardy kodowania

\- Zawsze używaj semantycznego HTML5.

\- CSS: mobile-first, zmienne CSS (--color-\*), unikaj !important.

\- JS: vanilla ES6+, moduły opcjonalnie, nie dodawaj frameworków bez uzasadnienia.

\- Nigdy nie zostawiaj komentarzy TODO — albo zrób, albo wpisz do docs/TODO.md.

\- Unikaj duplikacji kodu — wydzielaj komponenty do components/ lub shared CSS/JS.

\- Ścieżki względne: ./assets/..., ./stories/...



\## Workflow

1\. Audit (docs/AUDIT.md) — nie ruszaj kodu przed audytem.

2\. Plan (docs/MIGRATION\_PLAN.md) — zatwierdź plan przed implementacją.

3\. Restrukturyzacja — usuń duplikację, wydziel komponenty.

4\. Implementacja etapami — jeden story = jeden etap.

5\. Test lokalny i review.

6\. Deployment (GitHub Pages lub hosting klienta).



\## /compact — co zachować

\- Ostatnie decyzje architektoniczne (ADR).

\- Stan formularza i popupu (czy działają).

\- Lista podstron stories/ i ich status.

\- Otwarte zagadnienia z docs/TODO.md.



\## Git

\- Commity po polsku lub angielsku? Preferuj: angielski, konwencjonalny prefix.

&#x20; - feat: nowa podstrona/komponent

&#x20; - fix: naprawa

&#x20; - refactor: restrukturyzacja bez zmiany zachowania

&#x20; - chore: porządki, docs, config

\- Nie commituj plików tymczasowych ani cache.

\- Nie pushuj bez lokalnego testu.



\## Zasady bezpieczeństwa i formularzy

@.claude/rules/security-forms.md



\## Reguły projektowe

@.claude/rules/static-site-rules.md

@.claude/rules/deployment-rules.md

@.claude/rules/repo-structure.md



\## Skill: grill-me

Aktywuj /grill-me przy każdym nowym zadaniu, które dotyczy:

\- nowej podstrony,

\- zmiany architektury,

\- dodania funkcjonalności (np. nowy formularz, nowy popup).



\## Ograniczenia

\- Nie zakładaj backendu PHP, WordPress runtime ani bazy danych.

\- Formularz obsługiwany przez Google Apps Script + lh.pl (szczegóły w architecture.md).

\- Popup z dostępnością miejsc na spotkanie — logika w JS, dane mogą być z GAS.

