
      // Close the existing mobile disclosure after navigation; Escape returns focus.
      const mobileMenu = document.querySelector('#mobile-menu');
      mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => { mobileMenu.open = false; }));
      mobileMenu.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          mobileMenu.open = false;
          mobileMenu.querySelector('summary').focus();
        }
      });
      document.querySelector('#subscribe-form').addEventListener('submit', (event) => {
        event.preventDefault();
        document.querySelector('#subscribe-message').textContent = 'Дякуємо! Це демонстраційна форма.';
        event.currentTarget.reset();
      });
    
document.querySelector('[data-load-video]')?.addEventListener('click', event => {
  const frame = document.querySelector('#video-guide iframe');
  frame.src = frame.dataset.src; frame.hidden = false; event.currentTarget.hidden = true;
});
