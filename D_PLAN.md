# D Plan: Token Compiler POC

Created: 2026-05-12

## 1. Goal

Prove whether **Path D: Token Compiler** can become an elegant Marwes React Native architecture.

Path D does **not** compile CSS declarations into final React Native style objects. Instead, it
extracts native-friendly **semantic design tokens** from Marwes design intent, then lets native
components own layout, behavior, and platform rendering.

The POC should answer one question:

> Can Marwes keep useful web/RN design alignment without building a CSS-to-RN browser engine?

## 2. Hypothesis

Path D is promising if it can make these three families feel simple:

- `Badge`: simple semantic color/spacing/typography token extraction.
- `Checkbox`: hard pseudo-element case where RN should render its own mark.
- `Spinner`: hard animation case where RN should animate natively.

If these three work with a small schema, D may be a better long-term architecture than Path A.

## 3. How D Differs From A + G

### A + G

```text
Simple CSS family -> CSS-to-RN compiler -> final RN styles
Hard native family -> handwritten native component -> theme directly
```

A + G keeps two implementation models:

- compiled styles for simple families
- native-authored styles for hard families

### D

```text
CSS/core/theme intent -> semantic native token compiler -> RN component owns layout and behavior
```

D has one main idea:

- generate or materialize **semantic native tokens**
- never generate full layout/behavior styles from browser CSS
- component authors use those tokens to build real RN components

Example output shape:

```ts
badgeTokens.info = {
  surface: theme.color.status.info.background,
  border: theme.color.status.info.border,
  label: theme.color.status.info.text,
  radius: theme.ui.radius,
  paddingX: 8,
  paddingY: 2,
  fontSize: 12,
  fontWeight: "500",
}
```

The component then decides how to render:

```tsx
<View
  style={{
    backgroundColor: tokens.surface,
    borderColor: tokens.border,
    borderRadius: tokens.radius,
    paddingHorizontal: tokens.paddingX,
    paddingVertical: tokens.paddingY,
  }}
>
  <Text style={{ color: tokens.label }}>{children}</Text>
</View>
```

## 4. Non-Negotiables

- [ ] D must not generate final RN layout objects from arbitrary CSS declarations.
- [ ] D must not support pseudo-elements as compiler output.
- [ ] D must not support CSS grid translation.
- [ ] D must not support CSS keyframes as compiler output.
- [ ] D must keep generated output smaller and easier to read than `first-edition.ts`.
- [ ] D must keep RN components native-owned for structure and interaction.
- [ ] D must use `@marwes-ui/core` recipes where they are platform-neutral.
- [ ] D must use `ResolvedTheme` as the runtime token source.
- [ ] D must produce evidence in `RN_POC_EVIDENCE.md`.

## 5. POC Branch

Use the existing D worktree:

```sh
cd /Users/niklaswestman/Documents/extras-projects/marwes-project-folder/marwes-rn-d-token
git status --short
```

Branch:

```text
rn-poc/d-token-compiler
```

The branch currently has only an evidence-placeholder commit. Before implementation, copy or
cherry-pick this plan into the D worktree.

## 6. Proposed File Layout

Use experimental names so the POC does not pretend to be final API.

```text
packages/react-native/src/styles/native-tokens/
  native-token-types.ts
  resolve-native-token.ts
  generated/
    first-edition.native-tokens.ts

packages/react-native/src/components/badge/
  badge.tsx

packages/react-native/src/components/checkbox/
  checkbox.tsx
  checkbox-mark.tsx
  index.ts

packages/react-native/src/components/spinner/
  spinner.tsx
  spinner-segments.tsx
  index.ts

scripts/
  generate-react-native-tokens.ts
```

This layout intentionally separates:

- token schema
- token generation
- token resolution
- native component rendering

## 7. Token Schema

Start with family-scoped tokens. Do not create one global mega-schema.

### Shared Types

```ts
export type NativeTokenValue = string | number

export type NativeTokenRef =
  | { kind: "theme"; path: string; fallback?: NativeTokenValue }
  | { kind: "static"; value: NativeTokenValue }

export type ResolvedNativeTokenMap<T> = {
  [K in keyof T]: T[K] extends NativeTokenRef ? NativeTokenValue : ResolvedNativeTokenMap<T[K]>
}
```

### Badge Tokens

```ts
export type BadgeNativeToneTokens = {
  surface: NativeTokenRef
  border: NativeTokenRef
  label: NativeTokenRef
}

export type BadgeNativeTokens = {
  base: {
    radius: NativeTokenRef
    paddingX: NativeTokenRef
    paddingY: NativeTokenRef
    gap: NativeTokenRef
    fontFamily: NativeTokenRef
    fontSize: NativeTokenRef
    fontWeight: NativeTokenRef
    lineHeight: NativeTokenRef
  }
  tones: Record<"neutral" | "info" | "success" | "warning" | "error", BadgeNativeToneTokens>
}
```

### Checkbox Tokens

```ts
export type CheckboxNativeTokens = {
  sizes: Record<"sm" | "md" | "lg", { size: NativeTokenRef }>
  box: {
    radiusMultiplier: NativeTokenRef
    border: NativeTokenRef
    background: NativeTokenRef
    checkedBackground: NativeTokenRef
    check: NativeTokenRef
    disabledOpacity: NativeTokenRef
    invalidBorder: NativeTokenRef
    focus: NativeTokenRef
  }
}
```

The checkbox token layer must **not** encode the checkmark as CSS mask or pseudo-element. RN owns the
mark rendering.

### Spinner Tokens

```ts
export type SpinnerNativeTokens = {
  sizes: Record<"xs" | "sm" | "md" | "lg", { size: NativeTokenRef }>
  colors: {
    track: NativeTokenRef
    indicator: NativeTokenRef
  }
  motion: {
    rotationDurationMs: NativeTokenRef
    reducedMotionDurationMs: NativeTokenRef
    segmentOpacities4: readonly number[]
    segmentOpacities8: readonly number[]
  }
}
```

The spinner token layer must **not** encode CSS keyframes. RN owns animation.

## 8. Token Source Strategy

Use the smallest extraction strategy that proves the architecture.

### Phase 1: Authored Token Manifests

Start with explicit TS manifests that represent design intent.

Why:

- Fastest path to prove component ergonomics.
- Avoids over-investing in CSS parsing too early.
- Makes the target token shape easy to inspect.

### Phase 2: CSS-Assisted Extraction

Only after Phase 1 works, add a small extractor for CSS-local variables where it is clearly valuable.

Candidate extraction:

- Badge local vars:
  - `--mw-badge-surface`
  - `--mw-badge-border`
  - `--mw-badge-label`
  - `--mw-badge-radius`
- Spinner local vars:
  - `--mw-spinner-size`
  - `--mw-spinner-track-color`
  - `--mw-spinner-indicator-color`
  - `--mw-spinner-rotation-duration`
- Checkbox local vars:
  - `--mw-checkbox-size`
  - `--mw-checkbox-radius`
  - `--mw-checkbox-border`
  - `--mw-checkbox-bg`
  - `--mw-checkbox-checked-bg`
  - `--mw-checkbox-check`

Stop if extraction starts becoming a CSS layout compiler.

## 9. Implementation Checklist

### A. Prep

- [x] Switch to `/Users/niklaswestman/Documents/extras-projects/marwes-project-folder/marwes-rn-d-token`.
- [x] Confirm branch is `rn-poc/d-token-compiler`.
- [x] Copy or cherry-pick `D_PLAN.md` into the D worktree.
- [x] Fill `RN_POC_EVIDENCE.md` branch identity fields.
- [x] Run baseline validation:
  - [x] `pnpm --filter @marwes-ui/react-native typecheck`
  - [x] `pnpm native-styles:check`

### B. Token Schema

- [x] Add `native-token-types.ts`.
- [x] Add `resolve-native-token.ts`.
- [ ] Define family-scoped token types for Badge, Checkbox, Spinner.
- [x] Keep token value model limited to static values and theme refs.
- [x] Add type-level protection against arbitrary style props.

### C. Generated/Authored Token Output

- [x] Add `first-edition.native-tokens.ts`.
- [x] Encode Badge base tokens and tones.
- [x] Encode Checkbox sizes and state colors.
- [ ] Encode Spinner size, color, and motion tokens.
- [x] Keep output readable by a human.
- [x] Record generated/authored token line count in `RN_POC_EVIDENCE.md`.

### D. Optional Token Generator

- [x] Add `scripts/generate-react-native-tokens.ts` only if authored token output proves useful.
- [x] Generator may read CSS variables, but not layout declarations.
- [x] Generator must fail on unsupported token references.
- [x] Generator output must be deterministic.
- [x] Add a check command if generator exists.

### E. Badge Component

- [x] Refactor RN Badge to consume resolved badge tokens instead of `resolveBadgeStyles()`.
- [x] Preserve `createBadgeRecipe()`.
- [x] Preserve `MarwesNativeProvider` and `useMarwesTheme()`.
- [x] Support `neutral`, `info`, `success`, `warning`, `error`.
- [x] Support light/dark through `ResolvedTheme`.
- [x] Keep component readable without inspecting generated CSS resolver output.

### F. Checkbox Component

- [x] Add RN Checkbox component.
- [x] Use core `checkboxRecipe()` or current exported checkbox recipe API.
- [x] Resolve size and state visuals from Checkbox native tokens.
- [x] Render checked mark natively.
- [x] Render indeterminate mark natively.
- [x] Support disabled state.
- [x] Support invalid state.
- [x] Map native accessibility props deliberately.
- [x] Do not use pseudo-element or CSS-mask concepts in RN.

### G. Spinner Component

- [ ] Add RN Spinner component.
- [ ] Use `createSpinnerRecipe()`.
- [ ] Resolve size, track color, indicator color, duration, and segment opacity tokens.
- [ ] Render SVG or RN-native primitives deliberately.
- [ ] Use RN animation primitives for rotation/segment opacity.
- [ ] Support reduced-motion strategy or document why it is deferred.
- [ ] Do not compile CSS keyframes.

### H. Playground

- [x] Add a D POC section in `apps/playground-react-native/App.tsx`.
- [ ] Render Badge variants.
- [x] Render Checkbox unchecked, checked, mixed, disabled, invalid.
- [ ] Render Spinner at least two variants.
- [x] Render light and dark theme states.

### I. Validation

- [x] `pnpm --filter @marwes-ui/react-native typecheck`
- [x] `pnpm native-styles:check`
- [x] Scoped Biome check for touched RN, token, and playground files.
- [ ] Expo playground manual inspection.
- [x] Fill all validation rows in `RN_POC_EVIDENCE.md`.

### J. Evidence

- [x] Count authored source lines.
- [x] Count generated/authored token lines.
- [x] Count schema/config files.
- [x] Count new abstractions.
- [x] Record dependency delta.
- [x] Record next-component cost.
- [x] Compare D against A + G in plain language.
- [x] Mark recommendation: keep, reject, or continue.

## 10. Success Criteria

D is successful if:

- [ ] Badge is simpler to reason about than the generated style resolver path.
- [x] Checkbox does not require compiler support for pseudo-elements.
- [ ] Spinner does not require compiler support for CSS animation/keyframes.
- [ ] Token schema stays family-scoped and understandable.
- [ ] Generated/authored token output is much smaller than current full style resolver output.
- [ ] Components remain native and readable.
- [x] Typecheck passes.
- [ ] Evidence clearly explains next-component cost.

## 11. Failure Criteria

D should be rejected or reduced if:

- [ ] The token schema becomes a generic styling DSL.
- [ ] Token manifests duplicate most of the CSS by hand.
- [ ] Components need to understand CSS selectors.
- [ ] The generator starts handling layout declarations.
- [ ] The implementation needs broad changes to `@marwes-ui/core`.
- [ ] The result is harder to explain than A + G.
- [ ] Visual alignment is no better than handwritten native styles.

## 12. Expected Comparison Against A + G

| Dimension | A + G expected | D target |
|---|---|---|
| Simple families | Compiled final RN styles | Semantic tokens consumed by native components |
| Hard families | Handwritten native styles | Same token contract, native rendering |
| Compiler scope | CSS declaration translation for selected families | Semantic token extraction only |
| Generated output | Full style resolver | Token maps and resolver helpers |
| Native UX | Good when using G | Good by default for all D components |
| Drift control | Strong for compiled, weaker for native-authored | Shared semantic tokens across both |
| Main risk | Compiler creep | Token schema becoming a second DSL |

## 13. Ready-To-Start Gate

We are ready to start POC D implementation when:

- [ ] `D_PLAN.md` is committed on `rn-poc/baseline`.
- [ ] `D_PLAN.md` is copied or cherry-picked to `rn-poc/d-token-compiler`.
- [ ] `rn-poc/d-token-compiler` worktree is clean.
- [ ] `RN_POC_EVIDENCE.md` exists in the D worktree.
- [ ] Baseline validation passes.

## 14. Recommended First Implementation Slice

Do not start with all three families at once.

First slice:

1. Add token schema.
2. Add authored Badge native tokens.
3. Refactor RN Badge to consume tokens.
4. Fill evidence with line counts and readability notes.

Only continue to Checkbox if Badge feels meaningfully cleaner than the current generated resolver
path.

Second slice:

1. Add Checkbox native tokens.
2. Add RN Checkbox with native mark rendering.
3. Validate that no pseudo-element compiler work is needed.

Third slice:

1. Add Spinner native tokens.
2. Add RN Spinner native animation.
3. Validate that no keyframe compiler work is needed.

## 15. My Readiness Assessment

First and second implementation slices are complete for Badge and Checkbox. The first extractor slice
is also complete: Badge and Checkbox token data now comes from explicit variables in
`packages/presets/src/firstEdition`.

The preset-sourced token output still looks elegant enough to justify the third slice. Checkbox
rendered checked, indeterminate, invalid, and disabled states natively from the same small token
model, so Path D currently stays ahead of A + G as the primary architecture candidate.

The next readiness gate is Spinner: if Spinner can render motion natively without CSS keyframe
compiler support, D has proved both hard cases that A + G would otherwise split into special paths.
