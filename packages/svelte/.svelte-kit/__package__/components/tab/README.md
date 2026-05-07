# TabGroup — Parity Findings

## Svelte vs React/Vue

### Aligned ✅
- `createTabRecipe` + `buildTabGroupA11yIds` integration
- `moveTabSelection` keyboard navigation (ArrowLeft/Right, Home, End)
- Active tab management (controlled + uncontrolled)
- Disabled tabs
- Proper ARIA: role="tablist", role="tab", role="tabpanel", aria-selected, aria-controls, aria-labelledby
- Panel content rendering (string or Snippet)
- Optional visible label with labelId wiring

### Missing ❌
- **Individual `Tab` component export** (React/Vue export both `Tab` + `TabGroup`)
- **Purpose variants**

### Notes
- Svelte uses a declarative `tabs` array prop. React/Vue also have an imperative `Tab` atom for custom layouts. For most use cases, `TabGroup` is sufficient.
