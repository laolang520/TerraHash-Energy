(() => {
  'use strict';

  document.querySelectorAll('form[data-careers-form]').forEach(form => {
    const resume = form.elements.namedItem('attachment');
    const button = form.querySelector('button[type="submit"]');
    const status = form.querySelector('[data-submit-status]');
    const originalLabel = button.textContent;
    let submitting = false;
    let recoveryTimer;

    const validateResume = () => {
      const file = resume.files[0];
      let message = '';
      if (file && !/\.(pdf|doc|docx)$/i.test(file.name)) {
        message = 'Please choose a PDF, DOC or DOCX resume.';
      } else if (file && file.size > 10000000) {
        message = 'Please choose a resume no larger than 10 MB.';
      }
      resume.setCustomValidity(message);
      return !message;
    };

    const restoreButton = () => {
      window.clearTimeout(recoveryTimer);
      submitting = false;
      button.disabled = false;
      button.textContent = originalLabel;
      form.removeAttribute('aria-busy');
    };

    resume.addEventListener('change', validateResume);
    form.addEventListener('submit', event => {
      if (submitting) {
        event.preventDefault();
        return;
      }
      if (!validateResume() || !form.reportValidity()) {
        event.preventDefault();
        resume.reportValidity();
        return;
      }

      // Keep the native multipart POST so attachments and the provider's
      // verification flow work even without JavaScript. Do not reset fields
      // or show success before the provider redirects to the confirmation.
      submitting = true;
      button.disabled = true;
      button.textContent = 'SUBMITTING…';
      form.setAttribute('aria-busy', 'true');
      status.textContent = 'Continue through the verification step to complete your submission.';
      status.hidden = false;

      recoveryTimer = window.setTimeout(() => {
        restoreButton();
        status.textContent = 'Submission has not been confirmed. If no confirmation page appears, check your connection or contact hr@terrahashenergy.com for help.';
      }, 30000);
    });

    // Returning from a provider error or using Back must leave the form usable.
    window.addEventListener('pageshow', () => {
      restoreButton();
      status.textContent = '';
      status.hidden = true;
      validateResume();
    });
  });

  const focusConfirmation = () => {
    if (window.location.hash === '#application-submitted') {
      document.getElementById('application-submitted')?.focus();
    }
  };
  focusConfirmation();
  window.addEventListener('hashchange', focusConfirmation);
})();
