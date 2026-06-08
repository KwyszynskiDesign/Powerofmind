# security-forms

## Formularz kontaktowy
- Endpoint: Google Apps Script (GAS). URL endpointu trzymaj w konfiguracji, nie na sztywno w kodzie (np. zmienna JS lub data-attribute).
- Walidacja po stronie klienta: HTML5 required, minlength, type="email", trim.
- Nie przechowuj danych formularza w localStorage ani sessionStorage (sandbox + RODO).
- Feedback dla użytkownika: komunikat sukcesu / błędu w DOM, nie alert().
- Rate limiting: jeśli możliwe, zaimplementuj prostą ochronę przed spamem (honeypot lub min czas wypełniania).
- Nie umieszczaj sekretów (kluczy API, haseł SMTP) w kodzie JS.

## Popup dostępności
- Dane o dostępnych terminach mogą pochodzić z GAS jako JSON lub być statyczne w JS (do ustalenia).
- Jeśli dynamiczne: fetch do GAS z prostym cachingiem w pamięci (zmienna JS), nie localStorage.
- Modal musi mieć focus trap i zamknięcie Escape (ARIA + JS).
- Nie zbieraj danych osobowych w popupie bez wyraźnego zgłoszenia (RODO).
