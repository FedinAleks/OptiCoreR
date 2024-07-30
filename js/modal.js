(() => {
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
    emailError: document.getElementById('email-error'), // Додано
    policyError: document.getElementById('policy-error')
  };

  refs.openModalBtn.addEventListener("click", toggleModal);
  refs.closeModalBtn.addEventListener("click", toggleModal);
  refs.form.addEventListener('submit', validateForm);
  refs.tel.addEventListener('input', formatPhoneNumber);
  refs.name.addEventListener('input', capitalizeName);

  function toggleModal() {
    document.body.classList.toggle("modal-open");
    refs.modal.classList.toggle("is-hidden");
    
    // Очистити поля форми при закритті модального вікна
    if (refs.modal.classList.contains("is-hidden")) {
      clearForm();
    }
  }

  function validateForm(event) {
    let isValid = true;

    // Очистити попередні повідомлення про помилки
    clearErrors();

    // Перевірка полів
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
      showFormError(refs.emailError, 'Введіть дійсну електронну пошту'); // Змінено
    }
    if (!refs.agreement.checked) {
      isValid = false;
      showFormError(refs.policyError, 'Ви повинні погодитися на обробку персональних даних');
    }

    if (!isValid) {
      event.preventDefault(); // Зупиняємо стандартну відправку форми
    } else {
      event.preventDefault(); // Зупиняємо стандартну відправку форми

      // Відправка email
      emailjs.send("service_kx9ukxb", "template_s9ijj5a", {
        name: refs.name.value,
        tel: refs.tel.value,
        email: refs.email.value,
        request: refs.request.value
      })
      .then(() => {
        // Закриття модального вікна
        toggleModal();

        // Показ повідомлення про успішне відправлення
        refs.successMessage.classList.remove('is-hidden');
        
        // Сховати повідомлення через 5 секунд
        setTimeout(() => {
          refs.successMessage.classList.add('is-hidden');
        }, 5000);

        // Очистити поля форми
        clearForm();
      })
      .catch(error => {
        // Обробка помилок, якщо відправка email не вдалася
        console.error('Відправка email не вдалася:', error);
        alert('Не вдалося відправити email. Спробуйте ще раз пізніше.');
      });
    }
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
    console.log("Clearing form"); 
    refs.form.reset();
    refs.agreement.checked = false; // Очистити стан чекбокса
    // Додатково очищення значень інших полів
    refs.name.value = '';
    refs.tel.value = '';
    refs.email.value = '';
    refs.request.value = '';
  }

  function formatPhoneNumber(event) {
    let value = event.target.value.replace(/\D/g, '');
    if (!value.startsWith('380')) {
      value = '380' + value;
    }
    value = value.slice(0, 12); // Залишаємо тільки 12 цифр
    event.target.value = '+380' + value.slice(3); // Видалено пробіли
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
})();
