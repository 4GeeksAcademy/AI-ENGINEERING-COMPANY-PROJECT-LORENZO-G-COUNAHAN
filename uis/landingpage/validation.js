(() => {
  'use strict';

  const form = document.querySelector('#application-form');
  const identity = document.querySelector('#identity-fields');
  const remaining = document.querySelector('#remaining-fields');
  const continueButton = document.querySelector('#continue-button');
  const submitButton = document.querySelector('#submit-button');
  const summary = document.querySelector('#error-summary');
  const success = document.querySelector('#success-message');
  const gateStatus = document.querySelector('#gate-status');
  const prefix = document.querySelector('#phone-prefix');
  const fields = {
    fullName: document.querySelector('#full-name'),
    birthdate: document.querySelector('#birthdate'),
    email: document.querySelector('#email'),
    country: document.querySelector('#country'),
    city: document.querySelector('#city'),
    phone: document.querySelector('#phone'),
    source: document.querySelector('#source'),
    terms: document.querySelector('#terms'),
    offers: document.querySelector('#offers'),
    location: document.querySelector('#location'),
    preferences: document.querySelector('#preferences'),
  };
  const preferences = [...form.querySelectorAll('input[name="preferences"]')];
  const countries = {
    CO: {
      prefix: '+57',
      cities: {
        'Medellín': ['El Poblado', 'Laureles', 'Envigado', 'Sabaneta'],
        'Bogotá': ['Usaquén', 'Chapinero', 'Zona Rosa'],
        'Cali': ['Granada', 'Ciudad Jardín', 'Unicentro'],
      },
    },
    US: {
      prefix: '+1',
      cities: {
        Miami: ['Brickell', 'Coral Gables'],
        Orlando: ['Downtown', 'International Drive'],
      },
    },
  };
  const sources = [
    'Redes sociales', 'Recomendación', 'Pasando por el local',
    'Búsqueda en internet', 'Otro',
  ];
  const dietaryOptions = ['Sin restricciones', 'Vegetariano', 'Sin gluten', 'Otro'];
  const messages = {
    fullName: 'Ingresa tu nombre completo (nombre y apellido)',
    birthdate: 'Debes ser mayor de 18 años para registrarte en Brasa Points',
    email: 'Ingresa un email válido (ejemplo: <nombre@correo.com>)',
    country: 'Selecciona tu país',
    city: 'Selecciona tu ciudad',
    phone: 'El teléfono debe incluir código de país (ejemplo: +57 300 123 4567 o +1 305 123 4567)',
    source: 'Cuéntanos cómo conociste Brasaland',
    terms: 'Debes aceptar los términos del programa Brasa Points para continuar',
    location: 'Selecciona una ubicación válida para tu país y ciudad, o deja este campo vacío',
    preferences: 'Selecciona preferencias válidas; «Sin restricciones» no se combina con otras opciones',
  };
  let unlocked = false;

  function selectedCountry() {
    return Object.hasOwn(countries, fields.country.value)
      ? countries[fields.country.value] : null;
  }

  function locationOptions() {
    const country = selectedCountry();
    return country && Object.hasOwn(country.cities, fields.city.value)
      ? country.cities[fields.city.value].map((name) => `Brasaland ${name}`) : [];
  }

  function isAdult(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const [year, month, day] = value.split('-').map(Number);
    const birth = new Date(year, month - 1, day);
    const today = new Date();
    if (birth.getFullYear() !== year || birth.getMonth() !== month - 1
      || birth.getDate() !== day || birth > today) return false;
    const birthdayPending = today.getMonth() < month - 1
      || (today.getMonth() === month - 1 && today.getDate() < day);
    return today.getFullYear() - year - Number(birthdayPending) >= 18;
  }

  function isValid(key) {
    const control = fields[key];
    const value = control.value?.trim();
    switch (key) {
      case 'fullName': {
        const words = value.split(/\s+/);
        return value.length <= 120 && words.length >= 2
          && words.every((word) => /^\p{L}[\p{L}\p{M}'’-]*$/u.test(word));
      }
      case 'birthdate': return isAdult(value);
      case 'email':
        return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          && !control.validity.typeMismatch;
      case 'country': return selectedCountry() !== null;
      case 'city': {
        const country = selectedCountry();
        return country !== null && Object.hasOwn(country.cities, value);
      }
      case 'phone':
        return selectedCountry() !== null && /^[0-9 ()-]+$/.test(value)
          && value.replace(/\D/g, '').length === 10;
      case 'source': return sources.includes(value);
      case 'terms': return control.checked;
      case 'offers': return true;
      case 'location': return value === '' || locationOptions().includes(value);
      case 'preferences': {
        const checked = preferences.filter((item) => item.checked).map((item) => item.value);
        return checked.every((item) => dietaryOptions.includes(item))
          && (!checked.includes('Sin restricciones') || checked.length === 1);
      }
      default: throw new Error(`Campo de validación desconocido: ${key}`);
    }
  }

  function showError(key, message = '') {
    const error = document.querySelector(`#${fields[key].id}-error`);
    fields[key].setAttribute('aria-invalid', String(Boolean(message)));
    if (error) {
      error.textContent = message;
      error.hidden = !message;
    }
    if (key === 'preferences') {
      preferences.forEach((item) => item.setAttribute('aria-invalid', String(Boolean(message))));
    }
  }

  function validate(key) {
    const valid = isValid(key);
    showError(key, valid ? '' : messages[key]);
    return valid;
  }

  function clearFeedback() {
    summary.textContent = '';
    success.hidden = true;
  }

  function refreshDependentState() {
    const hasCountry = selectedCountry() !== null;
    fields.city.disabled = !unlocked || !hasCountry;
    fields.phone.disabled = !unlocked || !hasCountry;
    fields.location.disabled = !unlocked || locationOptions().length === 0;
  }

  function setUnlocked(value) {
    unlocked = value;
    remaining.disabled = !value;
    submitButton.disabled = !value;
    gateStatus.textContent = value
      ? 'Edad validada. Puedes completar el resto del formulario.'
      : 'Completa nombre y fecha de nacimiento y pulsa «Continuar». Debes tener 18 años cumplidos.';
    refreshDependentState();
  }

  function populate(select, placeholder, options) {
    select.replaceChildren(new Option(placeholder, ''), ...options.map((value) => new Option(value, value)));
  }

  continueButton.addEventListener('click', () => {
    clearFeedback();
    const nameValid = validate('fullName');
    const ageValid = validate('birthdate');
    setUnlocked(nameValid && ageValid);
    if (!unlocked) {
      summary.textContent = 'Revisa tus datos personales para continuar. Debes tener 18 años cumplidos.';
      (nameValid ? fields.birthdate : fields.fullName).focus();
      return;
    }
    fields.email.focus();
  });

  fields.country.addEventListener('change', () => {
    const country = selectedCountry();
    populate(fields.city, 'Selecciona tu ciudad', country ? Object.keys(country.cities) : []);
    populate(fields.location, 'Sin preferencia', []);
    prefix.textContent = country ? country.prefix : '—';
    fields.phone.value = '';
    ['city', 'phone', 'location'].forEach((key) => showError(key));
    refreshDependentState();
  });

  fields.city.addEventListener('change', () => {
    populate(fields.location, 'Sin preferencia', locationOptions());
    showError('location');
    refreshDependentState();
  });

  preferences.forEach((item) => {
    item.addEventListener('change', () => {
      if (item.checked) {
        preferences.forEach((other) => {
          if (other !== item && (item.value === 'Sin restricciones' || other.value === 'Sin restricciones')) {
            other.checked = false;
          }
        });
      }
      validate('preferences');
    });
  });

  form.addEventListener('input', (event) => {
    clearFeedback();
    if (event.target === fields.fullName || event.target === fields.birthdate) {
      if (!isValid('fullName') || !isValid('birthdate')) setUnlocked(false);
    }
  });

  form.addEventListener('change', () => clearFeedback());
  Object.entries(fields).forEach(([key, control]) => {
    if (key === 'preferences' || key === 'offers') return;
    control.addEventListener('blur', () => {
      if (!control.disabled) {
        if (!validate(key)) summary.textContent = messages[key];
      }
    });
    control.addEventListener('input', () => {
      if (control.getAttribute('aria-invalid') === 'true') validate(key);
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearFeedback();
    const keys = Object.keys(fields);
    const invalid = keys.filter((key) => !validate(key));
    if (invalid.length > 0) {
      const first = fields[invalid[0]];
      summary.textContent = `Hay ${invalid.length} campo(s) por corregir. ${messages[invalid[0]]}`;
      if (invalid.includes('fullName') || invalid.includes('birthdate')) setUnlocked(false);
      (first === fields.preferences ? preferences[0] : first).focus();
      return;
    }
    if (!unlocked) {
      summary.textContent = 'Valida primero tus datos personales con el botón «Continuar».';
      continueButton.focus();
      return;
    }
    success.hidden = false;
    success.focus();
  });

  const today = new Date();
  fields.birthdate.max = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('-');
  identity.disabled = false;
  continueButton.disabled = false;
  setUnlocked(false);
  document.querySelector('#script-status').hidden = true;
})();
