const GAS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyr7r3AYp1qEWZqKGuK9KJGHfw5ny8jQgoxE6xFUke0mETsx0DgjU4lc722A3n5KnAnRw/exec';

function getField(name) {
  return document.querySelector(`[name="${name}"]`);
}

function showError(name, msg) {
  const field = getField(name);
  if (!field) return;
  const wrap = field.closest('.form-group');
  if (!wrap) return;
  const err = wrap.querySelector('.form-error');
  if (err) err.textContent = msg;
  field.setAttribute('aria-invalid', 'true');
}

function clearErrors(form) {
  form.querySelectorAll('.form-error').forEach(el => el.textContent = '');
  form.querySelectorAll('[aria-invalid]').forEach(el => el.removeAttribute('aria-invalid'));
}

function validate(form) {
  let ok = true;
  const name = form.querySelector('#fc-name');
  const email = form.querySelector('#fc-email');
  const phone = form.querySelector('#fc-phone');
  const ryzyko = form.querySelector('[name="ryzyko"]:checked');
  const rodo = form.querySelector('[name="rodo"]:checked');

  if (!name.value.trim() || name.value.trim().length < 2) {
    showError('name', 'Podaj imię i nazwisko (min. 2 znaki).');
    ok = false;
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email.value.trim())) {
    showError('email', 'Podaj poprawny adres e-mail.');
    ok = false;
  }

  const digits = phone.value.replace(/\D/g, '');
  if (digits.length < 9) {
    showError('phone', 'Podaj numer telefonu (min. 9 cyfr).');
    ok = false;
  }

  if (!ryzyko) {
    const wrap = form.querySelector('[name="ryzyko"]').closest('.form-group');
    if (wrap) wrap.querySelector('.form-error').textContent = 'Zaznacz jedną z opcji.';
    ok = false;
  }

  if (!rodo || rodo.value !== 'tak') {
    const wrap = form.querySelector('[name="rodo"]').closest('.form-group');
    if (wrap) wrap.querySelector('.form-error').textContent = 'Wymagana zgoda na przetwarzanie danych.';
    ok = false;
  }

  return ok;
}

function setStatus(form, type) {
  form.querySelector('.form-success').classList.toggle('is-hidden', type !== 'success');
  form.querySelector('.form-error-msg').classList.toggle('is-hidden', type !== 'error');
}

async function handleSubmit(e) {
  e.preventDefault();
  const form = e.currentTarget;
  clearErrors(form);
  setStatus(form, null);

  if (!validate(form)) return;

  const btn = form.querySelector('.form-submit');
  btn.disabled = true;
  btn.textContent = 'Wysyłanie…';

  if (!GAS_ENDPOINT) {
    setStatus(form, 'error');
    btn.disabled = false;
    btn.textContent = 'Wyślij zgłoszenie';
    return;
  }

  try {
    const params = new URLSearchParams(new FormData(form));
    const res = await fetch(GAS_ENDPOINT, { method: 'POST', body: params, redirect: 'follow' });
    const json = await res.json();
    if (json.result === 'success') {
      setStatus(form, 'success');
      form.reset();
    } else {
      setStatus(form, 'error');
    }
  } catch {
    setStatus(form, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Wyślij zgłoszenie';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', handleSubmit);

  const textarea = form.querySelector('#fc-comment');
  const counter = form.querySelector('#fc-counter');
  if (textarea && counter) {
    textarea.addEventListener('input', () => {
      counter.textContent = textarea.value.length;
    });
  }
});
