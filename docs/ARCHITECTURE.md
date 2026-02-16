# Marwes Architecture

Complete overview of how Marwes component system works.

## The Three Layers

Marwes separates concerns into three distinct packages:

```
┌─────────────────────────────────────────────────────────────┐
│                    @marwes-ui/core                             │
│  Framework-agnostic logic (TypeScript only)                 │
│  • Theme system (merge, normalize, defaults)                │
│  • Component recipes (Button, Input, etc.)                  │
│  • A11y logic (props → ARIA attributes)                     │
│  • State machines (for stateful components)                 │
│  • Zero runtime dependencies                                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  @marwes-ui/presets                            │
│  Design system tokens + CSS (Vanilla CSS + CSS Variables)  │
│  • firstEdition preset (theme defaults)                     │
│  • CSS files with .mw-* classes                             │
│  • Token definitions (radius, density, etc.)                │
│  • No runtime JavaScript, only static CSS                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  @marwes-ui/react                              │
│  React adapter (framework-specific rendering)               │
│  • MarwesProvider (theme context)                           │
│  • Component wrappers (Button, Input, etc.)                 │
│  • Hooks (useTheme, useSystem)                              │
│  • Applies RenderKit from core to React elements            │
└─────────────────────────────────────────────────────────────┘
```

## Complete Flow: Button Example

Let's trace how a Button goes from user code → rendered HTML:

### 1. User Code (React App)

```tsx
import { MarwesProvider, Button } from "@marwes-ui/react"
import { firstEdition } from "@marwes-ui/presets"
import "@marwes-ui/presets/firstEdition/styles.css"

function App() {
  return (
    <MarwesProvider 
      preset={firstEdition}
      theme={{ color: { primary: "#5B8CFF" } }}
    >
      <Button variant="solid" tone="primary" onClick={handleSave}>
        Save Changes
      </Button>
    </MarwesProvider>
  )
}
```

### 2. React Adapter Layer

File: `packages/react/src/components/button.tsx`

```tsx
export function Button(props: ButtonProps) {
  const theme = useTheme() // Gets merged theme from context
  
  // Call core recipe
  const kit = createButtonRecipe(theme, props)
  
  // Apply RenderKit to React element
  return (
    <button
      className={kit.className}
      style={kit.vars as React.CSSProperties}
      type={kit.a11y.type}
      disabled={kit.a11y.disabled}
      aria-busy={kit.a11y.ariaBusy}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  )
}
```

### 3. Core Recipe Layer

File: `packages/core/src/components/atoms/button/button-recipe.ts`

```ts
export function createButtonRecipe(
  theme: Theme,
  opts: ButtonOptions
): ButtonRenderKit {
  // Get a11y props from dedicated logic
  const { tag, a11y, blockClick } = resolveButtonA11y(opts)
  
  // Build className from variant/tone/size
  const variant = opts.variant ?? "solid"
  const tone = opts.tone ?? "primary"
  const size = opts.size ?? "md"
  
  const className = [
    "mw-btn",
    `mw-btn--${variant}`,
    `mw-btn--${tone}`,
    `mw-btn--${size}`
  ].join(" ")
  
  // Build CSS variables from theme
  const vars = {
    "--mw-primary": theme.color.primary,
    "--mw-secondary": theme.color.secondary,
    "--mw-radius": `${theme.ui.radius}px`
  }
  
  // Return RenderKit
  return { tag, className, vars, a11y, blockClick }
}
```

**Output RenderKit:**
```js
{
  tag: "button",
  className: "mw-btn mw-btn--solid mw-btn--primary mw-btn--md",
  vars: {
    "--mw-primary": "#5B8CFF",
    "--mw-secondary": "#111111",
    "--mw-radius": "10px"
  },
  a11y: {
    type: "button",
    disabled: false,
    ariaBusy: false
  },
  blockClick: false
}
```

### 4. A11y Layer

File: `packages/core/src/components/atoms/button/button-a11y.ts`

```ts
export function resolveButtonA11y(opts: ButtonOptions) {
  const tag = opts.as === "a" || opts.href ? "a" : "button"
  const isDisabled = opts.disabled || opts.loading
  
  const a11y: ButtonA11yProps = {}
  
  if (tag === "button") {
    a11y.type = "button"
    if (isDisabled) a11y.disabled = true
  } else {
    a11y.role = "button"
    a11y.tabIndex = isDisabled ? -1 : 0
    if (opts.href && !isDisabled) a11y.href = opts.href
  }
  
  if (opts.loading) a11y.ariaBusy = true
  if (isDisabled) a11y.ariaDisabled = true
  if (opts.ariaLabel) a11y.ariaLabel = opts.ariaLabel
  
  return { tag, a11y, blockClick: isDisabled && tag === "a" }
}
```

### 5. Preset CSS Layer

File: `packages/presets/src/firstEdition/styles.css`

```css
.mw-btn {
  height: 40px;
  padding: 0 14px;
  border-radius: var(--mw-radius);
  border: 1px solid transparent;
  font: inherit;
  cursor: pointer;
}

.mw-btn--solid.mw-btn--primary {
  background: var(--mw-primary);
  color: #ffffff;
}

.mw-btn--md {
  height: 40px;
  padding: 0 14px;
  font-size: 14px;
}
```

### 6. Final Rendered HTML

```html
<button
  class="mw-btn mw-btn--solid mw-btn--primary mw-btn--md"
  style="--mw-primary: #5B8CFF; --mw-secondary: #111111; --mw-radius: 10px"
  type="button"
>
  Save Changes
</button>
```

Browser applies CSS using the variables:
- `.mw-btn` → base styles
- `.mw-btn--solid` → uses `var(--mw-primary)` = `#5B8CFF`
- `.mw-btn--md` → size styles

## Why This Architecture?

### ✅ Framework Agnostic
Core has zero React dependencies. Adding Vue/Svelte is just:
```ts
// packages/vue/src/components/Button.vue
const kit = createButtonRecipe(theme, props)
// Apply kit to Vue template
```

### ✅ Testable Without DOM
```ts
// packages/core/src/components/atoms/button/__tests__/button-recipe.test.ts
test('creates solid primary button', () => {
  const kit = createButtonRecipe(theme, { variant: 'solid', tone: 'primary' })
  expect(kit.className).toContain('mw-btn--solid')
  expect(kit.vars['--mw-primary']).toBe('#5B8CFF')
})
```

### ✅ Swappable Presets
```tsx
import { materialEdition } from "@marwes-ui/presets/material"
import "@marwes-ui/presets/material/styles.css"

<MarwesProvider preset={materialEdition}> // Same components, different look
```

### ✅ Consistent A11y
Accessibility logic is centralized in core. All frameworks get the same ARIA behavior.

### ✅ Zero Runtime CSS Overhead
CSS is static files, not runtime JS. No CSS-in-JS performance cost.

## Repository Structure

```
marwes/
├── packages/
│   ├── core/              # Pure TypeScript logic
│   │   └── src/
│   │       ├── components/
│   │       │   ├── button/
│   │       │   │   ├── button-types.ts
│   │       │   │   ├── button-a11y.ts
│   │       │   │   ├── button-recipe.ts
│   │       │   │   └── index.ts
│   │       │   └── input/
│   │       └── theme/
│   │
│   ├── presets/           # Design tokens + CSS
│   │   └── src/
│   │       └── firstEdition/
│   │           ├── index.ts       # Theme defaults
│   │           └── styles.css     # Component CSS
│   │
│   └── react/             # React adapter
│       └── src/
│           ├── provider/
│           │   └── marwes-provider.tsx
│           └── components/
│               ├── button.tsx
│               └── input.tsx
│
├── apps/
│   ├── storybook-react/   # Component development
│   └── playground-react/  # Integration testing
│
└── docs/
    └── ARCHITECTURE.md    # This file
```

## Developer Journey

When working on a component, you'll touch files in this order:

1. **Define contract** → `packages/core/src/components/atoms/button/button-types.ts`
2. **Implement a11y** → `packages/core/src/components/atoms/button/button-a11y.ts`
3. **Create recipe** → `packages/core/src/components/atoms/button/button-recipe.ts`
4. **Write CSS** → `packages/presets/src/firstEdition/styles.css`
5. **Create adapter** → `packages/react/src/components/button.tsx`
6. **Document** → `apps/storybook-react/src/stories/button/*.stories.tsx`
7. **Test integration** → `apps/playground-react/src/App.tsx`

Each step is independent and testable. The architecture ensures you only need to understand one layer at a time.

## Related Documentation

- [Core Components](../packages/core/src/components/README.md)
- [Button Component](../packages/core/src/components/atoms/button/README.md)
- [Input Component](../packages/core/src/components/atoms/input/README.md)
- [Specification](../SPEC.md)
