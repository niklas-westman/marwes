# Implementation Guide: Dashboard Teaser SEO and Searchability

Created: 2026-05-23
Status: implemented with sitemap/robots deferred
Scope: `apps/dashboard-teaser`
Reference inspiration: `/Users/niklaswestman/Documents/sprout/web/sprouttechnology.github.io/SEO_IMPLEMENTATION_GUIDE.md`

---

## Living Document

Update this guide while implementing:

- [ ] Check off tasks as they are completed.
- [ ] Add notes when reality diverges from the plan.
- [ ] Split phases if a phase becomes too large.
- [ ] Mark skipped tasks with a short reason.
- [ ] Record validation results after each phase.

Last updated: 2026-05-23
Current phase: 7 complete

---

## 0. Project Discovery

### Discovery Summary

| Variable | Value |
|---|---|
| App | `apps/dashboard-teaser` |
| Package manager | `pnpm` workspace |
| Framework | React 19 + Vite |
| Styling | `styled-components` + `@marwes-ui/react` |
| Route model | Single static app route today |
| Entry HTML | `apps/dashboard-teaser/index.html` |
| Main entry | `apps/dashboard-teaser/src/main.tsx` |
| Root component | `apps/dashboard-teaser/src/App.tsx` |
| Current SEO handling | Bare static `<title>` only |
| Test command | `pnpm --filter "./apps/dashboard-teaser" test` |
| Build command | `pnpm --filter "./apps/dashboard-teaser" build` |
| Typecheck command | `pnpm --filter "./apps/dashboard-teaser" typecheck` |
| Existing app-specific test | `check:button-variants` only |
| Current base path | `VITE_BASE_PATH ?? "/dashboard-teaser/latest/"` |

### Current SEO Handling

`apps/dashboard-teaser/index.html` currently contains:

- HTML language set to English.
- Charset and viewport meta.
- Vite favicon reference.
- Static title: `Marwes — Design with intention`.
- Font preconnects and font stylesheet.
- Empty `#root` before React runs.

Current searchability gaps:

- No meta description.
- No canonical URL policy.
- No robots meta policy.
- No Open Graph or Twitter card metadata.
- No JSON-LD.
- No static semantic body content before React executes.
- No sitemap or robots strategy for the dashboard teaser deployment path.
- No automated tests that protect generated or static head metadata.
- No explicit search-intent contract for Marwes, the dashboard teaser, target audience, or product terms.

### Existing Visible Product Signals

The visible app currently positions Marwes as:

- A design system / UI library teaser.
- Multi-framework: React, Vue, Svelte.
- Framework-agnostic, static CSS, type-safe, accessibility-first, and agent-readable.
- Installation-oriented, with manual and AI install prompts.
- Component showcase for Marwes UI primitives and product surfaces.

The SEO work should match those visible claims. Do not add search terms or schema for features that are not visible or true in the dashboard teaser.

### Validation Stack

| Purpose | Command |
|---|---|
| Dashboard teaser test | `pnpm --filter "./apps/dashboard-teaser" test` |
| Dashboard teaser typecheck | `pnpm --filter "./apps/dashboard-teaser" typecheck` |
| Dashboard teaser build | `pnpm --filter "./apps/dashboard-teaser" build` |
| Root changed-file check | `pnpm check:changed` |
| Browser verification | `pnpm --filter "./apps/dashboard-teaser" dev`, then inspect with Playwright/browser |

Baseline validation:

- [x] Run before code changes.
- [x] Record failures before implementation.

Baseline result, 2026-05-23:

- `pnpm --filter "./apps/dashboard-teaser" test` passed.
- `pnpm --filter "./apps/dashboard-teaser" typecheck` passed.
- `pnpm --filter "./apps/dashboard-teaser" build` passed.

---

## 1. Architecture Contract

### Problem Statement

Upgrade `apps/dashboard-teaser` so search engines, social preview tools, AI crawlers, and static consumers can understand the Marwes teaser before React executes, while keeping the implementation scoped to the dashboard teaser app.

### Chosen Approach

Use a small app-local SEO contract instead of introducing a broad repo SEO system. The dashboard teaser has one route today, so start with typed metadata and pure render helpers that can support more routes later without overbuilding.

This mirrors the useful parts of the Sprout SEO plan:

- One source of truth for page metadata.
- Tests for head tags and schema.
- Generated or static artifact validation.
- Static semantic content in the HTML body.

It deliberately does not copy Sprout's localized multi-route model because `dashboard-teaser` does not need that yet.

### Architecture Boundaries

| Layer | Owns | Does NOT Own |
|---|---|---|
| `src/seo/dashboard-seo.ts` | Typed SEO copy, canonical URL, social metadata, JSON-LD payloads, static semantic summary inputs | Filesystem writes, React UI rendering |
| `index.html` or generator output | Initial head tags and pre-React semantic body | Product copy decisions |
| Optional `scripts/generate-dashboard-seo.mjs` | Rendering static SEO artifacts if static HTML becomes too hard to maintain manually | Broad repo SEO for other apps |
| `src/App.tsx` and sections | Visible product experience | Hidden crawler-only copy |
| Tests | Metadata budgets, required head tags, schema truthfulness, static body presence | External search console validation |

### Non-Negotiables

- [ ] No changes to `/Users/niklaswestman/Documents/sprout/web/sprouttechnology.github.io`.
- [ ] Keep all implementation inside `apps/dashboard-teaser` unless a reusable repo script is clearly justified.
- [ ] Do not add hidden keyword stuffing.
- [ ] Static body copy must match visible page content.
- [ ] Canonical URL must account for the deployed base path.
- [ ] JSON-LD must truthfully describe Marwes as software/design-system tooling, not a generic company site.
- [ ] Keep the Vite app working locally and in production.
- [ ] Do not modify unrelated dirty files in `apps/dashboard-teaser`.

Implementation result:

- [x] No changes to `/Users/niklaswestman/Documents/sprout/web/sprouttechnology.github.io`.
- [x] Implementation stayed inside `apps/dashboard-teaser`.
- [x] No hidden keyword stuffing was added.
- [x] Static body copy matches visible page content.
- [x] Canonical URL uses `VITE_PUBLIC_SITE_ORIGIN` + `VITE_BASE_PATH`, with a CloudFront fallback.
- [x] JSON-LD is limited to `SoftwareApplication` and `WebSite`.
- [x] Vite app validated locally and in production build.
- [x] Existing dirty section files were not edited by this pass.

---

## 2. Search Intent Contract

### Target Search Intent

| Field | Contract |
|---|---|
| Product/category | Marwes UI, design system, React/Vue/Svelte component library, type-safe UI primitives |
| Audience | Frontend engineers, design-system maintainers, AI-assisted product builders, teams evaluating UI libraries |
| Pains | Inconsistent UI primitives, weak accessibility contracts, framework divergence, agent-unfriendly component APIs |
| Alternatives | design system, UI component library, React component library, Vue component library, Svelte component library, shadcn alternative, Radix alternative, design tokens |
| Geography | Global / English-language product page |
| Conversion goal | Move qualified visitors to docs, GitHub, Storybook, or installation |
| Out of scope | Generic consultancy SEO, unrelated Sprout copy, claims about production adoption that are not visible or verified |

### Initial Metadata Draft

| Field | Draft |
|---|---|
| Title | `Marwes UI | AI-friendly framework-agnostic components` |
| Description | `Build AI-friendly frontend components with Marwes UI: framework-agnostic React, Vue, and Svelte adapters, static CSS, and adjustable typed themes.` |
| Social title | `Marwes UI | AI-friendly frontend components` |
| Social description | `Framework-agnostic UI components with AI-readable contracts, static CSS, and typed theme variables for plain CSS, CSS Modules, and CSS-in-JS.` |
| Site name | `Marwes UI` |
| Image alt | `Marwes UI dashboard teaser showing component previews and installation controls` |

Budget checks:

- [x] Title should be roughly <= 60 characters, or consciously accepted if brand/category clarity wins.
- [x] Description should target 120-160 characters.
- [x] Social description should be <= 200 characters.

Positioning refinement, 2026-05-23:

- Search copy now emphasizes Marwes as a framework-agnostic component system, not only a multi-framework package set.
- Metadata and JSON-LD include AI-friendly frontend components, semantic contracts, static CSS, CSS variables, adjustable typed themes, and CSS-framework-compatible usage through plain CSS, CSS Modules, CSS-in-JS, and Tailwind-style config.

---

## 3. Implementation Phases

### Phase 1: App-Local SEO Contract and Tests

Goal: Create a typed metadata source and tests before changing public output.
Depends on: Baseline validation.
Status: Done

#### Outputs

- `apps/dashboard-teaser/src/seo/dashboard-seo.ts`
- `apps/dashboard-teaser/src/seo/dashboard-seo.test.ts`
- Metadata budget tests.
- Canonical URL helper that respects `VITE_BASE_PATH` or explicit production origin configuration.

#### Tasks

- [x] Create a typed `dashboardSeo` object for title, description, social metadata, canonical path, and JSON-LD inputs.
- [x] Add helper functions for canonical URL, Open Graph values, Twitter values, and JSON-LD payloads.
- [x] Add or update an app-local test entrypoint so SEO tests run under `pnpm --filter "./apps/dashboard-teaser" test` without replacing `check:button-variants`.
- [x] Add metadata budget tests.
- [x] Add tests that assert the search-intent terms are present without requiring exact copy everywhere.
- [x] Decide the production origin source: `VITE_PUBLIC_SITE_ORIGIN` with `https://d3hobet9plpuvm.cloudfront.net` fallback.

#### Validation

- [x] `pnpm --filter "./apps/dashboard-teaser" test`
- [x] `pnpm --filter "./apps/dashboard-teaser" typecheck`

### Phase 2: Static Head Metadata

Goal: Add reliable head metadata to the dashboard teaser entry page.
Depends on: Phase 1.
Status: Done

#### Outputs

- Updated `apps/dashboard-teaser/index.html`, or generated equivalent.
- Required SEO head tags covered by tests.

#### Tasks

- [x] Add title and meta description from the SEO contract.
- [x] Add canonical link for the dashboard teaser URL.
- [x] Add robots meta: `index,follow,max-image-preview:large`, unless deployment should remain private.
- [x] Replace the Vite favicon reference with a real Marwes asset if one exists; otherwise add a follow-up task.
- [x] Add Open Graph metadata: type, site name, title, description, URL, image, image alt.
- [x] Add Twitter card metadata.
- [x] Add a head inspection test that parses `index.html` and checks required tags.

#### Validation

- [x] `pnpm --filter "./apps/dashboard-teaser" test`
- [x] `pnpm --filter "./apps/dashboard-teaser" build`

### Phase 3: Structured Data

Goal: Add truthful machine-readable meaning for the dashboard teaser.
Depends on: Phase 2.
Status: Done

#### Schema Policy

Use schema that matches visible content:

- `SoftwareApplication` is appropriate if Marwes is positioned as installable UI software.
- `WebSite` is appropriate for the page itself.
- `Organization` is optional only if Marwes owner/publisher details are known and should be public.
- `FAQPage` is out of scope unless visible FAQ content is added.
- `Product` is out of scope unless pricing, offers, reviews, or product detail content exists.

#### Tasks

- [x] Add JSON-LD builder for `SoftwareApplication`.
- [x] Include application category, operating system/platform neutrality, framework support, and URL.
- [x] Add `WebSite` JSON-LD for the teaser page.
- [x] Serialize JSON-LD safely into the HTML.
- [x] Test required JSON-LD fields and forbid unsupported schema types.

#### Validation

- [x] `pnpm --filter "./apps/dashboard-teaser" test`
- [x] `pnpm --filter "./apps/dashboard-teaser" build`

### Phase 4: Static Semantic Body

Goal: Make the page understandable before React runs.
Depends on: Phase 3.
Status: Done

#### Outputs

- Meaningful semantic fallback content inside `#root` or near it.
- Client mounting behavior that intentionally replaces or hydrates the fallback without visual breakage.

#### Tasks

- [x] Add static HTML containing one `h1`, concise intro paragraph, key capability list, and primary links.
- [x] Keep the static text aligned with visible React copy: design system, React/Vue/Svelte, static CSS, type-safe, a11y-first, agent-readable.
- [x] Decide whether to keep `createRoot` replacement or move to hydration. Replacement remains acceptable for this teaser page.
- [x] Add an HTML body inspection test that checks the static semantic content.
- [x] Browser-check desktop and mobile after build or dev server startup.

#### Validation

- [x] `pnpm --filter "./apps/dashboard-teaser" test`
- [x] `pnpm --filter "./apps/dashboard-teaser" build`
- [x] Browser screenshot / visual inspection for desktop and mobile.

### Phase 5: Social Preview Asset

Goal: Give shared previews a deliberate image instead of a missing or generic asset.
Depends on: Phase 2.
Status: Done

#### Tasks

- [x] Inventory existing Marwes assets under `apps/dashboard-teaser/public` and repo docs.
- [x] Choose either a static brand/dashboard preview asset or generate one specifically for the dashboard teaser.
- [x] Place the asset under `apps/dashboard-teaser/public/assets/`.
- [x] Add image dimensions and alt metadata.
- [x] Test that head tags reference the asset with the configured base path.

#### Validation

- [x] `pnpm --filter "./apps/dashboard-teaser" build`
- [x] Inspect built HTML for valid image URLs.

### Phase 6: Sitemap, Robots, and Deployment Policy

Goal: Make the teaser's indexability explicit.
Depends on: Phase 2.
Status: Deferred pending deployment decision

#### Decision Required

Confirm the production URL before implementation. Current Vite base defaults to:

```text
/dashboard-teaser/latest/
```

Open question:

- [ ] Should the canonical production URL be a Marwes docs/product URL, a GitHub Pages URL, or another deployment host?

#### Tasks

- [ ] Add a local `public/robots.txt` only if the dashboard teaser deploys as its own static site root.
- [ ] Add a local `public/sitemap.xml` only if it will be served from the correct origin/path.
- [x] If dashboard teaser is published under a larger site, document that sitemap ownership belongs to the host site instead.
- [x] Add tests only for artifacts that the app truly owns.

Skipped for now: `robots.txt` and `sitemap.xml` are not app-owned until the production origin and static-site root ownership are confirmed.

#### Validation

- [x] `pnpm --filter "./apps/dashboard-teaser" build`
- [x] Inspect `dist` for expected artifacts.

### Phase 7: Documentation and Final Verification

Goal: Make the SEO workflow repeatable.
Depends on: Phases 1-6.
Status: Done

#### Tasks

- [x] Document SEO metadata ownership in `apps/dashboard-teaser/README.md` if that file exists or is created.
- [x] Document validation commands.
- [x] Update this guide with completed phases, skipped tasks, validation outputs, and remaining risks.
- [x] Run final validation.

#### Validation

- [x] `pnpm --filter "./apps/dashboard-teaser" test`
- [x] `pnpm --filter "./apps/dashboard-teaser" typecheck`
- [x] `pnpm --filter "./apps/dashboard-teaser" build`
- [x] `pnpm check:changed`

---

## 4. Test Strategy

### Required Tests

| Test | Purpose | Suggested Path |
|---|---|---|
| SEO contract unit test | Metadata budgets, canonical URL, social values, JSON-LD fields | `apps/dashboard-teaser/src/seo/dashboard-seo.test.ts` |
| HTML head artifact test | Required static head tags exist in `index.html` or rendered output | `apps/dashboard-teaser/src/seo/index-html-seo.test.ts` |
| HTML body artifact test | Static semantic body has `h1`, intro, capabilities, and links | `apps/dashboard-teaser/src/seo/index-html-seo.test.ts` |
| Build verification | Vite build accepts the SEO output | Existing build command |

### Test Principles

- Prefer parsing HTML over fragile snapshot tests.
- Test public behavior and generated/static artifacts, not implementation details.
- Keep exact string assertions for title and URL; use semantic contains checks for broader body copy.
- Tests should fail if metadata is removed, oversized, or disconnected from the visible product positioning.

---

## 5. Failure Protocol

| Failure | Action |
|---|---|
| Metadata budget fails | Tighten copy before weakening budgets. |
| Canonical URL is unknown | Stop and confirm deployment origin/path. |
| JSON-LD feels speculative | Use less schema. Truth beats richness. |
| Static body diverges from React UI | Update visible UI or static body so they match. |
| Build fails due to base path asset URLs | centralize base-path URL building in the SEO helper. |
| Existing dirty app files conflict | Do not overwrite them; inspect and adapt or ask Niklas. |

---

## 6. Completion Tracker

| Phase | Title | Status | Validation | Completed |
|---|---|---|---|---|
| 0 | Discovery | Done | Not run | 2026-05-23 |
| 1 | SEO Contract and Tests | Done | `test`, `typecheck` passed | 2026-05-23 |
| 2 | Static Head Metadata | Done | `test`, `build` passed | 2026-05-23 |
| 3 | Structured Data | Done | `test`, `build` passed | 2026-05-23 |
| 4 | Static Semantic Body | Done | `test`, `build`, browser passed | 2026-05-23 |
| 5 | Social Preview Asset | Done | `build`, built HTML inspected | 2026-05-23 |
| 6 | Sitemap, Robots, Deployment Policy | Deferred | Deployment owner not confirmed | - |
| 7 | Documentation and Final Verification | Done | `test`, `typecheck`, `build`, `check:changed` passed | 2026-05-23 |

---

## 7. Implementation Notes

- The Sprout guide is a reference for discipline and artifact coverage only. Do not edit that repo.
- `dashboard-teaser` is currently single-route, so avoid introducing localized routing or multi-page generation until the app actually needs it.
- The likely first implementation pass should touch only:
  - `apps/dashboard-teaser/index.html`
  - `apps/dashboard-teaser/src/seo/*`
  - possibly `apps/dashboard-teaser/public/assets/*`
  - possibly `apps/dashboard-teaser/README.md`
- Existing modified files currently visible in `apps/dashboard-teaser/src/sections/*` should be treated as user work unless explicitly assigned.

Implemented files:

- `apps/dashboard-teaser/src/seo/dashboard-seo.ts`
- `apps/dashboard-teaser/src/seo/dashboard-seo.test.ts`
- `apps/dashboard-teaser/src/seo/index-html-seo.test.ts`
- `apps/dashboard-teaser/vitest.config.ts`
- `apps/dashboard-teaser/index.html`
- `apps/dashboard-teaser/vite.config.ts`
- `apps/dashboard-teaser/public/assets/marwes-icon.svg`
- `apps/dashboard-teaser/public/assets/marwes-ui-social-preview.png`
- `apps/dashboard-teaser/README.md`
