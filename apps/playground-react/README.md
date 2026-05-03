# Marwes React Playground

Integration sandbox for validating how Marwes components behave together in a realistic React app.

## Purpose

Use the playground when you need to validate things that are hard to judge in isolated stories:

- Cross-component composition
- Full-page layout behavior
- Live theme overrides
- Realistic form flows
- Manual debugging of interaction edge cases

Storybook is still the primary place for isolated component development. The playground is the fast feedback loop for app-level integration.

## Quick Start

```bash
# From the monorepo root
pnpm dev:playground

# From this workspace
pnpm dev
```

Default URL: `http://localhost:5173`

## Canonical Theme Setup

The public API story for React should always start the same way:

1. import components from `@marwes-ui/react`
2. wrap the app with `<MarwesProvider>`

```tsx
import { useState } from "react"
import { Button, ButtonVariant, Input, MarwesProvider } from "@marwes-ui/react"

export function PlaygroundExample() {
  const [email, setEmail] = useState("")

  return (
    <MarwesProvider>
      <Input
        value={email}
        onValueChange={setEmail}
        placeholder="Email"
        ariaLabel="Email"
      />
      <Button variant={ButtonVariant.primary}>Save</Button>
    </MarwesProvider>
  )
}
```

For live experiments, the real playground can swap the provider theme at runtime:

```tsx
const [theme, setTheme] = useState<ThemeInput>({})

<MarwesProvider theme={theme}>...</MarwesProvider>
```

The baseline contract above is the one docs should teach first.

## Current Workspace Shape

The current app is organized around a single preview surface:

- `src/App.tsx` wires the layout, sidebar controls, and preview sections
- `src/layout/*` contains the playground shell
- `src/sections/*` contains grouped component showcases
- `src/global-style.ts` contains app-specific shell styling

This workspace is intentionally app-like. It is not a published package.

## When to Use Playground vs Storybook

| Use case | Storybook | Playground |
| --- | --- | --- |
| Single component iteration | ✅ | ❌ |
| Public component documentation | ✅ | ❌ |
| App-level composition | ❌ | ✅ |
| Theme override testing | ⚠️ | ✅ |
| Multi-step flows | ❌ | ✅ |
| Manual reproduction of integration bugs | ❌ | ✅ |

## Good Playground Tasks

- Validate a form made from several Marwes inputs
- Check how cards, buttons, tabs, and toasts feel in one page
- Verify theme overrides across many components at once
- Reproduce focus, spacing, or visual rhythm issues seen in product code

## Recommended Workflow

1. Reproduce the issue or design question in the playground
2. Narrow the problem until the interaction is understood
3. Move the stable component behavior into Storybook stories when it should become documented coverage
4. Keep playground code biased toward realistic composition, not exhaustive prop matrices

## Scripts

```bash
pnpm dev
pnpm typecheck
pnpm build
pnpm preview
```

## Related Docs

- [Main README](../../README.md)
- [React package README](../../packages/react/README.md)
- [Storybook React README](../storybook-react/README.md)
- [Architecture reference](../../docs/reference/architecture.md)
