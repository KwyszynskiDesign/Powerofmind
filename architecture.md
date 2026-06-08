\# architecture.md — powerofmind



\## Paradygmat

Statyczny site (HTML + CSS + JS), z możliwością późniejszej rozbudowy do generatora lub frameworka.

Strona była w WordPress (Elementor + Astra + shortcodes). Migracja do static oznacza:

\- odtworzenie wyglądu 1:1 lub z drobnymi poprawkami UX,

\- restrukturyzację duplikacji,

\- zachowanie funkcjonalności formularza i popupu.



\## Struktura modułowa (głębokie moduły, proste interfejsy)

site/

├── index.html — landing sprzedażowy

├── stories/

│ ├── index.html — opcjonalna lista historii

│ └── {story-slug}/

│ └── index.html — pojedyncza historia

├── components/

│ ├── head.html — wspólny <head> (meta, fonty, css)

│ ├── nav.html — nawigacja

│ ├── footer.html — stopka

│ ├── form-contact.html — formularz kontaktowy

│ ├── popup-availability.html — popup dostępności

│ └── cta-section.html — powtarzalna sekcja CTA

├── assets/

│ ├── css/

│ │ ├── variables.css — design tokens (kolory, spacing, fonty)

│ │ ├── base.css — reset + typografia

│ │ ├── layout.css — grid, kontenery, nawigacja

│ │ ├── components.css — przyciski, karty, formularze, popup

│ │ ├── stories.css — specyficzne style dla podstron historii

│ │ └── index.css — specyficzne dla landing page

│ ├── js/

│ │ ├── main.js — inicjalizacja, nawigacja, lazy load

│ │ ├── form-handler.js — obsługa formularza → GAS

│ │ ├── popup.js — logika popupu dostępności

│ │ └── utils.js — helpers (throttle, debounce, fetch wrapper)

│ ├── images/

│ └── fonts/



text



\## Komponenty HTML w static site

Ponieważ nie ma backendu, komponenty HTML mogą być:

\- wklejane ręcznie (na start),

\- lub generowane przez prosty build step (później, opcjonalnie).

Claude powinien utrzymywać spójność komponentów ręcznie — nie halucynuj o SSR.



\## Integracje



\### Formularz kontaktowy

\- Frontend: HTML form w `components/form-contact.html` (lub inline na stronach).

\- Backend proxy: Google Apps Script (GAS) — istniejący lub nowy endpoint.

\- Email: lh.pl (SMTP / wysyłka przez GAS).

\- Pola: imię, email, temat, wiadomość, opcjonalnie wybrany termin (jeśli z popupu).

\- Walidacja: HTML5 + JS (trim, email regex, min length).

\- Feedback: inline message (sukces / błąd), nie alert().



\### Popup dostępności

\- Trigger: klik przycisku, opcjonalnie scroll/time (do ustalenia).

\- UI: modal overlay z listą terminów / miejsc.

\- Dane: mogą być:

&#x20; a) hardcoded w JS (prosty przypadek),

&#x20; b) pobierane z GAS jako JSON (dynamiczny).

\- Interakcja: wybór terminu → przekazanie do formularza (np. wypełnienie hidden field lub URL param).

\- Dostępność: focus trap w modalu, zamknięcie Escape lub kliknięciem tła, ARIA labels.



\## Stos technologiczny (obecny i docelowy)

\- HTML5 (semantyczny)

\- CSS3 (zmienne, flexbox, grid, clamp)

\- Vanilla JS (ES6+)

\- Opcjonalnie później: Vite + Tailwind lub prosty generator (11ty, Astro) — decyzja ADR.



\## Bezpieczeństwo

\- Nie przechowuj danych w localStorage (sandbox blokuje, a i tak niebezpieczne).

\- Endpoint GAS powinien walidować dane po stronie serwera (jeśli to możliwe w GAS).

\- Nie umieszczaj sekretów w kodzie JS (tokeny, hasła). GAS endpoint może być publiczny, ale rate-limitowany.



\## Wydajność

\- Obrazy: WebP z fallbackiem, lazy loading.

\- CSS/JS: na start osobne pliki, później opcjonalnie minifikacja.

\- Fonty: font-display: swap.

