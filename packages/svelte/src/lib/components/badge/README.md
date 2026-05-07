# Badge — Parity Findings

## Svelte vs React/Vue

### Aligned ✅
- `Badge` atom with `createBadgeRecipe`
- All variants: neutral, info, success, warning, error
- `BadgeGroup` molecule with fieldset/legend/aria-labelledby
- Class merging, data attributes spreading
- Optional ariaLabel, id, custom dataAttributes

### Missing ❌
- **Purpose variant wrappers** (3): `StatusBadge`, `PriorityBadge`, `NotificationBadge`

### Notes
- Purpose badge variants are thin — they pre-set variant and add purpose-specific data attributes. Low priority follow-up.
