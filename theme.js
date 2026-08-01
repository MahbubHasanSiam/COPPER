(function () {
  const THEME_KEY = 'theme_dark';

  function applyTheme() {
    const dark = localStorage.getItem(THEME_KEY) === '1';
    document.body.classList.toggle('dark', dark);
  }

  function ensureBodyReady(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  ensureBodyReady(applyTheme);

  window.setThemeDark = function (value) {
    localStorage.setItem(THEME_KEY, value ? '1' : '0');
    applyTheme();
  };

  window.getThemeDark = function () {
    return localStorage.getItem(THEME_KEY) === '1';
  };

  window.toggleThemeDark = function () {
    setThemeDark(!getThemeDark());
  };
})();