// feed.js — small front-end demo: auth bridge, posting, interactions, quick nav
(function () {
  const DEMO_KEY = 'auth_demo';
  if (!localStorage.getItem(DEMO_KEY)) {
    // Not logged in in demo mode — redirect to login
    setTimeout(() => window.location.href = 'index.html', 300);
    return;
  }

  localStorage.setItem('demo_last_page', 'feed.html');

  const postSubmit = document.getElementById('postSubmit');
  const postText = document.getElementById('postText');
  const feedList = document.getElementById('feedList');
  const composerFeedback = document.getElementById('composerFeedback');
  const signOutLeft = document.getElementById('signOutLeft');
  const completeProfile = document.getElementById('completeProfile');

  const samplePosts = [
    {
      id: 'p1',
      author: 'Dr. Emma Smith',
      avatar: 'https://i.pravatar.cc/64?img=65',
      title: 'Professor of Data Science',
      company: 'Univ. of Example',
      verified: true,
      time: '2h',
      text: 'We are looking for mentors for the upcoming mentorship program. If you can spare 2 hours a week, please sign up! #Mentorship #Alumni',
      media: null,
      likes: 12,
      comments: 3,
      bookmarked: false
    },
    {
      id: 'p2',
      author: 'Amy Chen',
      avatar: 'https://i.pravatar.cc/64?img=12',
      title: 'Data Analyst',
      company: 'DataAI',
      verified: false,
      time: '1d',
      text: 'Shared my project: interactive dashboard for civic data visualization. Check out the preview below. #DataViz #Portfolio',
      media: 'https://images.unsplash.com/photo-1526378729793-0c4b8b7e2b4e?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=5a0e2e3b8d9fdd0b',
      likes: 34,
      comments: 8,
      bookmarked: true
    }
  ];

  let posts = [...samplePosts];

  function createPostElement(post) {
    const root = document.createElement('article');
    root.className = 'post-card';
    root.dataset.id = post.id;

    root.innerHTML = `
      <div class="post-head">
        <img src="${post.avatar}" alt="${post.author}">
        <div class="post-meta">
          <div><span class="name">${post.author}</span>${post.verified ? '<span class="verified-badge">Verified</span>' : ''}</div>
          <div class="meta-sub">${post.title} • ${post.company} · <span class="muted small">${post.time} ago</span></div>
        </div>
        <button class="action-btn report" title="Report">⚑</button>
      </div>

      <div class="post-body">${escapeHtml(post.text)}</div>

      ${post.media ? `<div class="post-media"><img src="${post.media}" alt="Post media"></div>` : ''}

      <div class="post-actions">
        <button class="action-btn like" aria-pressed="false">❤ <span class="count">${post.likes}</span></button>
        <button class="action-btn comment">💬 <span class="count">${post.comments}</span></button>
        <button class="action-btn share">🔗 Share</button>
        <button class="action-btn bookmark ${post.bookmarked ? 'active' : ''}">🔖</button>
      </div>

      <div class="comments" hidden></div>
    `;

    root.querySelector('.like').addEventListener('click', () => toggleLike(root));
    root.querySelector('.comment').addEventListener('click', () => toggleComment(root));
    root.querySelector('.bookmark').addEventListener('click', (e) => toggleBookmark(e.currentTarget));
    root.querySelector('.report').addEventListener('click', () => {
      alert('Report submitted. Thank you for helping keep the community safe.');
    });

    return root;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML.replace(/\n/g, '<br>');
  }

  function renderInitialFeed() {
    if (!feedList) return;
    feedList.innerHTML = '';
    posts.forEach((post) => feedList.appendChild(createPostElement(post)));
  }

  function toggleLike(postEl) {
    const btn = postEl.querySelector('.like');
    const countEl = btn.querySelector('.count');
    const current = parseInt(countEl.textContent || '0', 10);
    const pressed = btn.getAttribute('aria-pressed') === 'true';
    if (pressed) {
      btn.setAttribute('aria-pressed', 'false');
      btn.classList.remove('active');
      countEl.textContent = Math.max(0, current - 1);
    } else {
      btn.setAttribute('aria-pressed', 'true');
      btn.classList.add('active');
      countEl.textContent = current + 1;
    }
  }

  function toggleBookmark(button) {
    button.classList.toggle('active');
  }

  function toggleComment(postEl) {
    const comments = postEl.querySelector('.comments');
    if (comments.hidden) {
      comments.hidden = false;
      comments.innerHTML = commentInputTemplate();
      const input = comments.querySelector('textarea');
      const send = comments.querySelector('button.send-comment');
      send.addEventListener('click', () => {
        const value = input.value.trim();
        if (!value) return;
        const list = comments.querySelector('.comment-list');
        const li = document.createElement('div');
        li.className = 'comment-item';
        li.innerHTML = `<strong>You</strong> <span class="muted small">now</span><div>${escapeHtml(value)}</div>`;
        list.prepend(li);
        input.value = '';
      });
      input.focus();
    } else {
      comments.hidden = true;
    }
  }

  function commentInputTemplate() {
    return `
      <div class="comment-list" style="margin-bottom:8px"></div>
      <textarea placeholder="Write a comment..." rows="2" style="width:100%;padding:8px;border-radius:10px;border:1px solid rgba(15,23,42,0.06)"></textarea>
      <button class="btn-primary send-comment" style="margin-top:8px">Post Comment</button>
    `;
  }

  function addPost(text) {
    const displayName = localStorage.getItem('demo_user_name') || 'Jordan Walker';
    const newPost = {
      id: `p${Date.now()}`,
      author: displayName,
      avatar: 'https://i.pravatar.cc/64?img=32',
      title: 'Alumni Member',
      company: 'AlumNet',
      verified: false,
      time: 'now',
      text,
      media: null,
      likes: 0,
      comments: 0,
      bookmarked: false
    };

    posts = [newPost, ...posts];
    renderInitialFeed();
  }

  function signOut() {
    localStorage.removeItem(DEMO_KEY);
    localStorage.removeItem('demo_user_name');
    window.location.href = 'index.html';
  }

  renderInitialFeed();

  postSubmit?.addEventListener('click', () => {
    const value = postText.value.trim();
    if (!value) {
      composerFeedback.textContent = 'Write something before sharing.';
      return;
    }

    addPost(value);
    postText.value = '';
    composerFeedback.textContent = 'Your post is live.';
  });

  signOutLeft?.addEventListener('click', signOut);
  completeProfile?.addEventListener('click', () => {
    composerFeedback.textContent = 'Complete your profile from the dashboard to unlock more opportunities.';
  });
})();