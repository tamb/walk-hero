# Walk Hero

A walking game. The screen can stay awake while you play, and the same quest, minigames, and lock screen are still here.

## Scripts

- `npm start` — dev server at http://localhost:3000
- `npm test` — Vitest
- `npm run build` — production build in `dist/`
- `npm run preview` — serve the production build

The toolchain is [Vite+](https://viteplus.dev/) (`vp dev`, `vp test`, `vp build`, `vp check`). The npm scripts call the same commands.

## GitHub Pages

Pushes to `main` publish https://tamb.github.io/walk-hero/. The same workflow can be run by hand from **Actions → Deploy to GitHub Pages**.

The build uses `/walk-hero/` so scripts, the manifest, and the service worker resolve on that project URL. Local dev stays at http://localhost:3000.

The published site is a PWA: installable manifest, icons, and a service worker that precaches the app shell. The screen wake lock is requested from the lock button and requested again when you come back to the page, because browsers release it whenever the screen turns off.
