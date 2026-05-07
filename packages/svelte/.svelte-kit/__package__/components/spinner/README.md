# Spinner — Parity Findings

## Svelte vs React/Vue

### Aligned ✅
- `Spinner` atom with full `createSpinnerRecipe` integration
- All 7 variants: classic, ring, dual, dots-round, dots-square, lines, cross
- All sizes: xs, sm, md, lg (and custom numeric)
- SVG node rendering with kebab-case attribute conversion
- `ButtonSpinner` purpose wrapper with track/indicator color vars
- Accessibility: role="status", aria-hidden, aria-label, aria-live
- Data attributes: data-component, data-variant, data-size
- Class/style/CSS vars merging

### Missing ❌
- `EmptyStateSpinner` purpose wrapper (React/Vue have it, low priority)

### Notes
- `EmptyStateSpinner` is trivial — same as `ButtonSpinner` but defaults to `variant="dots-round"`, `size="lg"`, with `data-purpose="empty-state"`.
