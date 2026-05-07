# Accordion — Parity Findings

## Svelte vs React/Vue

### Aligned ✅
- `createAccordionRecipe` integration
- Open/closed state with `ontoggle` callback
- Disabled state
- Proper aria wiring: aria-expanded, aria-controls, aria-labelledby
- Trigger + panel compound structure
- Generated IDs via `$props.id()`
- Icon placeholder for expand/collapse indicator

### Missing ❌
- **`AccordionField`** molecule (wraps accordion with label/description)
- **Purpose variants**: React/Vue have some accordion variants

### Notes
- The base accordion is fully functional. `AccordionField` adds a thin label/description wrapper around a group of accordions.
