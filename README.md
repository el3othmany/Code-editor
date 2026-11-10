# OMNI CODE STUDIO
Browser IDE (Monaco, xterm.js, Pyodide, IndexedDB, Web Workers). No build step; all asset paths are relative.
Deploy: push to `main`, then Settings → Pages → Source: **GitHub Actions**. Local: `npx serve .`
Limits: browser sandbox only (no real shell, no network servers, no npm). Python needs a first-time ~10 MB download. Text files only for upload/ZIP. Libraries load from jsDelivr (internet required).
