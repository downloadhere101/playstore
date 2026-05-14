/* detail.js — renders individual app detail page */

function getApps() {
  try { return JSON.parse(localStorage.getItem('apkvault_apps') || '[]'); }
  catch(e) { return []; }
}

function escHtml(str) {
  return String(str || '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function getCategoryEmoji(cat) {
  const map = { tools: '🔧', health: '🥗', games: '🎮', social: '💬', productivity: '📋' };
  return map[cat] || '📦';
}

function formatDate(iso) {
  if (!iso) return 'Unknown';
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function renderDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const page = document.getElementById('detailPage');

  if (!id) {
    page.innerHTML = notFound();
    return;
  }

  const apps = getApps();
  const app = apps.find(a => a.id === id);

  if (!app) {
    page.innerHTML = notFound();
    return;
  }

  // Update page title
  document.title = `${app.name} — APKVault`;

  const iconHtml = app.iconData
    ? `<img src="${app.iconData}" alt="${escHtml(app.name)}" />`
    : getCategoryEmoji(app.category);

  const screenshotsHtml = app.screenshots && app.screenshots.length
    ? `<div class="detail-screenshots">
        ${app.screenshots.map((s, i) => `<img src="${s}" alt="Screenshot ${i+1}" />`).join('')}
      </div>`
    : '';

  const downloadHtml = app.apkData
    ? `<a class="download-btn" href="${app.apkData}" download="${escHtml(app.apkName || app.name + '.apk')}" onclick="incrementDownload('${app.id}')">
        ⬇ Download APK
       </a>`
    : `<div style="background:rgba(255,82,82,0.08);border:1px solid rgba(255,82,82,0.2);color:rgba(255,120,120,0.9);
        padding:12px 18px;border-radius:10px;font-size:13px;">
        ⚠ APK file was too large to store locally. The developer needs to host it externally.
       </div>`;

  page.innerHTML = `
    <a href="index.html" style="display:inline-flex;align-items:center;gap:6px;color:var(--muted);font-size:13px;margin-bottom:28px;transition:color 0.2s;"
       onmouseover="this.style.color='#fff'" onmouseout="this.style.color=''">
      ← Back to store
    </a>

    <div class="detail-hero">
      <div class="detail-icon">${iconHtml}</div>
      <div class="detail-info">
        <h1>${escHtml(app.name)}</h1>
        <div class="detail-dev">by ${escHtml(app.developer || 'Unknown')}</div>
        <div class="detail-meta">
          <span class="meta-chip">v${escHtml(app.version || '1.0')}</span>
          <span class="meta-chip">${escHtml(app.category)}</span>
          <span class="meta-chip">${escHtml(app.apkSize || 'Unknown size')}</span>
          <span class="meta-chip">⬇ ${app.downloads || 0} downloads</span>
          <span class="meta-chip">📅 ${formatDate(app.uploadedAt)}</span>
        </div>
        ${downloadHtml}
      </div>
    </div>

    ${screenshotsHtml}

    <div class="detail-section">
      <h2>About this app</h2>
      <p>${escHtml(app.description || 'No description provided.')}</p>
    </div>

    <div class="detail-section">
      <h2>How to install</h2>
      <div class="install-steps">
        <ol>
          <li>Tap <strong>Download APK</strong> above to save the file to your device.</li>
          <li>Go to <strong>Settings → Security</strong> (or <strong>Privacy</strong> on newer Android).</li>
          <li>Enable <strong>"Install unknown apps"</strong> for your browser or file manager.</li>
          <li>Open the downloaded <strong>.apk</strong> file and tap <strong>Install</strong>.</li>
          <li>Launch the app from your home screen. Enjoy!</li>
        </ol>
      </div>
    </div>

    <div style="display:flex;gap:12px;margin-top:16px;flex-wrap:wrap;">
      <button onclick="deleteApp('${app.id}')"
        style="background:rgba(255,82,82,0.08);color:rgba(255,120,120,0.9);
               border:1px solid rgba(255,82,82,0.2);padding:9px 20px;
               border-radius:40px;cursor:pointer;font-size:13px;font-family:inherit;">
        🗑 Remove this app
      </button>
    </div>
  `;
}

function incrementDownload(id) {
  const apps = getApps();
  const app = apps.find(a => a.id === id);
  if (app) {
    app.downloads = (app.downloads || 0) + 1;
    try { localStorage.setItem('apkvault_apps', JSON.stringify(apps)); } catch(e) {}
  }
}

function deleteApp(id) {
  if (!confirm('Remove this app from APKVault?')) return;
  const apps = getApps().filter(a => a.id !== id);
  try { localStorage.setItem('apkvault_apps', JSON.stringify(apps)); } catch(e) {}
  window.location.href = 'index.html';
}

function notFound() {
  return `
    <div class="not-found">
      <div style="font-size:56px;margin-bottom:16px;">🔍</div>
      <h2>App not found</h2>
      <p>This app may have been removed or the link is invalid.</p>
      <a href="index.html">← Back to store</a>
    </div>
  `;
}

renderDetail();
