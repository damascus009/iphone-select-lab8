import { validators } from './validation-rules.mjs';
const form = document.querySelector('#feedbackForm');
if (form) {
  const fields = Object.keys(validators).map(id => form.querySelector('#' + id));
  const summary = form.querySelector('#feedbackStatus');
  const dialog = document.querySelector('#feedbackDialog');
  const submit = form.querySelector('[type=submit]');
  const touched = new Set();
  let returnFocus = null;

  // textContent keeps messages as text; user input is never inserted as HTML.
  const clearError = field => {
    field.removeAttribute('data-state');
    field.classList.remove('border-red-500', 'border-green-500');
    field.setAttribute('aria-invalid', 'false');
    document.getElementById(field.id + 'Error').textContent = '';
  };
  const showError = (field, error) => {
    field.dataset.state = 'error';
    field.classList.remove('border-green-500');
    field.classList.add('border-red-500');
    field.setAttribute('aria-invalid', 'true');
    document.getElementById(field.id + 'Error').textContent = error;
  };
  const showSuccess = field => {
    field.dataset.state = 'success';
    field.classList.remove('border-red-500');
    field.classList.add('border-green-500');
    field.setAttribute('aria-invalid', 'false');
    document.getElementById(field.id + 'Error').textContent = '✓ Формат правильний';
  };
  const validateField = field => {
    const value = field.type === 'checkbox' ? field.checked : field.value;
    const error = validators[field.id](value);
    if (error) showError(field, error); else showSuccess(field);
    return !error;
  };
  fields.forEach(field => {
    field.addEventListener('blur', () => { touched.add(field.id); validateField(field); });
    field.addEventListener('input', () => {
      // Check a touched field while correcting it; avoid errors on first keystroke.
      if (touched.has(field.id)) validateField(field);
      summary.textContent = '';
    });
    if (field.type === 'checkbox') field.addEventListener('change', () => {
      touched.add(field.id); validateField(field);
    });
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (dialog.open) return; // Repeated submit cannot open duplicate dialogs.
    const invalid = fields.filter(field => {
      touched.add(field.id);
      return !validateField(field);
    });
    if (invalid.length) {
      summary.textContent = 'Перевірте поля з помилками: ' + invalid.length + '.';
      invalid[0].focus();
      return;
    }
    summary.textContent = '';
    returnFocus = document.activeElement;
    submit.disabled = true;
    dialog.showModal(); // Native modal makes the background inert.
    dialog.querySelector('#feedbackClose').focus();
  });
  dialog.querySelector('#feedbackClose').addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', event => {
    // A single close button is the only focus stop; keep Tab/Shift+Tab inside.
    if (event.key === 'Tab') {
      event.preventDefault();
      dialog.querySelector('#feedbackClose').focus();
    }
  });
  // Native cancel event handles Escape and then emits close.
  dialog.addEventListener('close', () => {
    form.reset();
    fields.forEach(clearError);
    touched.clear();
    submit.disabled = false;
    if (returnFocus?.isConnected) returnFocus.focus();
  });
  form.addEventListener('reset', () => {
    fields.forEach(clearError); touched.clear(); summary.textContent = '';
  });
  // Progressive enhancement: without JS the demo never submits personal data.
  form.noValidate = true;
  submit.disabled = false;
  document.querySelector('#feedbackJsNotice').hidden = true;
}
