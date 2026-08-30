# Security

This site is a static folio. There is no backend, no form processor, and no
analytics. If nothing secret is committed, there is almost nothing to steal.

## Report a vulnerability

Please **do not** open a public issue for a security finding.

Use GitHub’s private vulnerability reporting on this repository, or email
[m.edakulahci@mail.com](mailto:m.edakulahci@mail.com) with:

- what you found
- the page or file
- steps to reproduce
- a suggested fix if you have one

You should hear back within a few days.

## What this repo will not contain

- API keys, tokens, cookies, or private keys
- `.env` files (only `.env.example`, which documents that no secrets are needed)
- phone numbers, student numbers, or private addresses
- third-party widgets that need a secret to render

Copy and links live in `src/content/site.ts`. The public email on the site is
intentional contact information.

## What the site already does

| Control | Where |
| --- | --- |
| Content-Security-Policy (`script-src 'self'`) | `vercel.json`, `public/_headers` |
| Theme boot without inline script | `public/theme-init.js` |
| HSTS, frame denial, nosniff, referrer, permissions | same header files |
| Secrets ignored | `.gitignore` |
| Dependency alerts | Dependabot (npm + GitHub Actions) |
| Build check | `.github/workflows/ci.yml` |
| Secret scanning + push protection | GitHub repository settings |

Map tiles (MapLibre / ArcGIS) are the only third-party network hosts allowed
in CSP. Do not add new origins without updating both header files.

## After a production URL exists

Check the live headers at [securityheaders.com](https://securityheaders.com).
