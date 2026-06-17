(function () {
  var GAS_URL = 'https://script.google.com/macros/s/AKfycbyr7r3AYp1qEWZqKGuK9KJGHfw5ny8jQgoxE6xFUke0mETsx0DgjU4lc722A3n5KnAnRw/exec';

  function collectWPFormsData(form) {
    var data = { source: 'wpforms', form_id: form.dataset.formid, page: window.location.pathname };
    form.querySelectorAll('[name]').forEach(function (el) {
      var m = el.name.match(/wpforms\[fields\]\[(\d+)\](?:\[([^\]]+)\])?/);
      if (m) {
        var key = m[2] ? 'field_' + m[1] + '_' + m[2] : 'field_' + m[1];
        if (el.type === 'checkbox' || el.type === 'radio') {
          if (el.checked) data[key] = (data[key] ? data[key] + ', ' : '') + el.value;
        } else {
          data[key] = el.value;
        }
      }
    });
    return data;
  }

  function showWPFormsConfirmation(form) {
    var container = form.closest('.wpforms-container');
    if (!container) return;
    container.innerHTML =
      '<div style="padding:48px 24px;text-align:center;background:#f0faf0;border:1px solid #a5d6a7;border-radius:8px;">' +
      '<div style="font-size:56px;margin-bottom:16px">✅</div>' +
      '<p style="font-size:22px;font-weight:700;color:#2e7d32;margin:0 0 12px">Wiadomość wysłana!</p>' +
      '<p style="color:#555;margin:0">Dziękujemy za kontakt. Odpiszemy wkrótce.</p>' +
      '</div>';
  }

  function showWPFormsError(form) {
    var existing = form.querySelector('.wpforms-error-container-full');
    if (existing) {
      existing.style.display = 'block';
      existing.innerHTML = '<p>Wystąpił błąd wysyłania. Skontaktuj się bezpośrednio: <a href="mailto:kontakt@powerofmind.pl">kontakt@powerofmind.pl</a></p>';
    }
  }

  function handleWPFormsSubmit(e) {
    var form = e.currentTarget;
    e.preventDefault();
    e.stopImmediatePropagation();

    var submitBtn = form.querySelector('[type="submit"]');
    var originalText = submitBtn ? submitBtn.textContent : '';
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Wysyłanie…'; }

    var data = collectWPFormsData(form);

    fetch(GAS_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(data)
    })
    .then(function () {
      showWPFormsConfirmation(form);
    })
    .catch(function () {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalText; }
      showWPFormsError(form);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.wpforms-ajax-form').forEach(function (form) {
      form.addEventListener('submit', handleWPFormsSubmit, true);
    });
  });
})();
