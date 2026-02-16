# Core Components

Framework-agnostic component logic for Marwes.

## Philosophy

Each component in `@marwes-ui/core` is **pure logic** - no DOM, no React, no styling execution. This makes components:

- ✅ Testable without a browser
- ✅ Framework-agnostic (works with React, Vue, Svelte, etc.)
- ✅ Type-safe with strict TypeScript
- ✅ Portable to any environment (browser, Node, React Native)

## Architecture Pattern

Every component follows the same structure:

```
button/
├── button-types.ts      # Public contracts (Options, RenderKit, A11y types)
├── button-a11y.ts       # Accessibility logic (props → ARIA attributes)
├── button-recipe.ts     # Main recipe (theme + options → RenderKit)
└── index.ts             # Public exports
```

Optional files for stateful components:
- `*.state.ts` - State machine logic
- `*.reducer.ts` - State transitions

## The RenderKit Contract

Core recipes return a **RenderKit** - a plain object that framework adapters consume:

```ts
interface RenderKit {
  tag: string                    // HTML tag to render ("button", "input", "a")
  className: string              // Space-separated CSS classes
  vars: Record<string, string>   // CSS variables (--mw-primary: #5B8CFF)
  a11y: A11yProps                // ARIA attributes (strongly typed)
  blockClick?: boolean           // For disabled links
}
```

### Example Flow

```ts
// 1. Core produces RenderKit
const kit = createButtonRecipe(theme, { variant: "solid", tone: "primary" })

// Returns:
{
  tag: "button",
  className: "mw-btn mw-btn--solid mw-btn--primary",
  vars: { "--mw-primary": "#5B8CFF" },
  a11y: { type: "button", disabled: false }
}

// 2. React adapter applies it
<button
  className={kit.className}
  style={kit.vars}
  type={kit.a11y.type}
  disabled={kit.a11y.disabled}
>
  {children}
</button>

// 3. Preset CSS styles it
.mw-btn { height: 40px; border-radius: var(--mw-radius); }
.mw-btn--solid { background: var(--mw-primary); }
```

## Why This Pattern?

**Separation of Concerns:**
- Core = Logic (what to render)
- Presets = Styling (how it looks)
- Adapters = Rendering (framework-specific implementation)

**Benefits:**
- Add new frameworks without touching core
- Swap presets without changing logic
- Test accessibility rules in isolation
- Share component behavior across all frameworks

## Components

### Implemented
- **[Button](atoms/button/)** - Action trigger (solid, outline, soft, ghost variants)
- **[Input](atoms/input/)** - Text input with validation states
- **Checkbox** - Selection control with mixed state support
- **Icon** - Icon recipe and registry mapping
- **Heading + Paragraph** - Typography atoms

### Planned (v0.1)
- Textarea
- Select
- Switch
- FormField
- Card
- Divider
- Spinner

## Related Documentation

- [Architecture Overview](../../../../docs/ARCHITECTURE.md)
- [Presets Documentation](../../../presets/README.md)
- [React Adapter](../../../react/README.md)
