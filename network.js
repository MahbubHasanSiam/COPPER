// network.js — Demo interactions: auth check, search, chips, rendering profiles, requests slide-over
(function () {
  const DEMO_KEY = 'auth_demo';
  if (!localStorage.getItem(DEMO_KEY)) {
    setTimeout(() => window.location.href = 'index.html', 300);
    return;
  }

  // DOM refs
  const alumniGrid = document.getElementById('alumniGrid');
  const resultsCount = document.getElementById('resultsCount');
  const alumniSearchForm = document.getElementById('alumniSearchForm');
  const alumniSearch = document.getElementById('alumniSearch');
  const chips = document.querySelectorAll('.chip');
  const activeFiltersEl = document.getElementById('activeFilters');
  const requestsPanel = document.getElementById('requestsPanel');
  const openRequests = document.getElementById('openRequests');
  const closeRequests = document.getElementById('closeRequests');
  const incomingList = document.getElementById('incomingList');
  const outgoingList = document.getElementById('outgoingList');
  const rtabButtons = document.querySelectorAll('.rtab');
  const copyYear = document.getElementById('copyYear');

  // Demo profiles
  const profiles = [
    {
      id: 'u1',
      name: 'Sarah Lee',
      avatar: 'https://i.pravatar.cc/120?img=10',
      verified: true,
      position: 'Product Designer',
      company: 'DesignWorks',
      companyLogo: 'https://via.placeholder.com/48x48.png?text=DW',
      grad: '2014',
      dept: 'Design',
      exp: '8 yrs',
      skills: ['Figma','UX Research','Prototyping'],
      mentor: true,
      bio: 'Design lead focusing on UX for enterprise SaaS.'
    },
    {
      id: 'u2',
      name: 'Mark Robinson',
      avatar: 'https://i.pravatar.cc/120?img=15',
      verified: true,
      position: 'Data Scientist',
      company: 'DataAI',
      companyLogo: 'https://via.placeholder.com/48x48.png?text=DA',
      grad: '2016',
      dept: 'Computer Science',
      exp: '6 yrs',
      skills: ['Python','SQL','ML'],
      mentor: false,
      bio: 'Building ML systems for healthcare analytics.'
    },
    {
      id: 'u3',
      name: 'Priya Kumar',
      avatar: 'https://i.pravatar.cc/120?img=22',
      verified: false,
      position: 'Engineering Manager',
      company: 'TechCorp',
      companyLogo: 'https://via.placeholder.com/48x48.png?text=TC',
      grad: '2012',
      dept: 'Engineering',
      exp: '10 yrs',
      skills: ['Leadership','Go','Distributed Systems'],
      mentor: true,
      bio: 'Manager focused on platform engineering and mentoring juniors.'
    }
  ];

  // Demo requests
  const incomingRequests = [
    { id: 'r1', name: 'Alex P.', avatar: 'https://i.pravatar.cc/64?img=28', message: 'Would love to connect about mentorship.' },
    { id: 'r2', name: 'Daniela G.', avatar: 'https://i.pravatar.cc/64?img=45', message: 'Interested in career advice for data roles.' }
  ];
  const outgoingRequests = [
    { id: 'o1', name: 'Priya Kumar', avatar: 'https://i.pravatar.cc/64?img=22', status: 'Pending' }
  ];

  // Helpers to render
  function renderProfiles(list) {
    alumniGrid.innerHTML = '';
    list.forEach(p => alumniGrid.appendChild(profileCardEl(p)));
    resultsCount && (resultsCount.textContent = list.length);
  }

  function profileCardEl(p) {
    const el = document.createElement('article');
    el.className = 'profile-card';
    el.innerHTML = `
      <div class="pc-top">
        <img src="${p.avatar}" alt="${p.name}">
        <div style="flex:1">
          <div class="name-row"><strong>${p.name}</strong> ${p.verified ? '<span class="verified">✔</span>' : ''}</div>
          <div class="position">${p.position} • ${p.company}</div>
          <div class="meta-row">
            <div>Batch ${p.grad}</div>
            <div>${p.dept}</div>
            <div>${p.exp}</div>
          </div>
        </div>
        <img class="company-logo" src="${p.companyLogo}" alt="${p.company} logo">
      </div>
      <div class="skills">${p.skills.map(s => `<span class="skill-pill">${s}</span>`).join('')}</div>
      <div class="bio muted">${p.bio}</div>
      <div class="card-actions">
        <div class="left">
          <button class="btn-primary connect-btn" data-id="${p.id}">Connect</button>
          <button class="btn-outline mentor-btn" data-id="${p.id}">${p.mentor ? 'Request Mentorship' : 'Ask about mentorship'}</button>
        </div>
        <div class="right">
          <button class="btn-outline msg-btn" data-id="${p.id}">Message</button>
          <button class="btn-ghost view-btn" data-id="${p.id}">View profile</button>
        </div>
      </div>
    `;

    // Wire actions
    el.querySelector('.connect-btn').addEventListener('click', (e) => {
      e.currentTarget.textContent = 'Requested';
      e.currentTarget.disabled = true;
      // Add to outgoing requests demo
      outgoingRequests.push({ id: 'o' + Date.now(), name: p.name, avatar: p.avatar, status: 'Pending' });
      alert(`Connection request sent to ${p.name} (demo).`);
    });
    el.querySelector('.mentor-btn').addEventListener('click', () => {
      alert(`Mentorship request sent to ${p.name} (demo).`);
    });
    el.querySelector('.msg-btn').addEventListener('click', () => {
      alert(`Open message composer for ${p.name} (demo).`);
    });
    el.querySelector('.view-btn').addEventListener('click', () => {
      // In production: navigate to profile page
      alert(`Open profile for ${p.name} (demo).`);
    });

    return el;
  }

  // Filters and search
  let activeFilters = new Map();

  function updateActiveFiltersUI() {
    activeFiltersEl.innerHTML = '';
    activeFilters.forEach((v,k) => {
      const chip = document.createElement('div');
      chip.className = 'chip active';
      chip.textContent = `${k}: ${v}`;
      chip.addEventListener('click', () => { activeFilters.delete(k); updateActiveFiltersUI(); applyFilters(); });
      activeFiltersEl.appendChild(chip);
    });
  }

  function applyFilters() {
    const query = alumniSearch.value.trim().toLowerCase();
    let results = profiles.filter(p => {
      let matchesQuery = true;
      if (query) {
        const hay = (p.name + ' ' + p.position + ' ' + p.company + ' ' + p.skills.join(' ') + ' ' + p.dept + ' ' + p.grad + ' ' + p.bio).toLowerCase();
        matchesQuery = hay.includes(query);
      }
      // simple demo filters: check available mentorship
      for (let [k,v] of activeFilters.entries()) {
        if (k === 'Available for Mentorship' && (!p.mentor)) return false;
        // other filters could be implemented similarly in production
      }
      return matchesQuery;
    });
    renderProfiles(results);
  }

  // Chip click behaviors (demo: simple toggles)
  chips.forEach(c => {
    c.addEventListener('click', () => {
      const key = c.dataset.filter;
      if (key === 'mentor') {
        // toggle mentorship filter
        if (activeFilters.has('Available for Mentorship')) {
          activeFilters.delete('Available for Mentorship');
          c.classList.remove('active');
        } else {
          activeFilters.set('Available for Mentorship', 'Yes');
          c.classList.add('active');
        }
      } else {
        // for demo, open a prompt to set a filter value
        const val = prompt(`Filter by ${key} (enter value) — leave empty to cancel:`);
        if (val) {
          activeFilters.set(key.charAt(0).toUpperCase() + key.slice(1), val);
          c.classList.add('active');
        }
      }
      updateActiveFiltersUI();
      applyFilters();
    });
  });

  // Search form
  alumniSearchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    applyFilters();
  });

  // Requests slide-over
  function openRequestsPanel() {
    requestsPanel.setAttribute('aria-hidden','false');
    requestsPanel.style.transform = 'translateX(0)';
    renderRequests();
  }
  function closeRequestsPanel() {
    requestsPanel.setAttribute('aria-hidden','true');
    requestsPanel.style.transform = 'translateX(440px)';
  }

  if (requestsPanel) {
    requestsPanel.style.transform = 'translateX(440px)';
  }

  openRequests && openRequests.addEventListener('click', openRequestsPanel);
  closeRequests && closeRequests.addEventListener('click', closeRequestsPanel);

  // Tabs inside slide-over
  rtabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      rtabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.dataset.tab;
      if (tab === 'incoming') {
        incomingList.hidden = false;
        outgoingList.hidden = true;
      } else {
        incomingList.hidden = true;
        outgoingList.hidden = false;
      }
    });
  });

  function renderRequests() {
    incomingList.innerHTML = '';
    outgoingList.innerHTML = '';
    incomingRequests.forEach(r => {
      const item = document.createElement('div');
      item.className = 'request-item';
      item.innerHTML = `
        <img src="${r.avatar}" alt="${r.name}">
        <div class="request-body">
          <strong>${r.name}</strong>
          <div class="muted small">${r.message}</div>
        </div>
        <div class="request-actions">
          <button class="btn-primary accept" data-id="${r.id}">Accept</button>
          <button class="btn-outline decline" data-id="${r.id}">Decline</button>
        </div>
      `;
      item.querySelector('.accept').addEventListener('click', (e) => {
        e.currentTarget.textContent = 'Accepted';
        e.currentTarget.disabled = true;
        alert(`Accepted connection from ${r.name} (demo).`);
      });
      item.querySelector('.decline').addEventListener('click', (e) => {
        item.remove();
        alert(`Declined connection from ${r.name} (demo).`);
      });
      incomingList.appendChild(item);
    });

    outgoingRequests.forEach(r => {
      const item = document.createElement('div');
      item.className = 'request-item';
      item.innerHTML = `
        <img src="${r.avatar}" alt="${r.name}">
        <div class="request-body">
          <strong>${r.name}</strong>
          <div class="muted small">${r.status}</div>
        </div>
        <div class="request-actions">
          <button class="btn-outline cancel" data-id="${r.id}">Cancel</button>
          <button class="btn-ghost message" data-id="${r.id}">Message</button>
        </div>
      `;
      item.querySelector('.cancel').addEventListener('click', () => {
        item.remove();
        alert(`Cancelled request to ${r.name} (demo).`);
      });
      item.querySelector('.message').addEventListener('click', () => {
        alert(`Send personalized message to ${r.name} (demo).`);
      });
      outgoingList.appendChild(item);
    });
  }

  // initialize
  renderProfiles(profiles);
  updateActiveFiltersUI();
  copyYear && (copyYear.textContent = new Date().getFullYear());

  // Small UX: keyboard shortcut "/" to focus search
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      alumniSearch.focus();
    }
  });

})();