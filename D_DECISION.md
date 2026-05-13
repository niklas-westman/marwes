# D Decision: Preset-Sourced Native Tokens

Decision date: 2026-05-13
Branch: `rn-poc/d-token-compiler`
Status: Selected as primary React Native architecture direction

## 1. Decision

We select **Path D: Preset-Sourced Native Tokens** as the primary architecture for Marwes React
Native.

Path D means:

```text
@marwes-ui/core
  -> shared props, state, recipes, semantics, accessibility

@marwes-ui/presets
  -> shared visual design intent through explicit --mw-* component variables

native token extractor
  -> strict bridge from preset variables into typed React Native token data

@marwes-ui/react-native
  -> native rendering, native layout, native interaction, native animation
```

We are not choosing a general CSS-to-RN compiler as the long-term foundation. The current compiler
work remains useful as evidence and as a migration aid, but D should be the architecture we build
toward.

## 2. Why We Selected D

The POC proved the three important cases:

| Proof point | Result | Meaning |
|---|---|---|
| Badge | Passed | Simple visual components can consume semantic native tokens cleanly. |
| Checkbox | Passed | Hard pseudo-element/mask cases do not need CSS compiler support. |
| Spinner | Passed | Hard CSS keyframe cases can use native animation instead. |

This matters because the scary part of React Native support is not simple colors or spacing. The
scary part is compiler creep:

- CSS pseudo-elements
- CSS masks
- CSS keyframes
- selector semantics
- layout translation
- browser-specific behavior

D avoids that. It extracts design intent, then lets React Native do native things natively.

## 3. What D Delivers

### For Product Quality

- Components feel like real React Native components instead of translated web components.
- Interaction and animation can use native primitives.
- Hard mobile components remain understandable and debuggable.
- We can support platform differences deliberately instead of hiding them behind a compiler.

### For Design Consistency

- Presets remain the visual source of truth.
- RN token data is generated from `@marwes-ui/presets` variables.
- Web and RN share semantic design intent without sharing rendering mechanics.
- Drift becomes easier to detect because token generation can be checked.

### For Engineering Velocity

- Core recipes are reused across adapters.
- RN components do not need to understand CSS selectors.
- Each component can be implemented with a small native token contract.
- The extractor can fail fast when a required preset token is missing.

### For Long-Term Maintenance

- The architecture has clean ownership boundaries.
- The token extractor is smaller and stricter than a style compiler.
- New components can be added incrementally.
- We can improve visual parity without growing a browser engine inside the repo.

## 4. Architecture Boundaries

### Core Owns

`@marwes-ui/core` owns:

- public prop types
- state models
- controlled/uncontrolled behavior contracts
- render recipes
- accessibility contracts
- platform-neutral metadata

Examples:

- `checkboxRecipe()`
- `createSpinnerRecipe()`
- `createBadgeRecipe()`

### Presets Own

`@marwes-ui/presets` owns:

- design tokens
- component-specific semantic CSS variables
- visual values from Figma/design review
- light/dark/custom theme alignment

Examples:

- `--mw-badge-surface`
- `--mw-checkbox-checked-bg`
- `--mw-spinner-rotation-duration`

### Native Token Extractor Owns

`scripts/generate-react-native-tokens.ts` owns:

- reading preset CSS
- extracting only whitelisted variables
- mapping CSS variables to typed native token refs
- converting `px`, `ms`, and numeric values
- failing when a required token is missing
- generating deterministic token data

It must not parse general CSS behavior.

### React Native Owns

`@marwes-ui/react-native` owns:

- React Native component structure
- layout
- `Pressable`, `View`, `Text`, `Animated`, and other native primitives
- native interaction behavior
- native animation behavior
- platform-specific accessibility mapping

## 5. Non-Negotiables

- [ ] Do not build a general CSS-to-RN browser engine.
- [ ] Do not compile pseudo-elements into React Native.
- [ ] Do not compile CSS masks into React Native.
- [ ] Do not compile CSS keyframes into React Native.
- [ ] Do not translate arbitrary layout CSS into React Native.
- [ ] Keep extractor manifests explicit and family-scoped.
- [ ] Keep preset variables semantic, not one-to-one dumps of every CSS declaration.
- [ ] Keep React Native components readable without reading generated output.
- [ ] Keep `@marwes-ui/core` recipes as the semantic source.
- [ ] Add visual validation before claiming production parity.

## 6. Current POC Evidence

### Implemented

- [x] Badge consumes semantic native tokens.
- [x] Checkbox consumes semantic native tokens.
- [x] Checkbox renders checked mark natively.
- [x] Checkbox renders indeterminate mark natively.
- [x] Spinner consumes semantic native tokens.
- [x] Spinner renders native animation via `Animated`.
- [x] Preset token extractor generates native token data.
- [x] Token generation check exists: `pnpm native-tokens:check`.
- [x] Existing style generation still checks: `pnpm native-styles:check`.

### Validation Passed

- [x] React Native package typecheck.
- [x] Biome on changed files.
- [x] `pnpm native-tokens:check`.
- [x] `pnpm native-styles:check`.
- [x] `pnpm test:presets`.

### Not Yet Proven

- [ ] Expo visual inspection on real device/simulator.
- [ ] Screenshot-based visual parity.
- [ ] Accessibility behavior on iOS and Android screen readers.
- [ ] Full component library coverage.
- [ ] Release packaging for generated native token data.

## 7. Trade-Offs

### What We Gain

- Cleaner long-term architecture.
- Smaller compiler scope.
- Better native UX.
- Better debuggability.
- Lower risk of CSS edge-case creep.
- Reuse of existing core recipes and preset design intent.

### What We Accept

- RN components need deliberate native implementations.
- Some visual geometry may not match web pixel-for-pixel automatically.
- The preset CSS must expose explicit semantic variables.
- The extractor manifest must be maintained as components evolve.
- Visual parity requires a separate validation harness.

### What We Avoid

- A large CSS runtime.
- Translating pseudo-elements.
- Translating keyframes.
- Translating browser layout rules.
- Duplicating a separate RN design system by hand.

## 8. Component Implementation Pattern

Every RN component should follow this shape:

```text
1. Use core recipe for props/state/a11y.
2. Resolve generated native tokens from the current theme.
3. Render with native primitives.
4. Keep layout and interaction in RN.
5. Add playground examples.
6. Validate typecheck, token check, style check, and visual output.
```

Example:

```tsx
const kit = createSomethingRecipe(options)
const tokens = resolveSomethingNativeTokens(theme)

return (
  <Pressable accessibilityRole={...kit.a11y}>
    ...
  </Pressable>
)
```

## 9. Token Extraction Pattern

For each component family:

1. Add explicit semantic variables in preset CSS.
2. Add a family entry in `scripts/generate-react-native-tokens.ts`.
3. Generate token data.
4. Add resolver output in `first-edition.native-tokens.ts`.
5. Consume resolved tokens in RN components.

Extractor input should look like:

```css
.mw-checkbox {
  --mw-checkbox-size: var(--mw-density-checkbox-size);
  --mw-checkbox-border: var(--mw-color-border);
  --mw-checkbox-checked-bg: var(--mw-color-primary-base);
}
```

Extractor output should look like:

```ts
export const firstEditionCheckboxNativeTokens = {
  box: {
    border: { kind: "theme", path: "color.border" },
    checkedBackground: { kind: "theme", path: "color.primary.base" },
  },
}
```

## 10. Implementation Phases

### Phase 0: Lock The Decision

- [x] Select Path D as primary RN architecture.
- [x] Document decision in `D_DECISION.md`.
- [x] Keep POC branch history with Badge, Checkbox, Spinner proof.
- [ ] Review decision with project owner.
- [ ] Decide how to merge/cherry-pick D work back to the main RN branch.

### Phase 1: Hardening The Token Extractor

- [x] Generate Badge tokens from preset variables.
- [x] Generate Checkbox tokens from preset variables.
- [x] Generate Spinner tokens from preset variables.
- [x] Add `native-tokens:generate`.
- [x] Add `native-tokens:check`.
- [ ] Split extractor manifest data from extractor implementation if it grows.
- [ ] Add unit tests for token parsing:
  - [ ] `var(--mw-token)`
  - [ ] `var(--mw-token, fallback)`
  - [ ] `px`
  - [ ] `ms`
  - [ ] plain numbers
  - [ ] unsupported theme vars fail loudly
- [ ] Add a check that generated token data is committed.
- [ ] Add docs for adding a new native token family.

### Phase 2: Native Foundation Components

Goal: complete small atoms first and prove repeatability.

- [x] Badge.
- [x] Checkbox.
- [x] Spinner.
- [ ] Divider.
- [ ] Skeleton.
- [ ] Avatar.
- [ ] Icon.
- [ ] Button migration from current style resolver to D tokens.

Checklist per component:

- [ ] Core recipe exists or is added.
- [ ] Preset exposes explicit semantic variables.
- [ ] Extractor manifest entry exists.
- [ ] Generated native token data exists.
- [ ] RN component consumes resolved native tokens.
- [ ] Playground examples exist.
- [ ] Typecheck passes.
- [ ] Token check passes.
- [ ] Visual parity reviewed.
- [ ] Accessibility mapping reviewed.

### Phase 3: Form Controls

Goal: build real mobile form primitives without CSS translation.

- [x] Checkbox atom POC.
- [ ] Radio.
- [ ] Switch.
- [ ] Slider.
- [ ] Input.
- [ ] Textarea.
- [ ] Select trigger.
- [ ] Date picker trigger.
- [ ] Rich text controls if RN scope requires them.

Special validation:

- [ ] Keyboard behavior.
- [ ] Focus behavior.
- [ ] Disabled behavior.
- [ ] Invalid/error state.
- [ ] Screen reader labels.
- [ ] Field wrapper composition.

### Phase 4: Field Molecules

Goal: compose atoms into accessible form fields.

- [ ] CheckboxField.
- [ ] CheckboxGroupField.
- [ ] RadioGroupField.
- [ ] InputField.
- [ ] SliderField.
- [ ] SwitchField.
- [ ] AccordionField.

Special validation:

- [ ] Label association.
- [ ] Helper text.
- [ ] Error text.
- [ ] Required state.
- [ ] Group semantics.
- [ ] Layout density.

### Phase 5: Layout And Display Components

- [ ] Card.
- [ ] StatTile.
- [ ] Heading.
- [ ] Paragraph.
- [ ] Spacing.
- [ ] Tab.
- [ ] Tooltip display fallback.
- [ ] Toast visual shell.

Rule: if a component is mostly visual, prefer preset-sourced tokens. If it has behavior, core recipe
must own the behavior contract.

### Phase 6: Overlay And Hard Mobile Components

- [ ] Dialog.
- [ ] Modal behavior.
- [ ] Toast host.
- [ ] Tooltip/Popover mobile behavior.
- [ ] Select native interaction.
- [ ] Date picker native interaction.

Rule: do not force web interaction behavior into RN. Use native mobile patterns where the platform
expects them.

### Phase 7: Visual Validation Harness

- [ ] Run Expo playground on iOS.
- [ ] Run Expo playground on Android.
- [ ] Capture light mode screenshots.
- [ ] Capture dark mode screenshots.
- [ ] Capture custom theme screenshots.
- [ ] Add screenshot artifact folder.
- [ ] Compare Badge/Checkbox/Spinner against web/Figma references.
- [ ] Record accepted visual drift.
- [ ] Record required corrections.

### Phase 8: Accessibility Validation

- [ ] Verify decorative Spinner is hidden from assistive technology.
- [ ] Verify labelled Spinner announces loading when `decorative={false}` and `ariaLabel` is set.
- [ ] Verify Checkbox checked/mixed/disabled state.
- [ ] Verify form field labels and descriptions.
- [ ] Verify touch target sizes.
- [ ] Verify reduced-motion behavior.

### Phase 9: Release Readiness

- [ ] Decide generated file policy for package publishing.
- [ ] Ensure `@marwes-ui/react-native` exports all completed components.
- [ ] Add package README examples.
- [ ] Add migration notes from current RN POC.
- [ ] Add CI checks:
  - [ ] `pnpm native-tokens:check`
  - [ ] `pnpm native-styles:check` while legacy generated styles remain
  - [ ] RN package typecheck
  - [ ] preset tests
- [ ] Cut release candidate.

## 11. Component Completion Tracker

| Component | Core recipe | Preset variables | Token extraction | RN implementation | Playground | Visual validation | Status |
|---|---|---|---|---|---|---|---|
| Badge | Yes | Yes | Yes | Yes | Yes | No | POC complete |
| Checkbox | Yes | Yes | Yes | Yes | Yes | No | POC complete |
| Spinner | Yes | Yes | Yes | Yes | Yes | No | POC complete |
| Divider | Yes | Partial | No | Existing | Yes | No | Needs D migration |
| Button | Yes | Partial | No | Existing compiler path | Yes | No | Needs D migration |
| Skeleton | Yes | Partial | No | No | No | No | Next candidate |
| Avatar | Yes | Unknown | No | No | No | No | Pending |
| Icon | Yes | Unknown | No | No | No | No | Pending |
| Radio | Yes | Unknown | No | No | No | No | Pending |
| Switch | Yes | Unknown | No | No | No | No | Pending |
| Slider | Yes | Unknown | No | No | No | No | Pending |
| Input | Yes | Unknown | No | No | No | No | Pending |

## 12. Recommended Next Actions

1. Review this decision document.
2. Run visual validation for Badge, Checkbox, and Spinner in Expo.
3. Fix visual drift while keeping D boundaries intact.
4. Migrate Divider and Button from the current style resolver to D.
5. Build Skeleton as the next animation-adjacent component.

## 13. Final Position

Path D should be the Marwes React Native architecture going forward.

It gives us the right balance:

- shared semantic behavior from core
- shared visual intent from presets
- native rendering in React Native
- strict generation instead of broad compilation

That is the architecture most likely to scale across the full component library without becoming
fragile or over-engineered.
