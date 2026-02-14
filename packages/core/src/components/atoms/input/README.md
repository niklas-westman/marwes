# Input Component

Framework-agnostic input logic for Marwes.

## Files in this folder

- **[input-types.ts](input-types.ts)** - TypeScript interfaces for Input options, a11y props, and render kit
- **[input-a11y.ts](input-a11y.ts)** - Accessibility logic: maps props → ARIA attributes + semantic behavior
- **[input-recipe.ts](input-recipe.ts)** - Main recipe: combines theme + options → RenderKit (className, vars, a11y)
- **[index.ts](index.ts)** - Public exports

## Flow: How Input Works

```
User Code (React)
  ↓
<Input 
  label="Email" 
  value={email} 
  onValueChange={setEmail}
  invalid={errors.email}
/>
  ↓
[@marwes/react] input.tsx calls createInputRecipe(theme, props)
  ↓
[@marwes/core] input-recipe.ts
  ├─ resolveInputA11y(opts) → a11y props (id, name, type, aria-*)
  ├─ Build className: "mw-input mw-input--default is-invalid"
  └─ Build CSS vars: { "--mw-primary": "#5B8CFF", "--mw-border": "...", ... }
  ↓
Returns RenderKit:
{
  tag: "input",
  className: "mw-input mw-input--default is-invalid",
  vars: { "--mw-primary": "#5B8CFF", "--mw-border": "#D9D9DE", ... },
  a11y: { 
    type: "text", 
    id: "email", 
    "aria-invalid": true,
    "aria-describedby": "email-error"
  }
}
  ↓
[@marwes/react] input.tsx applies className + style={vars} + a11y props
  ↓
[@marwes/presets] styles.css provides .mw-input { ... } rules
  ↓
Browser renders styled, accessible input
```

## Related Files

- **CSS Styles:** [packages/presets/src/firstEdition/styles.css](../../../../../presets/src/firstEdition/styles.css)
- **React Adapter:** [packages/react/src/components/input.tsx](../../../../../react/src/components/input.tsx)
- **Storybook Stories:** [apps/storybook-react/src/stories/input.stories.tsx](../../../../../../apps/storybook-react/src/stories/input.stories.tsx)

## Example Usage (React)

```tsx
import { Input } from "@marwes/react";

<Input
  label="Email"
  type="email"
  value={email}
  onValueChange={setEmail}
  placeholder="you@example.com"
  invalid={!!errors.email}
  helperText={errors.email || "We'll never share your email"}
/>

// Renders:
<input
  class="mw-input mw-input--default is-invalid"
  style="--mw-primary: #5B8CFF; --mw-border: #D9D9DE; ..."
  type="email"
  id="email"
  placeholder="you@example.com"
  aria-invalid="true"
  aria-describedby="email-helper"
/>
```

## RenderKit Output Example

```ts
createInputRecipe(theme, {
  type: "email",
  invalid: true,
  tone: "danger"
})

// Returns:
{
  tag: "input",
  className: "mw-input mw-input--danger is-invalid",
  vars: {
    "--mw-primary": "#5B8CFF",
    "--mw-border": "#D9D9DE",
    "--mw-text": "#111111",
    "--mw-text-muted": "#5B5B5F",
    "--mw-surface": "#F7F7F8",
    "--mw-danger": "#D92D20",
    "--mw-success": "#067647",
    "--mw-radius": "10px"
  },
  a11y: {
    type: "email",
    "aria-invalid": true
  }
}
```

## A11y Behavior

The [input-a11y.ts](input-a11y.ts) file handles:

- **`type` prop** → maps to correct `inputMode` and `autoComplete`
- **`invalid` prop** → sets `aria-invalid={true}`
- **`required` prop** → sets `required` and `aria-required`
- **`disabled` prop** → sets `disabled` attribute
- **Helper text** → links via `aria-describedby`
- **Labels** → associates via `id` (handled by FormField wrapper)

## Testing

```bash
# Validate core package
pnpm --filter @marwes/core typecheck

# View in Storybook
pnpm dev:storybook

# Test in playground
pnpm dev:playground
```
