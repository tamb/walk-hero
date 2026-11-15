# Walk Hero

A walking game. The screen can stay awake while you play, and the same quest, minigames, and lock screen are still here.

## Scripts

- `npm start` — dev server at http://localhost:3000
- `npm test` — Vitest
- `npm run build` — production build in `dist/`
- `npm run preview` — serve the production build

The toolchain is [Vite+](https://viteplus.dev/) (`vp dev`, `vp test`, `vp build`, `vp check`). The npm scripts call the same commands.

## GitHub Pages

Deploy is manual. In GitHub, open **Actions → Deploy to GitHub Pages → Run workflow**.

The default base path is `/`, which matches the `walkhero.io` custom domain (`public/CNAME`). For a project site without that domain, set the workflow input to `/walk-hero/`.

The published site is a PWA: installable manifest, icons, and a service worker that precaches the app shell. The screen wake lock is requested from the lock button and requested again when you come back to the page, because browsers release it whenever the screen turns off.
