// Runs before styles to avoid a flash of the wrong theme. Storage can be unavailable.
(() => {
  const key = 'iphone-select-theme';
  const media = window.matchMedia('(prefers-color-scheme: light)');
  let preference;
  try { preference = localStorage.getItem(key); } catch {}
  const apply = theme => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#faf7f8' : '#080808');
    const button = document.querySelector('#theme-toggle');
    if (button) {
      button.textContent = theme === 'light' ? '☾' : '☀';
      button.setAttribute('aria-label', theme === 'light' ? 'Увімкнути темну тему' : 'Увімкнути світлу тему');
      button.setAttribute('aria-pressed', String(theme === 'light'));
    }
  };
  const preferred = () => preference === 'light' || preference === 'dark' ? preference : media.matches ? 'light' : 'dark';
  apply(preferred());
  document.addEventListener('DOMContentLoaded', () => {
    apply(preferred());
    document.querySelector('#theme-toggle')?.addEventListener('click', () => {
      preference = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
      try { localStorage.setItem(key, preference); } catch {}
      apply(preference);
    });
  });
  media.addEventListener('change', () => apply(preferred()));
  window.addEventListener('storage', event => {
    if (event.key === key || event.key === null) { preference = event.newValue; apply(preferred()); }
  });
})();
