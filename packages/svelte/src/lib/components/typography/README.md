# Typography (H1, H2, H3, Paragraph) — Parity Findings

## Svelte vs React/Vue

### Aligned ✅
- H1, H2, H3 with `headingRecipe` + theme context
- Paragraph with `paragraphRecipe` + theme context
- Visual size override (e.g. H1 rendered as h3 size)
- CSS vars from theme typography settings
- Semantic HTML tags (h1, h2, h3, p)
- Class/style merging, id, ariaLabel

### Missing ❌
- None — full parity with React/Vue atoms.

### Notes
- React additionally exports a `Heading` generic component. Vue uses individual H1/H2/H3. Svelte follows the Vue pattern (individual components).
