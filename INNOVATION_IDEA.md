# Innovation Idea: Preset-Sourced Native Tokens

Created: 2026-05-12

## Core Idea

Path D should not hand-author React Native design tokens long term.

Instead, `@marwes-ui/presets` should expose a small, explicit native token surface through existing
CSS custom properties. A strict extractor reads those variables and generates RN-friendly token data.

```text
@marwes-ui/core
  owns props, state, semantics, recipes, and a11y

@marwes-ui/presets
  owns visual design intent through semantic --mw-* variables

@marwes-ui/react-native
  owns native layout, native interaction, and native animation

native token extractor
  bridges preset variables into typed RN token maps
```

## Why This Is Better

This avoids two bad extremes:

- A full CSS-to-RN compiler that slowly becomes a browser engine.
- A handwritten RN design system that duplicates preset values and drifts from web.

The extractor should read design intent, not CSS behavior.

Good extraction:

```text
--mw-checkbox-checked-bg -> theme.color.primary
--mw-checkbox-size -> 18
--mw-spinner-rotation-duration -> 800
```

Bad extraction:

```text
.mw-checkbox::before mask-image -> RN checkmark
@keyframes mw-spinner-rotate -> RN animation code
display: inline-grid -> RN layout
```

RN should render the checkbox mark and spinner motion natively.

## Preset Variables We Want

### Badge

Already present:

- `--mw-badge-surface`
- `--mw-badge-border`
- `--mw-badge-label`
- `--mw-badge-radius`

Should be explicit for native extraction:

- `--mw-badge-gap`
- `--mw-badge-padding-x`
- `--mw-badge-padding-y`
- `--mw-badge-font-family`
- `--mw-badge-font-size`
- `--mw-badge-font-weight`
- `--mw-badge-line-height`

### Checkbox

Already present:

- `--mw-checkbox-size`
- `--mw-checkbox-radius`
- `--mw-checkbox-border`
- `--mw-checkbox-bg`
- `--mw-checkbox-checked-bg`
- `--mw-checkbox-check`

Should be explicit for native extraction:

- `--mw-checkbox-radius-multiplier`
- `--mw-checkbox-disabled-opacity`
- `--mw-checkbox-invalid-border`

### Spinner

Already present:

- `--mw-spinner-size`
- `--mw-spinner-track-color`
- `--mw-spinner-indicator-color`
- `--mw-spinner-rotation-duration`

Should be explicit later:

- segment opacity tokens, or a named motion profile token such as `--mw-spinner-motion-profile`.

## Extractor Rules

The extractor must be intentionally small:

- Read preset CSS with PostCSS.
- Extract only variables listed in a family manifest.
- Resolve component-local variable overrides by selector.
- Preserve theme references as typed theme paths.
- Convert `px`, plain numbers, and `ms` to numbers.
- Fail hard when a required token is missing.
- Refuse to parse pseudo-elements, CSS masks, layout declarations, grid, or keyframes as native output.

## Proposed Manifest Shape

```ts
checkbox: {
  sourceCss: "packages/presets/src/firstEdition/checkbox.css",
  tokens: {
    sizes: {
      sm: [".mw-checkbox--sm", "--mw-checkbox-size"],
      md: [".mw-checkbox--md", "--mw-checkbox-size"],
      lg: [".mw-checkbox--lg", "--mw-checkbox-size"],
    },
    box: {
      border: [".mw-checkbox", "--mw-checkbox-border"],
      background: [".mw-checkbox", "--mw-checkbox-bg"],
      checkedBackground: [".mw-checkbox", "--mw-checkbox-checked-bg"],
      check: [".mw-checkbox", "--mw-checkbox-check"],
      disabledOpacity: [".mw-checkbox", "--mw-checkbox-disabled-opacity"],
      invalidBorder: [".mw-checkbox", "--mw-checkbox-invalid-border"],
    },
  },
}
```

## Success Criteria

This idea is successful if:

- Badge and Checkbox native token maps can be generated from preset CSS.
- RN components remain readable and native-owned.
- No new runtime dependency is added.
- `@marwes-ui/core` remains the semantic source for props/state/a11y.
- The extractor is smaller and easier to reason about than the CSS-to-RN style compiler.

## Current Recommendation

Continue Path D with a strict preset-token extractor.

Do not build a general CSS compiler. Add explicit component variables to presets where design intent is
currently hidden inside normal CSS declarations.
