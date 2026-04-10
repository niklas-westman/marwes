# Loading Button Spec

## Status
Proposed

## Purpose
Define the public API and expected behavior for loading-state buttons in Marwes.

This spec extends the existing `Button` API so loading behavior can be expressed in two ways:
- a simple boolean for the common case
- a structured object for custom loading behavior

---

## Implementation References

### Design references
- `.figma/INDEX.md`
- `.figma/marwes/pages/-spinner/-spinner_1737-10635.json`
- `.figma/marwes/pages/-spinner/-spinner-dark_1780-1543.json`
- `.figma/marwes/components/spinnerclassic.json`
- `.figma/marwes/components/spinnerdual.json`
- `.figma/marwes/components/spinnerdots-round.json`
- `.figma/marwes/pages/-button/README.md`

### Repo workflow references
- `docs/guides/adding-components.md`
- `docs/guides/figma-to-marwes.md`
- `docs/reference/spec.md`
- `docs/reference/architecture.md`

### Key code paths
- `packages/core/src/components/atoms/button/`
- `packages/react/src/components/button/`
- `packages/vue/src/components/button/`
- `packages/core/src/components/atoms/spinner/`
- `packages/react/src/components/spinner/`
- `packages/vue/src/components/spinner/`

---

## Goals

- Keep the existing simple API ergonomic
- Support richer loading behavior without introducing a separate button component
- Let product code control:
  - whether loading is active
  - whether the button is disabled while loading
  - which spinner variant is used
  - which label is shown while loading
- Keep React and Vue behavior aligned
- Reuse the existing `Spinner` family and `ButtonSpinner` treatment

---

## Non-goals

- Introduce determinate progress into `Button`
- Replace skeletons or other loading patterns
- Add async state management to the button itself
- Invent a new loading-only molecule instead of extending `Button`

---

## Proposed Public API

```ts
loading?: boolean | ButtonLoadingOptions
```

### Type

```ts
interface ButtonLoadingOptions {
  isLoading: boolean
  disableWhileLoading?: boolean
  spinnerVariant?: SpinnerVariant
  loadingLabel?: string
}
```

### Notes

- `disableWhileLoading` defaults to `true`
- `spinnerVariant` defaults to `SpinnerVariants.classic`
- `loadingLabel` is optional
- `isLoading` is kept for explicitness and stable object-shape usage

---

## Proposed Spinner Exports

To make spinner variants easy to import and use in button loading config, expose:

```ts
export const SpinnerVariants = {
  classic: "classic",
  ring: "ring",
  dual: "dual",
  dotsRound: "dots-round",
  dotsSquare: "dots-square",
  lines: "lines",
  cross: "cross",
} as const

export type SpinnerVariant =
  (typeof SpinnerVariants)[keyof typeof SpinnerVariants]
```

### Rationale

This gives a clear split between:
- `SpinnerVariants` as the runtime value object
- `SpinnerVariant` as the type

Example:

```ts
import { SpinnerVariants, type SpinnerVariant } from "@marwes-ui/core"
```

---

## Examples

### 1. Simple boolean loading

```tsx
<Button loading>Save</Button>
```

Equivalent behavior:
- loading is active
- button is disabled while loading
- spinner variant is `classic`
- original children remain visible

### 2. Configurable object loading

```tsx
<Button
  loading={{
    isLoading: true,
    disableWhileLoading: true,
    spinnerVariant: SpinnerVariants.classic,
    loadingLabel: "Saving…",
  }}
>
  Save
</Button>
```

### 3. Controlled async state

```tsx
<Button
  loading={{
    isLoading: isSaving,
    loadingLabel: "Saving…",
    spinnerVariant: SpinnerVariants.classic,
  }}
>
  Save
</Button>
```

### 4. Non-blocking loading state

```tsx
<Button
  loading={{
    isLoading: isRefreshing,
    disableWhileLoading: false,
    loadingLabel: "Refreshing…",
    spinnerVariant: SpinnerVariants.dual,
  }}
>
  Refresh
</Button>
```

---

## Normalization Rules

The button implementation should normalize the `loading` prop into an internal resolved shape.

### Internal resolved shape

```ts
interface ResolvedButtonLoading {
  isLoading: boolean
  disableWhileLoading: boolean
  spinnerVariant: SpinnerVariant
  loadingLabel?: string
}
```

### Input cases

#### Case A
```ts
loading === undefined
```
Resolved:
- not loading

#### Case B
```ts
loading === false
```
Resolved:
- not loading

#### Case C
```ts
loading === true
```
Resolved:
- `isLoading = true`
- `disableWhileLoading = true`
- `spinnerVariant = SpinnerVariants.classic`
- `loadingLabel = undefined`

#### Case D
```ts
loading = {
  isLoading,
  disableWhileLoading,
  spinnerVariant,
  loadingLabel,
}
```
Resolved:
- `isLoading = loading.isLoading`
- `disableWhileLoading = loading.disableWhileLoading ?? true`
- `spinnerVariant = loading.spinnerVariant ?? SpinnerVariants.classic`
- `loadingLabel = loading.loadingLabel`

---

## Render Rules

When resolved loading is active:

1. Render a prepended spinner using the button-loading treatment
2. Hide left/right icon affordances
3. Preserve button structure and spacing from the real Marwes button
4. Set `aria-busy="true"`
5. If loading should disable interaction, apply disabled behavior
6. If `loadingLabel` exists, render it instead of the original button children
7. If `loadingLabel` does not exist, keep rendering the original children
8. Keep button-loading spinner size fixed to the synced button treatment (`xs`)

### Label behavior

### Accessible name behavior

When loading is active:
- if the consumer provided `ariaLabel`, keep using it
- otherwise, if `loadingLabel` is rendered, treat `loadingLabel` as the effective accessible label
- otherwise, fall back to the normal button text content

#### With loading label
```tsx
<Button
  loading={{
    isLoading: true,
    loadingLabel: "Saving…",
  }}
>
  Save
</Button>
```
Visible text while loading:
- `Saving…`

#### Without loading label
```tsx
<Button loading>Save</Button>
```
Visible text while loading:
- `Save`

---

## Disabled Behavior

Resolved disabled state should follow:

```ts
finalDisabled = disabled || (isLoading && disableWhileLoading)
```

### Meaning

- explicit `disabled` still wins
- loading disables by default
- object form can opt out with `disableWhileLoading: false`

### `disableWhileLoading: false`

If loading is active and `disableWhileLoading` is `false`:
- spinner is still shown
- `aria-busy="true"` is still set
- button remains interactive
- click handling is not blocked
- anchor navigation is not blocked

This mode is visual and semantic only — not interaction-blocking.

### Anchor-backed buttons

For buttons rendered as anchors:
- preserve current blocked-click behavior when loading disables interaction
- keep `aria-disabled="true"`
- prevent navigation while disabled/loading-blocked

---

## Accessibility Rules

When loading is active:
- apply `aria-busy="true"`
- if disabled via loading, apply the same disabled semantics already used by the current button implementation
- spinner inside button should remain decorative
- button text or `loadingLabel` remains the user-facing loading announcement
- if `loadingLabel` is shown and `ariaLabel` is not explicitly provided, the effective accessible name should follow `loadingLabel`

### Icon-only buttons

If a button is icon-only and loading is active, it must still have an accessible name.

Acceptable sources:
- explicit `ariaLabel`
- `loadingLabel`

If neither exists:
- emit a development warning
- keep runtime behavior safe, but treat the missing accessible name as invalid usage

### Important rule

Inside a button, the spinner itself should not become a separate announced status region.

Reason:
- the button label already communicates the loading action
- nested competing announcements would be noisy

---

## Spinner Treatment Rules

Default loading button spinner should use the current button-loading spinner treatment:
- size: `xs`
- default variant: `classic`
- filled buttons use inverted spinner colors
- non-filled buttons use current-color spinner colors

### Size policy

`spinnerVariant` may be customized in button loading config, but spinner size should remain fixed to the button-loading treatment.

Reason:
- keeps button loading visually consistent
- avoids layout drift between buttons
- aligns more closely with the synced Figma button-loading usage

### Filled button variants
Filled variants currently include:
- `primary`
- `success`

### Non-filled button variants
Non-filled variants currently include:
- `secondary`
- `neutral`
- `text`

---

## Adapter Requirements

### Core
Core should:
- define the loading types
- normalize loading config
- expose enough metadata for adapters to render the right loading state
- keep accessibility logic in core

### React/Vue adapters
Adapters should:
- render `ButtonSpinner` when loading is active
- suppress left/right icons while loading
- swap visible label when `loadingLabel` is present
- keep the existing button DOM element and styling contract

---

## Backward Compatibility

### Existing usage
Current usage:

```tsx
<Button loading>Save</Button>
```

Should remain valid without changes.

Existing `loading={true}` usage must continue to render the current classic loading treatment without requiring migration.

### Migration behavior
No breaking change should be required for boolean loading.

The object form is additive.

---

## Naming Decisions

### Accepted names
- `loading?: boolean | ButtonLoadingOptions`
- `ButtonLoadingOptions`
- `disableWhileLoading`
- `loadingLabel`
- `SpinnerVariants`
- `SpinnerVariant`

### Rejected names
- `defaultDisabled`
  - rejected because it sounds like an initial/default prop state, not runtime behavior
- `label`
  - rejected because it is too generic for button loading behavior
- `LoadingSpinnerType`
  - rejected because `ButtonLoadingOptions` is clearer and more local to the button API

---

## Open Questions

1. Should `loadingLabel` update the accessible name automatically when `ariaLabel` is not provided?
   - Recommended: yes, when visible label is replaced, accessible name should follow the visible loading label.

2. Should icon-only buttons require a loading label when loading is active?
   - Recommended: yes, icon-only loading buttons should still have an accessible name.

3. Should `ButtonSpinner` allow direct size override in button usage?
   - Recommended: not for the default `Button loading` path. Keep button loading visually consistent.

4. Should `disableWhileLoading: false` be common enough to document prominently in button docs?
   - Recommended: yes, because it changes interaction semantics in an important way.

---

## Recommended Implementation Order

1. Add `ButtonLoadingOptions` to core button types
2. Add normalized loading resolver in core
3. Rename spinner runtime export to `SpinnerVariants`
4. Update button adapters to use normalized loading state
5. Update tests for boolean and object forms
6. Update Storybook button stories to cover:
   - boolean loading
   - object loading with label swap
   - object loading with `disableWhileLoading: false`
   - object loading with custom spinner variant

---

## Summary

Recommended direction:
- keep `loading` on `Button`
- allow `boolean | ButtonLoadingOptions`
- preserve boolean shorthand
- add object form for explicit control
- keep `isLoading` in the object form for stable, explicit usage
- use clearer field names:
  - `disableWhileLoading`
  - `loadingLabel`
- expose spinner variants through:
  - `SpinnerVariants`
  - `SpinnerVariant`
- keep button-loading spinner size fixed to the synced treatment
- treat `loadingLabel` as the effective accessible label when it replaces visible content and no explicit `ariaLabel` is provided
