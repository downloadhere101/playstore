/* store.js — loads apps from localStorage and renders them */

let currentCategory = 'all';

function getApps() {
  try {
    return JSON.parse(localStorage.getItem('apkvault_apps') || '[]');
  } catch(e) { return []; }
}

function filterApps() {
  const q = (document.getElementById('searchInput').value || '').toLowerCase().trim();
  const apps = getApps();
  const filtered = apps.filter(app => {
    const matchCat = currentCategory === 'all' || app.category === currentCategory;
    const matchQ = !q ||
      app.name.toLowerCase().includes(q) ||
      (app.description || '').toLowerCase().includes(q) ||
      (app.developer || '').toLowerCase().includes(q);
    return matchCat && matchQ;
  });
  renderApps(filtered);
}

function setCategory(cat, btn) {
  currentCategory = cat;
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  filterApps();
}

function renderApps(apps) {
  const grid = document.getElementById('appGrid');
  const empty = document.getElementById('emptyState');
  const countBadge = document.getElementById('app-count');
  countBadge.textContent = apps.length + ' app' + (apps.length !== 1 ? 's' : '');

  if (!apps.length) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  grid.innerHTML = apps.map(app => {
    const iconHtml = app.iconData
      ? `<img src="${app.iconData}" alt="${escHtml(app.name)}" />`
      : `<span>${getCategoryEmoji(app.category)}</span>`;

    return `
    <div class="app-card" onclick="openApp('${app.id}')">
      <div class="app-card-banner">
        ${app.screenshots && app.screenshots[0]
          ? `<img src="${app.screenshots[0]}" alt="" />`
          : `<span style="font-size:32px;opacity:0.15;">${getCategoryEmoji(app.category)}</span>`}
      </div>
      <div class="app-card-body">
        <div class="app-card-row">
          <div class="app-icon-small">${iconHtml}</div>
          <div>
            <div class="app-card-name">${escHtml(app.name)}</div>
            <div class="app-card-dev">${escHtml(app.developer || 'Unknown dev')}</div>
          </div>
        </div>
        <div class="app-card-desc">${escHtml(app.description || '')}</div>
        <div class="app-card-footer">
          <span class="cat-tag">${escHtml(app.category)}</span>
          <span class="dl-count">⬇ ${app.downloads || 0}</span>
        </div>
      </div>
    </div>`;
  }).join('');
}

function openApp(id) {
  window.location.href = `app.html?id=${id}`;
}

function getCategoryEmoji(cat) {
  const map = { tools: '🔧', health: '🥗', games: '🎮', social: '💬', productivity: '📋' };
  return map[cat] || '📦';
}

function escHtml(str) {
  return String(str || '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

/* Seed a demo app (NutriScan AI) if store is empty */
function seedDemo() {
  const apps = getApps();
  if (apps.length === 0) {
    const demo = {
      id: 'demo_nutriscan',
      name: 'NutriScan AI',
      developer: 'APKVault Demo',
      version: '1.0.0',
      category: 'health',
      description: 'Snap a photo of any food and instantly get calories, protein, carbs, and fat breakdowns. Powered by Groq AI Vision with NutriBot assistant.',
      iconData: null,
      screenshots: [],
      apkName: 'nutriscan-ai-v1.apk',
      apkSize: '8.4 MB',
      apkData: null,
      downloads: 142,
      uploadedAt: new Date().toISOString()
    };
    localStorage.setItem('apkvault_apps', JSON.stringify([demo]));
  }
}

seedDemo();
filterApps();
