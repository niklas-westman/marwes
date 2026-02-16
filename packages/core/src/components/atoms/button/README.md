# Button Component

Framework-agnostic button logic for Marwes.

## Files in this folder

- **[button-types.ts](button-types.ts)** - TypeScript interfaces for Button options, a11y props, and render kit
- **[button-a11y.ts](button-a11y.ts)** - Accessibility logic: maps props → ARIA attributes + semantic behavior
- **[button-recipe.ts](button-recipe.ts)** - Main recipe: combines theme + options → RenderKit (className, vars, a11y)
- **[index.ts](index.ts)** - Public exports

## Flow: How Button Works

```
User Code (React)
  ↓
<Button variant="solid" tone="primary">Save</Button>
  ↓
[@marwes-ui/react] button.tsx calls createButtonRecipe(theme, props)
  ↓
[@marwes-ui/core] button-recipe.ts
  ├─ resolveButtonA11y(opts) → { tag, a11y, blockClick }
  ├─ Build className: "mw-btn mw-btn--solid mw-btn--primary"
  └─ Build CSS vars: { "--mw-primary": "#5B8CFF", ... }
  ↓
Returns RenderKit:
{
  tag: "button",
  className: "mw-btn mw-btn--solid mw-btn--primary",
  vars: { "--mw-primary": "#5B8CFF", "--mw-radius": "10px" },
  a11y: { type: "button", disabled: false },
  blockClick: false
}
  ↓
[@marwes-ui/react] button.tsx applies className + style={vars} + a11y props
  ↓
[@marwes-ui/presets] styles.css provides .mw-btn { ... } rules
  ↓
Browser renders styled, accessible button
```

## Related Files

- **CSS Styles:** [packages/presets/src/firstEdition/styles.css](../../../../../presets/src/firstEdition/styles.css)
- **React Adapter:** [packages/react/src/components/button.tsx](../../../../../react/src/components/button.tsx)
- **Storybook Stories:** [apps/storybook-react/src/stories/button/primary-button.stories.tsx](../../../../../../apps/storybook-react/src/stories/button/primary-button.stories.tsx)

## Example Usage (React)

```tsx
import { Button } from "@marwes-ui/react";

<Button variant="solid" tone="primary" onClick={handleClick}>
  Save Changes
</Button>

// Renders:
<button 
  class="mw-btn mw-btn--solid mw-btn--primary"
  style="--mw-primary: #5B8CFF; --mw-radius: 10px"
  type="button"
>
  Save Changes
</button>
```

## RenderKit Output Example

```ts
createButtonRecipe(theme, { 
  variant: "outline", 
  tone: "secondary",
  disabled: true 
})

// Returns:
{
  tag: "button",
  className: "mw-btn mw-btn--outline mw-btn--secondary",
  vars: {
    "--mw-primary": "#5B8CFF",
    "--mw-secondary": "#111111",
    "--mw-radius": "10px"
  },
  a11y: {
    type: "button",
    disabled: true,
    "aria-disabled": true
  },
  blockClick: false
}
```

## A11y Behavior

The [button-a11y.ts](button-a11y.ts) file handles:

- **`as="button"`** → renders `<button>` with `type="button"` and native `disabled`
- **`as="a"`** → renders `<a>` with `role="button"`, `tabIndex`, `aria-disabled`
- **Icon-only buttons** → warns in dev mode if `ariaLabel` is missing
- **Loading state** → sets `aria-busy={true}`
- **Toggle buttons** → sets `aria-pressed` based on `pressed` prop

## Testing

```bash
# Validate core package
pnpm --filter @marwes-ui/core typecheck

# View in Storybook
pnpm dev:storybook

# Test in playground
pnpm dev:playground
```
