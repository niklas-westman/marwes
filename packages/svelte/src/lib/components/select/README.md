# Select — Parity Findings

## Svelte vs React/Vue

### Aligned ✅
- `createSelectRecipe` integration
- `bind:value` support
- Options rendering with placeholder
- Native and Marwes appearance modes via `resolveSelectMode`
- Custom arrow icon for Marwes mode
- Placeholder-selected state via data attribute
- Disabled, required, aria-label, aria-invalid, aria-describedby

### Missing ❌
- **`SelectField`** molecule (label, helper, error wiring)
- **`SelectArrowIcon`** — using inline SVG instead of separate component (functionally equivalent)

### Notes
- `SelectField` follows the same molecule pattern as `InputField`. Can be added as a thin wrapper.
