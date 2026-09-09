# Cloudflare Pages deployment

Connect the private GitHub repository to Cloudflare Pages.

- Framework preset: None
- Build command: `exit 0`
- Build output directory: `/` (repository root)
- Production branch: `main`

After deployment, send the `*.pages.dev` URL back to ChatGPT so `robots.txt` and a real absolute `sitemap.xml` can be added.

Do not put Cloudflare Access/password protection in front of `/wm/*`; public AI crawlers must be able to read resolver pages.
