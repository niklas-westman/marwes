# Heading — Parity Findings

## Svelte vs React/Vue

### Aligned ✅
- `H1`, `H2`, `H3` components with `headingRecipe`
- `mw-heading` class with size modifiers (`mw-heading--h1`, etc.)
- CSS vars for font family, size, weight, line height from resolved theme
- Optional `id`, `ariaLabel`, `size` override, custom `class`, `style`
- Requires `MarwesProvider` context for theme access

### Notes
- Heading recipe requires the resolved theme to compute font variables.
