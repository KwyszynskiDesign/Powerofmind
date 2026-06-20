# MIGRATION_PLAN.md — powerofmind
Data: 2026-06-19
Podstawa: AUDIT.md + decyzje właściciela projektu

---

## 1. Zakres migracji

### W zakresie MVP

| Slug źródłowy | Slug docelowy | Uwagi |
|---|---|---|
| `/` (index.html) | `site/index.html` | landing główny |
| `/oddech/` | `site/oddech/index.html` | historia tematu |
| `/oddech_9d/` | `site/oddech-9d/index.html` | historia tematu; kebab-case |
| `/testy-mtq/` | `site/testy-mtq/index.html` | historia tematu |
| `/strefa_relaksu/` | `site/strefa-relaksu/index.html` | historia tematu; kebab-case |
| `/o-mnie-ewa-bugaj-…/` | `site/o-mnie/index.html` | skrócony slug; bez zmiany treści |
| `/formularz_zapisow/` | `site/formularz/index.html` | jeden wspólny formularz całego site |
| `/polityka-prywatnosci/` | `site/polityka-prywatnosci/index.html` | bez zmian treści |

### Poza zakresem MVP (nie blokują)

| Slug | Powód wyłączenia |
|---|---|
| `/webinar_mtq/` | archiwalne / niezweryfikowane; decyzja klientki |
| `/linki/` | opcjonalna strona pomocnicza; po MVP |
| `/produkt/*` | WooCommerce poza scope; linki zastąpione CTA |
| `/koszyk/`, `/platnosci/`, `/moje_konto/` | WooCommerce artefakty |
| `/hello-world/`, `/post-1/2/3/`, `/witaj-swiecie/` | demo WP |
| `/rtsb-template/`, `/author/`, `/category/`, `/e-floating-buttons/` | artefakty pluginów/WP |

---

## 2. Architektura docelowa (site/)

```
site/
├── index.html
├── oddech/
│   └── index.html
├── oddech-9d/
│   └── index.html
├── testy-mtq/
│   └── index.html
├── strefa-relaksu/
│   └── index.html
├── o-mnie/
│   └── index.html
├── formularz/
│   └── index.html
├── polityka-prywatnosci/
│   └── index.html
├── assets/
│   ├── css/
│   │   ├── variables.css
│   │   ├── base.css
│   │   ├── layout.css
│   │   ├── components.css
│   │   ├── stories.css
│   │   └── index.css
│   ├── js/
│   │   ├── main.js
│   │   ├── form-handler.js
│   │   └── utils.js
│   ├── images/
│   │   ├── logo/
│   │   ├── ewa/
│   │   ├── oddech9d/
│   │   ├── opinie/
│   │   ├── ikony/
│   │   └── tla/
│   └── fonts/
│       └── (opcjonalnie: self-hosted woff2)
└── components/
    ├── head.html
    ├── nav.html
    ├── footer.html
    ├── form-contact.html
    └── cookie-banner.html
```

---

## 3. Fazy migracji

### Faza 0 — Fundament (blokuje wszystko)
Cel: działające środowisko lokalne z pustym, ale poprawnym szkieletem.

Kroki:
1. Utwórz `site/` z podfolderdami zgodnie z architekturą
2. Utwórz `site/assets/css/variables.css` — design tokens (kolory, spacing, fonty)
3. Utwórz `site/assets/css/base.css` — reset + typografia (Roboto, Playfair Display)
4. Utwórz `site/assets/css/layout.css` — grid, kontener, nawigacja
5. Utwórz `site/assets/css/components.css` — przyciski (`.btn-primary`, `.btn-secondary`), karty, cookie banner; style formularza dodaje Faza 3
6. Utwórz `site/components/head.html` — meta charset, viewport, Google Fonts CDN (Roboto + Playfair Display), Swiper.js CDN (CSS + JS, zablokowana wersja), linki do CSS assets
7. Utwórz `site/components/nav.html`, `site/components/footer.html`
8. Utwórz `site/components/cookie-banner.html` — prosty, natywny JS, bez zewnętrznych zależności
9. Utwórz `site/assets/js/utils.js` — helpers (throttle, debounce, fetch wrapper)
10. Utwórz `site/assets/js/main.js` — inicjalizacja, mobile nav, smooth scroll
11. Skopiuj używane obrazy z `wp-content/uploads/` do `site/assets/images/` (patrz §5)

DoD Fazy 0: `npx serve site/` otwiera pustą stronę z nawigacją, stopką i poprawnym CSS; utils.js i main.js załadowane bez błędów w konsoli.

---

### Faza 1 — Landing (index.html)
Cel: gotowy landing główny.

Kroki:
1. Odczytaj treść z `/index.html` (WP export)
2. Przepisz do `site/index.html` — semantyczny HTML5, bez Elementora
3. Użyj komponentów z `components/`
4. Zastąp linki `/produkt/*` linkiem CTA → `/formularz/`
5. Dodaj `site/assets/css/index.css` — style specyficzne dla landingu

DoD Fazy 1: landing działa lokalnie, obrazy się wczytują, linki produktowe nie wskazują WooCommerce.

---

### Faza 2 — Strony tematu (Historie)
Cel: 5 podstron (o-mnie + 4 historie tematyczne). Każda = osobny commit.

Kolejność (od najprostszej treściowo):
1. `site/o-mnie/index.html` — bio, zdjęcia, wartości
2. `site/oddech/index.html` — historia + galeria 9D + opinie
3. `site/oddech-9d/index.html` — szczegóły sesji
4. `site/testy-mtq/index.html` — opis testów; linki produktowe → CTA `/formularz/`
5. `site/strefa-relaksu/index.html`

Dla każdej strony:
- Odczytaj treść z WP export
- Przepisz markup do semantycznego HTML5
- Zastąp WPForms embed linkiem/przyciskiem CTA → `/formularz/`
- Dodaj `site/assets/css/stories.css` (wspólne — raz, przy pierwszej historii)

DoD Fazy 2: wszystkie 5 stron tematycznych działają lokalnie, nawigacja między nimi spójna.

---

### Faza 3 — Formularz (bez GAS)
Cel: gotowy formularz z walidacją frontend — bez podpięcia endpointu.

Kroki:
1. Przepisz `site/formularz/index.html` na podstawie custom form z `/formularz_zapisow/`
2. Pola: Email, Imię i nazwisko, Telefon (z prefiksem), Ryzyko (radio), RODO (radio), Komentarz (textarea, opcjonalny)
3. Utwórz `site/components/form-contact.html` — fragment wielokrotnego użytku
4. Utwórz `site/assets/js/form-handler.js` — walidacja HTML5 + JS, fetch do `GAS_ENDPOINT` (stała `const GAS_ENDPOINT = ''` — placeholder)
5. Zaimplementuj inline feedback: komunikat sukcesu / błędu (nie alert())
6. Dodaj style formularza do `components.css`

DoD Fazy 3: formularz przechodzi walidację frontend; fetch do pustego endpointu obsługuje błąd sieci bez crashu; UX feedback działa.

---

### Faza 4 — Strona prawna
Cel: `site/polityka-prywatnosci/index.html`

Kroki:
1. Przepisz treść z WP export do semantycznego HTML5
2. Zaktualizuj odniesienia do cookie banner (własny, nie Real Cookie Banner)

DoD Fazy 4: strona działa lokalnie, treść kompletna.

---

### Faza 5 — Integracja GAS (osobny krok, po dostarczeniu endpointu)
Cel: działający formularz end-to-end.

Warunek wejścia: klientka dostarcza URL GAS `/exec` i potwierdza e-mail docelowy (lh.pl).

Kroki:
1. Ustaw `const GAS_ENDPOINT = 'https://script.google.com/macros/s/…/exec'` w `form-handler.js`
2. Sprawdź mapowanie pól: email, name, phone, ryzyko, rodo, komentarz → kolumny w arkuszu GAS
3. Zweryfikuj odpowiedź GAS (JSON `{result: "success"}`) i obsługę błędu
4. Przetestuj formularz end-to-end: submit → arkusz → e-mail
5. Dodaj rate-limit UX (disable button po submit, re-enable po błędzie)

DoD Fazy 5: formularz wysyła dane, klientka otrzymuje e-mail, dane trafiają do arkusza.

---

### Faza 6 — QA i gotowość do deploymentu
Kroki:
1. Sprawdź wszystkie linki wewnętrzne (brak 404)
2. Sprawdź responsive (mobile 375px, tablet 768px, desktop 1280px)
3. Sprawdź alt na wszystkich obrazach
4. Sprawdź meta title + description na każdej stronie
5. Sprawdź favicon
6. Sprawdź cookie banner (pojawia się, można odrzucić)
7. Sprawdź LCP < 2s (lokalnie: `npx serve site/` + DevTools)
8. Utwórz `docs/DEPLOY.md`

DoD Fazy 6: `docs/DEPLOY.md` istnieje, wszystkie powyższe check-boxy zaliczone.

---

## 4. Mapa komponentów

| Komponent | Plik | Użycie |
|---|---|---|
| `<head>` | `components/head.html` | każda strona — meta, fonty, CSS link |
| Nawigacja | `components/nav.html` | każda strona — logo + menu główne + mobile hamburger |
| Stopka | `components/footer.html` | każda strona — kontakt, polityka, social |
| Formularz | `components/form-contact.html` | `site/formularz/index.html` + inline CTA na historiach |
| Cookie banner | `components/cookie-banner.html` | każda strona — prosty, RODO-compliant, native JS |

Komponenty wklejane ręcznie (brak build step na start). Spójność utrzymywana manualnie.

---

## 5. Mapa zasobów — obrazy

### Logo i identyfikacja

| Źródło | Cel |
|---|---|
| `uploads/2025/07/logo_powerofMINd10.webp` | `assets/images/logo/logo-primary.webp` |
| `uploads/2025/07/logo_powerofMINd7_poziom8.webp` | `assets/images/logo/logo-horizontal.webp` |
| `uploads/2025/07/cropped-logo_powerofMINd4.webp` | `assets/images/logo/logo-og.webp` (OG image) |
| `uploads/2025/07/logo9D.png` | `assets/images/logo/logo-9d.png` |
| `uploads/2025/07/cropped-favicon-scaled-1-32x32.webp` | `assets/images/logo/favicon-32.webp` |
| `uploads/2025/07/cropped-favicon-scaled-1-192x192.webp` | `assets/images/logo/favicon-192.webp` |

### Zdjęcia Ewy Bugaj

| Źródło | Cel |
|---|---|
| `uploads/2025/07/Ewa_smile.webp` | `assets/images/ewa/ewa-smile.webp` |
| `uploads/2025/07/EWA-1-czeka.webp` | `assets/images/ewa/ewa-czeka.webp` |
| `uploads/2025/12/Ewa-Bugaj-Wita_st.webp` | `assets/images/ewa/ewa-wita.webp` |
| `uploads/2026/01/Ewa-Bugaj-Wita_st_50.webp` | `assets/images/ewa/ewa-wita-2.webp` |
| `uploads/2025/07/WEB-20250630-BoCerba-Photography-Ewa-Bugaj-_BCP0060.jpg` | `assets/images/ewa/ewa-pro-1.jpg` |
| `uploads/2025/07/WEB-20250630-BoCerba-Photography-Ewa-Bugaj_BCP0222.jpg` | `assets/images/ewa/ewa-pro-2.jpg` |
| `uploads/2025/07/WEB-20250630-BoCerba-Photography-Ewa-Bugaj-_BCP9836.jpg` | `assets/images/ewa/ewa-pro-3.jpg` |
| `uploads/2025/10/MTQ_Photography-Ewa-Bugaj.webp` | `assets/images/ewa/ewa-mtq.webp` |
| `uploads/2025/12/MTQ_EWA_st.webp`, `Mentoring_EWA_st.webp`, `Oddech_EWA_st.webp` | `assets/images/ewa/ewa-mtq-st.webp` itd. |

### Galeria Oddech 9D

| Źródło | Cel |
|---|---|
| `uploads/2025/11/ODDECH9D_Z1–Z10_12T.webp/.jpg` (10 plików) | `assets/images/oddech9d/sesja-01.webp` … `sesja-10.webp` |

### Opinie

| Źródło | Cel |
|---|---|
| `uploads/2025/12/Opinia_wdziecznosc3-8.webp` (6 plików) | `assets/images/opinie/wdziecznosc-*.webp` |
| `uploads/2025/12/Opinia-Oddech9D_po-sesji1-8.webp` (8 plików) | `assets/images/opinie/oddech9d-sesja-*.webp` |
| `uploads/2026/01/Opinia-Oddech9D*.webp` + inne (10 plików) | `assets/images/opinie/oddech9d-*.webp` |
| `uploads/2026/01/Raport-Ewy-przed.webp`, `Raport-Ewy-po.webp` | `assets/images/opinie/raport-przed.webp`, `raport-po.webp` |

### Ikony i ilustracje

| Źródło | Cel |
|---|---|
| `uploads/2025/06/coaching.png`, `dudanienia.png`, `efekty_dzwiekowe.png`, `fale.png` itd. (10 plików) | `assets/images/ikony/*.png` |
| `uploads/2025/07/*.svg` (6 SVG plików) | `assets/images/ikony/*.svg` |
| `uploads/2025/07/autentycznosc_lo.webp`, `transformacja_lo.webp` itd. (5 plików) | `assets/images/ikony/wartosci/*.webp` |
| `uploads/2025/12/MTQ_ODPORNOSC2.webp` | `assets/images/ikony/mtq-odpornosc.webp` |
| `uploads/2025/08/mental-health.png`, `mentorship.png`, `yoga.png`, `MTQ.webp` | `assets/images/ikony/*.png/.webp` |

### Tła i bannery

| Źródło | Cel |
|---|---|
| `uploads/2025/06/czlowiek_tlo-scaled.webp` | `assets/images/tla/czlowiek.webp` |
| `uploads/2025/06/polaczone-1-2-scaled_new.webp` | `assets/images/tla/polaczone.webp` |
| `uploads/2025/07/breath1-1.webp`, `Oddech2-scaled.webp` | `assets/images/tla/oddech-hero.webp`, `oddech-2.webp` |
| `uploads/2025/06/fog.jpg`, `9d-banner-1-*.jpg`, `252752.webp` | `assets/images/tla/*.jpg/.webp` |
| `uploads/2026/01/pexels-photo-1834399-*.jpg` | `assets/images/tla/pexels-tlo.jpg` |

### Jung (sekcja cytatu)

| Źródło | Cel |
|---|---|
| `uploads/2025/05/lossy-page1-…-830x1024.webp` | `assets/images/tla/jung-portret.webp` |
| `uploads/2025/05/Carl_Jung_signature.svg.webp` | `assets/images/tla/jung-podpis.webp` |

### Do pominięcia

- `uploads/sites/28/2020/02/*` — demo Astra Sites (logo-atr, logo-jett, stock photos)
- `uploads/2024/01/logo-pom.png` — stara wersja logo; zachować tylko jeśli używana

---

## 6. Strategia CSS

### Kolejność budowania

1. `variables.css` — najpierw; blokuje cały CSS
   - Kolory: wyekstrahować z Astra inline styles (`#00c9aa` jako accent, `#234070` jako primary dark, `#2b2b2b` jako text)
   - Spacing: 4px base unit
   - Fonty: `--font-heading: 'Playfair Display', serif`, `--font-body: 'Roboto', sans-serif`
   - Breakpoints: `--bp-mobile: 375px`, `--bp-tablet: 768px`, `--bp-desktop: 1280px`

2. `base.css` — reset (box-sizing, margin 0), typografia, font-display: swap

3. `layout.css` — `.container` (max-width 1200px, padding symetryczny), grid sekcji, nawigacja desktop + mobile

4. `components.css` — przyciski (`.btn-primary`, `.btn-secondary`), karty, formularz, cookie banner, accordion (FAQ)

5. `stories.css` — wspólne style podstron historii (hero sekcja, body text, galeria, opinie)

6. `index.css` — style specyficzne tylko dla landing page (sekcje tematyczne, karuzela opinii)

### Podejście

- Mobile-first (min-width media queries)
- Zmienne CSS dla wszystkich kolorów i typografii — bez hardcodowania wartości poza `variables.css`
- Bez `!important`
- Karuzela opinii: Swiper.js (standalone, bez Elementora) — jedyna zewnętrzna zależność JS

---

## 7. Strategia formularza i GAS

### Jeden wspólny formularz

Wszystkie strony używają jednego formularza pod `/formularz/`. Na stronach historii (oddech, testy-mtq itd.) zamiast WPForms embed → przycisk CTA linkujący do `/formularz/`.

### Architektura form-handler.js

```
form-handler.js
├── walidacja HTML5 (required, type=email, minlength)
├── walidacja JS (trim, telefon regex, radio required)
├── submitHandler()
│   ├── zbierz pola → obiekt FormData
│   ├── fetch(GAS_ENDPOINT, { method: 'POST', body: FormData })
│   ├── sukces → pokaż .form-success, wyczyść pola
│   └── błąd → pokaż .form-error z komunikatem
└── const GAS_ENDPOINT = ''  ← placeholder; wypełnić w Fazie 5
```

### Pola formularza (finalny zestaw)

| Pole | Type | Wymagane | Walidacja |
|---|---|---|---|
| Imię i nazwisko | text | tak | min 2 znaki, trim |
| Email | email | tak | HTML5 email + regex |
| Telefon | tel | tak | cyfry, min 9 znaków |
| Akceptacja ryzyka | radio (tak/nie) | tak | musi być „tak" |
| Akceptacja RODO | radio (tak/nie) | tak | musi być „tak" |
| Komentarz / przeciwwskazania | textarea | nie | max 500 znaków |

### GAS — stan i plan

- Fazy 0–4: `GAS_ENDPOINT = ''`; fetch nie jest wysyłany; walidacja działa; komunikat „formularz tymczasowo niedostępny" jeśli endpoint pusty
- Faza 5 (po dostarczeniu URL): wypełnić stałą, przetestować end-to-end
- Arkusz GAS: kolumny odpowiadają polom formularza + timestamp + source (nazwa podstrony)

---

## 8. Ryzyka otwarte

| # | Ryzyko | Wpływ na plan | Mitygacja |
|---|---|---|---|
| R1 | GAS endpoint brak | Faza 5 odblokowana dopiero po dostarczeniu URL | Placeholder w form-handler.js; Fazy 0–4 niezależne |
| R2 | Produkty WooCommerce — klientka może zmienić zdanie i chcieć kart produktów | Zmiana zakresu po MVP | Architektura `site/` gotowa na dodanie `/produkt/` jako podstron historii |
| R3 | Swiper.js — jedyna zewnętrzna zależność JS | Ewentualne zmiany API | Zablokować wersję; rozważyć CSS-only carousel jako fallback |
| R4 | Fonty — Google Fonts CDN vs. self-host | Wydajność vs. zależność | Na start CDN; self-host jako opcjonalna optymalizacja w Fazie 6 |
| R5 | Slug `/o-mnie/` zamiast obecnego długiego | Wymaga decyzji czy SEO redirect jest potrzebny | Przy static hosting (GitHub Pages): 404 redirect via `_redirects` lub meta refresh |
| R6 | Popup dostępności (PRD US-4) | Nie istnieje w WP eksporcie — nowa funkcja | Zaplanować jako Fazę 7 (po MVP); nie blokuje Faz 0–6 |

---

## 9. Definition of Done — cała migracja (MVP)

- [ ] `site/` istnieje i uruchamia się przez `npx serve site/` bez błędów
- [ ] Wszystkie 8 stron MVP renderują się poprawnie lokalnie
- [ ] Nawigacja między stronami spójna, żaden link nie wskazuje na `/wp-content/` ani `/wp-admin/`
- [ ] Żaden link nie wskazuje na `/produkt/*` — zastąpione CTA do `/formularz/`
- [ ] Formularz przechodzi walidację frontend (wszystkie pola, oba radio)
- [ ] Feedback sukces/błąd działa inline (bez alert())
- [ ] Wszystkie obrazy mają atrybut `alt`
- [ ] Każda strona ma unikalny `<title>` i `<meta name="description">`
- [ ] Favicon działa
- [ ] Cookie banner pojawia się i można go zaakceptować/odrzucić
- [ ] Responsywność: mobile 375px, tablet 768px, desktop 1280px — brak overflow
- [ ] Brak zależności na `wp-content/`, `wp-includes/`, `wp-admin/`
- [ ] `docs/DEPLOY.md` istnieje z instrukcją wdrożenia
