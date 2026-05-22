# Dashboard Teaser Responsivity Plan

## Goal

Make `apps/dashboard-teaser` responsive without turning the component showcase into a stretched, sparse, or horizontally clipped layout. The page should preserve the feeling of a curated component board on desktop, then switch to denser and more intentional layouts on tablet and mobile.

## Current Findings

The current showcase is a hand-composed flex layout. It works at wide desktop sizes, but the layout has no shared responsive contract for the in-between range.

Observed failures:

- At `951x772`, the first component row overflowed because the layout still attempted a desktop composition: fixed left column, two right-side cards, outer page padding, inner panel padding, and `24px` gaps.
- After forcing the first row to stack at `1024px`, the `967x772` view became too sparse. Switch and Card became full-width rows with large empty space.
- At `1142x772`, the OTP card still clips internally. The issue is not only the row. `InputOtp` has an intrinsic width: `.mw-input-otp { width: max-content; }`, six `40px` cells, and fixed gaps. It does not adapt inside a narrower card.

Relevant files:

- `apps/dashboard-teaser/src/sections/ComponentsShowcase.tsx`
- `apps/dashboard-teaser/src/sections/rows/shared.tsx`
- `apps/dashboard-teaser/src/sections/rows/RowSwitchCard.tsx`
- `apps/dashboard-teaser/src/sections/rows/RowAccordionInput.tsx`
- `apps/dashboard-teaser/src/sections/rows/RowToastMenuAvatar.tsx`
- `apps/dashboard-teaser/src/sections/rows/RowButtonPaginationProgress.tsx`
- `packages/presets/src/firstEdition/input-otp.css`
- `packages/presets/src/firstEdition/pagination.css`
- `packages/presets/src/firstEdition/segmented-control.css`
- `packages/presets/src/firstEdition/toast.css`

## Root Cause

The dashboard teaser uses component demos as if they were content cards, but several demos have real minimum widths:

- OTP cells need enough width for six cells plus gaps.
- Pagination can adapt item count, but still needs room for previous/next controls unless configured compactly.
- Toast has `min-width: 288px`.
- Segmented control uses `inline-size: fit-content` and nowrap items.
- Some row cards use `max-width` values, but there is no row-level rule for how those max widths should collapse, wrap, or recompose.

Because the rows are independent custom flex layouts, each row has a different failure point. A global `768px` breakpoint is too late for some rows and too early or too blunt for others.

## Constraints

- The page is a marketing/demo surface, not a production dashboard. It should look intentionally arranged, not merely technically unbroken.
- Component APIs should not be changed just for this teaser unless the component itself is genuinely non-responsive.
- The showcase should avoid horizontal page scroll at common widths: `1440`, `1280`, `1142`, `1024`, `967`, `951`, `768`, `430`, and `390`.
- The gray showcase panel should contain all cards visually.
- Text and controls must not clip inside cards.
- Empty whitespace is a bug when it makes the layout look abandoned, especially in the `900-1100px` tablet-landscape range.

## Options

### Option A: Continue Per-Row Breakpoints

Add specific breakpoints to each problematic row.

Pros:

- Smallest immediate code change.
- Preserves current desktop composition.
- Easy to apply incrementally.

Cons:

- Fragile. Every new row or component variant needs another breakpoint audit.
- The `967px` screenshot shows this can fix overflow while making the layout worse.
- It does not solve component intrinsic-width issues such as OTP.

Use only as a temporary stopgap.

### Option B: Convert Showcase Rows To A Shared Responsive Grid

Introduce a shared `ShowcaseGrid`, `ShowcaseCard`, and optional card span API for the teaser. Rows stop owning their layout independently. The container controls tracks and density.

Possible track policy:

- Desktop `>= 1200px`: curated 12-column board, preserving wide/fixed visual rhythm.
- Large tablet `900px-1199px`: 2-column board with balanced cards.
- Small tablet `700px-899px`: 1 or 2 columns depending on content density.
- Mobile `< 700px`: single column, compact padding.

Pros:

- One responsive model for the whole showcase.
- Avoids accidental sparse full-width cards on tablet.
- Makes future rows easier to reason about.
- Lets wide components request `span: 2` while small demos stay compact.

Cons:

- Requires a structural refactor of the showcase rows.
- Some current rows group related components together, so we need to decide which groupings remain atomic.

This is the strongest page-level solution.

### Option C: Split Desktop Showcase From Tablet/Mobile Showcase

Keep the current curated desktop board, but create a simplified tablet/mobile composition with different grouping and ordering.

Pros:

- Best visual control.
- Lets mobile/tablet prioritize scannability over desktop fidelity.
- Avoids forcing complex desktop groupings into narrow spaces.

Cons:

- More code and more maintenance.
- Risk of duplicate demo markup unless carefully factored.
- Needs stronger acceptance criteria so the two modes do not drift behaviorally.

Use if the marketing page needs very high visual polish across breakpoints.

### Option D: Component-Level Responsive Fixes Only

Patch intrinsic widths in design-system CSS, for example making OTP cells shrink with container queries.

Pros:

- Improves real components, not just the teaser.
- Fixes clipping inside cards.

Cons:

- Does not solve sparse or awkward teaser composition.
- Requires design review because component dimensions come from Figma references.
- Some components should remain intrinsically sized in product contexts.

This is necessary for OTP-like failures, but not sufficient by itself.

## Recommended Direction

Use a hybrid of Option B and Option D.

1. Replace per-row layout ownership in `apps/dashboard-teaser` with a shared responsive showcase grid.
2. Keep the wide desktop arrangement curated with spans.
3. Define a specific tablet layout instead of relying on desktop layout until `768px`.
4. Add local demo wrappers or compact props for wide controls first.
5. Only change design-system CSS when the component itself should be responsive outside the teaser.

This gives us a maintainable layout system and avoids using component CSS as a workaround for a page composition problem.

## Proposed Layout Contract

### Page Shell

- `ComponentsShowcase` owns outer padding and panel padding.
- Use fluid values with `clamp()`:
  - outer padding: `clamp(16px, 4vw, 72px)`
  - panel padding: `clamp(16px, 3vw, 32px)`
  - grid gap: `clamp(16px, 2vw, 24px)`
- Avoid hard desktop padding at tablet widths.

### Showcase Grid

Create shared primitives in `apps/dashboard-teaser/src/sections/rows/shared.tsx` or a new `showcase-layout.tsx`:

- `ShowcaseGrid`
- `ShowcaseCard`
- `ShowcaseCardGroup`
- `ShowcaseSectionLabel`

Suggested CSS direction:

```css
display: grid;
grid-template-columns: repeat(12, minmax(0, 1fr));
gap: var(--showcase-gap);
```

Card spans:

- Desktop:
  - large card: `span 6`
  - medium card: `span 4`
  - small card: `span 3`
  - full card: `span 12`
- `900px-1199px`:
  - most cards: `span 6`
  - wide controls: `span 12`
- `< 700px`:
  - all cards: `span 12`

This avoids both overflow and the current tablet issue where simple cards become enormous full-width blocks too early.

### Component Demo Rules

- Demos with small intrinsic width, such as Switch, Badge, Spinner, Button, should stay in paired cards on tablet.
- Demos with medium intrinsic width, such as Checkbox, Radio, Input fields, Segmented controls, can be half-width on tablet when content fits.
- Demos with hard intrinsic width, such as OTP, Pagination, Toast stacks, should either span full width or switch to compact presentation.

## Component-Specific Decisions

### Input OTP

Current issue:

- `.mw-input-otp` uses `width: max-content`.
- Cells are fixed at `40px`.
- Six cells plus gaps can overflow narrow cards.

Recommended teaser fix:

- Put OTP in a card that spans full width at `900px-1199px`, or use a compact demo variant with smaller CSS custom properties if supported.

Potential design-system fix:

- Add responsive CSS variables:
  - `--mw-input-otp-cell-size`
  - `--mw-input-otp-cell-gap`
- Change cells from hard `40px` to variables.
- Consider `width: min(100%, max-content)` and allow the cell grid to use `minmax(32px, 40px)` in constrained contexts.

Do not change this blindly. It affects the actual component contract.

### Pagination

Current strength:

- React pagination already has adaptive `maxVisibleItems` measurement.

Recommended teaser fix:

- Keep it in a wide enough card.
- For narrow demos, consider `showPrevNext={false}` or lower `siblingCount`.

### Toast

Current issue:

- Toast has `min-width: 288px`, so a toast card narrower than that plus padding will clip or force overflow.

Recommended teaser fix:

- Toast card should not be allowed below its usable minimum width.
- On tablet, place Toast as half-width only when card content width remains at least `320px`.

### Segmented Control

Current issue:

- Items are nowrap and `fit-content`.

Recommended teaser fix:

- Keep segmented controls in cards with enough width.
- For mobile, show fewer variants per card or stack controls vertically, which the row already does internally.

### Switch And Card

Current issue:

- These are small demos. Making each full-width at `967px` creates excessive empty space.

Recommended teaser fix:

- In the new grid, keep Switch and Card as separate half-width cards at tablet widths, not full-width stacked cards.

## Implementation Plan

### Phase 1: Stabilize Layout Primitives

- Add shared showcase layout primitives.
- Move repeated `RowContainer`, `SectionLabel`, and card sizing rules into the shared layer.
- Add `min-width: 0` consistently to grid/flex children.
- Replace row-specific `max-width` behavior with grid spans.

Validation:

- `pnpm --filter ./apps/dashboard-teaser typecheck`
- `pnpm --filter ./apps/dashboard-teaser build`
- Visual checks at `1440`, `1142`, `967`, `951`, `768`, `430`, `390`.

### Phase 2: Recompose Component Showcase

- Convert `RowSwitchCard` into individual showcase cards under the shared grid.
- Keep related controls grouped only where grouping improves scanning.
- Ensure Switch and Card remain compact on tablet.
- Put OTP, Pagination, and Toast into width-aware spans.

Validation:

- No horizontal scroll at the target viewport widths.
- No card content clipping.
- No large empty full-width cards in `900px-1100px`.

### Phase 3: Address Component Intrinsic Widths

- Audit OTP, Toast, Pagination, SegmentedControl in constrained cards.
- Decide which fixes are teaser-local wrappers and which belong in `packages/presets`.
- If changing design-system CSS, add component tests or visual Storybook checks where possible.

Validation:

- Component stories still match intended desktop sizes.
- Dashboard teaser no longer needs one-off CSS hacks for each intrinsic width.

### Phase 4: Add Regression Guard

- Add a lightweight screenshot check for dashboard teaser breakpoints if the repo's visual tooling supports it.
- At minimum, document the manual viewport matrix in the PR.

Suggested viewport matrix:

- `1440x900`
- `1280x800`
- `1142x772`
- `1024x768`
- `967x772`
- `951x772`
- `768x900`
- `430x932`
- `390x844`

## Acceptance Criteria

- The page has no horizontal scroll at target viewports.
- The gray showcase panel always contains all visible cards.
- OTP cells and helper text do not clip.
- Switch and Card demos do not become oversized empty rows at tablet widths.
- Cards maintain consistent spacing and rhythm across rows.
- The implementation uses shared layout primitives rather than per-row breakpoint patches.
- Dashboard teaser typecheck and build pass.

## Recommendation Summary

Do not continue adding isolated breakpoints. The current page needs a real responsive showcase layout model.

The best next step is to build a shared grid-based showcase layout for `apps/dashboard-teaser`, then treat OTP and similar controls as intrinsic-width components that need explicit compact/full-span presentation rules. This gives us a cleaner tablet layout and prevents the current cycle where fixing one viewport breaks the visual balance at another.
