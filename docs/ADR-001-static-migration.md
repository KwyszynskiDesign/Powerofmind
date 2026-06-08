# ADR-001: Migracja z WordPress (Elementor/Astra) do statycznego HTML/CSS/JS

## Status
Zaakceptowane

## Kontekst
Strona powerofmind działała na WordPressie z motywem Astra i page builderem Elementor. Strona była oparta na shortcodes, co zapewniało responsywność, ale tworzyło duplikację i uzależnienie od WP.

## Decyzja
Migracja do czystego statycznego site (HTML + CSS + JS) z zachowaniem:
- wyglądu i treści,
- formularza kontaktowego (przez GAS),
- popupu dostępności,
- responsywności.

## Konsekwencje
+ Łatwiejsze hosting (GitHub Pages / dowolny static hosting).
+ Szybsze ładowanie.
+ Pełna kontrola nad kodem (łatwiejsza optymalizacja SEO i dostępności).
- Brak CMS — aktualizacja treści wymaga edycji HTML lub późniejszego wprowadzenia generatora.
- Formularz wymaga GAS jako backend proxy.

## Alternatywy rozważane
1. Pozostawienie WordPressa — odrzucone: klientka chce uproszczenia i lepszej wydajności.
2. Headless CMS (Strapi, Sanity) — odrzucone: na start zbyt duża złożoność.
3. Generator statyczny (Astro, 11ty) — odroczone: możliwe w przyszłości, na start czysty HTML.
