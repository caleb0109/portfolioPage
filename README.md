# Caleb Jeon — Portfolio

## Run locally

- `npm ci`
- `npm run dev`
- Open the URL Vite prints (for example `http://127.0.0.1:5173`)

## Build + preview production

- `npm run build`
- `npm run preview`

## Troubleshooting blank page / MIME errors

If you see:

- `Expected a JavaScript-or-Wasm module script ... MIME type of "text/jsx"`
- `Unexpected token 'export'`

you are serving the raw source `index.html` with a generic static server or browser extension.

Use Vite (`npm run dev`) or deploy the built `dist` output only.

The console errors from `chrome-extension://...` are from browser extensions, not this app.