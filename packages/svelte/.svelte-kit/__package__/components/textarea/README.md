# Textarea — Parity Findings

## Svelte vs React/Vue

### Aligned ✅
- `createTextareaRecipe` integration
- `bind:value` support
- All input props: placeholder, disabled, readOnly, required, rows, cols, resize
- Tone/invalid/describedBy support
- aria-label, aria-invalid, aria-describedby
- Class/style/CSS vars merging

### Missing ❌
- **`TextareaField`** molecule (label, helper, error wiring — like InputField but for textarea)

### Notes
- `TextareaField` is the same pattern as `InputField` but wraps `Textarea` instead of `Input`. Can be added following the same template.
