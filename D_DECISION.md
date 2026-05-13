# Implementation Guide: Preset-Sourced Native Tokens (Path D)

Created: 2026-05-13
Status: active
Branch: `rn-poc/baseline`

---

## ⚠️ Living Document

This guide MUST be updated during implementation:

- ✅ Check off tasks as they are completed
- 📝 Add notes when reality diverges from plan
- 🔄 Reorder or split phases when blockers are discovered
- ➕ Add new tasks discovered during implementation
- ❌ Mark tasks as "skipped — <reason>" when they become irrelevant
- 🕐 Record timestamps on phase completions for velocity tracking
- 🧪 Update test coverage map as tests are written

**Last updated:** 2026-05-13
**Current phase:** Phase 2

---

## 0. Project Discovery

### Discovery Summary

| Variable | Value |
|---|---|
| Package manager | pnpm |
| Monorepo | Yes — `packages/`, `apps/` |
| Test runner | vitest |
| Test command | `pnpm test:packages` |
| Typecheck | `pnpm -r typecheck` |
| Lint | `pnpm biome check .` |
| Build | `pnpm -r build` |
| Domain checks | `pnpm native-tokens:check`, `pnpm native-styles:check` |
| CI | `.github/workflows/_ci.yml` |
| Feature paths | `packages/react-native/`, `packages/core/`, `packages/presets/` |
| Existing tests | `packages/core/test/recipes/*.test.ts`, `packages/presets/test/*-css-contract.test.ts` |

### Validation Stack

> These commands are used as exit criteria for every phase.

| Purpose | Command | Scope |
|---|---|---|
| Unit tests (core) | `pnpm test:core` | Core recipe tests |
| Unit tests (presets) | `pnpm test:presets` | Preset CSS contract tests |
| Typecheck (all) | `pnpm -r typecheck` | All workspace packages |
| Typecheck (RN) | `pnpm --filter @marwes-ui/react-native typecheck` | RN package only |
| Lint/format | `pnpm biome check .` | Whole repo |
| Token generation | `pnpm native-tokens:check` | Generated token data is up-to-date |
| Style generation | `pnpm native-styles:check` | Legacy generated styles (while they remain) |
| Repo integrity | `pnpm check:repo-map` | Compass, semantics, artifacts, registry, parity, storybook, boundaries |
| Contract typecheck | `pnpm test:typecheck:contracts` | Adapter contracts against public APIs |
| CI (full) | `pnpm biome check . && pnpm check:repo-map && pnpm -r typecheck && pnpm test:typecheck:contracts && pnpm test:packages && pnpm -r build` | Full CI pipeline |

---

## 1. Architecture Contract

### Problem Statement

Marwes needs React Native components that share design intent with web but render natively — without building a CSS-to-RN browser engine that accumulates pseudo-elements, keyframes, masks, and layout translation complexity.

### Chosen Approach

**Path D: Preset-Sourced Native Tokens.** Extract semantic design intent from `@marwes-ui/presets` CSS variables into typed token data. React Native components consume these tokens and render using native primitives. Core recipes provide shared state, props, and accessibility contracts.

### Architecture Boundaries

| Layer | Owns | Does NOT Own |
|---|---|---|
| `@marwes-ui/core` | Props, state, recipes, a11y contracts, platform-neutral metadata | Rendering, styling, platform interaction |
| `@marwes-ui/presets` | Design tokens, component semantic CSS variables, theme alignment | Component behavior, layout logic |
| Token extractor (`scripts/generate-react-native-tokens.ts`) | Reading preset CSS, extracting whitelisted vars, type-safe token generation | General CSS parsing, layout translation |
| `@marwes-ui/react-native` | Native rendering, layout, interaction, animation, platform a11y | CSS compilation, pseudo-elements, keyframes |

### Non-Negotiables

- [ ] Do not build a general CSS-to-RN browser engine
- [ ] Do not compile pseudo-elements into React Native
- [ ] Do not compile CSS masks into React Native
- [ ] Do not compile CSS keyframes into React Native
- [ ] Do not translate arbitrary layout CSS into React Native
- [ ] Keep extractor manifests explicit and family-scoped
- [ ] Keep preset variables semantic — not one-to-one dumps of every CSS declaration
- [ ] Keep React Native components readable without reading generated output
- [ ] Keep `@marwes-ui/core` recipes as the semantic source
- [ ] Add visual validation before claiming production parity

---

## 2. Implementation Phases

### Phase 0: Lock The Decision

**Goal:** Formalize the architecture decision and preserve POC evidence.
**Depends on:** None
**Status:** ✅ Complete

#### Inputs

- POC implementations (Badge, Checkbox, Spinner)
- Architecture analysis comparing paths

#### Outputs

- `D_DECISION.md` — this document
- POC branch preserved with all proof

#### Tasks

- [x] Select Path D as primary RN architecture
- [x] Document decision
- [x] Keep POC branch history with Badge, Checkbox, Spinner proof
- [ ] Review decision with project owner
- [ ] Decide how to merge/cherry-pick D work back to the main RN branch

#### Tests for This Phase

| Test Type | What to Test | Exists? | Path / Command |
|---|---|---|---|
| Domain | Token generation is current | Yes | `pnpm native-tokens:check` |
| Domain | Style generation is current | Yes | `pnpm native-styles:check` |
| Unit | Preset contracts | Yes | `pnpm test:presets` |
| Type safety | RN package types | Yes | `pnpm --filter @marwes-ui/react-native typecheck` |

#### Phase Exit Criteria

- [x] `pnpm native-tokens:check` passes
- [x] `pnpm native-styles:check` passes
- [x] `pnpm test:presets` passes
- [x] `pnpm --filter @marwes-ui/react-native typecheck` passes
- [x] `pnpm biome check .` passes on changed files

---

### Phase 1: Hardening The Token Extractor

**Goal:** Make the extractor production-quality with unit tests, clear error messages, and documentation.
**Depends on:** Phase 0
**Status:** ✅ Complete

#### Inputs

- Working extractor at `scripts/generate-react-native-tokens.ts`
- Existing token data generation for Badge, Checkbox, Spinner

#### Outputs

- Unit test suite for token parsing
- Committed generated token data verification
- Documentation for adding new native token families

#### Relevant Paths

| What | Path | Action |
|---|---|---|
| Token extractor | `scripts/generate-react-native-tokens.ts` | Edit — add error handling, split if needed |
| Generated token data | `packages/react-native/src/styles/native-tokens/generated/first-edition.native-token-data.ts` | Generated output |
| Token types | `packages/react-native/src/styles/native-tokens/native-token-types.ts` | Edit — extend as families grow |
| Resolver | `packages/react-native/src/styles/native-tokens/resolve-native-token.ts` | Read — understand resolution |
| Resolved tokens | `packages/react-native/src/styles/native-tokens/generated/first-edition.native-tokens.ts` | Read — resolver implementations |

#### Tasks

- [x] Generate Badge tokens from preset variables
  - **Tool:** `bash`
  - **Verify:** `pnpm native-tokens:check`

- [x] Generate Checkbox tokens from preset variables
  - **Tool:** `bash`
  - **Verify:** `pnpm native-tokens:check`

- [x] Generate Spinner tokens from preset variables
  - **Tool:** `bash`
  - **Verify:** `pnpm native-tokens:check`

- [x] Add `native-tokens:generate` script
  - **Tool:** `edit` (root `package.json`)
  - **Verify:** `pnpm native-tokens:generate` runs without error

- [x] Add `native-tokens:check` script
  - **Tool:** `edit` (root `package.json`)
  - **Verify:** `pnpm native-tokens:check` exits 0

- [x] Split extractor manifest data from extractor implementation (if it grows)
  - **Tool:** `edit` / `write`
  - **Verify:** `pnpm native-tokens:check` still passes after refactor

- [x] Add unit tests for token parsing
  - **Tool:** `write`
  - **Verify:** `pnpm test:core` or new test file runs green
  - Tests to cover:
    - [x] `var(--mw-token)` → resolves to theme path
    - [x] `var(--mw-token, fallback)` → resolves with fallback
    - [x] `px` values → numeric conversion
    - [x] `ms` values → numeric conversion
    - [x] Plain numbers → passthrough
    - [x] Unsupported theme vars → fails loudly with clear error

- [x] Add check that generated token data is committed (CI-safe)
  - **Tool:** `edit` (CI workflow or extractor script)
  - **Verify:** `pnpm native-tokens:check` is wired into `.github/workflows/_ci.yml`

- [x] Add documentation for adding a new native token family
  - **Tool:** `write`
  - **Verify:** Doc exists and references correct paths

#### Tests for This Phase

| Test Type | What to Test | Exists? | Path / Command |
|---|---|---|---|
| Unit | Token parsing (var resolution) | Yes | `packages/core/test/native-tokens/generate-react-native-tokens.test.ts` |
| Unit | px/ms/number conversion | Yes | `packages/core/test/native-tokens/generate-react-native-tokens.test.ts` |
| Unit | Error on missing theme var | Yes | `packages/core/test/native-tokens/generate-react-native-tokens.test.ts` |
| Domain | Generated data committed | Yes | `pnpm native-tokens:check` |
| Type safety | Token types compile | Yes | `pnpm --filter @marwes-ui/react-native typecheck` |
| Lint | Changed files | Yes | `pnpm biome check .` |

#### Phase Exit Criteria

- [x] Unit tests for token parsing pass
- [x] `pnpm native-tokens:check` passes
- [x] `pnpm --filter @marwes-ui/react-native typecheck` passes
- [x] `pnpm biome check .` passes on changed files
- [x] Documentation file exists
- [x] Guide updated with completion status

#### Failure Protocol

| If | Then |
|---|---|
| Token parsing test fails | Check extractor logic for edge case handling |
| Typecheck fails | Verify `NativeTokenRef` type aligns with generated output |
| Check script doesn't catch uncommitted changes | Add git-diff or hash comparison |
| Unclear which vars should be whitelisted | Refer to preset CSS → only expose semantic component vars |

---

### Phase 2: Native Foundation Components

**Goal:** Complete small atoms first and prove the D pattern is repeatable.
**Depends on:** Phase 1
**Status:** 🔄 In progress

#### Inputs

- Hardened token extractor with tests
- Proven pattern from Badge, Checkbox, Spinner POC

#### Outputs

- D-pattern implementations for: Divider, Skeleton, Avatar, Icon, Button
- Per-component playground examples
- Visual parity initial review

#### Relevant Paths

| What | Path | Action |
|---|---|---|
| Core recipes | `packages/core/src/components/atoms/<family>/` | Read — confirm exists |
| Preset CSS | `packages/presets/src/firstEdition/<family>.css` | Edit — add semantic vars |
| Extractor manifest | `scripts/generate-react-native-tokens.ts` | Edit — add family entry |
| Generated tokens | `packages/react-native/src/styles/native-tokens/generated/` | Generated |
| RN components | `packages/react-native/src/components/<family>/` | Create / Edit |
| RN index | `packages/react-native/src/index.ts` | Edit — export new components |
| Playground | `apps/playground-react-native/App.tsx` | Edit — add examples |
| Preset tests | `packages/presets/test/<family>-css-contract.test.ts` | Read / Extend |

#### Tasks

- [x] Badge — POC complete
- [x] Checkbox — POC complete
- [x] Spinner — POC complete
- [x] Divider — migrate from current style resolver to D tokens
- [x] Skeleton — new D-pattern implementation
- [x] Avatar — new D-pattern implementation
- [x] Icon — new D-pattern implementation
  - Note: implemented with a dependency-free native fallback renderer; full SVG-path parity needs a later `react-native-svg` decision.
- [x] Button — migrate from current compiler path to D tokens

Each component follows the **Repeatable Unit Contract** (Section 3).

#### Tests for This Phase

| Test Type | What to Test | Exists? | Path / Command |
|---|---|---|---|
| Unit | Core recipes exist | Yes | `packages/core/test/recipes/<family>.test.ts` |
| Unit | Preset CSS contracts | Partial | `packages/presets/test/<family>-css-contract.test.ts` |
| Domain | Token generation | Yes | `pnpm native-tokens:check` |
| Type safety | RN exports compile | Yes | `pnpm --filter @marwes-ui/react-native typecheck` |
| Lint | Code quality | Yes | `pnpm biome check .` |
| Visual | Rendering check | **No → manual** | Expo playground inspection |

#### Phase Exit Criteria

- [x] All 5 new components pass token check
- [x] All typecheck passes for `@marwes-ui/react-native` and the React Native playground
- [x] All lint passes
- [x] All have playground examples
- [ ] Visual review completed for each
- [x] Guide updated

#### Validation Notes

- `pnpm -r typecheck` still fails outside this phase in `apps/storybook-svelte/vite.config.ts` because of an existing Vite plugin type mismatch. React Native package typecheck and React Native playground typecheck pass.

#### Failure Protocol

| If | Then |
|---|---|
| Preset doesn't expose needed vars | Add semantic vars to preset CSS first |
| Core recipe missing for component | Check if component can use existing recipe or needs one |
| Token extractor can't handle component shape | Extend extractor, add test for new case |
| Visual drift is significant | Document in tracker, decide accept/fix per component |

---

### Phase 3: Form Controls

**Goal:** Build real mobile form primitives without CSS translation.
**Depends on:** Phase 2
**Status:** ⬜ Not started

#### Inputs

- Proven D-pattern from Phase 2 foundation components
- Core recipes for all form controls

#### Outputs

- Native implementations: Radio, Switch, Slider, Input, Textarea, Select trigger, Date picker trigger
- Keyboard, focus, disabled, and error state validation

#### Relevant Paths

| What | Path | Action |
|---|---|---|
| Core recipes | `packages/core/src/components/atoms/{radio,switch,slider,input,date-picker}/` | Read |
| Preset CSS | `packages/presets/src/firstEdition/{radio,switch,slider,input,textarea,select,date-picker}.css` | Edit — semantic vars |
| Extractor | `scripts/generate-react-native-tokens.ts` | Edit — add families |
| RN components | `packages/react-native/src/components/` | Create |
| Playground | `apps/playground-react-native/App.tsx` | Edit |

#### Tasks

- [x] Checkbox atom — POC complete
- [ ] Radio
- [ ] Switch
- [ ] Slider
- [ ] Input
- [ ] Textarea
- [ ] Select trigger
- [ ] Date picker trigger

Each follows the **Repeatable Unit Contract** (Section 3).

#### Special Validation

- [ ] Keyboard behavior
- [ ] Focus behavior
- [ ] Disabled behavior
- [ ] Invalid/error state
- [ ] Screen reader labels
- [ ] Field wrapper composition

#### Tests for This Phase

| Test Type | What to Test | Exists? | Path / Command |
|---|---|---|---|
| Unit | Core recipes | Yes | `packages/core/test/recipes/<family>.test.ts` |
| Unit | Preset CSS contracts | Partial | `packages/presets/test/<family>-css-contract.test.ts` |
| Domain | Token generation | Yes | `pnpm native-tokens:check` |
| Integration | Keyboard/focus | **No → create** | RN-specific test or manual |
| Type safety | RN types | Yes | `pnpm --filter @marwes-ui/react-native typecheck` |
| A11y | Screen reader labels | **No → manual** | iOS/Android VoiceOver/TalkBack |

#### Phase Exit Criteria

- [ ] All form controls pass token check
- [ ] All typecheck passes
- [ ] Keyboard/focus behavior documented and validated
- [ ] Error states render correctly
- [ ] Guide updated

#### Failure Protocol

| If | Then |
|---|---|
| Native interaction doesn't map to web | Use native mobile pattern — don't force web behavior |
| Slider/Date picker needs native module | Document dependency, evaluate feasibility |
| Focus management differs by platform | Document platform differences, implement per-platform |

---

### Phase 4: Field Molecules

**Goal:** Compose atoms into accessible form fields with labels, helpers, and error messaging.
**Depends on:** Phase 3
**Status:** ⬜ Not started

#### Inputs

- Working form control atoms from Phase 3
- Field molecule patterns from web adapters

#### Outputs

- CheckboxField, CheckboxGroupField, RadioGroupField, InputField, SliderField, SwitchField, AccordionField

#### Relevant Paths

| What | Path | Action |
|---|---|---|
| Core molecules | `packages/core/src/components/` | Read — check for molecule recipes |
| Preset molecules | `packages/presets/src/firstEdition/molecules/` | Read — check existing CSS |
| RN components | `packages/react-native/src/components/` | Create |

#### Tasks

- [ ] CheckboxField
- [ ] CheckboxGroupField
- [ ] RadioGroupField
- [ ] InputField
- [ ] SliderField
- [ ] SwitchField
- [ ] AccordionField

#### Special Validation

- [ ] Label association
- [ ] Helper text
- [ ] Error text
- [ ] Required state
- [ ] Group semantics
- [ ] Layout density

#### Tests for This Phase

| Test Type | What to Test | Exists? | Path / Command |
|---|---|---|---|
| Unit | Field composition | **No → create** | RN-specific |
| Integration | Label + control association | **No → create** | A11y test |
| Type safety | RN types | Yes | `pnpm --filter @marwes-ui/react-native typecheck` |
| Domain | Token generation | Yes | `pnpm native-tokens:check` |

#### Phase Exit Criteria

- [ ] All field molecules render with correct label association
- [ ] Error/helper text displays correctly
- [ ] Typecheck passes
- [ ] Token check passes
- [ ] Guide updated

---

### Phase 5: Layout & Display Components

**Goal:** Build visual/display components that are mostly token-driven.
**Depends on:** Phase 2
**Status:** ⬜ Not started

#### Inputs

- Proven token pattern from foundation components

#### Outputs

- Card, StatTile, Heading, Paragraph, Spacing, Tab, Tooltip display fallback, Toast visual shell

#### Tasks

- [ ] Card
- [ ] StatTile
- [ ] Heading
- [ ] Paragraph
- [ ] Spacing
- [ ] Tab
- [ ] Tooltip display fallback
- [ ] Toast visual shell

**Rule:** If a component is mostly visual → prefer preset-sourced tokens. If it has behavior → core recipe must own the behavior contract.

#### Tests for This Phase

| Test Type | What to Test | Exists? | Path / Command |
|---|---|---|---|
| Unit | Core recipes | Yes | `packages/core/test/recipes/<family>.test.ts` |
| Unit | Preset CSS contracts | Partial | `packages/presets/test/<family>-css-contract.test.ts` |
| Domain | Token generation | Yes | `pnpm native-tokens:check` |
| Type safety | RN types | Yes | `pnpm --filter @marwes-ui/react-native typecheck` |

#### Phase Exit Criteria

- [ ] All display components pass token check
- [ ] Typecheck passes
- [ ] Playground examples exist
- [ ] Guide updated

---

### Phase 6: Overlay & Hard Mobile Components

**Goal:** Build components with complex mobile-native interaction patterns.
**Depends on:** Phase 3, Phase 5
**Status:** ⬜ Not started

#### Inputs

- Working form controls and display components
- Understanding of platform-specific interaction expectations

#### Outputs

- Dialog, Modal behavior, Toast host, Tooltip/Popover mobile behavior, Select native interaction, Date picker native interaction

#### Tasks

- [ ] Dialog
- [ ] Modal behavior
- [ ] Toast host
- [ ] Tooltip/Popover mobile behavior
- [ ] Select native interaction
- [ ] Date picker native interaction

**Rule:** Do not force web interaction behavior into RN. Use native mobile patterns where the platform expects them.

#### Tests for This Phase

| Test Type | What to Test | Exists? | Path / Command |
|---|---|---|---|
| Unit | Core recipes | Yes | `packages/core/test/recipes/<family>.test.ts` |
| Integration | Overlay stacking | **No → create** | RN-specific |
| A11y | Focus trap, dismiss | **No → create/manual** | iOS/Android |
| Type safety | RN types | Yes | `pnpm --filter @marwes-ui/react-native typecheck` |

#### Phase Exit Criteria

- [ ] Native interaction patterns feel correct per platform
- [ ] Typecheck passes
- [ ] Accessibility reviewed
- [ ] Guide updated

---

### Phase 7: Visual Validation Harness

**Goal:** Establish systematic visual parity checking between web and RN.
**Depends on:** Phase 2 (at minimum)
**Status:** ⬜ Not started

#### Inputs

- Implemented RN components with playground examples
- Web/Figma references for comparison

#### Outputs

- Screenshot capture workflow
- Light/dark/custom theme captures
- Accepted drift documentation

#### Tasks

- [ ] Run Expo playground on iOS
- [ ] Run Expo playground on Android
- [ ] Capture light mode screenshots
- [ ] Capture dark mode screenshots
- [ ] Capture custom theme screenshots
- [ ] Add screenshot artifact folder
- [ ] Compare Badge/Checkbox/Spinner against web/Figma references
- [ ] Record accepted visual drift
- [ ] Record required corrections

#### Tests for This Phase

| Test Type | What to Test | Exists? | Path / Command |
|---|---|---|---|
| Visual | Screenshot comparison | **No → create** | Manual or snapshot tool |
| Visual | Theme switching | **No → create** | Expo playground |

#### Phase Exit Criteria

- [ ] Screenshot workflow documented
- [ ] At least Badge/Checkbox/Spinner compared
- [ ] Drift decisions recorded
- [ ] Guide updated

---

### Phase 8: Accessibility Validation

**Goal:** Verify assistive technology behavior on real devices.
**Depends on:** Phase 2, Phase 3
**Status:** ⬜ Not started

#### Tasks

- [ ] Verify decorative Spinner is hidden from assistive technology
- [ ] Verify labelled Spinner announces loading when `decorative={false}` and `ariaLabel` is set
- [ ] Verify Checkbox checked/mixed/disabled state
- [ ] Verify form field labels and descriptions
- [ ] Verify touch target sizes
- [ ] Verify reduced-motion behavior

#### Tests for This Phase

| Test Type | What to Test | Exists? | Path / Command |
|---|---|---|---|
| A11y | Screen reader behavior | **No → manual** | VoiceOver / TalkBack |
| A11y | Touch targets | **No → manual** | Device inspection |
| A11y | Reduced motion | **No → manual** | OS setting toggle |

#### Phase Exit Criteria

- [ ] All core a11y behaviors verified on iOS
- [ ] All core a11y behaviors verified on Android
- [ ] Issues documented and tracked
- [ ] Guide updated

---

### Phase 9: Release Readiness

**Goal:** Prepare the RN package for publishing.
**Depends on:** All previous phases
**Status:** ⬜ Not started

#### Tasks

- [ ] Decide generated file policy for package publishing
- [ ] Ensure `@marwes-ui/react-native` exports all completed components
- [ ] Add package README examples
- [ ] Add migration notes from current RN POC
- [ ] Add CI checks:
  - [ ] `pnpm native-tokens:check`
  - [ ] `pnpm native-styles:check` (while legacy generated styles remain)
  - [ ] RN package typecheck
  - [ ] Preset tests
- [ ] Cut release candidate

#### Tests for This Phase

| Test Type | What to Test | Exists? | Path / Command |
|---|---|---|---|
| CI | Full pipeline | Yes | `.github/workflows/_ci.yml` — extend |
| Domain | All checks pass | Yes | `pnpm native-tokens:check && pnpm native-styles:check` |
| Type safety | Full typecheck | Yes | `pnpm -r typecheck` |
| Build | Package builds | Yes | `pnpm -r build` |

#### Phase Exit Criteria

- [ ] CI runs all RN-relevant checks
- [ ] Package builds cleanly
- [ ] Exports verified
- [ ] README exists with usage examples
- [ ] Guide updated with final status

---

## 3. Repeatable Unit Contract

> Every RN component follows this exact contract. Apply for each unit in Phase 2, 3, 4, 5, 6.

### Unit: <ComponentName>

| Step | Description | Path | Action | Verify | Test |
|---|---|---|---|---|---|
| 1 | Core recipe exists | `packages/core/src/components/atoms/<name>/<name>-recipe.ts` | Read — confirm | `grep "Recipe" <path>` | `pnpm test:core` |
| 2 | Preset exposes semantic vars | `packages/presets/src/firstEdition/<name>.css` | Read / Edit — add `--mw-<name>-*` | `grep "--mw-<name>" packages/presets/src/` | `pnpm test:presets` |
| 3 | Extractor manifest entry | `scripts/generate-react-native-tokens.ts` | Edit — add family config | `pnpm native-tokens:generate` | `pnpm native-tokens:check` |
| 4 | Token data generated | `packages/react-native/src/styles/native-tokens/generated/first-edition.native-token-data.ts` | Generated | `pnpm native-tokens:check` | Auto |
| 5 | Token types defined | `packages/react-native/src/styles/native-tokens/native-token-types.ts` | Edit — add resolved type | Typecheck | `pnpm --filter @marwes-ui/react-native typecheck` |
| 6 | Resolver function | `packages/react-native/src/styles/native-tokens/generated/first-edition.native-tokens.ts` | Edit — add resolve function | Typecheck | `pnpm --filter @marwes-ui/react-native typecheck` |
| 7 | RN component | `packages/react-native/src/components/<name>/<name>.tsx` | Create | Typecheck + renders | `pnpm --filter @marwes-ui/react-native typecheck` |
| 8 | Export from index | `packages/react-native/src/index.ts` | Edit — add export | Import resolves | Typecheck |
| 9 | Playground example | `apps/playground-react-native/App.tsx` | Edit — add example | Renders in Expo | Manual |
| 10 | Visual review | — | Manual | Screenshot compare | Manual |
| 11 | A11y review | — | Manual | Screen reader test | Manual |

**Unit done when:**
- [ ] All verify commands pass
- [ ] All tests pass
- [ ] Component renders in playground
- [ ] Visual parity reviewed
- [ ] Guide updated with unit status

---

## 4. Test Strategy

### Principles

- Tests are phase exit criteria — not optional
- If a test doesn't exist, creating it IS the first task in the phase
- Tests validate behavior, not implementation details
- Tests must be runnable in CI (or explicitly marked manual)
- Every new token family must have a corresponding preset CSS contract test

### Coverage Map

| Phase | What's Tested | Test Type | Exists? | Path |
|---|---|---|---|---|
| Phase 1 | Token parsing (var, px, ms, number) | Unit | Yes | `packages/core/test/native-tokens/generate-react-native-tokens.test.ts` |
| Phase 1 | Error on missing theme var | Unit | Yes | `packages/core/test/native-tokens/generate-react-native-tokens.test.ts` |
| Phase 2 | Preset CSS contracts per component | Unit | Partial | `packages/presets/test/<family>-css-contract.test.ts` |
| Phase 2 | Core recipes | Unit | Yes | `packages/core/test/recipes/<family>.test.ts` |
| Phase 3 | Form control interaction | Integration | **No → create** | RN-specific |
| Phase 4 | Field composition + a11y | Integration | **No → create** | RN-specific |
| Phase 7 | Visual parity | Visual | **No → create** | Screenshot workflow |
| Phase 8 | Assistive technology | A11y | **No → manual** | Device testing |

### Full Validation Run

```bash
# Run after EVERY phase completion
pnpm test:core                                    # core recipe tests
pnpm test:presets                                 # preset CSS contract tests
pnpm native-tokens:check                          # generated tokens current
pnpm native-styles:check                          # legacy styles current
pnpm --filter @marwes-ui/react-native typecheck   # RN types
pnpm biome check .                                # lint/format
```

---

## 5. Failure & Rollback Protocol

| Failure Type | Detection | Action |
|---|---|---|
| Token generation fails | `pnpm native-tokens:check` exits non-zero | Check preset CSS syntax, verify var names match `themeVarPaths` in extractor |
| Typecheck fails | `pnpm -r typecheck` exits non-zero | Check token types match generated output shape |
| Lint failure | `pnpm biome check .` exits non-zero | Run `pnpm format:all` then re-check |
| Preset test fails | `pnpm test:presets` exits non-zero | Verify CSS variable names align with contract test expectations |
| Missing core recipe | Recipe file doesn't exist | Create in `packages/core/src/components/atoms/<name>/` first |
| Preset lacks semantic vars | `grep "--mw-<name>"` returns nothing | Add semantic vars to preset CSS before continuing |
| Visual drift | Screenshot comparison shows differences | Document in tracker — decide accept (with reason) or fix |
| Extractor can't parse new pattern | Generation throws | Extend extractor, add unit test for new pattern |
| Repeated failure (3x) | Same check fails after 3 attempts | Stop — escalate to user or recommend different approach |
| Ambiguous requirement | Can't determine correct native behavior | STOP — ask the user |

---

## 6. Completion Tracker

| Phase | Title | Status | Tests | Validation | Completed |
|---|---|---|---|---|---|
| 0 | Lock The Decision | ✅ | pass | pass | 2026-05-13 |
| 1 | Hardening Token Extractor | ✅ | pass | pass | 2026-05-13 |
| 2 | Native Foundation Components | ⬜ | — | — | — |
| 3 | Form Controls | ⬜ | — | — | — |
| 4 | Field Molecules | ⬜ | — | — | — |
| 5 | Layout & Display | ⬜ | — | — | — |
| 6 | Overlay & Hard Mobile | ⬜ | — | — | — |
| 7 | Visual Validation Harness | ⬜ | — | — | — |
| 8 | Accessibility Validation | ⬜ | — | — | — |
| 9 | Release Readiness | ⬜ | — | — | — |

### Component Status

| Component | Core Recipe | Preset Vars | Token Extraction | RN Implementation | Playground | Visual Review | Status |
|---|---|---|---|---|---|---|---|
| Badge | ✅ | ✅ | ✅ | ✅ | ✅ | ⬜ | POC complete |
| Checkbox | ✅ | ✅ | ✅ | ✅ | ✅ | ⬜ | POC complete |
| Spinner | ✅ | ✅ | ✅ | ✅ | ✅ | ⬜ | POC complete |
| Divider | ✅ | ✅ | ✅ | ✅ | ✅ | ⬜ | D implementation complete; visual review pending |
| Button | ✅ | ✅ | ✅ | ✅ | ✅ | ⬜ | D implementation complete; visual review pending |
| Skeleton | ✅ | ✅ | ✅ | ✅ | ✅ | ⬜ | D implementation complete; visual review pending |
| Avatar | ✅ | ✅ | ✅ | ✅ | ✅ | ⬜ | D implementation complete; visual review pending |
| Icon | ✅ | ✅ | ✅ | ✅ | ✅ | ⬜ | Native fallback complete; SVG-path parity pending |
| Radio | ✅ | Unknown | ⬜ | ⬜ | ⬜ | ⬜ | Pending |
| Switch | ✅ | Unknown | ⬜ | ⬜ | ⬜ | ⬜ | Pending |
| Slider | ✅ | Unknown | ⬜ | ⬜ | ⬜ | ⬜ | Pending |
| Input | ✅ | Unknown | ⬜ | ⬜ | ⬜ | ⬜ | Pending |

---

## 7. Post-Completion Checklist

- [ ] All phases marked ✅
- [ ] Full validation suite passes (`pnpm validate:packages`)
- [ ] No skipped tests without documented reason
- [ ] Guide reflects final state (all updates applied)
- [ ] CI extended with RN-specific checks
- [ ] Branch ready for review/merge
- [ ] Package README with usage examples
- [ ] Migration notes from old RN approach documented
