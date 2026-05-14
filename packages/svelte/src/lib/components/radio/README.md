# Radio — Parity Findings

## Svelte vs React/Vue

### Aligned ✅
- `Radio` atom with `radioRecipe`
- `bind:checked` support
- `oncheckedchange` callback
- `RadioGroupField` molecule with fieldset, legend, aria-labelledby, error region
- `buildRadioGroupFieldA11yIds` integration

### Missing ❌
- **Purpose variant wrappers**: React/Vue have `RadioCard` and similar (not critical)

### Notes
- Full functional parity for the core atom + group field. Variant wrappers are optional enhancements.
