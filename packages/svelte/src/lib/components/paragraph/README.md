# Paragraph — Parity Findings

## Svelte vs React/Vue

### Aligned ✅
- `Paragraph` component with `paragraphRecipe`
- `mw-p` class with size modifiers (`mw-p--sm`, `mw-p--md`, `mw-p--lg`)
- CSS vars for font family, size, weight, line height from resolved theme
- Optional `id`, `size`, custom `class`, `style`
- Requires `MarwesProvider` context for theme access

### Notes
- Paragraph recipe requires the resolved theme to compute font variables.
