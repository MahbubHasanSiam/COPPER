// Minimal JS for segmented control, password toggle, role-dependent ID field, and lightweight validation.
// Meant for demo — integrate with your form handlers and server-side validation.

document.addEventListener('DOMContentLoaded', () => {
  // Tabs
  const tabs = document.querySelectorAll('.segmented-btn');
  const forms = document.querySelectorAll('.auth-form');

  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected','false')});
      btn.classList.add('active'); btn.setAttribute('aria-selected','true');

      forms.forEach(f => f.classList.remove('active'));
      const target = document.getElementById(btn.dataset.target);
      if (target) target.classList.add('active');

      // move focus into first field of the active form for accessibility
      const first = target.querySelector('input,select,button');
      if (first) first.focus();
    });
  });

  // Password toggles
  document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.target;
      const input = document.getElementById(id);
      if (!input) return;
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      btn.setAttribute('aria-pressed', String(!isPassword));
      btn.textContent = isPassword ? 'Hide' : 'Show';
    });
  });

  // Role selection (show/hide ID verification input for student/alumni)
  const roleSelect = document.getElementById('reg-role');
  const idGroup = document.getElementById('id-verification-group');
  if (roleSelect) {
    roleSelect.addEventListener('change', () => {
      const val = roleSelect.value;
      if (val === 'student' || val === 'alumni') {
        idGroup.hidden = false;
        idGroup.querySelector('input').setAttribute('required','');
      } else {
        idGroup.hidden = true;
        idGroup.querySelector('input').removeAttribute('required');
      }
    });
  }

  // Simple validation demo
  function showError(id, msg) {
    const el = document.getElementById(id);
    if (el) el.textContent = msg || '';
  }

  function completeDemoAuth(name) {
    localStorage.setItem('auth_demo', '1');
    if (name) {
      localStorage.setItem('demo_user_name', name);
    }
    window.location.replace('feed.html');
  }

  // Demo submit handlers (prevent default for demo)
  document.getElementById('login').addEventListener('submit', (e) => {
    e.preventDefault();
    // clear errors
    showError('login-email-error','');
    showError('login-password-error','');

    const email = document.getElementById('login-email').value.trim();
    const pass = document.getElementById('login-password').value;
    let ok = true;
    if (!email) { showError('login-email-error','Please enter your institutional email.'); ok = false; }
    if (!pass) { showError('login-password-error','Please enter your password.'); ok = false; }
    if (!ok) return;

    completeDemoAuth(email);
  });

  document.getElementById('register').addEventListener('submit', (e) => {
    e.preventDefault();
    // clear errors
    ['reg-name-error','reg-email-error','reg-password-error','reg-confirm-error','reg-role-error','reg-id-error'].forEach(id => showError(id,''));

    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const pass = document.getElementById('reg-password').value;
    const confirm = document.getElementById('reg-confirm').value;
    const role = document.getElementById('reg-role').value;
    const idVal = document.getElementById('reg-id').value.trim();
    let ok = true;

    if (!name) { showError('reg-name-error','Please provide your full name.'); ok = false; }
    if (!email) { showError('reg-email-error','Please provide an institutional email.'); ok = false; }
    if (!pass || pass.length < 8) { showError('reg-password-error','Password must be at least 8 characters.'); ok = false; }
    if (pass !== confirm) { showError('reg-confirm-error','Passwords do not match.'); ok = false; }
    if (!role) { showError('reg-role-error','Please select your role.'); ok = false; }
    if ((role === 'student' || role === 'alumni') && !idVal) { showError('reg-id-error','Please enter your Student / Alumni ID for verification.'); ok = false; }

    if (!ok) return;

    completeDemoAuth(name);
  });

});