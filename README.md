# ⬡ APKVault — Self-Hosted APK Store

A fully functional Play Store-style website where anyone can upload and download Android APK files — no backend server needed.

---

## 📁 File Structure

```
apkstore/
├── index.html        ← Main store / browse page
├── upload.html       ← Upload a new APK
├── app.html          ← Individual app detail + download
├── css/
│   └── style.css     ← All styles
├── js/
│   ├── store.js      ← Browse, search, filter logic
│   ├── upload.js     ← Upload form logic
│   └── detail.js     ← App detail page logic
└── README.md
```

---

## 🚀 How to Deploy (Free)

### Option 1 — Netlify (Easiest, Recommended)
1. Go to https://netlify.com and sign up free
2. Click **"Add new site" → "Deploy manually"**
3. Drag the entire `apkstore/` folder into the upload box
4. Done! Netlify gives you a live URL instantly

### Option 2 — GitHub Pages
1. Create a free GitHub account at https://github.com
2. Create a new repository (public)
3. Upload all files keeping the folder structure
4. Go to Settings → Pages → select `main` branch → Save
5. Your site is live at `https://yourusername.github.io/repo-name`

### Option 3 — Vercel
1. Go to https://vercel.com
2. Import your GitHub repo or drag-and-drop
3. Deploy instantly

---

## 📱 How It Works

- **Storage**: All app data (metadata + APK files up to ~5MB) is saved in the browser's `localStorage`.
  - For larger APKs, the metadata is saved but the APK must be hosted externally (Google Drive, Dropbox, etc.)
- **No server needed**: Everything runs in the browser — pure HTML/CSS/JavaScript
- **Download counter**: Tracks how many times each APK has been downloaded

---

## ⚠️ Important Notes

### For users installing APKs:
1. Download the APK file
2. Go to **Settings → Security → Unknown sources** (or "Install unknown apps")
3. Enable installation for your browser
4. Open the downloaded file and tap **Install**

### Storage limits:
- `localStorage` holds ~5-10MB depending on the browser
- For APKs larger than ~5MB, only metadata is saved — you'll need to host the APK on Google Drive or similar and update the link manually

### For production use:
- Add a real backend (Node.js, Firebase, Supabase) to store large APK files
- Add user authentication for managing uploads
- Add virus scanning (VirusTotal API) before allowing downloads

---

## 🎨 Features

- ✅ Dark mode UI (Play Store inspired)
- ✅ Drag & drop APK upload
- ✅ App icon + screenshots upload
- ✅ Category filtering (Tools, Health, Games, Social, Productivity)
- ✅ Search by name, developer, description
- ✅ Download counter
- ✅ Install instructions on each app page
- ✅ Delete apps
- ✅ Demo app pre-loaded (NutriScan AI)
- ✅ Works offline (localStorage)
- ✅ Mobile responsive

---

Made with ❤️ — APKVault 2026
