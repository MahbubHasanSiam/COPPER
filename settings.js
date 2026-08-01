document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('darkModeToggle');
  const save = document.getElementById('saveSettings');

  if (!toggle || !save) return;

  toggle.checked = window.getThemeDark ? window.getThemeDark() : false;

  toggle.addEventListener('change', () => {
    const enabled = toggle.checked;
    window.setThemeDark && window.setThemeDark(enabled);
  });

  save.addEventListener('click', () => {
    const enabled = toggle.checked;
    window.setThemeDark && window.setThemeDark(enabled);
    save.textContent = enabled ? 'Saved: Dark mode enabled' : 'Saved: Light mode enabled';
    setTimeout(() => { save.textContent = 'Save preferences'; }, 2200);
  });
});
