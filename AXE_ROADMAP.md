# AXE Roadmap for Marwes

This roadmap translates the accessibility review against `axe-core` into an implementation plan for Marwes.

It is intentionally practical.
It focuses on strengthening verification and accessibility governance without changing the core Marwes architecture.

## Why this roadmap exists

Marwes already has a strong accessibility architecture:
- source-owned a11y logic in `@marwes-ui/core`
- thin React and Vue adapters
- solid field wiring helpers
- strong React/Vue parity foundations
- broad test coverage and governance structure

The main gap is not architecture.
The main gap is **accessibility enforcement discipline**.

`axe-core` is strong because it treats accessibility as a system of:
- explicit rules
- explicit severity
- explicit automation boundaries
- explicit manual-review boundaries
- explicit support assumptions

This roadmap adapts that mindset to Marwes.

Detailed family-by-family audit checklists live under `docs/audits/`.
Start there when executing one component family at a time.

---

## Current strengths to preserve

Do not regress these.

### Strong foundations
- `packages/core/src/components/atoms/*/*-a11y.ts`
- `packages/core/src/shared/field-helpers.ts`
- `docs/reference/architecture.md`
- `docs/reference/spec.md`
- `docs/reference/governance.md`

### Strong parity and coverage base
- `tests/contracts/*`
- `scripts/storybook-consistency.mjs`
- `apps/storybook-react/*`
- `apps/storybook-vue/*`

### Good theme groundwork
- `packages/core/src/theme/color-utils.ts`
- `packages/core/src/theme/color-resolve.ts`
- `packages/core/src/theme/theme-normalize.ts`

---

## Main gaps to address

### Gap 1 — Accessibility checks are not hard-gated enough
Storybook includes `@storybook/addon-a11y`, but both previews currently use:

- `apps/storybook-react/.storybook/preview.tsx`
- `apps/storybook-vue/.storybook/preview.ts`

with:

```ts
a11y: { test: "todo" }
```

That means a11y is visible, but not enforced.

### Gap 2 — Native-first defaults are inconsistent
Most notably:
- `packages/core/src/components/atoms/input/select-types.ts` defaults to custom Marwes select behavior
- button navigation paths currently expose anchor-backed controls as `role="button"`

### Gap 3 — High-risk widgets need stronger contracts
The most accessibility-sensitive widgets do not yet all have shared cross-adapter contract coverage.

Missing or under-specified contract areas:
- custom select keyboard matrix
- rich text manual-review coverage

### Gap 4 — Manual-review boundaries are under-documented
Marwes docs talk about accessibility, but do not yet define:
- supported assistive technology assumptions
- which components are high manual-review risk
- what automated checks can and cannot guarantee

### Gap 5 — Theme accessibility is not validated as a release concern
Contrast-aware helpers exist, but consumer or preset overrides are not yet checked through a dedicated validation flow.

---

# Implementation roadmap

## Phase 1 — Turn accessibility from advisory into enforced

### Goal
Make automated accessibility verification a real trust gate.

### Files to change

#### Storybook enforcement
- `apps/storybook-react/.storybook/preview.tsx`
- `apps/storybook-vue/.storybook/preview.ts`

#### Root trust model
- `package.json`
- `docs/reference/governance.md`
- `docs/reference/testing.md`

#### New scripts or tests
- `scripts/` for any new accessibility verification helpers
- package test files under React and Vue for smoke-level accessibility checks

### Work items
- [ ] Replace `a11y: { test: "todo" }` with a stricter Storybook a11y policy for covered stories
- [ ] Define which stories are expected to pass automated a11y by default
- [ ] Add a dedicated repo command for accessibility verification
- [ ] Add that command to the local trust model and CI-facing docs
- [ ] Document when a story may be exempted and how exemptions are tracked

### Acceptance criteria
- [ ] Storybook accessibility checks are not left in `todo` mode for core component coverage
- [ ] `pnpm check` or an adjacent trust command includes accessibility verification
- [ ] governance docs explain the new rule clearly

### Notes
Start small if needed:
- first gate a curated smoke set
- then expand to all stable families

---

## Phase 2 — Resolve native-first decisions

### Goal
Prefer accessibility-supported browser behavior where custom behavior is not necessary.

## 2A — Select default mode

### Files to change
- `docs/reference/spec.md`
- `packages/core/src/components/atoms/input/select-types.ts`
- `packages/react/src/components/input/select.tsx`
- `packages/react/src/components/input/select-field.tsx`
- `packages/vue/src/components/input/select.ts`
- `packages/vue/src/components/input/select-field.ts`
- relevant Storybook stories and docs in both apps
- relevant tests in both adapters and contracts

### Work items
- [ ] Resolve `DEC-001` explicitly in `docs/reference/spec.md`
- [ ] Decide whether default `Select` should become native-only or native-first
- [ ] If native-first wins, flip `resolveSelectMode()` default away from custom Marwes mode
- [ ] Keep the custom combobox as an explicit opt-in if still needed
- [ ] Update docs and stories so examples teach the new default clearly

### Acceptance criteria
- [ ] Default select behavior matches the documented spec
- [ ] Storybook examples teach the correct default
- [ ] contracts cover both native and custom paths if both remain shipped

## 2B — Navigation semantics for links

### Files to change
- `packages/core/src/components/atoms/button/button-a11y.ts`
- `packages/core/src/components/atoms/button/button-types.ts`
- `packages/react/src/components/button/button.tsx`
- `packages/vue/src/components/button/button.ts`
- `tests/contracts/button.contract.ts`
- button stories/docs in React and Vue Storybook

### Work items
- [ ] Revisit whether navigation controls rendered as anchors should keep link semantics instead of `role="button"`
- [ ] Align contract tests with the final semantic decision
- [ ] Update docs to distinguish action buttons from navigation links more clearly

### Acceptance criteria
- [ ] Navigational controls use intentional semantics documented in one place
- [ ] button contracts reflect the final policy
- [ ] React and Vue stay aligned

---

## Phase 3 — Expand shared accessibility contracts to the highest-risk widgets

### Goal
Bring a11y-critical widget behavior under the same cross-framework contract discipline already used elsewhere.

### New contract files to add
- `tests/contracts/accordion.contract.ts`
- `tests/contracts/switch.contract.ts`
- `tests/contracts/tab.contract.ts`
- `tests/contracts/tooltip.contract.ts`
- `tests/contracts/slider.contract.ts`
- optionally `tests/contracts/dialog-modal.contract.ts`
- optionally `tests/contracts/select-combobox.contract.ts`

### React files likely to change
- `packages/react/src/components/accordion/__tests__/*`
- `packages/react/src/components/switch/__tests__/*`
- `packages/react/src/components/tab/__tests__/*`
- `packages/react/src/components/tooltip/__tests__/*`
- `packages/react/src/components/slider/__tests__/*`
- `packages/react/src/components/dialog/__tests__/*`
- `packages/react/src/components/input/__tests__/select-field.test.tsx`

### Vue files likely to change
- `packages/vue/src/components/accordion/__tests__/*`
- `packages/vue/src/components/switch/__tests__/*`
- `packages/vue/src/components/tab/__tests__/*`
- `packages/vue/src/components/tooltip/__tests__/*`
- `packages/vue/src/components/slider/__tests__/*`
- `packages/vue/src/components/dialog/__tests__/*`
- `packages/vue/src/components/input/__tests__/select-field.test.ts`

### Work items
- [x] Add shared accordion contract covering open state, ids, and label/description wiring
- [x] Add shared switch contract covering name, checked state, and disabled behavior
- [x] Add shared tab contract covering roving focus, active state, and panel wiring
- [x] Add shared tooltip contract covering trigger labeling and open/close behavior
- [x] Add shared slider contract covering label, description, value updates, and disabled state
- [x] Expand dialog modal tests beyond current local checks into shared modal behavior rules where practical
- [ ] Add explicit keyboard-matrix tests for custom select if it remains shipped

### Acceptance criteria
- [ ] React and Vue run the same accessibility contracts for high-risk widgets
- [ ] keyboard interaction coverage becomes explicit, not incidental
- [ ] parity regressions are easier to catch early

---

## Phase 4 — Harden the highest-risk components

### Goal
Improve the behavior of components that are most likely to fail real-world accessibility review.

## 4A — Dialog modal hardening

### Current strengths
- focus trap exists
- restore focus exists
- escape handling exists
- scrim dismissal exists

### Files to change
- `packages/react/src/components/dialog/dialog-modal.tsx`
- `packages/vue/src/components/dialog/dialog-modal.ts`
- dialog tests in both adapters
- dialog docs in both Storybooks if behavior changes

### Work items
- [x] Add an explicit initial-focus policy
- [ ] Consider background isolation via `inert` or equivalent sibling management where feasible
- [ ] Add tests for nested focusables and no-focusable-content fallback
- [x] Document modal boundary behavior more explicitly

### Acceptance criteria
- [x] modal behavior is deterministic on open
- [ ] background interaction is more clearly suppressed
- [x] tests cover focus lifecycle more completely

## 4B — Custom select hardening

### Files to change
- `packages/react/src/components/input/select-field.tsx`
- `packages/vue/src/components/input/select-field.ts`
- select-related tests and contracts
- docs in both Storybooks

### Work items
- [ ] Add ArrowUp and ArrowDown coverage
- [ ] Add Home and End coverage
- [ ] Add Escape close coverage
- [ ] Add disabled option traversal rules
- [ ] Add `aria-activedescendant` assertions
- [ ] Decide whether typeahead belongs in scope

### Acceptance criteria
- [ ] custom combobox behavior is fully keyboard-tested if it remains supported
- [ ] docs clearly indicate when to prefer native select

## 4C — Rich text risk handling

### Files to change
- `packages/react/src/components/input/rich-text.tsx`
- `packages/vue/src/components/input/rich-text.ts`
- rich text tests in both adapters
- `docs/reference/testing.md`
- new accessibility support doc from Phase 5

### Work items
- [ ] Document rich text as a manual-review-heavy component
- [ ] Strengthen toolbar and editor behavior expectations
- [ ] Audit current `contentEditable` + `execCommand` assumptions
- [ ] Define what is guaranteed automatically vs what needs manual AT review

### Acceptance criteria
- [ ] rich text risk is explicitly documented
- [ ] tests and docs stop implying stronger guarantees than the implementation can prove

## 4D — Tooltip scope discipline

### Files to change
- `packages/react/src/components/tooltip/tooltip-group.tsx`
- `packages/vue/src/components/tooltip/tooltip-group.ts`
- tooltip stories/docs in both Storybooks
- tooltip tests and contracts

### Work items
- [x] Clarify tooltip content expectations as non-interactive
- [x] Add docs stating when a popover/dialog should be used instead
- [x] Add tests for keyboard dismissal and label/description wiring
- [ ] Optionally add dev-time warnings for clearly invalid interactive usage if practical

### Acceptance criteria
- [x] tooltip contract is clearer
- [x] users are less likely to misuse tooltip as a general popover

---

## Phase 5 — Add a first-class accessibility support model

### Goal
Document what Marwes supports, what it automates, and where manual review is required.

### New file to add
- `docs/reference/accessibility.md`

### Existing docs to update
- `docs/README.md`
- `docs/reference/testing.md`
- `docs/reference/governance.md`
- `README.md` if public claims need tightening

### Document contents
- supported browser and assistive technology assumptions
- automated checks vs manual checks
- component risk tiers
- manual review checklist
- expectations for custom widgets vs native controls
- release expectations for accessibility-sensitive families

### Suggested sections

#### 1. Accessibility support assumptions
Examples to document intentionally:
- VoiceOver + Safari
- NVDA + Firefox
- JAWS + Chrome
- mobile screen reader expectations if you want to claim them

#### 2. What automation covers
- semantic structure
- label/description wiring
- keyboard basics for covered widgets
- Storybook a11y checks
- contract tests

#### 3. What still requires manual review
- dialog focus behavior across AT/browser combinations
- custom select behavior in real environments
- rich text editing behavior
- tooltip behavior in compositions
- mobile interaction edge cases

#### 4. Component risk tiers
- low risk: native form controls, divider, heading, paragraph
- medium risk: toast, accordion, tabs, switch, slider
- high risk: dialog modal, custom select, rich text, tooltip composition

### Acceptance criteria
- [ ] Marwes has a canonical accessibility support document
- [ ] claims in README/docs are better calibrated
- [ ] manual review is part of the documented process, not tribal knowledge

---

## Phase 6 — Validate theme accessibility as part of quality

### Goal
Back up contrast-related claims with explicit validation.

### Files to change
- `packages/core/src/theme/color-utils.ts`
- `packages/core/src/theme/color-resolve.ts`
- `packages/core/src/theme/theme-normalize.ts`
- possibly new theme validation module under `packages/core/src/theme/`
- tests under `packages/core/test/` or package-local tests
- `docs/guides/figma-to-marwes.md`
- `docs/reference/testing.md`

### New files likely needed
- `packages/core/src/theme/theme-accessibility.ts`
- `packages/core/test/theme-accessibility.test.ts`

### Work items
- [ ] Add a theme accessibility validator around current contrast utilities
- [ ] Define what minimum contrast is expected for shipped presets
- [ ] Add preset-level tests for text/background combinations that are part of the public contract
- [ ] Decide whether invalid consumer overrides should warn in development

### Acceptance criteria
- [ ] preset accessibility claims are test-backed
- [ ] contrast regressions become detectable in CI or local trust gates

---

## Phase 7 — Add dev-time accessibility guardrails

### Goal
Catch common mistakes early in development, similar to how axe-core acts as a useful linting layer.

### Existing good example
- `packages/core/src/components/atoms/button/button-a11y.ts`

### Areas to add warnings

#### Avatar
- `packages/core/src/components/atoms/avatar/avatar-a11y.ts`
- warn on likely non-decorative image avatar without useful alt/label context

#### Dialog
- `packages/core/src/components/atoms/dialog/dialog-a11y.ts`
- warn when neither `ariaLabel` nor visible-title-derived labeling exists

#### Rich text
- `packages/core/src/components/atoms/input/rich-text-a11y.ts`
- warn when no accessible name is provided

#### Switch
- `packages/core/src/components/atoms/switch/switch-a11y.ts`
- warn when no accessible name path exists

#### Tooltip group
- adapter-level warnings if clearly invalid content patterns are passed and can be detected safely

### Acceptance criteria
- [ ] high-probability accessibility mistakes produce useful development warnings
- [ ] warnings stay framework-neutral when they belong in core
- [ ] warnings do not overreach into noisy false-positive territory

---

# Prioritized todo checklist

Use this as the execution order.

This section now follows the repository workflow from `docs/guides/adding-components.md`.
For component-level accessibility work, the checklist should move through the tree in this order:

```text
spec/decision → core → preset CSS → React adapter → React stories/tests → Vue adapter → Vue stories/tests → contracts/exports → verify
```

## Component-tree execution model

For each family, audit the same tree in the same order.

### 1. Core
- `packages/core/src/components/atoms/<family>/`
- review `*-types.ts`, `*-a11y.ts`, `*-recipe.ts`, and any local helpers

### 2. Presets
- `packages/presets/src/firstEdition/<family>.css`
- plus `packages/presets/src/firstEdition/molecules/*` when applicable

### 3. React adapter
- `packages/react/src/components/<family>/`

### 4. React stories and tests
- `apps/storybook-react/src/stories/<family>/`
- `packages/react/src/components/<family>/__tests__/`

### 5. Vue adapter
- `packages/vue/src/components/<family>/`

### 6. Vue stories and tests
- `apps/storybook-vue/src/stories/<family>/`
- `packages/vue/src/components/<family>/__tests__/`

### 7. Shared contracts and verification
- `tests/contracts/*.contract.ts`
- relevant exports
- `pnpm typecheck`
- `pnpm test:packages`
- `pnpm storybook:consistency`
- `pnpm check`

## Family audit template

Use this template when walking one component family.

### `<family>` audit checklist
- [ ] spec decision confirmed or updated
- [ ] core types reviewed
- [ ] core a11y reviewed
- [ ] core recipe reviewed
- [ ] preset CSS reviewed for focus/disabled/invalid/hover states
- [ ] React adapter reviewed for DOM semantics and event behavior
- [ ] React stories/tests reviewed
- [ ] Vue adapter reviewed for DOM semantics and event behavior
- [ ] Vue stories/tests reviewed
- [ ] shared contract added or updated
- [ ] public docs updated if behavior changed
- [ ] verification commands run

## P0 — Cross-cutting foundation work first

These items unlock the component audits and should land before broad family-by-family work.

### Accessibility enforcement foundation
- [ ] Replace `a11y: { test: "todo" }` in:
  - `apps/storybook-react/.storybook/preview.tsx`
  - `apps/storybook-vue/.storybook/preview.ts`
- [ ] Add a dedicated accessibility verification command in `package.json`
- [ ] Add accessibility verification to the documented trust model in:
  - `docs/reference/governance.md`
  - `docs/reference/testing.md`
- [ ] Define how temporary story-level a11y exemptions are allowed and documented

### Documentation and decision foundation
- [ ] Resolve `DEC-001` in `docs/reference/spec.md`
- [ ] Decide whether `Select` becomes native-first by default
- [ ] Add `docs/reference/accessibility.md`
- [ ] Link it from:
  - `docs/README.md`
  - `docs/reference/testing.md`
  - `docs/reference/governance.md`

## P1 — First component audit queue

Walk these families through the tree structure from the adding-components guide.
These are the highest-leverage first audits.

### 1. Input / Select family
Tree anchors:
- Core: `packages/core/src/components/atoms/input/`
- Presets: `packages/presets/src/firstEdition/input.css`, `select.css`, `rich-text.css`, `molecules/input-field.css`
- React: `packages/react/src/components/input/`
- React stories: `apps/storybook-react/src/stories/input/`
- Vue: `packages/vue/src/components/input/`
- Vue stories: `apps/storybook-vue/src/stories/input/`
- Contracts: `tests/contracts/select.contract.ts`, `select-field.contract.ts`, `dropdown-field.contract.ts`, `input*.contract.ts`, `rich-text*.contract.ts`

Checklist:
- [x] apply the select default-mode decision in core
- [x] audit custom combobox keyboard behavior if it remains shipped
- [x] document when native select is preferred
- [x] review rich text as a manual-review-heavy subfamily

### 2. Tab family
Tree anchors:
- Core: `packages/core/src/components/atoms/tab/`
- Presets: `packages/presets/src/firstEdition/tab.css`
- React: `packages/react/src/components/tab/`
- React stories: `apps/storybook-react/src/stories/tab/`
- Vue: `packages/vue/src/components/tab/`
- Vue stories: `apps/storybook-vue/src/stories/tab/`
- Contracts: add `tests/contracts/tab.contract.ts`

Checklist:
- [x] review `tab-a11y.ts` and `tab-group-a11y.ts`
- [x] add shared tab contract
- [x] verify roving focus, panel wiring, and disabled-tab behavior in both adapters

### 3. Switch family
Tree anchors:
- Core: `packages/core/src/components/atoms/switch/`
- Presets: `packages/presets/src/firstEdition/switch.css`
- React: `packages/react/src/components/switch/`
- React stories: `apps/storybook-react/src/stories/switch/`
- Vue: `packages/vue/src/components/switch/`
- Vue stories: `apps/storybook-vue/src/stories/switch/`
- Contracts: add `tests/contracts/switch.contract.ts`

Checklist:
- [x] review switch labeling rules in core
- [x] add shared switch contract
- [x] verify checked, disabled, description, and field-wiring behavior in both adapters

## P2 — Second component audit queue

### 4. Accordion family
Tree anchors:
- Core: `packages/core/src/components/atoms/accordion/`
- Presets: `packages/presets/src/firstEdition/accordion.css`
- React: `packages/react/src/components/accordion/`
- Vue: `packages/vue/src/components/accordion/`
- Storybooks: both `stories/accordion/`
- Contracts: add `tests/contracts/accordion.contract.ts`

Checklist:
- [x] audit trigger/panel/id relationships
- [x] add shared accordion contract
- [x] verify grouped-field labeling and error wiring in both adapters

### 5. Tooltip family
Tree anchors:
- Core: `packages/core/src/components/atoms/tooltip/`
- Presets: `packages/presets/src/firstEdition/tooltip.css`
- React: `packages/react/src/components/tooltip/`
- Vue: `packages/vue/src/components/tooltip/`
- Storybooks: both `stories/tooltip/`
- Contracts: add `tests/contracts/tooltip.contract.ts`

Checklist:
- [x] audit tooltip trigger semantics and dismissal behavior
- [x] add shared tooltip contract
- [x] document tooltip as non-interactive content only

### 6. Slider family
Tree anchors:
- Core: `packages/core/src/components/atoms/slider/`
- Presets: `packages/presets/src/firstEdition/slider.css`
- React: `packages/react/src/components/slider/`
- Vue: `packages/vue/src/components/slider/`
- Storybooks: both `stories/slider/`
- Contracts: add `tests/contracts/slider.contract.ts`

Checklist:
- [x] audit label/value/describedby wiring
- [x] add shared slider contract
- [x] verify disabled, tooltip, and value-change behavior in both adapters

### 7. Dialog family
Tree anchors:
- Core: `packages/core/src/components/atoms/dialog/`
- Presets: `packages/presets/src/firstEdition/dialog.css`
- React: `packages/react/src/components/dialog/`
- Vue: `packages/vue/src/components/dialog/`
- Storybooks: both `stories/dialog/`
- Contracts: add `tests/contracts/dialog-modal.contract.ts` if practical

Checklist:
- [x] audit `dialog-a11y.ts` and modal lifecycle behavior separately
- [x] add explicit initial-focus policy
- [x] evaluate background isolation via `inert` or equivalent sibling management
- [x] expand focus lifecycle tests in both adapters

## P3 — Follow-up family and system work

### Button semantics cleanup
Tree anchors:
- Core: `packages/core/src/components/atoms/button/`
- Presets: `packages/presets/src/firstEdition/button.css`
- React: `packages/react/src/components/button/`
- Vue: `packages/vue/src/components/button/`
- Storybooks: button stories in both apps
- Contracts: `tests/contracts/button.contract.ts`

Checklist:
- [ ] revisit anchor-backed button semantics
- [ ] align contract tests with the final policy
- [ ] update docs to distinguish navigation links from action buttons

### Theme accessibility validation
- [ ] Add a theme accessibility validator, likely in:
  - `packages/core/src/theme/theme-accessibility.ts`
- [ ] Add tests for shipped preset contrast guarantees
- [ ] Decide whether invalid consumer theme overrides warn in development

### Dev-time warnings
- [ ] Expand a11y warnings beyond icon-only buttons
- [ ] Evaluate warnings for:
  - avatar labeling
  - switch labeling
  - dialog labeling
  - rich text labeling
  - tooltip misuse

### Governance maturity
- [ ] Fold accessibility verification into the long-term release checklist
- [ ] Treat regressions in high-risk widget contracts as release-level issues
- [ ] Expand accessibility coverage gradually rather than landing one huge refactor

## Recommended first three work items

If you want the fastest meaningful progress, start here:

1. [ ] Tighten Storybook a11y enforcement and add the repo-level accessibility command
2. [ ] Run the Input / Select family through the full tree using the resolved default-mode decision
3. [ ] Add shared `tab` and `switch` contracts, then audit both families end-to-end

---

# Suggested PR sequence

## PR 1 — Accessibility gate foundations
- tighten Storybook a11y preview config
- add accessibility command to repo scripts
- update governance/testing docs

## PR 2 — Native-first select decision
- resolve `DEC-001`
- change select default if approved
- update stories/tests/docs

## PR 3 — Link semantics cleanup
- revisit anchor-backed button semantics
- update button contracts and docs

## PR 4 — New shared contracts for tabs, switch, accordion, tooltip, slider
- add contract files
- wire both adapters

## PR 5 — Dialog modal hardening
- focus lifecycle improvements
- background isolation strategy
- stronger tests

## PR 6 — Accessibility support documentation
- add `docs/reference/accessibility.md`
- cross-link from docs index and governance/testing docs

## PR 7 — Theme accessibility validation
- new validator
- tests for shipped preset guarantees

## PR 8 — Dev-time warnings expansion
- avatar, dialog, switch, rich text, tooltip where appropriate

---

# Commands to keep using during this roadmap

```bash
pnpm typecheck
pnpm docs:links
pnpm docs:api
pnpm semantics:check
pnpm artifacts:check
pnpm storybook:consistency
pnpm test:packages
pnpm test:typecheck:contracts
pnpm check
```

Likely additions during this roadmap:

```bash
pnpm test:a11y
# or
pnpm accessibility:check
```

---

# Definition of done for the roadmap

Marwes should be considered meaningfully improved when all of the following are true:

- [ ] accessibility checks are not left in advisory-only mode
- [ ] native-first decisions are resolved and reflected in code
- [ ] high-risk widgets have shared React/Vue accessibility contracts
- [ ] dialog, custom select, tooltip, and rich text have clearer risk handling
- [ ] accessibility support assumptions are documented canonically
- [ ] preset accessibility claims are backed by validation
- [ ] common developer mistakes trigger useful warnings

---

# Final recommendation

Do not replace the current Marwes architecture.
It is already one of the project’s strengths.

Instead, use this roadmap to layer in the part that `axe-core` does exceptionally well:
**accessibility as an enforceable system, not just an implementation intention.**
