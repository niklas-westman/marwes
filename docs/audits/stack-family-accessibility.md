# Stack Family Accessibility Audit

Status: **in progress** — the first pass below is recorded; owner sign-off is pending.

## Goal
Confirm that the Stack layout family stays a presentational container: it adds no role, keyboard
behaviour or naming of its own, while `as` lets consumers give the container real structure
(landmarks and lists) without breaking that structure.

## Scope

### Atoms
- `Stack` — flex container, rendered as `div` by default or as `section`, `nav`, `header`, `footer`, `main`, `aside`, `ul` or `ol`
- `StackItem` — declared child, rendered as `div` or `li`

## Tree anchors

### Core
- `packages/core/src/components/atoms/stack/`
- `packages/core/test/recipes/stack.test.ts`

### Presets
- `packages/presets/src/firstEdition/stack.css`
- `packages/presets/test/stack-css-contract.test.ts`

### React
- `packages/react/src/components/stack/`
- `apps/storybook-react/src/stories/stack/`

### Vue
- `packages/vue/src/components/stack/`
- `apps/storybook-vue/src/stories/stack/`

### Svelte
- `packages/svelte/src/lib/components/stack/`
- `apps/storybook-svelte/src/stories/stack/`

### Contracts
- `tests/contracts/stack.contract.ts`

## Step-by-step checklist

### 0. Spec and decisions
- [x] confirm the relevant requirement in `docs/reference/spec.md` (REQ-STACK-001)
- [x] confirm open decisions before editing behaviour (spec section 9: sp-6, reverse directions, alignSelf/alignContent, fix vs fixed)
- [x] confirm whether public docs need updates (Storybook introductions in all three apps)
- [ ] owner sign-off on this audit

### 1. Core
- [x] review `stack.types.ts` — no `*A11y` type; the container has no a11y model (Card precedent)
- [x] review `stack.recipe.ts` and `stack-item.recipe.ts` — no ARIA output; `as` only changes the tag
- [x] review `stack.values.ts` — `as` is restricted to structural elements; `form` is excluded

### 2. Preset CSS
- [x] no focus, disabled or invalid states apply to a layout container
- [x] visual order equals DOM order: reverse directions are not offered
- [x] `display: flex` on `ul`/`ol` and `li` removes list markers; list semantics stay in the DOM

### 3–6. Adapters, stories and tests
- [x] native element choice comes from the recipe's `tag` in React, Vue and Svelte
- [x] `aria-label`, `id` and other native attributes pass through; `data-component` stays recipe-owned
- [x] no adapter adds keyboard handling or roles
- [x] Storybook a11y smoke runs on every Stack and StackItem story in all three apps
- [x] the `ListItems` story renders `ul` with `li` items and an `aria-label`

### 7. Shared contracts
- [x] `tests/contracts/stack.contract.ts` runs in React, Vue and Svelte
- [x] covers `as` for every allowed value, list structure and attribute passthrough

### 8. Verification and doc completion
- [x] `docs/audits/README.md` and `docs/audits/status.md` list Stack as in progress
- [ ] move the status on after owner review

## Findings

### Good
- Stack and StackItem are presentational: no role, no keyboard behaviour, no generated names.
- `as` covers the honest structural choices (`section`, `nav`, `header`, `footer`, `main`, `aside`, `ul`, `ol`, `li`) and rejects anything else with a `TypeError`.
- Reading order matches visual order because only `row` and `column` are supported.

### Risks
- **Landmarks need names when repeated.** A page with more than one `nav`, `aside` or `section` landmark needs a consumer `aria-label` (or `aria-labelledby`) on each. Stack cannot know this, so it stays a manual-review item.
- **Lists need list items.** A Stack rendered `as="ul"` or `as="ol"` must contain only `StackItem as="li"` children; a `div` child breaks list semantics.
- **One `main` per page.** `as="main"` should be used once per page.
- **Layout claims can diverge.** Consumer style or className can change layout keys other than `--mw-stack-*` vars; this is a verification concern, not an assistive-technology one.

### Decisions needed
- Owner sign-off on this first pass.
- The open spec decisions in `docs/reference/spec.md` section 9 do not change accessibility behaviour.

## Expected outputs
- code and tests aligned with the presentational-container contract
- public docs (Storybook introductions) that state the landmark and list rules
- audit status docs that show Stack as in progress until owner sign-off
