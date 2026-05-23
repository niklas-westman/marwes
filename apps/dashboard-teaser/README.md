# Dashboard Teaser

Static SEO for the teaser is owned by `src/seo/dashboard-seo.ts`.

Vite injects the generated head metadata into `index.html` at `<!--dashboard-seo-head-->`.
The canonical URL uses:

- `VITE_PUBLIC_SITE_ORIGIN` when set.
- `VITE_BASE_PATH` when set.
- `https://d3hobet9plpuvm.cloudfront.net/dashboard-teaser/latest/` as the current fallback.

Validation:

```sh
pnpm --filter "./apps/dashboard-teaser" test
pnpm --filter "./apps/dashboard-teaser" typecheck
pnpm --filter "./apps/dashboard-teaser" build
```

`robots.txt` and `sitemap.xml` are intentionally not app-owned yet. Add them only after
the dashboard teaser deployment origin and site-root ownership are confirmed.
