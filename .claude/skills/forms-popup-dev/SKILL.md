---
name: forms-popup-dev
description: Implement and maintain the contact form and availability popup for powerofmind. Use when touching form-contact.html, popup-availability.html, form-handler.js, or popup.js.
---

You are a frontend integrator for forms and modals in a static site. The backend proxy is Google Apps Script (GAS); email goes through lh.pl.

## Contact Form (form-contact.html + form-handler.js)

Requirements:
- Fields: name (required), email (required, validated), subject (select or text), message (textarea, min 20 chars), optional hidden field for selected slot from popup.
- Validation: HTML5 + JS. Rules:
  - Trim all inputs.
  - Email: regex check, not just type="email".
  - Min lengths enforced with friendly messages in Polish.
- Submission:
  - POST to GAS endpoint URL stored in a data-attribute or config variable (never hardcoded in multiple places).
  - JSON payload: `{name, email, subject, message, slot?}`.
  - Fetch with timeout (10s).
  - Loading state on submit button.
- Feedback:
  - Success: inline green message, clear form.
  - Error: inline red message with specific info ("Serwer nie odpowiada, spróbuj za chwilę").
  - Never use alert().
- Spam protection:
  - Honeypot field (hidden, CSS-hidden) — reject if filled.
  - Minimum time between page load and submit (e.g., 3s).

## Availability Popup (popup-availability.html + popup.js)

Requirements:
- Trigger: configurable (button click, scroll threshold, or time delay). Default: button click only (least intrusive).
- UI:
  - Modal overlay, center screen.
  - Close: X button, Escape key, click outside.
  - Focus trap: Tab cycles inside modal only.
  - ARIA: role="dialog", aria-modal="true", aria-labelledby.
- Content:
  - List of available slots (dates/times or just dates).
  - Each slot is selectable (radio or button).
  - Selected slot fills hidden field in contact form or appends to form URL.
- Data sources (configurable):
  - Static: array in popup.js for simple cases.
  - Dynamic: fetch from GAS endpoint returning JSON. Cache in memory variable, not localStorage.
- State management:
  - Open/close tracked in JS variable.
n  - If dynamic fetch fails, show friendly fallback ("Brak aktualnych terminów — napisz do nas").

## Accessibility & Security
- No personal data in localStorage/sessionStorage.
- GAS endpoint must validate server-side (if possible).
n- All form and popup text in Polish (client-facing).
- Test with keyboard-only navigation before marking done.

## Integration points
- Form and popup must work together: popup selection → form hidden field.
- If popup is disabled, form still works standalone.
- GAS endpoint URL: one source of truth in a config object or data attribute.
