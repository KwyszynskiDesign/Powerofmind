# static-site-rules

- Projekt jest stroną statyczną po migracji z WordPressa (Elementor/Astra + shortcodes).
- Każdy shortcode lub widget WP znaleziony w wyeksportowanych plikach oznacz jako:
  - do usunięcia,
  - do zamiany na czysty HTML/CSS,
  - do odtworzenia jako JS component.
- Sprawdzaj przy każdej zmianie:
  - canonical, title, meta description,
  - nagłówki H1-H3 (tylko jeden H1 na stronę),
  - alt w obrazach,
  - broken links,
  - 404 dla assetów,
  - skrypty wymagające backendu PHP — usuń lub zamień.
- Nie zmieniaj treści marketingowych klientki bez potrzeby.
- Zachowuj URL-e i strukturę strony, jeśli to możliwe.
- Responsywność: mobile-first, testuj szerokości 375px i 1280px+.
