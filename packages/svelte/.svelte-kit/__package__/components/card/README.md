# Card — Parity Findings

## Svelte vs React/Vue

### Aligned ✅
- `Card` atom with `createCardRecipe`
- Title (string or snippet) + body content
- Correct DOM structure: mw-card > mw-card__header > mw-card__title + mw-card__body
- Class merging, id, data attributes

### Missing ❌
- **Purpose variant wrappers** (3): `ProductCard`, `ProfileCard`, `StatCard`

### Notes
- Purpose card variants add pre-configured slot structures and data-purpose attributes. Medium complexity — each needs custom slot/snippet layout.
