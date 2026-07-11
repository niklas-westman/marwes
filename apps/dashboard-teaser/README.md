# Dashboard Teaser

Static SEO for the teaser is owned by `src/seo/dashboard-seo.ts`.

Vite injects the generated head metadata into `index.html` at `<!--dashboard-seo-head-->`.
The canonical URL uses:

- `VITE_PUBLIC_SITE_ORIGIN` when set.
- `VITE_BASE_PATH` when set.
- `https://marwes.io/` as the production default.

`robots.txt` and `sitemap.xml` live in `public/` and ship at `marwes.io/robots.txt` and
`marwes.io/sitemap.xml`. Update `sitemap.xml`'s `<lastmod>` on significant content
changes.

Validation:

```sh
pnpm --filter "./apps/dashboard-teaser" test
pnpm --filter "./apps/dashboard-teaser" typecheck
pnpm --filter "./apps/dashboard-teaser" build
```
