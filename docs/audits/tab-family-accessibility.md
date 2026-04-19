# Tab Family Accessibility Audit

## Goal
Audit the entire Tab family step by step through the Marwes tree structure.

This audit starts with Tabs next because the family combines a low-level atom with a
higher-risk coordinated widget pattern:
- a raw `Tab` atom
- `TabGroup` and `TabPanel` coordination
- automatic keyboard-driven tab activation
- disabled-tab handling
- purpose variants that should stay React/Vue aligned

The main goal is to prove that Marwes ships one intentional tab contract across:
- core keyboard and id logic
- preset focus and selected states
- React behavior
- Vue behavior
- Storybook guidance
- shared contracts

## Scope
This audit covers:

### Atom
- `Tab`

### Molecule
- `TabGroup`
- `TabPanel`

### Purpose variants
- `NavigationTabs`
- `ContentTabs`
- `SettingsTabs`

## Tree anchors

### Core
- `packages/core/src/components/atoms/tab/index.ts`
- `packages/core/src/components/atoms/tab/tab-types.ts`
- `packages/core/src/components/atoms/tab/tab-a11y.ts`
- `packages/core/src/components/atoms/tab/tab-recipe.ts`
- `packages/core/src/components/atoms/tab/tab-group-a11y.ts`
- `packages/core/src/components/atoms/tab/tab-group-types.ts`

### Presets
- `packages/presets/src/firstEdition/tab.css`
- `packages/presets/src/firstEdition/molecules/tab-group.css`

### React
- `packages/react/src/components/tab/tab.tsx`
- `packages/react/src/components/tab/tab-group.tsx`
- `packages/react/src/components/tab/variants.tsx`
- tests:
  - `packages/react/src/components/tab/__tests__/`

### React stories and docs
- `apps/storybook-react/src/stories/tab/Introduction.mdx`
- `apps/storybook-react/src/stories/tab/tab.stories.tsx`
- `apps/storybook-react/src/stories/tab/tab-group.stories.tsx`
- `apps/storybook-react/src/stories/tab/navigation-tabs.stories.tsx`
- `apps/storybook-react/src/stories/tab/content-tabs.stories.tsx`
- `apps/storybook-react/src/stories/tab/settings-tabs.stories.tsx`
- storybook tests:
  - `apps/storybook-react/src/stories/tab/__tests__/`

### Vue
- `packages/vue/src/components/tab/tab.ts`
- `packages/vue/src/components/tab/tab-group.ts`
- `packages/vue/src/components/tab/variants.ts`
- tests:
  - `packages/vue/src/components/tab/__tests__/`

### Vue stories and docs
- `apps/storybook-vue/src/stories/tab/Introduction.mdx`
- `apps/storybook-vue/src/stories/tab/tab.stories.ts`
- `apps/storybook-vue/src/stories/tab/tab-group.stories.ts`
- `apps/storybook-vue/src/stories/tab/navigation-tabs.stories.ts`
- `apps/storybook-vue/src/stories/tab/content-tabs.stories.ts`
- `apps/storybook-vue/src/stories/tab/settings-tabs.stories.ts`
- storybook tests:
  - `apps/storybook-vue/src/stories/tab/__tests__/`

### Contracts
- add `tests/contracts/tab.contract.ts`

## Step-by-step audit checklist

### 0. Spec and decision pass
- [x] confirm current Tab-family requirements in `docs/reference/spec.md`
- [x] make the activation model explicit: automatic activation on arrow movement vs manual activation on Enter/Space
- [x] confirm the intended disabled-tab policy for Marwes roving focus behavior
- [x] confirm whether raw `Tab` docs need stronger icon-only naming guidance

### 1. Core audit

#### 1A. Tab atom
- [ ] review `tab-types.ts`
- [ ] review `tab-a11y.ts`
- [ ] review `tab-recipe.ts`
- [ ] verify `role="tab"`, selected state, disabled state, and `tabIndex` behavior are intentional
- [ ] verify icon-only tab naming requirements are explicit

#### 1B. TabGroup helpers
- [ ] review `tab-group-types.ts`
- [ ] review `tab-group-a11y.ts`
- [ ] verify id generation for tablist, tabs, and panels
- [ ] verify first-enabled fallback when the requested tab is missing or disabled
- [ ] verify ArrowLeft, ArrowRight, Home, and End behavior
- [ ] verify disabled tabs are skipped intentionally
- [ ] verify wraparound behavior is intentional and documented

### 2. Preset CSS audit
- [ ] review `tab.css` for focus-visible, selected, hover, and disabled states
- [ ] review `molecules/tab-group.css` for list and panel affordances
- [ ] confirm selected-state visuals align with semantic selected state
- [ ] confirm disabled-state visuals align with actual disabled behavior
- [ ] confirm visible focus remains obvious on both tabs and the active panel

### 3. React adapter audit

#### 3A. Atom and group
- [ ] review `tab.tsx`
- [ ] review `tab-group.tsx`
- [ ] verify native button semantics are preserved
- [ ] verify core a11y output is applied directly and completely
- [ ] verify keyboard behavior matches the intended activation model

#### 3B. Purpose variants
- [ ] review `variants.tsx`
- [ ] verify purpose wrappers preserve the base accessibility contract
- [ ] confirm purpose metadata does not replace or weaken tablist labeling

### 4. React stories and tests audit
- [ ] review `apps/storybook-react/src/stories/tab/Introduction.mdx`
- [ ] review all React tab story files for keyboard, disabled, and controlled-state coverage
- [ ] review `apps/storybook-react/src/stories/tab/__tests__/`
- [ ] review `packages/react/src/components/tab/__tests__/`
- [ ] confirm docs teach the right boundary between `TabGroup` and raw `Tab`
- [ ] identify any tab cases that should later join automated accessibility smoke coverage

### 5. Vue adapter audit

#### 5A. Atom and group
- [ ] review `tab.ts`
- [ ] review `tab-group.ts`
- [ ] verify native button semantics are preserved
- [ ] verify core a11y output is applied directly and completely
- [ ] verify keyboard behavior matches React and the intended activation model

#### 5B. Purpose variants
- [ ] review `variants.ts`
- [ ] verify purpose wrappers preserve the base accessibility contract
- [ ] confirm Vue event ergonomics do not change the accessibility contract

### 6. Vue stories and tests audit
- [ ] review `apps/storybook-vue/src/stories/tab/Introduction.mdx`
- [ ] review all Vue tab story files for keyboard, disabled, and controlled-state coverage
- [ ] review `apps/storybook-vue/src/stories/tab/__tests__/`
- [ ] review `packages/vue/src/components/tab/__tests__/`
- [ ] confirm Vue docs teach the same contract and boundaries as React docs

### 7. Shared contracts and gaps
- [x] add `tests/contracts/tab.contract.ts`
- [x] wire the shared tab contract into both React and Vue adapter tests
- [x] verify the contract covers tablist naming, panel wiring, keyboard movement, and disabled-tab behavior
- [x] verify the contract covers both controlled and uncontrolled paths where practical

### 8. Expected decisions from this audit
This Tab-family audit should ideally end with clear answers to these questions:

- [ ] Does Marwes intentionally use automatic activation for `TabGroup` keyboard navigation?
- [ ] What exact keyboard matrix is mandatory for shared tab behavior?
- [ ] Should disabled tabs ever participate in roving focus, or should they always be skipped entirely?
- [ ] Which Tab-family stories should later be part of automated accessibility gates?

### 9. Verification
Run after finishing the family audit and any resulting fixes:

- [ ] `pnpm typecheck`
- [ ] `pnpm test:packages`
- [ ] `pnpm storybook:consistency`
- [ ] `pnpm check`

## Audit outputs to capture

### Good signals to preserve
- core-owned tab keyboard and id logic
- strong React/Vue parity across the family
- clear Storybook separation between purpose variants, `TabGroup`, and raw `Tab`
- existing local tests for labeled tablists, disabled-tab skipping, and controlled state

### Risks to resolve or document
- missing explicit Tab-family requirement in `docs/reference/spec.md`
- missing shared `tab` contract despite cross-framework widget behavior
- incomplete keyboard-matrix proof relative to the behavior the component already ships
- any drift between Storybook claims and what contracts actually prove
- any ambiguity around disabled-tab focus behavior

### Deliverables expected from the Tab audit
- one clear statement of the shipped activation model
- one shared `tab` contract for React and Vue
- a list of any missing keyboard, naming, or panel-wiring assertions
- doc updates wherever public guidance is ahead of proven behavior

## Current findings — first pass (2026-04-17)

This section records the first direct audit pass across core, presets, adapters, stories, and tests.

### What looks good right now

#### 1. Core already owns the most important tab mechanics
Confirmed in:
- `packages/core/src/components/atoms/tab/tab-a11y.ts`
- `packages/core/src/components/atoms/tab/tab-recipe.ts`
- `packages/core/src/components/atoms/tab/tab-group-a11y.ts`
- `packages/core/src/components/atoms/tab/tab-group-types.ts`

Good signals:
- the raw `Tab` atom keeps a small, explicit accessibility surface
- `buildTabGroupA11yIds()` centralizes tablist, tab, and panel id generation
- `resolveTabValue()` gives the family a stable first-enabled fallback path
- `moveTabSelection()` keeps keyboard movement logic framework-agnostic

This is the right architectural shape for a shared accessibility contract later.

#### 2. React and Vue parity is strong across the family
Confirmed in:
- `packages/react/src/components/tab/tab.tsx`
- `packages/react/src/components/tab/tab-group.tsx`
- `packages/react/src/components/tab/variants.tsx`
- `packages/vue/src/components/tab/tab.ts`
- `packages/vue/src/components/tab/tab-group.ts`
- `packages/vue/src/components/tab/variants.ts`

Good signals:
- both adapters consume the same core keyboard and id helpers
- both adapters expose the same controlled and uncontrolled `TabGroup` model
- both adapters mirror purpose metadata for `NavigationTabs`, `ContentTabs`, and `SettingsTabs`
- both adapters render native buttons for individual tabs instead of custom div-based controls

#### 3. Storybook guidance already teaches the right layer boundaries
Confirmed in:
- `apps/storybook-react/src/stories/tab/Introduction.mdx`
- `apps/storybook-vue/src/stories/tab/Introduction.mdx`
- atom, molecule, and purpose stories in both Storybooks

Good signals:
- the docs clearly separate purpose variants from `TabGroup` and raw `Tab`
- the low-level `Tab` docs already say consumers must manage tablist coordination themselves
- both Storybooks include controlled and disabled examples for `TabGroup`
- both Storybooks maintain the same taxonomy across React and Vue

#### 4. Existing adapter tests already cover several important basics
Confirmed in:
- `packages/react/src/components/tab/__tests__/tab-group.test.tsx`
- `packages/react/src/components/tab/__tests__/variants.test.tsx`
- `packages/vue/src/components/tab/__tests__/tab-group.test.ts`
- `packages/vue/src/components/tab/__tests__/variants.test.ts`

Good signals:
- labeled tablist naming is covered
- the selected panel path is covered
- disabled tabs are skipped on ArrowRight in both adapters
- controlled-state behavior is covered in both adapters
- purpose metadata is covered in both adapters

This is a solid starting point even though the family is still missing a shared contract.

### Confirmed risks and gaps

#### Risk 1. The Tab-family contract is not yet explicit in `docs/reference/spec.md`
Confirmed in:
- `docs/reference/spec.md`
- current Tab implementation and Storybook docs

Current state:
- I did not find a tab-specific spec requirement in `docs/reference/spec.md`
- the family currently teaches its contract mainly through implementation and Storybook docs
- important behavior choices are therefore de facto decisions instead of explicit spec decisions

Why this matters:
- the methodology says decisions should be explicit before behavior is hardened
- tabs have meaningful policy choices, especially around activation and disabled-tab behavior

Status after follow-up fix:
- added `REQ-TAB-001` and `DEC-007` to `docs/reference/spec.md`
- the spec now states automatic activation, disabled-tab skipping, first-enabled fallback, and naming/wiring expectations explicitly

#### Risk 2. There is no shared `tests/contracts/tab.contract.ts`
Confirmed in:
- `tests/contracts/`
- `packages/react/src/components/tab/__tests__/`
- `packages/vue/src/components/tab/__tests__/`

Current state:
- Tab coverage currently lives only in local React and Vue test files
- React and Vue behavior is mirrored, but not yet proven through one framework-agnostic contract
- this is the exact gap called out in `AXE_ROADMAP.md`

Why this matters:
- tabs are one of the higher-risk coordinated widgets in the library
- without a shared contract, parity can drift more easily between adapters

Status after follow-up fix:
- added `tests/contracts/tab.contract.ts`
- wired the shared contract into both React and Vue `TabGroup` tests

#### Risk 3. The shipped keyboard behavior is broader than the current test proof
Confirmed in:
- `packages/core/src/components/atoms/tab/tab-group-a11y.ts`
- `packages/react/src/components/tab/tab-group.tsx`
- `packages/vue/src/components/tab/tab-group.ts`
- current React and Vue tab-group tests

Current state:
- implementation supports ArrowRight, ArrowLeft, Home, and End
- keyboard movement wraps across enabled tabs
- disabled tabs are skipped during movement
- current tests explicitly prove ArrowRight skip behavior, but I did not find explicit proof for:
  - ArrowLeft behavior
  - Home and End behavior
  - wraparound behavior
  - first-enabled fallback when `defaultActiveTab` or `activeTab` points to a disabled tab
  - the no-enabled-tabs edge case

This was the clearest Tab-family coverage gap.

Status after follow-up fix:
- the shared contract now proves ArrowLeft, ArrowRight, Home, End, wraparound, and disabled fallback behavior
- the no-enabled-tabs edge case remains undocumented and untested in this pass

#### Risk 4. Labeling and panel wiring are only partially asserted today
Confirmed in:
- `packages/react/src/components/tab/tab-group.tsx`
- `packages/vue/src/components/tab/tab-group.ts`
- current React and Vue tab-group tests

Current state:
- the implementation wires `aria-controls` from each tab to its panel id
- each panel wires `aria-labelledby` back to its tab id
- the visible-label path for the tablist is tested
- I did not find explicit shared or local assertions for:
  - the `ariaLabel` fallback path when no visible label is provided
  - exact `aria-controls` / `aria-labelledby` pairing
  - icon-only tab naming through `ariaLabel`

These are important because they are the actual accessibility contract, not just rendering details.

Status after follow-up fix:
- the shared contract now covers visible-label naming, `ariaLabel` fallback naming, and exact `aria-controls` / `aria-labelledby` wiring
- the raw icon-only `Tab` requirement is now explicit in the spec
- React and Vue now both have dedicated local atom tests for the icon-only `ariaLabel` path

#### Risk 5. Disabled-tab semantics should be documented more clearly
Confirmed in:
- `packages/core/src/components/atoms/tab/tab-a11y.ts`
- `packages/react/src/components/tab/tab.tsx`
- `packages/vue/src/components/tab/tab.ts`

Current state:
- adapters render disabled tabs as real disabled buttons
- disabled tabs also receive `aria-disabled`
- keyboard movement skips disabled tabs entirely
- the comment in `tab-a11y.ts` says disabled tabs remain in the tab sequence as `-1`, which does not fully match what disabled-button semantics communicate in practice

Why this matters:
- future contributors should not have to infer the intended disabled-tab policy from mixed signals
- this is a small but important contract clarification point

Status after follow-up fix:
- the core comment in `packages/core/src/components/atoms/tab/tab-a11y.ts` now matches the shipped disabled-tab policy more closely
- React and Vue atom tests now assert disabled tabs render with disabled semantics, `aria-disabled`, and `tabIndex=-1`

#### Risk 6. Public docs currently promise more than shared verification proves
Confirmed in:
- `apps/storybook-react/src/stories/tab/Introduction.mdx`
- `apps/storybook-vue/src/stories/tab/Introduction.mdx`

Current state:
- docs explicitly promise built-in keyboard navigation and accessible panel wiring
- those claims look directionally correct from the implementation
- but they are not yet backed by a shared cross-framework contract

This is not a docs bug yet.
It is a proof gap that should be closed before the family is considered hardened.

### Likely decisions coming out of this audit

#### Decision A — Make the activation model explicit
Reasoning from the first pass:
- `TabGroup` currently changes the active tab during arrow-key navigation
- that means Marwes is effectively shipping automatic activation today
- this should be an explicit spec decision instead of an implementation accident

#### Decision B — Add a shared `tab` contract next
Minimum contract surface should cover:
- visible-label tablist naming
- `ariaLabel` fallback naming
- tab `aria-controls` to panel id wiring
- panel `aria-labelledby` wiring
- ArrowRight and ArrowLeft movement
- Home and End behavior
- disabled-tab skipping
- controlled and uncontrolled selection behavior where practical

#### Decision C — Clarify the disabled-tab policy
The current implementation appears to intend:
- disabled tabs are not activatable
- disabled tabs are skipped during keyboard movement
- disabled tabs are rendered as actually disabled controls

That should be stated clearly in one place and then reflected consistently in comments, tests, and docs.

### Recommended first fixes from the Tab audit

#### Fix 1 — Add the shared contract the roadmap already calls for
Files:
- new contract: `tests/contracts/tab.contract.ts`
- `packages/react/src/components/tab/__tests__/tab-group.test.tsx`
- `packages/vue/src/components/tab/__tests__/tab-group.test.ts`

#### Fix 2 — Expand keyboard-focused proof to match the shipped behavior
Files:
- `tests/contracts/tab.contract.ts`
- adapter harnesses in the React and Vue tab-group tests

Coverage to add:
- ArrowLeft
- Home
- End
- wraparound
- disabled fallback cases

#### Fix 3 — Add explicit assertions for naming and panel wiring
Files:
- `tests/contracts/tab.contract.ts`
- local adapter tests if any framework-specific assertion is still needed

Coverage to add:
- `aria-label` fallback on the tablist
- `aria-controls`
- `aria-labelledby`
- icon-only tab naming path if Marwes intends to support it directly

#### Fix 4 — Record the Tab-family contract in the spec
Files:
- `docs/reference/spec.md`
- Tab Storybook introductions if wording needs alignment afterward

### Recommended execution order inside the Tab family

1. record the intended activation and disabled-tab policy in the spec
2. add the shared `tab` contract
3. use that contract to fill the keyboard and wiring proof gaps in both adapters
4. update Storybook wording if the explicit decision changes any current claims
5. run verification and record the next findings in this doc
