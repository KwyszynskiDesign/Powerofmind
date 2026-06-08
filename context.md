\# context.md — Ubiquitous Language (powerofmind)



\## Domena

Rozwój osobisty / coaching / psychologia — strona informacyjno-sprzedażowa klientki.



\## Terminy wspólne

| Termin (PL) | Znaczenie | Użycie w kodzie |

|---|---|---|

| powerofmind | Nazwa marki / projektu | folder repo, prefix klas `.pom-\*` opcjonalnie |

| Landing | Strona główna (index.html) | `index.html`, `index.css` |

| Historia | Podstrona opowiadająca jeden temat | `stories/{slug}/`, klasa `.story` |

| Spotkanie | Sesja coaching / konsultacja | `meeting`, `session` w nazwach funkcji |

| Dostępność | Wolne terminy spotkań | `availability`, `slots` w popupie |

| Miejsce | Wolny slot czasowy | `slot` |

| Formularz | Kontakt / zapis | `contact-form`, `form-handler.js` |

| Popup | Modal z dostępnością | `popup-availability`, `modal` |

| Klientka | Właścicielka marki | nie w kodzie, w docs |

| lh.pl | Dostawca poczty e-mail | w konfiguracji GAS |

| GAS | Google Apps Script | `gas-endpoint`, `google-apps-script` |



\## Reguły nazewnictwa

\- Pliki HTML podstron: `index.html` w folderze o nazwie slugu (np. `stories/coaching/index.html`).

\- Klasy CSS: semantyczne, nie skrótowe (`.story-header`, nie `.sh`).

\- JS funkcje: camelCase, opisowe (`handleFormSubmit`, nie `hfs`).

\- Foldery: angielskie, kebab-case.



\## Słowa unikać w UI

\- „Widget” (brzmi technicznie, używaj „formularz” lub "popup").

\- „Shortcode” (to termin WP, nie używaj w nowym repo).

\- „Post / wpis” (to termin blogowy; używaj „historia” lub „strona").

