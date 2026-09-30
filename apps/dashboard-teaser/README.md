# Dashboard Teaser

Static SEO for the teaser is owned by `src/seo/dashboard-seo.ts`.

Vite injects the generated head metadata into `index.html` at `<!--dashboard-seo-head-->`.
The canonical URL uses:

- `VITE_PUBLIC_SITE_ORIGIN` when set.
- `VITE_BASE_PATH` when set.
- `https://marwes.io/` as the production default.

`robots.txt` lives in `public/`. The AI publication generator owns `sitemap.xml`,
`llms.txt`, and `public/ai/`; regenerate them with `pnpm ai-docs:generate` whenever
their README or artifact sources change. Generated sitemaps intentionally omit
wall-clock `<lastmod>` metadata.

## Promoting a component docs family

The single migration registry is `componentPagePresentation` in
`scripts/generate-dashboard-docs.mjs`. Add the family's recommended public
components and short recommendation there; the generator supplies the shared
page shell, framework API inventory, verified fixtures, and static HTML.

Only add a handcrafted showcase in `src/docs/components/showcases/` when it
explains behavior that the verified fixtures do not. Register it as a lazy
loader in `src/docs/components/family-showcases.ts`. Do not introduce a generic
variant matrix: family-specific examples should stay small and intentional.

From the repository root, regenerate and validate the promotion:

```sh
pnpm consumer-docs:generate
pnpm --filter "./apps/dashboard-teaser" test
pnpm --filter "./apps/dashboard-teaser" build
pnpm docs:consumer-check
```

The generated route should use the component-docs renderer, retain its static
HTML content without JavaScript, and pass the dashboard build and consumer-docs
checks.

Validation:

```sh
pnpm --filter "./apps/dashboard-teaser" test
pnpm --filter "./apps/dashboard-teaser" typecheck
pnpm --filter "./apps/dashboard-teaser" build
```
