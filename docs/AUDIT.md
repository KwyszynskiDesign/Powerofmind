# AUDIT.md — powerofmind
Data audytu: 2026-06-19
Status: gotowy do przeglądu

---

## 1. Mapa podstron

| Slug | Tytuł | Typ | Formularz? | W nav? | Linkowana z innych? | Aktywna biznesowo? | Klasyfikacja |
|---|---|---|---|---|---|---|---|
| `/` | PowerofMind – Oddech 9D i odporność psychiczna MTQ i MTQ+ | Landing główny | tak (WPForms) | tak | tak — wszystkie strony | tak | **przepisać** |
| `/oddech/` | Oddech 9D | Historia tematu | tak (WPForms #3651) | tak | tak — index, oddech_9d | tak | **przepisać** |
| `/oddech_9d/` | Oddech 9D szczegóły sesji | Historia tematu | tak (WPForms) | tak | tak — oddech, index | tak | **przepisać** |
| `/testy-mtq/` | Testy odporności psychicznej MTQ i MTQ+ | Historia tematu | tak (WPForms) | tak | tak — index | tak | **przepisać** |
| `/strefa_relaksu/` | Strefa Relaksu | Historia tematu | tak (WPForms) | tak | tak — index | tak | **przepisać** |
| `/o-mnie-ewa-bugaj-oddech-9d-i-odpornosc-psychiczna/` | O mnie | Strona o autorce | nie | tak (jako „O mnie") | tak — wszystkie strony | tak | **przepisać** |
| `/formularz_zapisow/` | Formularz zapisów | Dedykowany formularz | tak (własny custom) | tak | tak — index, oddech, testy-mtq | tak | **przepisać** |
| `/polityka-prywatnosci/` | Polityka prywatności | Strona prawna | nie | tak | tak — cookie banner | tak | **przepisać** |
| `/linki/` | Zapisz się na kursy, sprawdź wydarzenia | Link-in-bio | nie (linki zewnętrzne) | tak | tak — index | aktywna, link do YouTube | **zbadać / decyzja później** — link-in-bio z zewnętrznymi URL-ami; może być utrzymywana osobno |
| `/webinar_mtq/` | webinar_MTQ | Landing eventowy | tak (WPForms) | tak | tak — index | niejasne — może archiwalna | **zbadać / decyzja później** — tytuł sugeruje jednorazowy event; potwierdzić z klientką |
| `/koszyk/` | koszyk | WooCommerce auto | nie | tak (WP auto) | tak (WP mechanizm) | WooCommerce — poza scope | **zbadać / decyzja później** — WooCommerce out of scope wg PRD, ale produkty są linkowane ze stron treści |
| `/platnosci/` | Redirecting... | WooCommerce auto | nie | tak (WP auto) | nie | WP-only przekierowanie | pominąć (artefakt WP) |
| `/moje_konto/` | Moje konto | WooCommerce auto | nie | tak (WP auto) | nie | WP-only | pominąć (artefakt WP) |
| `/produkt/` | (produkty MTQ48, MTQ-74, MTQ dla zespołów, Darowizna) | WooCommerce produkty | nie | nie (linkowane z treści) | tak — z oddech, testy-mtq | WooCommerce — poza scope | **zbadać / decyzja później** — produkty linkowane z realnych stron; decyzja: czy zastąpić stroną kontaktową |
| `/kategoria-produktu/` | (kategoria WooCommerce) | WooCommerce auto | nie | nie | nie | nie | pominąć (artefakt WP) |
| `/hello-world/` | Hello world! | Demo WP post | nie | nie | nie | nie | pominąć (demo WP) |
| `/post-1/` | Crafting Captivating Headlines… | Demo Astra/Elementor | nie | nie | nie | nie | pominąć (demo Astra) |
| `/post-2/` | The Art of Drawing Readers In… | Demo Astra/Elementor | nie | nie | nie | nie | pominąć (demo Astra) |
| `/post-3/` | (brak tytułu — demo) | Demo Astra/Elementor | nie | nie | nie | nie | pominąć (demo Astra) |
| `/rtsb-template/` | (nieznany) | Artefakt pluginu | nie | nie | nie | nie znane | pominąć — artefakt pluginu (prawdopodobnie Royal/RTSB theme builder) |
| `/author/` | (archiwum autora) | WP archiwum | nie | nie | nie | nie | pominąć (artefakt WP) |
| `/category/` | (archiwum kategorii) | WP archiwum | nie | nie | nie | nie | pominąć (artefakt WP) |
| `/e-floating-buttons/` | (floating buttons) | Artefakt pluginu | nie | nie | nie | nie | pominąć (artefakt pluginu) |
| `/witaj-swiecie/` | (hello world PL) | Demo WP post | nie | nie | nie | nie | pominąć (demo WP) |

---

## 2. Inwentarz zasobów

### 2a. Obrazy

**Używane na stronach treści (zachować):**

| Plik | Użycie | Status |
|---|---|---|
| `2025/05/Ewa_logoofmind2.webp` + warianty | Logo na wielu stronach | używane |
| `2025/07/cropped-logo_powerofMINd4.webp` | OG image / header | używane |
| `2025/07/logo_powerofMINd10.webp`, `logo_powerofMINd7_poziom8.webp` | warianty logo | używane |
| `2025/07/logo9D.png` | logo Oddech 9D | używane |
| `2025/07/cropped-favicon-scaled-1-*.webp` | favicon (różne rozmiary) | używane |
| `2024/01/logo-pom.png` | logo stara wersja | potencjalnie archiwalna |
| `2025/07/Ewa_smile.webp`, `EWA-1-czeka.webp`, `Ewa-Bugaj-Wita_st.webp` | zdjęcia Ewy — hero/sekcje | używane |
| `2025/07/WEB-20250630-BoCerba-Photography-Ewa-Bugaj-*.jpg` (3 pliki) | profesjonalne zdjęcia sesji foto | używane |
| `2025/10/MTQ_Photography-Ewa-Bugaj.webp` | zdjęcie na stronie MTQ | używane |
| `2025/11/ODDECH9D_Z1–Z10_12T.webp/.jpg` (10 plików) | galeria sesji Oddech 9D | używane |
| `2025/12/Opinia_wdziecznosc3-8.webp` (6 plików) | opinie klientów — screenshoty | używane |
| `2025/12/Opinia-Oddech9D_po-sesji1-8.webp` (8 plików) | opinie po sesji Oddech 9D | używane |
| `2026/01/Opinia-Oddech9D*.webp` + Mentalny-Reset (10 plików) | nowsze opinie | używane |
| `2026/01/Raport-Ewy-przed.webp`, `Raport-Ewy-po.webp` | raport MTQ przed/po | używane |
| `2025/12/Ewa-Bugaj-Wita_st.webp`, `Mentoring_EWA_st.webp`, `MTQ_EWA_st.webp`, `Oddech_EWA_st.webp` | sekcje hero/CTA | używane |
| `2025/12/MTQ_ODPORNOSC2.webp` | sekcja MTQ | używane |
| `2025/06/czlowiek_tlo-scaled.webp`, `polaczone-1-2-scaled_new.webp` | tła/ilustracje | używane |
| `2025/06/coaching.png`, `dudanienia.png`, `efekty_dzwiekowe.png`, `fale.png`, `mysla-1.png`, `oddech_somatyczny.png`, `soffie.png`, `strojenie_harmoniczne.png`, `sugestia_hipnotyczna.png`, `wielowymiarowe.png` | ikony/ilustracje Oddech 9D | używane |
| `2025/07/broke_breath9D.svg`, `connect_your_breath_mind9D.svg`, `connection_your_breath9D.svg`, `grow_breath9D.svg`, `lookingfor_breath.svg`, `think_like_pro.svg` | SVG ilustracje | używane |
| `2025/07/autentycznosc_lo.webp`, `transformacja_lo.webp`, `uwaznosc_lo.webp`, `wsparcie_lo.webp`, `zaufanie_lo.webp` | ikony wartości/kompetencji | używane |
| `2025/05/lossy-page1-1200px-ETH-BIB-Jung_Carl_Gustav…webp` + warianty | zdjęcie Junga (cytat) | używane |
| `2025/05/Carl_Jung_signature.svg.webp` | podpis Junga | używane |
| `2025/07/breath1-1.webp`, `2148714965.jpg` | hero/tło | używane |
| `2025/07/kelly1-1.png`, `op3.png` | sekcje partnerów/dowodu | zbadać |
| `2025/06/252752.webp`, `9d-banner-1-20240814-*.jpg`, `fog.jpg` | tła/bannery | używane |
| `2025/07/Oddech2-scaled.webp` | sekcja hero Oddech | używane |
| `2025/08/mental-health.png`, `mentorship.png`, `yoga.png`, `MTQ.webp` | ikony MTQ | używane |
| `2026/01/Ewa-Bugaj-Wita_st_50.webp`, `pexels-photo-1834399-*.jpg` | nowe sekcje | używane |

**Osierocone / demo (nie zachowywać):**

| Plik | Powód |
|---|---|
| `sites/28/2020/02/bb-top.png` | Astra Sites demo |
| `sites/28/2020/02/logo-atr.png`, `logo-jett-3.png`, `logo-justin-3.png`, `logo-mountain-dams.png`, `logo-travel-7.png`, `logo-youngs-coffee-1.png` | demo logos Astra |
| `sites/28/2020/02/photo-1552664730-*.jpg`, `photo-1558274648-*.jpg`, `photo-1558403194-*.jpg` | demo stock photos Astra |

### 2b. Fonty

| Rodzina | Warianty | Źródło | Status |
|---|---|---|---|
| Roboto | 400, 600 | Google Fonts CDN (Astra `astra-google-fonts-css`) | używane — krytyczne do zachowania |
| Playfair Display | 400, 600 | Google Fonts CDN (Astra) | używane — krytyczne do zachowania |
| woff2 w uploads/fonts/ | wiele plików | Google Fonts cache Astry (auto-download) | to jest lokalny cache Astra — NIE używać w static site; zamiast tego ładować z Google CDN lub self-host |

Decyzja do podjęcia: ładować z `fonts.googleapis.com` (prostsze) vs. self-host woff2 (szybciej, brak dependency na Google). Pliki woff2 są już w repo, ale ich nazwy hashowane — wymagają mapowania na rodziny fontów przed self-hostingiem.

### 2c. Ikony / SVG

- SVG inline: Elementor generuje SVG ikon w HTML (np. strzałki w accordion, ikony social).
- SVG pliki: 6 plików SVG ilustracji w `wp-content/uploads/2025/07/` — używane i do zachowania.
- Favicon: `cropped-favicon-scaled-1-32x32.webp`, `192x192`, `180x180`, `270x270` — dostępne w uploads.

---

## 3. Inwentarz zależności JS/CSS

### 3a. Krytyczne do odtworzenia

| Zależność WP | Co robi | Odpowiednik w static site |
|---|---|---|
| Google Fonts (Roboto, Playfair Display) | Typografia | `<link>` do `fonts.googleapis.com` lub self-hosted woff2 |
| WPForms (ID 3651+) | Formularze kontaktowe/zapisu | Własny HTML form + `form-handler.js` → GAS endpoint |
| Swiper.js (Elementor) | Karuzele (opinie, zdjęcia) | Swiper.js standalone (open source, można zachować) |
| Cookie consent banner | Real Cookie Banner (RODO) | Prosty własny banner cookie (native JS) |

### 3b. Opcjonalne / do oceny

| Zależność WP | Co robi | Propozycja |
|---|---|---|
| animate.css | Animacje Elementora | Zaimplementować selektywnie lub pominąć |
| MediaElement.js | Odtwarzacz audio/video | Zachować tylko jeśli jest audio/video na stronie |
| Schema.org JSON-LD | SEO structured data | Przepisać ręcznie (uproszczone: WebSite + Organization) |

### 3c. Czysty odpad WP/Elementor/WooCommerce — pominąć

| Plik / plugin | Powód pominięcia |
|---|---|
| `elementor/assets/css/frontend.min.css` i wszystkie pliki Elementora | Zastąpione własnym CSS |
| `wp-includes/js/jquery/jquery.min.js` + migrate | Vanilla JS nie potrzebuje jQuery |
| WooCommerce wszystkie JS/CSS (`photoswipe`, `woocommerce.min.js`, `add-to-cart`, `blockui`) | WooCommerce poza scope |
| `jetpack-forms-layout.css` | Zastąpione własnym form CSS |
| `real-cookie-banner` (wszystkie pliki) | Zastąpione prostym bannerem |
| `wp-admin/admin-ajax.php` wywołania | Tylko WP runtime |
| `stats.wp.com/s-202619.js` (WooCommerce Analytics) | Analityka WP |
| `window.formularz_ajax_object` (nonce, recaptcha) | Zależne od WP runtime |
| Akismet JS | Spam protection przez WP — nie przenośna |
| `window._wpemojiSettings` | WP emoji loader |
| `astra-sites` i pliki Astry | Motyw WP — zastąpiony własnym CSS |
| RSS feed, oEmbed, xmlrpc | WP-only |
| WooCommerce variation templates (`#tmpl-variation-template`) | WooCommerce poza scope |

---

## 4. Klasyfikacja treści

| Slug | Co zachować | Co przepisać | Co pominąć | Co zastąpić |
|---|---|---|---|---|
| `/` | Treść: hero, sekcje tematyczne, opinie, CTA | Cały markup — usunąć Elementor divs, przepisać semantyczny HTML | WP meta, Elementor data-atrybuty, JSON-LD WP | WPForms → własny formularz + GAS |
| `/oddech/` | Treść: tekst, sekcje, galeria 9D, opinie | Markup | Elementor, WP meta | WPForms #3651 → GAS |
| `/oddech_9d/` | Treść: szczegóły sesji, FAQ, galeria | Markup | j.w. | WPForms → GAS |
| `/testy-mtq/` | Treść: opis testów, linki do produktów MTQ | Markup; linki do `/produkt/` wymagają decyzji (patrz ryzyka) | j.w. | WPForms → GAS |
| `/strefa_relaksu/` | Treść | Markup | j.w. | WPForms → GAS |
| `/o-mnie-ewa-bugaj-…/` | Treść: bio, zdjęcia, wartości | Markup + slug (docelowo: `/o-mnie/`) | j.w. | — |
| `/formularz_zapisow/` | Treść + pola formularza (email, imię, tel, ryzyko-radio, rodo-radio, komentarz) | Markup — formularz jest już custom (nie WPForms) | WP form action + nonce | Podłączyć pod GAS endpoint |
| `/polityka-prywatnosci/` | Treść prawna | Markup | j.w. | — |
| `/linki/` | Treść + linki zewnętrzne (YouTube) | Markup | j.w. | zbadać — decyzja klientki |
| `/webinar_mtq/` | Treść + formularz zapisu | Markup | j.w. | zbadać — czy aktywny event |

---

## 5. Formularz — aktualny stan

### 5a. Dwa typy formularzy w repo

**Typ A: WPForms (na stronach oddech, testy-mtq, strefa_relaksu, index)**
- Plugin: WPForms (nie Contact Form 7 jak zakładano)
- Endpoint: `/oddech/?simply_static_page=7223` — statyczny snapshot, endpoint martwy
- Submit: AJAX przez WP backend (`admin-ajax.php`)
- Token auth: `data-token="a1f1621e1a9f0b7fd351cb2dbbbb14a2"` + nonce — unieważnione po eksporcie
- Pola (WPForms #3651 na `/oddech/`): Imię i nazwisko (first/last), Email, Telefon
- Status: **formularz nie działa w obecnym static exportcie** — wymaga podłączenia pod GAS

**Typ B: Custom form (na `/formularz_zapisow/`)**
- Struktura: własny HTML `<form id="zapisy-form" action="#" method="post" novalidate>`
- Pola: Email, Imię i nazwisko, Numer telefonu (z prefixem/select), Ryzyko (radio: tak/nie), Akceptacja RODO (radio: tak/nie), Pole na komentarz (textarea)
- Backend: brak — action="#" — formularz nie jest podłączony pod żaden endpoint
- Status: **frontend gotowy, backend niezdefiniowany** — do podłączenia pod GAS

### 5b. Co trzeba wyciąć z WPForms przy migracji
- `wpforms-ajax-form` class i AJAX submit handler
- `data-token` i `data-token-time` atrybuty
- `noscript` error messages WPForms
- Wszystkie pola ukryte WPForms (`wpforms[fields][*]` name pattern)
- Zależność od `/wp-json/` REST endpoint

### 5c. Wymagane pytania do klientki przed migracją formularza
1. Czy istnieje już GAS endpoint (URL `/exec`)? Jeśli tak — jaki?
2. Docelowy adres e-mail na powiadomienia (lh.pl)?
3. Które pola z `formularz_zapisow` są obowiązkowe w GAS?
4. Czy formularz na każdej podstronie powinien mieć te same pola co `formularz_zapisow`, czy tylko email+imię+telefon?

---

## 6. Ryzyka i niepewności

| # | Ryzyko / niepewność | Priorytet | Akcja |
|---|---|---|---|
| R1 | GAS endpoint — URL nieznany, nie ma go w repo ani w HTML | wysoki | pytanie do klientki przed migracją formularzy |
| R2 | Linki do `/produkt/mtq48-*`, `/produkt/mtq-74-*`, `/produkt/mtq-dla-zespolow-*`, `/produkt/darowizna-*` — produkty WooCommerce linkowane z realnych stron treści | wysoki | decyzja klientki: usunąć linki, zastąpić formularzem zapisu, lub zbudować statyczne strony produktów |
| R3 | `/linki/` — link-in-bio z YouTube; może być aktualizowana ręcznie przez klientkę | średni | decyzja: zachować jako prostą statyczną stronę linki lub pominąć |
| R4 | `/webinar_mtq/` — formularz zapisu na event; nieznane czy event jest aktywny | średni | potwierdzić z klientką aktualność |
| R5 | Fonty self-hosted — woff2 w uploads/fonts/ mają hashowane nazwy; mapowanie na rodziny fontów wymaga ekstrakcji z Astra CSS | niski | alternatywnie: użyć Google Fonts CDN na start |
| R6 | Obrazy z `uploads/sites/28/2020/02/` (Astra demo) — prawdopodobnie nieużywane, ale nie wszystkie strony zostały sprawdzone (pominięte: koszyk, platnosci, moje_konto) | niski | zignorować przy migracji stron treści |
| R7 | Slug `/o-mnie-ewa-bugaj-oddech-9d-i-odpornosc-psychiczna/` — długi, SEO-niekorzystny | niski | decyzja: docelowy slug `/o-mnie/` z przekierowaniem |
| R8 | `/formularz_zapisow/` ma własny custom form (nie WPForms), ale bez backendu — nie wiadomo czy był kiedyś podłączony pod GAS | średni | potwierdzić z klientką historię formularza |
| R9 | Popup dostępności (z PRD US-4) — nie znaleziono w żadnej stronie WP exportu | niski | zakres nowy: do zbudowania od zera wg PRD |

---

## 7. Definition of Done audytu

- [x] Każda podstrona ma wiersz w tabeli mapy z klasyfikacją
- [x] Status „zbadać / decyzja później" uzasadniony dla każdego przypadku
- [x] Lista wszystkich obrazów realnie używanych na stronach zakwalifikowanych
- [x] Zidentyfikowane obrazy osierocone / demo
- [x] Potwierdzone rodziny fontów (Roboto 400/600, Playfair Display 400/600)
- [x] Wszystkie zależności JS/CSS sklasyfikowane (krytyczne / opcjonalne / odpad)
- [x] Formularz: opisane dwa typy, pola, flow submit, co wyciąć
- [x] Ryzyka i otwarte pytania do klientki zapisane
- [x] Brak edycji kodu źródłowego
- [x] Brak tworzenia `site/`
