# Divider Component

Framework-agnostic divider logic for Marwes.

**Figma reference:** node-id=1-932

## Files in this folder

- **[divider-types.ts](divider-types.ts)** - TypeScript interfaces for Divider options and render kit
- **[divider-recipe.ts](divider-recipe.ts)** - Main recipe: combines theme + options → RenderKit (className, vars, a11y)
- **[index.ts](index.ts)** - Public exports

## Flow: How Divider Works

```
User Code (React)
  ↓
<Divider size="md" orientation="horizontal" />
  ↓
[@marwes-ui/react] divider.tsx calls createDividerRecipe(theme, props)
  ↓
[@marwes-ui/core] divider-recipe.ts
  ├─ Map size to pixel value (md → 32px)
  ├─ Build className: "mw-divider mw-divider--horizontal mw-divider--md"
  └─ Build CSS vars: { "--mw-divider-color": "#E5E7EB", "--mw-divider-size": "32px" }
  ↓
Returns RenderKit:
{
  tag: "hr",
  className: "mw-divider mw-divider--horizontal mw-divider--md",
  vars: { "--mw-divider-color": "#E5E7EB", "--mw-divider-size": "32px", "--mw-divider-spacing": "2rem" },
  a11y: { role: "separator", aria-orientation: "horizontal" },
  dataAttributes: { "data-orientation": "horizontal", "data-size": "md" }
}
  ↓
[@marwes-ui/react] divider.tsx applies className + style={vars} + a11y props
  ↓
[@marwes-ui/presets] divider.css provides .mw-divider { ... } rules
  ↓
Browser renders styled, accessible divider
```

## Size Mapping

Semantic sizes map to Figma specifications:

| Size | Pixel Value | Spacing |
|------|-------------|---------|
| xxs  | 1px         | 0.5rem  |
| xs   | 8px         | 1rem    |
| sm   | 16px        | 1.5rem  |
| md   | 32px        | 2rem    |
| lg   | 48px        | 2.5rem  |
| xl   | 64px        | 3rem    |
| xxl  | 80px        | 4rem    |

## Orientation Support

- **horizontal** (default): Full-width, height based on size
- **vertical**: Full-height, width based on size

Both orientations set the appropriate `aria-orientation` for accessibility.

## Related Files

- **CSS Styles:** [packages/presets/src/firstEdition/divider.css](../../../../../presets/src/firstEdition/divider.css)
- **React Adapter:** [packages/react/src/components/divider.tsx](../../../../../react/src/components/divider.tsx)
- **Storybook Stories:** [apps/storybook-react/src/stories/divider.stories.tsx](../../../../../../apps/storybook-react/src/stories/divider.stories.tsx)

## Example Usage (React)

```tsx
import { Divider } from "@marwes-ui/react";

// Horizontal divider (default)
<Divider size="md" />

// Vertical divider
<Divider size="sm" orientation="vertical" />

// Extra small hairline divider
<Divider size="xxs" />
```

## Accessibility

- Uses semantic `<hr>` element
- Sets `role="separator"` explicitly
- Includes `aria-orientation` to indicate direction
- Respects WCAG 2.1 AA contrast requirements via theme colors
