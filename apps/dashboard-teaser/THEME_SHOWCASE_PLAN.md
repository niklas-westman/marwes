# Theme Showcase — Implementation Plan

Living document. Any AI or engineer picking up this work should check off items
as they are completed and add short notes on the outcome (e.g. commit hash,
open questions, screenshots). Do not delete completed items — keep them for
audit.

## Goal

Elevate the theme presets experience in `apps/dashboard-teaser` from a functional
dropdown to a **compelling visual demo** of what a design system with typed
themes can do — inspired by
`/Users/niklaswestman/Documents/design/marwes-html-temps/marwes-themes-dashboard-teaser-example.html`.

The endpoint is: a user visiting `marwes.io` immediately understands that
switching themes reshapes the whole system, sees several distinct visual
identities in action, and can either browse curated presets or build their own
theme inline — with an educational surface explaining *how* the theme system is
constructed.

## How to use this document

- Work top-to-bottom by phase. Each phase is independently shippable.
- Update the checkbox status per task: `- [ ]` → `- [x]`.
- After each **phase completes**, append a short summary under
  `### Notes` in that phase (what shipped, what surprised you, what's left).
- If you decide to skip or defer a task, mark it `- [~]` (deferred) and add
  a one-line reason inline.
- Do not merge phases or re-order tasks without leaving a note.

## Design references

- HTML source of inspiration: `/Users/niklaswestman/Documents/design/marwes-html-temps/marwes-themes-dashboard-teaser-example.html`
- Current implementation touched files:
  - `src/sections/ComponentsShowcase.tsx` — hosts the dropdown + preview.
  - `src/sections/theme-presets.ts` — data + helpers.
  - `src/sections/playground-settings.ts` — settings shape + `PlaygroundStyle`, `PlaygroundFont`, `Density`.
  - `src/sections/PlaygroundControls.tsx` — full playground surface (kept hidden today; reference for widgets we might reuse).

---

## Phase 1 — Foundation improvements

**Goal:** Make the existing dropdown-driven preview feel alive with minimal
churn. Low risk, high perceived quality.

- [x] **1.1 Global preview transition** — Add a 200–300ms CSS transition on
      `background-color`, `border-color`, `color`, `border-radius` and
      `box-shadow` scoped to `PreviewThemeScope` (and its descendants) so
      preset switches morph visibly instead of snapping.
      *File:* `src/sections/ComponentsShowcase.tsx` (`PreviewThemeScope` styled
      component).
      *Watch out:* excluded properties (e.g. `outline` should NOT transition to
      keep focus-ring instant).

- [x] **1.2 Color swatches in the dropdown** — Extend the Select options so
      each preset renders 3–4 color chips (bg / accent / text / border) inline
      next to its name. Users pre-visualize the theme before selecting.
      *Files:* `src/sections/ComponentsShowcase.tsx`,
      `src/sections/theme-presets.ts`. Requires either a custom Select
      implementation OR augmenting each option label with an inline React
      element (verify `SelectOption` shape allows rich content).

- [x] **1.3 Preset descriptions** — Add a `description: string` field to each
      entry in `themePresets`. Copy inspiration:
      - Marwes → "Clean, precise, quietly confident."
      - Cyber → "High-contrast dark mode for dashboards and dev tools."
      - Editorial → "Serif type and ink rules for content-led products."
      - Sunset → "Warm, rounded, and friendly."
      - Nordic → "Calm, minimalist, cool tones."
      *File:* `src/sections/theme-presets.ts`.

### Notes (Phase 1)

Delivered 2026-07-08.

- **1.1** — Added a 240ms `transition` on `background-color`, `border-color`,
  `color`, `fill`, `stroke`, `border-radius`, `box-shadow` scoped to
  `PreviewThemeScope > [data-marwes-theme="true"]` and its descendants. Outline
  and `outline-offset` are intentionally left off the transition list so focus
  rings stay instant. Wrapped in a `@media (prefers-reduced-motion: reduce)`
  guard.
- **1.2** — Select atom only accepts text labels (verified in the atom
  source). Introduced a lightweight `ThemeSwatches` React component rendered
  inside `ThemeControl` between the label and the Select. It shows four
  14×14px chips (bg / accent / border / text) derived from the active preset's
  mode + `primary`. `aria-hidden="true"` because the Select itself already
  carries the accessible label.
- **1.3** — Added a `description: string` field to `ThemePreset` and filled
  in copy for all 5 presets per the plan. Not yet consumed by any UI —
  Phase 2's caption will use it.

Verification: `pnpm --filter dashboard-teaser run typecheck`, `run test`,
`run build` all green.

---

## Phase 2 — Contextual "Now viewing" indicator

**Goal:** Reinforce which theme is active and what its purpose is, without
requiring the user to open the dropdown.

- [x] **2.1 Caption element** — Add a subtle single-line caption between the
      header row and the preview area:
      `Now viewing **Cyber** — high-contrast dark mode for dashboards and dev tools.`
      Uses the `description` field added in 1.3.
      *File:* `src/sections/ComponentsShowcase.tsx`.

- [x] **2.2 Visual weight** — Style so it reads as metadata, not as another
      header: caption size, muted color, name bolded via `<strong>`.
      *File:* `src/sections/ComponentsShowcase.tsx`.

### Notes (Phase 2)

Delivered 2026-07-08.

- **2.1** — New `ActivePresetCaption` renders directly below `HeaderRow` and
  above `PreviewThemeScope`. Text: `Now viewing <strong>{name}</strong> — {description}`.
  Uses `activePreset` from the resolver we already had (falls back to `themePresets[0]`
  when the user has manually diverged), so a caption always renders.
- **2.2** — Styled via `TextVariant.caption`, muted `theme.color.textMuted`
  colour on the surrounding text; the `<strong>` inside gets
  `theme.color.text` at font-weight 600 so the preset name reads as the
  emphasised token without turning into another header.

Verification: typecheck ✅ · test 17/17 ✅ · build ✅.

---

## Phase 3 — Distinct theme identities

**Goal:** Escalate presets from "same layout, different tokens" to visibly
different personalities.

- [x] **3.1 Signature effects per preset** — Add scoped CSS in
      `PreviewThemeScope` that references a `data-preset="..."` attribute.
      Signature effects to consider:
      - Cyber → neon glow on primary buttons + switches
        (`box-shadow: 0 0 12px color-mix(in srgb, var(--mw-color-primary-base) 55%, transparent)`)
      - Brutalist / Editorial → hard offset shadow on primary buttons
        (`box-shadow: 3px 3px 0 var(--mw-color-text)`)
      - Nordic → soft blurred elevation on cards
      *Files:* `src/sections/ComponentsShowcase.tsx` (add `data-preset` to
      `PreviewThemeScope` from the active preset id), plus the CSS block.

- [x] **3.2 Extended token control** — Today's `themePreset` only sets
      `primary + style + font + radius + density + mode`. To make presets
      *feel* distinct we may also need to control `bg`, `surface`, `border`,
      `text`, `textMuted`. Investigate whether `PlaygroundSettings` can express
      these — likely via an escape hatch that lets a preset pass a partial
      `ThemeInput.color` overlay. Add fields to `ThemePreset` and merge them in
      `applyThemePreset`. Consumer knock-on: `getActivePresetId` must factor
      the new fields into equality.
      *Files:* `src/sections/theme-presets.ts`, `src/sections/playground-settings.ts`.

### Notes (Phase 3)

Delivered 2026-07-08.

- **3.1** — `PreviewThemeScope` now takes a transient `$activePresetId` prop
  plus a `data-active-preset` attribute. Signature CSS is scoped by
  `&[data-active-preset="…"]` and painted entirely through design-system CSS
  variables (`--mw-color-primary-base`, `--mw-color-text`, `--mw-card-border`,
  `--mw-color-border-strong`) so effects track the active palette rather than
  hard-coding literal colors.
  - Cyber → neon glow on `.mw-btn--primary` + `.mw-switch__thumb` (checked).
  - Editorial → hard-offset print shadow on `.mw-btn--primary` plus a subtle
    translate on hover/active for the print feel.
  - Sunset → soft blurred elevation on `.mw-card`.
  - Nordic → crisp inset outline on `.mw-btn--primary`.
- **3.2** — Introduced `ThemePresetColorOverrides = NonNullable<ThemeInput["color"]>`.
  - Added optional `colorOverrides` to `ThemePreset`. Marwes leaves it
    `undefined` (resets to shell defaults). Cyber, Editorial, Sunset, Nordic
    each ship a set of `background / surface / text / textMuted / border /
    borderStrong` overrides tuned to the preset's mood.
  - Added `colorOverrides?: NonNullable<ThemeInput["color"]>` to
    `PlaygroundSettings`, plumbed through `applyThemePreset` (sets the field
    from the preset).
  - `createDashboardThemeInput` merges preset overrides first, then
    `a11yOverrides` (high contrast) so accessibility still wins.
  - `getActivePresetId` uses a shallow `shallowEqualColorOverrides` compare so
    any manual palette tweak un-selects the preset.
  - Note for later phases: `applyPlaygroundStyle` (in `playground-settings.ts`)
    does NOT clear `colorOverrides` today — if a user opens the playground and
    toggles style there we'd carry the last preset's overrides. Custom Theme
    (Phase 5) should decide how to reconcile this; noted here as an open
    thread.

Verification: typecheck ✅ · test 17/17 ✅ · build ✅.

---

## Phase 3.5 — Personality axis promoted to the product (bonus)

**Goal:** Not part of the original plan. Added because Phase 3.1's signature
effects lived only in dashboard-teaser CSS — customers couldn't reproduce them
even though the demo showed them. Lifted the signatures into
`@marwes-ui/*` so `personality` is a real, opt-in axis on `ThemeInput`.

Design doc: `/Users/niklaswestman/.claude/plans/fluffy-napping-mountain.md`.

- [x] **3.5.1 Core** — Added `PersonalityName = "flat" | "glow" | "print" | "soft" | "outlined"`
      to `@marwes-ui/core`. New optional `personality?: PersonalityName` on
      `ThemeInput`, non-optional `personality` on `ResolvedTheme`, default
      `"flat"` applied in `resolveThemeInput`. `.d.ts` src mirrors updated.
- [x] **3.5.2 Adapters** — React, Vue, Svelte `MarwesProvider` wrappers all
      render `data-marwes-personality={resolved.personality}` next to
      `data-marwes-mode`. One-line addition per adapter; no other adapter
      surface changed.
- [x] **3.5.3 Presets CSS** — New
      `packages/presets/src/firstEdition/personality.css` with attribute-
      scoped rules for glow / print / soft / outlined. All effects reference
      `--mw-color-*` variables so they follow the active palette. `print`
      motion guarded by `@media (not (prefers-reduced-motion: reduce))`.
      `flat` intentionally ships no rules (default = no visual change).
      Imported from `styles.css`. Contract test in
      `packages/presets/test/personality-css-contract.test.ts`.
- [x] **3.5.4 Preset exports** — Lifted `marwesPreset / cyberPreset /
      editorialPreset / sunsetPreset / nordicPreset` (plus a `themePresets`
      array) into `@marwes-ui/presets` as `ThemeInput` exports. Consumers can
      now `import { cyberPreset } from "@marwes-ui/presets"` and pass it
      directly to `<MarwesProvider theme={cyberPreset}>`. Dashboard-specific
      metadata (`gradientFrom/To`, `foregroundOnPrimary`, `description`)
      stays in the dashboard.
- [x] **3.5.5 Dashboard migration** — Added `personality: PersonalityName`
      to `ThemePreset` and `PlaygroundSettings`. `createDashboardThemeInput`
      forwards it. `applyThemePreset` sets it. `getActivePresetId` includes
      it in equality. Deleted the local "Preset signatures" CSS block +
      `$activePresetId` / `data-active-preset` plumbing from
      `ComponentsShowcase.tsx` — signatures are now driven by the presets
      package via the `MarwesProvider` wrapper's `data-marwes-personality`
      attribute.

### Notes (Phase 3.5)

Delivered 2026-07-08.

Hard constraint held: default Marwes theme renders identically before and
after this change. New wrapper attribute value is `"flat"`, and the `flat`
personality has zero CSS rules — so byte-identical output for existing
consumers who don't opt in.

Verification: `pnpm -r run typecheck` 14/14 ✅ · tests 505+498+481+643+103+17
= **2 247 passed** ✅ · `pnpm -r run build` 13/13 ✅.

Follow-up threads (not blocking Phase 4/5):

- **Shared "resolved → wrapper props" helper** — All three adapters now
  independently render four wrapper attributes. Next axis addition would be
  four one-line changes; extracting a helper in core would drop that to one.
  Deferred until a next axis actually shows up.
- **Vue/Svelte consumer smoke tests for personality** — React
  `personality-css-contract.test.ts` covers the CSS surface. If we ever
  regress the adapter wrappers, that's caught by `data-marwes-personality`
  being missing from the DOM but no test currently asserts that per adapter.
  Add a wrapper attribute test to each provider package if regression risk
  grows.

---

## Phase 3.75 — Theme picker card grid

**Goal:** Replace the dropdown/label/swatch header inside the components
showcase with a horizontal card grid matching the HTML template
(`marwes-themes-dashboard-teaser-example.html`). Cards are the strongest
visual demo moment — a visitor sees the whole system's breadth in 2 seconds
instead of having to open a dropdown. Was originally in Deferred; promoted
after visual review confirmed the template's card layout reads
significantly stronger than the current dropdown.

Preset set stays as-is (Marwes, Cyber, Editorial, Sunset, Nordic).

- [x] **3.75.1 Card grid component** — Introduce a `ThemePickerGrid`
      inside `ComponentsShowcase.tsx` (inline styled component, no new
      file needed unless it grows). Renders one card per entry in
      `themePresets`. Each card contains:
      - A horizontal swatch strip (4 chips: background / surface / primary
        / text) sourced from the preset's `mode + colorOverrides + primary`.
      - The preset name (`Text` heading level 3-equivalent, bold weight).
      - The `description` field (muted caption).
      - Active state: primary-colored 2px border + a small check badge in
        the top-right of the swatch strip.
      - Whole card is a `<button>` so keyboard/focus/AT support is free.
      Card corners round to `theme.ui.radius * 3` capped at 20px (mirrors
      existing card cap pattern in `PreviewThemeScope`).

- [x] **3.75.2 Section framing** — Above the grid render a "CHOOSE A THEME"
      overline using `TextVariant.overline`, matching the template's
      convention. Section sits **outside** the `ContentGrid` (the dashboard
      chrome wrapper), positioned above it so the picker reads as a
      dedicated act of choice rather than a header of the preview.

- [x] **3.75.3 Remove replaced UI** — Delete these Phase 1/2 artefacts from
      `ComponentsShowcase.tsx` now that the grid conveys the same
      information more clearly:
      - `HeaderRow` + `ThemeControl` + `ThemeControlLabel` + `Select`
        dropdown (Phase 1.2).
      - `ThemeSwatches` component (Phase 1.2) — its chip row now lives
        inside every card.
      - `ActivePresetCaption` (Phase 2) — the highlighted card + its own
        description carry the "now viewing" signal.
      Clean up imports (`Select`, `TextVariant.caption` where only used by
      those, etc.).

- [x] **3.75.4 Responsive** — Grid is 5-across on desktop, wraps to 2-3 per
      row on tablet, 1-2 on mobile (`theme.media.mobileAndBelow`). Cards
      keep min-width so swatches remain legible. Preserve the hero card
      structure — do not switch to a vertical stack because the layout
      itself is part of the demo (breadth on one screen).

### Notes (Phase 3.75)

Delivered 2026-07-08.

- **3.75.1** — `ThemePickerGrid` + `ThemeCard` live inline in
  `ComponentsShowcase.tsx`. Each card is a `<button role="radio">` with
  `aria-checked`, whole card clickable. Cards render a 4-chip swatch strip
  (bg / surface / primary / text) with `getPresetSwatchColors()` deriving
  values from `preset.colorOverrides` with light/dark defaults matching
  firstEditionTheme's neutral palette. Active state = 2px primary border +
  a 24px check badge (using `IconName.Check`) overlapping top-right of the
  swatch strip.
- **3.75.2** — `ThemePickerRow` sits outside `ContentGrid` inside the
  showcase's `ShowcaseLayout`. Overline "Choose a theme" above the grid.
  `ShowcaseLayout` gained a `clamp(sp24, 3vw, sp32)` gap between picker
  and content.
- **3.75.3** — Deleted `HeaderRow`, `ThemeControl`, `ThemeControlLabel`,
  the outer `Select`-based dropdown, `SwatchRow` / `Swatch` /
  `ThemeSwatches` component (Phase 1.2), and `themePresetSelectOptions`.
  Also dropped the outer `Select` import from
  `packages/react/src/components/input/select`. Restored the
  "showcase-head" pattern from the HTML template: `ShowcaseHead` +
  `NowViewing` sit at the top of `ContentGrid` — label "Live component
  preview" on the left, "Now viewing <b>{name}</b> — {description}" on
  the right, matching the template's `.showcase-head` layout. The card
  grid indicates *which* theme is selected; the head text confirms it in
  words inside the preview surface.
- **3.75.4** — Grid uses `repeat(5, minmax(0, 1fr))` on desktop, falls
  back to `repeat(auto-fit, minmax(200px, 1fr))` below desktop and
  `minmax(160px, 1fr)` on mobile (from `theme.media.mobileAndBelow`).
  Swatch chips use `aspect-ratio: 4/3` + `min-height: 44px` so they
  remain legible at any card width.

Verification: typecheck ✅ · test 17/17 ✅ · build ✅.

Downstream impact on Phase 4:

- Original Phase 4 tasks referenced "the header row" as the trigger
  location for the "Read about theme" text link and the "View this theme's
  config" icon button. That header row no longer exists. Phase 4 needs
  to decide a new home — probably the `ThemePickerRow` (next to the
  "Choose a theme" overline) or inside each card. To be settled when
  Phase 4 starts.

---

## Phase 4 — Educational surfaces

**Goal:** Turn passive browsing into active learning. Two modals, both
reachable from the theme control area.

- [ ] **4.1 "Read about theme" modal** — Opens from a small text-link button
      near the dropdown (e.g. "How themes work"). Explains in plain language:
      1. What a Marwes theme is (typed input object).
      2. Which axes it controls (colors, radius, density, mode, tone, font).
      3. How it propagates via CSS variables to every component.
      4. Two-column code sample of a minimal theme + how to pass it to
         `<MarwesProvider theme={...}>` (React example, with a note that Vue and
         Svelte adapters accept the same shape).
      *Files:* new `src/components/AboutThemeModal.tsx`, wire trigger button
      into `ComponentsShowcase.tsx` header row.

- [ ] **4.2 "View this theme's config" modal** — Reuses `CodeSnippetModal`
      pattern (framework tabs + code block). Renders the *currently active*
      preset's config as a serialized theme object in React/Vue/Svelte syntax.
      Trigger sits next to the dropdown (small icon button, e.g. `IconName.Code`).
      Source of truth: the preset object + `applyThemePreset` result.
      *Files:* new `src/sections/rows/theme-config-snippets.ts` (or inline
      generator), reuse `CodeSnippetModal`. Wire into
      `ComponentsShowcase.tsx`.

### Notes (Phase 4)

_(Fill in after completion)_

---

## Phase 5 — Custom Theme

**Goal:** Let users go beyond the 5 presets and build their own theme, then
see it applied to the whole showcase. Playground already has the widgets;
this phase repackages them into a focused, opt-in surface.

- [ ] **5.1 "Customize theme" trigger** — Add a button/link near the theme
      dropdown labelled "Customize" (or `IconName.Sliders`). Opens the picker
      described below.
      *Files:* `src/sections/ComponentsShowcase.tsx`.

- [ ] **5.2 Custom theme picker surface** — Options:
      **a)** Drawer from the right (uses existing `Drawer` component).
      **b)** Inline expandable panel below the dropdown.
      Contains a curated subset of the full playground controls:
      - Primary color picker
      - Radius slider (0–16)
      - Density segmented control (compact / comfortable / spacious)
      - Mode toggle (light / dark)
      - Font selector
      - (Optional) surface/text overrides once phase 3.2 exposes them.
      *Files:* new `src/sections/CustomThemePanel.tsx`, references existing
      widgets from `PlaygroundControls.tsx` — factor out reusable sub-widgets
      if practical; do not duplicate whole file.
      *Do not* re-implement individual playground controls; import them.

- [ ] **5.3 "Custom" as a preset id** — Extend `ThemePresetId` union with
      `"custom"`. `getActivePresetId` returns `"custom"` when no other preset
      matches AND the user has been on the Customize surface. Otherwise
      returns null (current behaviour).
      *Files:* `src/sections/theme-presets.ts`. Consider persisting the last
      custom config in `sessionStorage` (mirrors framework preference pattern
      in `src/components/FrameworkPreference.tsx`).

- [ ] **5.4 Reset to preset button** — Inside the Customize panel, a button
      "Reset to Marwes" that reverts to the default preset. Keeps escape hatch
      clear.

### Notes (Phase 5)

_(Fill in after completion)_

---

## Verification checklist (runs at the end of every phase)

- [ ] `pnpm --filter dashboard-teaser run typecheck` → exit 0.
- [ ] `pnpm --filter dashboard-teaser run test` → all green.
- [ ] `pnpm --filter dashboard-teaser run build` → produces `dist/` cleanly.
- [ ] Manual: cycle every preset in the dev server, confirm nothing looks
      visually broken (drawer + modal radii, dropdown alignment, focus rings).
- [ ] Dark-mode toggle still works alongside preset selection.
- [ ] Accessibility tab (color vision + high contrast overrides) still applies
      on top of active preset without regressions.

## Deferred / out of scope

Track anything we chose NOT to build here so future work knows the boundary.

- [~] Visual theme-card grid replacing the dropdown — **promoted and
      shipped in Phase 3.75** on 2026-07-08. Kept here for audit trail.
- [ ] Persisting selected preset across visits (localStorage). Currently only
      session-level via other flows; theme preset resets on reload.
- [ ] Multi-provider theme scope (shell vs preview vs modal) audit — separate
      concern, tracked elsewhere.
