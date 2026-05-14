# Switch — Parity Findings

## Svelte vs React/Vue

### Aligned ✅
- `Switch` atom with `createSwitchRecipe`
- `oncheckedchange` callback
- role="switch", aria-checked, aria-disabled
- Track/thumb DOM structure (mw-switch__track > mw-switch__thumb)
- `SwitchField` molecule with label, description, error, `buildSwitchFieldA11yIds`
- All sizes: compact, wide, rich

### Missing ❌
- **Purpose variant wrappers**: React/Vue have some switch variants (not critical)

### Notes
- Full functional parity. Switch variants in React/Vue are minor visual presets — not blocking.
