// Dashboard interactions: sidebar toggle, theme toggle, simple demo auth check, and quick actions.
// This is a front-end prototype: replace sample handlers with real endpoints, API calls, and UI components.

(function () {
  const DEMO_KEY = 'auth_demo';
  
  if (!localStorage.getItem(DEMO_KEY)) {
    window.location.replace('index.html');
    return;
  }

  localStorage.setItem('demo_last_page', 'dashboard.html');

  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const menuBtn = document.getElementById('menuBtn');
  const copyYear = document.getElementById('copyYear');
  const signOut = document.getElementById('signOut');

  sidebarToggle && sidebarToggle.addEventListener('click', () => {
    sidebar?.classList.toggle('collapsed');
  });

  menuBtn && menuBtn.addEventListener('click', () => {
    sidebar?.classList.toggle('open');
  });

  signOut && signOut.addEventListener('click', () => {
    localStorage.removeItem(DEMO_KEY);
    localStorage.removeItem('demo_user_name');
    window.location.href = 'index.html';
  });

  document.getElementById('analyzeBtn')?.addEventListener('click', () => {
    alert('Demo: Running skill analysis... (hook into backend AI/skill-service)');
  });

  document.getElementById('updateProfileBtn')?.addEventListener('click', () => {
    document.getElementById('profileSettings')?.scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('uploadResumeBtn')?.addEventListener('click', () => {
    document.getElementById('resumeUpload')?.click();
  });

  copyYear && (copyYear.textContent = new Date().getFullYear());

  const welcomeName = document.getElementById('welcomeName');
  const storedName = localStorage.getItem('demo_user_name') || 'Jordan';
  if (welcomeName) welcomeName.textContent = storedName;

  document.addEventListener('click', (e) => {
    if (sidebar && !sidebar.contains(e.target) && window.innerWidth < 620) {
      sidebar.classList.remove('open');
    }
  });
})();