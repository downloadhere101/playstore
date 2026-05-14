/* upload.js — handles APK upload form */

let selectedApkFile = null;
let selectedIconData = null;
let screenshotDataList = [];

/* ===== DROP ZONE ===== */
const dropZone = document.getElementById('dropZone');

dropZone.addEventListener('click', () => {
  if (!selectedApkFile) document.getElementById('apkFile').click();
});

dropZone.addEventListener('dragover', e => {
  e.preventDefault();
  dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));

dropZone.addEventListener('drop', e => {
  e.preventDefault();
  dropZone.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file) processApkFile(file);
});

function handleFileSelect(input) {
  if (input.files[0]) processApkFile(input.files[0]);
}

function processApkFile(file) {
  if (!file.name.endsWith('.apk') && file.type !== 'application/vnd.android.package-archive') {
    alert('Please select a valid .apk file.');
    return;
  }
  if (file.size > 500 * 1024 * 1024) {
    alert('File too large. Max size is 500 MB.');
    return;
  }
  selectedApkFile = file;
  document.getElementById('dropInner').style.display = 'none';
  const sel = document.getElementById('fileSelected');
  sel.style.display = 'flex';
  document.getElementById('fileName').textContent = file.name;
  document.getElementById('fileSize').textContent = formatSize(file.size);

  // Auto-fill app name from filename
  const nameField = document.getElementById('appName');
  if (!nameField.value) {
    nameField.value = file.name.replace('.apk', '').replace(/[-_]/g, ' ').trim();
  }
}

function removeFile() {
  selectedApkFile = null;
  document.getElementById('apkFile').value = '';
  document.getElementById('dropInner').style.display = 'block';
  document.getElementById('fileSelected').style.display = 'none';
}

/* ===== ICON PREVIEW ===== */
function previewIcon(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    selectedIconData = e.target.result;
    const preview = document.getElementById('iconPreview');
    const placeholder = document.getElementById('iconPlaceholder');
    preview.src = selectedIconData;
    preview.style.display = 'block';
    placeholder.style.display = 'none';
  };
  reader.readAsDataURL(file);
}

/* ===== SCREENSHOTS ===== */
function addScreenshots(input) {
  const files = Array.from(input.files);
  const remaining = 4 - screenshotDataList.length;
  const toAdd = files.slice(0, remaining);
  toAdd.forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      screenshotDataList.push(e.target.result);
      renderScreenshots();
    };
    reader.readAsDataURL(file);
  });
  input.value = '';
}

function renderScreenshots() {
  const grid = document.getElementById('screenshotsGrid');
  let html = screenshotDataList.map((data, i) => `
    <div class="ss-wrap">
      <img class="ss-preview" src="${data}" alt="Screenshot ${i+1}" />
      <button class="ss-remove" onclick="removeScreenshot(${i})">✕</button>
    </div>
  `).join('');
  if (screenshotDataList.length < 4) {
    html += `<div class="ss-slot" onclick="document.getElementById('ssInput').click()">
      <span>+</span><small>Add screenshot</small>
    </div>`;
  }
  grid.innerHTML = html;
}

function removeScreenshot(index) {
  screenshotDataList.splice(index, 1);
  renderScreenshots();
}

/* ===== FORM SUBMIT ===== */
function handleUpload(e) {
  e.preventDefault();

  if (!selectedApkFile) {
    alert('Please select an APK file first.');
    return;
  }

  const submitBtn = document.getElementById('submitBtn');
  const submitLabel = document.getElementById('submitLabel');
  const spinner = document.getElementById('spinner');
  submitBtn.disabled = true;
  submitLabel.textContent = 'Publishing…';
  spinner.style.display = 'block';

  // Read APK as base64 (for demo purposes — in production use a real server)
  const reader = new FileReader();
  reader.onload = e => {
    const apkData = e.target.result;
    saveApp(apkData);
  };
  reader.onerror = () => {
    // If file is too big to read into memory, save metadata only
    saveApp(null);
  };

  // For large files, skip base64 reading and just save metadata
  if (selectedApkFile.size > 20 * 1024 * 1024) {
    saveApp(null); // too large for localStorage, save metadata only
  } else {
    reader.readAsDataURL(selectedApkFile);
  }
}

function saveApp(apkData) {
  const apps = getApps();
  const id = 'app_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);

  const app = {
    id,
    name: document.getElementById('appName').value.trim(),
    developer: document.getElementById('appDev').value.trim() || 'Unknown',
    version: document.getElementById('appVersion').value.trim() || '1.0',
    category: document.getElementById('appCategory').value,
    description: document.getElementById('appDesc').value.trim(),
    iconData: selectedIconData,
    screenshots: [...screenshotDataList],
    apkName: selectedApkFile.name,
    apkSize: formatSize(selectedApkFile.size),
    apkData: apkData,
    downloads: 0,
    uploadedAt: new Date().toISOString()
  };

  apps.unshift(app);

  try {
    localStorage.setItem('apkvault_apps', JSON.stringify(apps));
  } catch(err) {
    // localStorage quota exceeded — save without apkData
    app.apkData = null;
    app.apkNote = 'APK too large for local storage. Host the file externally and paste the URL.';
    apps[0] = app;
    try {
      localStorage.setItem('apkvault_apps', JSON.stringify(apps));
    } catch(e2) {
      alert('Storage full. Please clear some apps first.');
      resetSubmit();
      return;
    }
  }

  setTimeout(() => {
    document.getElementById('modalMsg').textContent =
      `"${app.name}" is now live on APKVault!`;
    document.getElementById('successModal').style.display = 'flex';
    resetSubmit();
  }, 1200);
}

function resetSubmit() {
  const submitBtn = document.getElementById('submitBtn');
  const submitLabel = document.getElementById('submitLabel');
  const spinner = document.getElementById('spinner');
  submitBtn.disabled = false;
  submitLabel.textContent = 'Publish App';
  spinner.style.display = 'none';
}

function closeModal() {
  document.getElementById('successModal').style.display = 'none';
  document.getElementById('uploadForm').reset();
  selectedApkFile = null;
  selectedIconData = null;
  screenshotDataList = [];
  document.getElementById('dropInner').style.display = 'block';
  document.getElementById('fileSelected').style.display = 'none';
  document.getElementById('iconPreview').style.display = 'none';
  document.getElementById('iconPlaceholder').style.display = 'flex';
  renderScreenshots();
}

function getApps() {
  try { return JSON.parse(localStorage.getItem('apkvault_apps') || '[]'); }
  catch(e) { return []; }
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
