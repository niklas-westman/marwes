# Input Family Accessibility Audit

## Goal
Audit the entire Input family step by step through the Marwes tree structure.

This audit starts with Input because it contains the highest concentration of accessibility-sensitive behavior:
- native text inputs
- helper and error wiring
- custom vs native select behavior
- input wrappers and purpose variants
- one-time-code input behavior
- rich text editing behavior

This family also contains both low-risk native controls and higher-risk custom widgets.
That makes it the best first end-to-end audit.

## Scope
This audit covers:

### Atoms
- `Input`
- `Textarea`
- `Select`
- `InputOtp`
- `RichText`

### Fields and variants
- `InputField`
- `TextareaField`
- `SelectField`
- `RichTextField`
- `DropdownField`
- `EmailField`
- `PasswordField`
- `PhoneField`
- `URLField`
- `CurrencyField`
- `DateOfBirthField`
- `ZipCodeField`

## Tree anchors

### Core
- `packages/core/src/components/atoms/input/index.ts`
- `packages/core/src/components/atoms/input/input-a11y.ts`
- `packages/core/src/components/atoms/input/input-recipe.ts`
- `packages/core/src/components/atoms/input/input-types.ts`
- `packages/core/src/components/atoms/input/textarea-a11y.ts`
- `packages/core/src/components/atoms/input/textarea-recipe.ts`
- `packages/core/src/components/atoms/input/textarea-types.ts`
- `packages/core/src/components/atoms/input/select-a11y.ts`
- `packages/core/src/components/atoms/input/select-recipe.ts`
- `packages/core/src/components/atoms/input/select-types.ts`
- `packages/core/src/components/atoms/input/input-otp-a11y.ts`
- `packages/core/src/components/atoms/input/input-otp-recipe.ts`
- `packages/core/src/components/atoms/input/input-otp-types.ts`
- `packages/core/src/components/atoms/input/rich-text-a11y.ts`
- `packages/core/src/components/atoms/input/rich-text-html.ts`
- `packages/core/src/components/atoms/input/rich-text-recipe.ts`
- `packages/core/src/components/atoms/input/rich-text-styles.ts`
- `packages/core/src/components/atoms/input/rich-text-types.ts`
- shared helpers:
  - `packages/core/src/shared/field-helpers.ts`

### Presets
- `packages/presets/src/firstEdition/input.css`
- `packages/presets/src/firstEdition/textarea.css`
- `packages/presets/src/firstEdition/select.css`
- `packages/presets/src/firstEdition/rich-text.css`
- `packages/presets/src/firstEdition/input-otp.css`
- `packages/presets/src/firstEdition/molecules/input-field.css`

### React
- `packages/react/src/components/input/input.tsx`
- `packages/react/src/components/input/input-field.tsx`
- `packages/react/src/components/input/textarea.tsx`
- `packages/react/src/components/input/textarea-field.tsx`
- `packages/react/src/components/input/select.tsx`
- `packages/react/src/components/input/select-field.tsx`
- `packages/react/src/components/input/select-arrow-icon.tsx`
- `packages/react/src/components/input/input-otp.tsx`
- `packages/react/src/components/input/rich-text.tsx`
- `packages/react/src/components/input/rich-text-field.tsx`
- `packages/react/src/components/input/field-variants.tsx`
- tests:
  - `packages/react/src/components/input/__tests__/`

### React stories and docs
- `apps/storybook-react/src/stories/input/Introduction.mdx`
- all story files under `apps/storybook-react/src/stories/input/`
- storybook tests:
  - `apps/storybook-react/src/stories/input/__tests__/`

### Vue
- `packages/vue/src/components/input/input.ts`
- `packages/vue/src/components/input/input-field.ts`
- `packages/vue/src/components/input/textarea.ts`
- `packages/vue/src/components/input/textarea-field.ts`
- `packages/vue/src/components/input/select.ts`
- `packages/vue/src/components/input/select-field.ts`
- `packages/vue/src/components/input/select-arrow-icon.ts`
- `packages/vue/src/components/input/input-otp.ts`
- `packages/vue/src/components/input/rich-text.ts`
- `packages/vue/src/components/input/rich-text-field.ts`
- `packages/vue/src/components/input/field-variants.ts`
- tests:
  - `packages/vue/src/components/input/__tests__/`

### Vue stories and docs
- `apps/storybook-vue/src/stories/input/Introduction.mdx`
- all story files under `apps/storybook-vue/src/stories/input/`
- storybook tests:
  - `apps/storybook-vue/src/stories/input/__tests__/`

### Contracts
- `tests/contracts/input.contract.ts`
- `tests/contracts/input-field.contract.ts`
- `tests/contracts/select.contract.ts`
- `tests/contracts/select-field.contract.ts`
- `tests/contracts/select-combobox.contract.ts`
- `tests/contracts/dropdown-field.contract.ts`
- `tests/contracts/textarea.contract.ts`
- `tests/contracts/textarea-field.contract.ts`
- `tests/contracts/input-otp.contract.ts`
- `tests/contracts/rich-text.contract.ts`
- `tests/contracts/rich-text-field.contract.ts`
- `tests/contracts/date-of-birth-field.contract.ts`
- `tests/contracts/zip-code-field.contract.ts`

## Step-by-step audit checklist

### 0. Spec and decision pass
- [ ] confirm current Input-family requirements in `docs/reference/spec.md`
- [ ] resolve `DEC-001` for select default behavior before changing implementation
- [ ] identify any README or Storybook wording that assumes custom select as the default
- [x] confirm rich text is documented as manual-review-heavy in this pass

### 1. Core atom audit

#### 1A. Input and Textarea
- [ ] review `input-types.ts` and `textarea-types.ts`
- [ ] review `input-a11y.ts` and `textarea-a11y.ts`
- [ ] verify accessible name, `aria-invalid`, and `aria-describedby` logic
- [ ] verify no adapter-only naming assumptions are required for correctness

#### 1B. Select
- [ ] review `select-types.ts`
- [ ] review `select-a11y.ts`
- [ ] review `select-recipe.ts`
- [x] confirm whether default mode remains custom or becomes native-first: custom Marwes mode remains the 1.0.0 default
- [ ] verify the core contract clearly distinguishes native select from custom combobox behavior

#### 1C. InputOtp
- [ ] review `input-otp-types.ts`
- [ ] review `input-otp-a11y.ts`
- [ ] review `input-otp-recipe.ts`
- [ ] verify labeling, invalid state, and described-by wiring assumptions

#### 1D. RichText
- [ ] review `rich-text-types.ts`
- [ ] review `rich-text-a11y.ts`
- [ ] review `rich-text-recipe.ts`
- [ ] review `rich-text-html.ts` and `rich-text-styles.ts`
- [ ] verify accessible naming requirements are explicit
- [ ] record that `contentEditable` + `execCommand` is a manual-review risk area

#### 1E. Shared field helpers
- [ ] review `packages/core/src/shared/field-helpers.ts`
- [ ] verify helper/error/description wiring is consistent across all Input-family fields
- [ ] note any naming inconsistencies that should be normalized later

### 2. Preset CSS audit
- [ ] review `input.css` for focus-visible, invalid, disabled, and hover behavior
- [ ] review `textarea.css` for the same states
- [ ] review `select.css` for both native and custom select behavior
- [ ] review `rich-text.css` for editor focus and toolbar button focus
- [ ] review `input-otp.css` for focus treatment and invalid state treatment
- [ ] review `molecules/input-field.css` for field wrapper focus and label behavior
- [ ] confirm CSS states align with semantic and keyboard states, not only visuals

### 3. React adapter audit

#### 3A. Native controls
- [ ] review `input.tsx`
- [ ] review `textarea.tsx`
- [ ] review `select.tsx`
- [ ] verify native elements are preserved where expected
- [ ] verify core a11y output is applied directly and completely

#### 3B. Field wrappers
- [ ] review `input-field.tsx`
- [ ] review `textarea-field.tsx`
- [ ] review `select-field.tsx`
- [ ] review `rich-text-field.tsx`
- [ ] verify visible label, helper, and error text are wired correctly
- [ ] verify field affordances such as password reveal and clear-search controls do not introduce naming or keyboard regressions

#### 3C. Higher-risk Input subcomponents
- [ ] review `input-otp.tsx`
- [ ] review `rich-text.tsx`
- [ ] review `select-field.tsx` custom combobox behavior
- [ ] verify keyboard behavior is explicit and testable
- [ ] verify no adapter-only a11y behavior diverges from Vue unnecessarily

#### 3D. Purpose field variants
- [ ] review `field-variants.tsx`
- [ ] verify each variant preserves the base field’s accessibility wiring
- [ ] confirm variant convenience does not hide required labeling decisions

### 4. React stories and tests audit
- [ ] review `apps/storybook-react/src/stories/input/Introduction.mdx`
- [ ] review all input story files for missing keyboard or error-state coverage
- [ ] review `apps/storybook-react/src/stories/input/__tests__/`
- [ ] review `packages/react/src/components/input/__tests__/`
- [ ] confirm stories teach the correct select default and rich text usage boundaries
- [ ] identify any cases that should be included in automated accessibility smoke coverage later

### 5. Vue adapter audit

#### 5A. Native controls
- [ ] review `input.ts`
- [ ] review `textarea.ts`
- [ ] review `select.ts`
- [ ] verify native elements are preserved where expected
- [ ] verify core a11y output is applied directly and completely

#### 5B. Field wrappers
- [ ] review `input-field.ts`
- [ ] review `textarea-field.ts`
- [ ] review `select-field.ts`
- [ ] review `rich-text-field.ts`
- [ ] verify visible label, helper, and error text are wired correctly
- [ ] verify Vue-idiomatic event ergonomics do not change the accessibility contract

#### 5C. Higher-risk Input subcomponents
- [ ] review `input-otp.ts`
- [ ] review `rich-text.ts`
- [ ] review `select-field.ts` custom combobox behavior
- [ ] verify keyboard behavior is explicit and testable
- [ ] verify no adapter-only a11y behavior diverges from React unnecessarily

#### 5D. Purpose field variants
- [ ] review `field-variants.ts`
- [ ] verify each variant preserves the base field’s accessibility wiring
- [ ] confirm variant convenience does not hide required labeling decisions

### 6. Vue stories and tests audit
- [ ] review `apps/storybook-vue/src/stories/input/Introduction.mdx`
- [ ] review all input story files for missing keyboard or error-state coverage
- [ ] review `apps/storybook-vue/src/stories/input/__tests__/`
- [ ] review `packages/vue/src/components/input/__tests__/`
- [ ] confirm Vue docs teach the same select default and rich text boundaries as React docs

### 7. Shared contracts and gaps
- [ ] review all current Input-family contracts listed above
- [x] add a dedicated custom-combobox keyboard contract if custom select remains shipped
- [x] add shared InputOtp contract coverage beyond local adapter tests
- [x] attach an explicit manual-review note for rich text in family docs and testing guidance

### 8. Expected decisions from this audit
This first family audit should ideally end with clear answers to these questions:

- [x] Should `Select` be native-first by default? Decision: no for 1.0.0; Marwes visual mode is the default, with native browser chrome as explicit opt-in.
- [ ] If custom select remains shipped, what keyboard matrix is mandatory?
- [ ] What does Marwes guarantee automatically for `RichText`, and what requires manual review?
- [ ] Which Input-family stories should be part of future automated accessibility gates?

### 9. Verification
Run after finishing the family audit and any resulting fixes:

- [ ] `pnpm typecheck`
- [ ] `pnpm test:packages`
- [ ] `pnpm storybook:consistency`
- [ ] `pnpm check`

## Audit outputs to capture

### Good signals to preserve
- source-owned field helper wiring in core
- strong React/Vue parity across the family
- broad story coverage already in place
- strong existing contract base for most of the family

### Risks to resolve or document
- custom select as the default is accepted for 1.0.0, with native browser chrome kept as an explicit fallback path
- incomplete keyboard matrix coverage for custom combobox behavior
- rich text reliance on `contentEditable` + `execCommand`
- any drift between React and Vue documentation or test coverage

### Deliverables expected from the Input audit
- one clear select-default decision
- one clear statement about rich text manual-review scope
- a list of any missing tests or contracts
- doc updates where public guidance is currently ahead of the proven behavior

## Current findings — first pass (2026-04-17)

This section records the first direct audit pass across core, presets, adapters, stories, and contracts.

### What looks good right now

#### 1. Core field wiring is a real strength
Confirmed in:
- `packages/core/src/components/atoms/input/input-a11y.ts`
- `packages/core/src/components/atoms/input/textarea-a11y.ts`
- `packages/core/src/components/atoms/input/select-a11y.ts`
- `packages/core/src/components/atoms/input/input-otp-a11y.ts`
- `packages/core/src/components/atoms/input/rich-text-a11y.ts`
- `packages/core/src/shared/field-helpers.ts`

Good signals:
- native text controls keep simple, explicit a11y shape
- helper and error ids are consistently merged through `buildInputFieldA11yIds()`
- rich text field has a separate `labelId` path instead of pretending it is a native input
- Input and Textarea stay close to native HTML semantics

#### 2. React and Vue parity is strong across the family
Confirmed in:
- `packages/react/src/components/input/*`
- `packages/vue/src/components/input/*`
- mirrored test files in both adapters
- mirrored Storybook trees in both apps

Good signals:
- React and Vue both consume the same core contracts
- Storybook coverage is broad in both frameworks
- helper/error/invalid flows appear intentionally mirrored

#### 3. Base Select keeps native element semantics at the atom level
Confirmed in:
- `packages/react/src/components/input/select.tsx`
- `packages/vue/src/components/input/select.ts`
- `tests/contracts/select.contract.ts`

Important nuance:
- the base `Select` atom is still a real native `<select>` even when styled with Marwes chrome
- the higher-risk custom combobox behavior lives in `SelectField` / `DropdownField`
- this keeps platform form semantics available in the atom while matching the Marwes visual default

#### 4. Story and contract coverage is already broad
Confirmed in:
- `tests/contracts/input.contract.ts`
- `tests/contracts/input-field.contract.ts`
- `tests/contracts/select.contract.ts`
- `tests/contracts/select-field.contract.ts`
- `tests/contracts/dropdown-field.contract.ts`
- `tests/contracts/textarea.contract.ts`
- `tests/contracts/textarea-field.contract.ts`
- `tests/contracts/rich-text.contract.ts`
- `tests/contracts/rich-text-field.contract.ts`
- `tests/contracts/date-of-birth-field.contract.ts`
- `tests/contracts/zip-code-field.contract.ts`

This is a strong starting point.
The gap is more about depth in the riskiest subcomponents than breadth.

### Confirmed risks and gaps

#### Risk 1. The docs and implementation teach custom select as the default
Confirmed in:
- `packages/core/src/components/atoms/input/select-types.ts`
- `apps/storybook-react/src/stories/input/Introduction.mdx`
- `apps/storybook-vue/src/stories/input/Introduction.mdx`

Current state:
- `resolveSelectMode()` defaults to `"marwes"`
- Storybook docs explicitly say Marwes mode is the default
- `DropdownField` docs also assume custom-first behavior

Why this matters:
- this is now the intentional 1.0.0 product decision recorded in `DEC-001`
- native browser chrome remains available through `native={true}` / `appearance="native"` for conservative contexts
- the custom field path needs stronger keyboard and assistive-technology verification than the low-level native atom

#### Risk 2. The custom combobox path does not yet have enough keyboard-contract coverage
Confirmed in:
- `packages/react/src/components/input/select-field.tsx`
- `packages/vue/src/components/input/select-field.ts`
- `packages/react/src/components/input/__tests__/select-field.test.tsx`
- `packages/vue/src/components/input/__tests__/select-field.test.ts`
- `tests/contracts/select-field.contract.ts`

Current state:
- implementation supports ArrowDown, ArrowUp, Home, End, Enter, Space, Escape, and Tab close
- tests currently verify click flow, icon rendering, native fallback, helper/error wiring
- I did not find shared contract coverage for:
  - ArrowDown / ArrowUp navigation
  - Home / End behavior
  - Escape closing
  - disabled-option traversal
  - `aria-activedescendant` correctness

This is the clearest Input-family test gap.

#### Risk 3. Rich text is functionally impressive but still a manual-review-heavy component
Confirmed in:
- `packages/react/src/components/input/rich-text.tsx`
- `packages/vue/src/components/input/rich-text.ts`
- `packages/core/src/components/atoms/input/rich-text-a11y.ts`
- `tests/contracts/rich-text.contract.ts`

Current state:
- semantic textbox model is reasonable
- toolbar buttons have labels and `aria-pressed`
- disabled and readonly semantics are covered
- editing behavior depends on `contentEditable` and `document.execCommand`

Why this matters:
- this is exactly the kind of widget that requires real AT/manual review
- current automated contracts are useful, but they should not imply stronger guarantees than the platform can reliably provide

Status after follow-up documentation fix:
- testing docs now call out `RichText` / `RichTextField` as manual-review-heavy
- governance docs now state that rich text correctness across all browser + AT combinations is not fully guaranteed by current gates
- both React and Vue Input introduction docs now carry a manual-review note
- RichText and RichTextField story docs now carry the same boundary

#### Risk 4. Field-level harnesses needed tightening to prove visible labeling
Originally observed in:
- `packages/react/src/components/input/__tests__/select-field.test.tsx`
- `packages/vue/src/components/input/__tests__/select-field.test.ts`
- `packages/react/src/components/input/__tests__/rich-text-field.test.tsx`
- related field-wrapper tests in both adapters

Original issue:
- some harnesses passed `ariaLabel: args.label` directly into controls
- that meant tests could still pass even if visible-label wiring regressed

Status after follow-up fix:
- field-level harnesses no longer inject `ariaLabel` just to make name assertions pass
- `RichTextField` contract now checks the intended `aria-labelledby` path explicitly

This is better because the tests now prove the intended field-wiring contract more directly.

#### Risk 5. InputOtp originally had only local adapter coverage
Originally observed in:
- `packages/react/src/components/input/input-otp.tsx`
- `packages/vue/src/components/input/input-otp.ts`
- `packages/react/src/components/input/__tests__/input-otp.test.tsx`
- `packages/vue/src/components/input/__tests__/input-otp.test.ts`

Original issue:
- OTP rendering, sanitization, helper/error wiring, and autocomplete were tested locally
- there was no dedicated shared contract in `tests/contracts/`

Status after follow-up fix:
- added `tests/contracts/input-otp.contract.ts`
- wired the shared contract into both React and Vue adapter tests

This is no longer just a local-test-only area.

#### Risk 6. Public docs are ahead of proven behavior on select guidance
Confirmed in:
- `apps/storybook-react/src/stories/input/Introduction.mdx`
- `apps/storybook-vue/src/stories/input/Introduction.mdx`

Current state:
- docs already teach a specific default and usage preference
- that guidance should wait for the select decision and stronger keyboard verification

### Likely decisions coming out of this audit

#### Decision A — Select stays Marwes-first for 1.0.0
Reasoning from the first pass:
- the base select atom is still native-friendly because it renders a real `<select>` with Marwes chrome
- the custom combobox lives at the field layer, where risk is higher and now has dedicated shared keyboard coverage
- documentation now normalizes the intended 1.0.0 Marwes-first behavior and points native browser chrome to explicit opt-in
- this preserves design-system visual consistency while keeping a conservative fallback available

#### Decision B — If custom select remains shipped, it needs its own stronger contract
Minimum contract surface should cover:
- open/close behavior
- active option movement
- disabled-option skipping
- `aria-activedescendant`
- Enter/Space selection
- Escape close
- Tab close behavior

#### Decision C — Rich text should be explicitly classified as manual-review-heavy
The component can remain shipped.
But docs and governance should state that:
- automation covers naming, readonly/disabled state, and basic formatting affordances
- real editor accessibility still requires manual verification in supported environments

### Recommended first fixes from the Input audit

#### Fix 1 — Resolve the select default decision before more doc drift accumulates
Files:
- `docs/reference/spec.md`
- `packages/core/src/components/atoms/input/select-types.ts`
- `apps/storybook-react/src/stories/input/Introduction.mdx`
- `apps/storybook-vue/src/stories/input/Introduction.mdx`

#### Fix 2 — Add shared keyboard-focused coverage for the custom select path
Files:
- new contract: `tests/contracts/select-combobox.contract.ts` or equivalent
- `packages/react/src/components/input/__tests__/select-field.test.tsx`
- `packages/vue/src/components/input/__tests__/select-field.test.ts`

#### Fix 3 — Tighten field-level harnesses so visible labeling is what gets tested
Files:
- `packages/react/src/components/input/__tests__/select-field.test.tsx`
- `packages/vue/src/components/input/__tests__/select-field.test.ts`
- `packages/react/src/components/input/__tests__/rich-text-field.test.tsx`
- corresponding Vue field tests where needed

#### Fix 4 — Add an InputOtp shared contract
Files:
- `tests/contracts/input-otp.contract.ts`
- `packages/react/src/components/input/__tests__/input-otp.test.tsx`
- `packages/vue/src/components/input/__tests__/input-otp.test.ts`

#### Fix 5 — Add a manual-review note for rich text in docs
Files:
- `docs/reference/testing.md`
- `docs/reference/governance.md`
- both Input Storybook introductions
- RichText and RichTextField story docs in both Storybooks

### Recommended execution order inside the Input family

1. resolve the select default decision
2. update Storybook input docs to match that decision
3. add custom-combobox keyboard contract coverage if the custom path remains
4. tighten field-label harnesses
5. keep rich text manual-review scope documented and calibrated as the editor evolves
6. keep the new InputOtp shared contract aligned with adapter behavior
