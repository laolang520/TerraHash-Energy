document.addEventListener('DOMContentLoaded', () => {
  const menu = document.querySelector('[data-menu]');
  const nav = document.querySelector('.nav');
  if (menu && nav) menu.addEventListener('click', () => nav.classList.toggle('open'));

  document.querySelectorAll('form[data-demo]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const out = form.querySelector('.form-message');
      if (out) {
        out.textContent = 'Thank you. This demo form is ready to connect to your CRM or email service.';
        out.hidden = false;
      }
      form.reset();
    });
  });

  // Use the clean SVG logo so the header never renders the old black JPEG block.
  document.querySelectorAll('.brand .logo').forEach(logo => {
    logo.textContent = '';
    logo.style.backgroundImage = 'url("logo.svg")';
    logo.style.backgroundRepeat = 'no-repeat';
    logo.style.backgroundPosition = 'center';
    logo.style.backgroundSize = 'contain';
    logo.style.width = '150px';
    logo.style.height = '52px';
    logo.style.flex = '0 0 150px';
    logo.style.border = '0';
    logo.style.borderRadius = '8px';
    logo.style.boxShadow = 'none';
    logo.style.backgroundColor = 'transparent';
  });

  // The image already contains the company name.
  document.querySelectorAll('.brand').forEach(brand => {
    const spans = brand.querySelectorAll(':scope > span');
    if (spans.length > 1) spans[1].style.display = 'none';
  });
});
