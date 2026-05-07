# Avatar — Parity Findings

## Svelte vs React/Vue

### Aligned ✅
- `createAvatarRecipe` integration
- All types: icon, initials, image (auto-detected)
- All sizes: small, medium, large
- Proper content rendering per type (img, span with initials, Icon)
- Accessibility: role="img", aria-hidden for decorative, aria-label
- Initials normalization (max 2 chars, uppercase)

### Missing ❌
- **`AvatarBadge`** component (small indicator overlaid on avatar)
- **`AvatarGroup`** component (stacked avatar row with overlap)
- **Purpose variants**

### Notes
- `AvatarBadge` and `AvatarGroup` are layout/positioning components. Medium complexity. They rely on CSS positioning rather than core recipes.
