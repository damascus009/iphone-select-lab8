
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

// Anonymous page analytics only on the published site; never send form/account data.
if (location.hostname === 'iphone-select-rgr.vercel.app' && navigator.doNotTrack !== '1') {
  import('./vercel-analytics-v2.mjs').then(({inject}) => inject({
    mode: 'production',
    beforeSend(event) {
      const url = new URL(event.url);
      url.search = ''; url.hash = '';
      return {...event, url: url.href};
    }
  })).catch(() => {});
}
