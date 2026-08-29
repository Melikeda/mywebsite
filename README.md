# portfoliomell

Private personal folio for Melike Külahcı. One scrolling page (folio) plus a recruiter-flat view. Turkish and English. Paper / ink themes.

Bu depo **private**. Sır, token ve kişisel iletişim bilgisi commit edilmez.

## Stack

- Vite · React 19 · TypeScript
- Static host target: Vercel or Cloudflare Pages (free)
- Copy lives in `src/content/site.ts` — change text and links there first

## Local

```bash
npm install
npm run dev
```

Build check:

```bash
npm run build
npm run preview
```

## Content

Edit `src/content/site.ts` for name, links (LinkedIn, GitHub, Kaggle, Medium, university), projects, and TR/EN strings. Put a later CV PDF in `public/cv.pdf` and wire the door plate when ready.

## View modes

- **Folio** — full-viewport plates, scroll snap, scene rhythm
- **Flat** — same page, compact, for a 20-second recruiter scan
- **TR / EN** and **Paper / Ink** persist in `localStorage` (`mell.lang`, `mell.theme`, `mell.view`)

## Security

- No backend, no form processor, no analytics in v1
- `.env` is gitignored; `.env.example` documents that no secrets are needed
- `vercel.json` and `public/_headers` set CSP, HSTS, frame denial, referrer and permissions policy
- Theme boot lives in `public/theme-init.js` (no inline script) so CSP can stay `script-src 'self'`
- Dependabot watches npm weekly
- CI builds on push

Do not add API keys for GitHub/Kaggle widgets. Do not publish student numbers, phone, or a private email on the site unless you choose to.

## Deploy

Connect this private GitHub repo to Vercel or Cloudflare Pages. Production branch: `main`. Preview deployments are enough until a custom domain exists.

After the first production URL, check [securityheaders.com](https://securityheaders.com).
