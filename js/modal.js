document.addEventListener('DOMContentLoaded', () => {
  const refs = {
    openModalBtn: document.querySelector("[data-modal-open]"),
    closeModalBtn: document.querySelector("[data-modal-close]"),
    modal: document.querySelector("[data-modal]"),
    form: document.querySelector('.form__agreement'),
    name: document.getElementById('name'),
    tel: document.getElementById('tel'),
    email: document.getElementById('email'),
    request: document.getElementById('request'),
    agreement: document.getElementById('policy'),
    successMessage: document.getElementById('success-message'),
    nameError: document.getElementById('name-error'),
    telError: document.getElementById('tel-error'),
    emailError: document.getElementById('email-error'),
    policyError: document.getElementById('policy-error')
  };

  refs.openModalBtn.addEventListener("click", toggleModal);
  refs.closeModalBtn.addEventListener("click", toggleModal);
  refs.form.addEventListener('submit', handleFormSubmit);
  refs.tel.addEventListener('input', formatPhoneNumber);
  refs.name.addEventListener('input', capitalizeName);

  function toggleModal() {
    document.body.classList.toggle("modal-open");
    refs.modal.classList.toggle("is-hidden");
    
    if (refs.modal.classList.contains("is-hidden")) {
      clearForm();
    } else {
      refs.tel.value = '+380';
    }
  }

  function handleFormSubmit(event) {
    event.preventDefault(); // Зупиняємо стандартну відправку форми

    let isValid = validateForm();
    if (isValid) {
      grecaptcha.ready(() => {
        grecaptcha.execute();
      });
    }
  }

  function validateForm() {
    let isValid = true;
    clearErrors();

    if (!refs.name.value.trim()) {
      isValid = false;
      showFormError(refs.nameError, 'Ім’я є обов’язковим');
    }
    if (!refs.tel.value.trim() || !/^\+380\d{9}$/.test(refs.tel.value.replace(/\s+/g, ''))) {
      isValid = false;
      showFormError(refs.telError, 'Номер телефону є обов’язковим');
    }
    if (refs.email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(refs.email.value)) {
      isValid = false;
      showFormError(refs.emailError, 'Введіть дійсну електронну пошту');
    }
    if (!refs.agreement.checked) {
      isValid = false;
      showFormError(refs.policyError, 'Ви повинні погодитися на обробку персональних даних');
    }

    return isValid;
  }

  function onReCaptchaSuccess(token) {
    // Відправка email
    emailjs.send("service_kx9ukxb", "template_s9ijj5a", {
      name: refs.name.value,
      tel: refs.tel.value,
      email: refs.email.value,
      request: refs.request.value,
      'g-recaptcha-response': token
    })
    .then(() => {
      toggleModal();
      refs.successMessage.classList.remove('is-hidden');
      
      setTimeout(() => {
        refs.successMessage.classList.add('is-hidden');
      }, 5000);

      clearForm();
    })
    .catch(error => {
      console.error('Відправка email не вдалася:', error);
      alert('Не вдалося відправити email. Спробуйте ще раз пізніше.');
    });
  }

  function showFormError(element, message) {
    element.textContent = message;
    element.classList.add('is-visible');
    setTimeout(() => {
      element.classList.remove('is-visible');
    }, 5000);
  }

  function clearErrors() {
    refs.nameError.textContent = '';
    refs.telError.textContent = '';
    refs.emailError.textContent = '';
    refs.policyError.textContent = '';
  }

  function clearForm() {
    refs.form.reset();
    refs.agreement.checked = false;
    refs.name.value = '';
    refs.tel.value = '';
    refs.email.value = '';
    refs.request.value = '';
  }

  function formatPhoneNumber(event) {
    let value = event.target.value.replace(/\D/g, '');

    if (value.length < 3) {
      value = '';
    } else if (!value.startsWith('380')) {
      value = '380' + value.slice(3);
    }

    value = value.slice(0, 12);

    let formattedValue = '+380';
    if (value.length > 3) {
      formattedValue += ' ' + value.slice(3, 5);
    }
    if (value.length > 5) {
      formattedValue += ' ' + value.slice(5, 8);
    }
    if (value.length > 8) {
      formattedValue += ' ' + value.slice(8, 10);
    }
    if (value.length > 10) {
      formattedValue += ' ' + value.slice(10, 12);
    }

    event.target.value = formattedValue.trim();
  }

  function capitalizeName(event) {
    let value = event.target.value;
    if (value.length > 50) {
      value = value.slice(0, 50);
    }
    event.target.value = value
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  function onReCaptchaSuccess(token) {
    // Відправка email
    emailjs.send("service_kx9ukxb", "template_s9ijj5a", {
      name: refs.name.value,
      tel: refs.tel.value,
      email: refs.email.value,
      request: refs.request.value,
      'g-recaptcha-response': token
    })
    .then(() => {
      toggleModal();
      refs.successMessage.classList.remove('is-hidden');
      
      setTimeout(() => {
        refs.successMessage.classList.add('is-hidden');
      }, 5000);

      clearForm();
    })
    .catch(error => {
      console.error('Відправка email не вдалася:', error);
      alert('Не вдалося відправити email. Спробуйте ще раз пізніше.');
    });
  }
});
