# Checkbox — Parity Findings

## Svelte vs React/Vue

### Aligned ✅
- `Checkbox` atom with `checkboxRecipe`
- `bind:checked` support
- `indeterminate` DOM property applied via `$effect`
- `oncheckedchange` callback
- All a11y: aria-label, aria-labelledby, aria-describedby, aria-checked="mixed", aria-invalid
- `CheckboxField` molecule with label, description, error, `buildCheckboxFieldA11yIds`

### Missing ❌
- **`CheckboxGroupField`** molecule (groups multiple checkboxes with shared label/error)

### Notes
- `CheckboxGroupField` is a fieldset-based wrapper around multiple `CheckboxField` items. Same pattern as `RadioGroupField`. Medium complexity.
