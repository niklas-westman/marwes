# Marwes Storybook for React

Primary documentation and isolated development environment for the React adapter.

## Purpose

Storybook is where Marwes teaches and verifies the public React surface:

- Isolated component development
- Visual API documentation
- Variant and state coverage
- Interaction testing with `play` functions
- Accessibility review through the a11y addon

Use this workspace when the goal is to document or validate a component contract. Use the playground when the goal is app-level composition.

## Quick Start

```bash
# From the monorepo root
pnpm dev:storybook:react

# From this workspace
pnpm storybook
```

Default URL: `http://localhost:6006`

## Canonical Story Setup

React stories should teach the same baseline setup used in the package docs:

```tsx
import type { Meta, StoryObj } from "@storybook/react"
import { Button, MarwesProvider } from "@marwes-ui/react"
import { firstEditionTheme } from "@marwes-ui/presets"
import "@marwes-ui/presets/firstEdition/styles.css"

const meta = {
  title: "Button/Button",
  component: Button,
  decorators: [
    (Story) => (
      <MarwesProvider theme={firstEditionTheme}>
        <Story />
      </MarwesProvider>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    children: "Save",
    variant: "primary",
  },
}
```

The important contract is:

- `firstEditionTheme` comes from `@marwes-ui/presets`
- preset CSS comes from `@marwes-ui/presets/firstEdition/styles.css`
- the provider uses `theme`, not `preset`

## Story Structure

Stories currently live under `src/stories/<family>/`.

Typical family structure:

```text
src/stories/
├── button/
│   ├── Introduction.mdx
│   ├── button.stories.tsx
│   ├── primary-button.stories.tsx
│   └── ...
├── input/
│   ├── Introduction.mdx
│   ├── input.stories.tsx
│   ├── input-field.stories.tsx
│   └── ...
└── ...
```

Families generally pair:

- `Introduction.mdx` for conceptual guidance
- `*.stories.tsx` for runnable examples and regression coverage

## Workspace Aliases

This Storybook resolves workspace packages directly to source during development.

Examples:

- `@marwes-ui/react` -> `packages/react/src/index.ts`
- `@marwes-ui/core` -> `packages/core/src/index.ts`
- `@marwes-ui/presets` -> `packages/presets/src/index.ts`
- `@marwes-ui/presets/firstEdition/styles.css` -> source CSS file in presets

See `apps/storybook-react/.storybook/main.ts` for the alias configuration.

## Installed Addons

- `@storybook/addon-a11y`
- `@storybook/addon-docs`
- `@storybook/addon-themes`
- `@storybook/addon-vitest`
- `@chromatic-com/storybook`

## Story Writing Guidelines

- Prefer package imports over relative workspace paths
- Show realistic usage, not only prop dumps
- Cover major states and semantic variants
- Use `tags: ["autodocs"]` where appropriate
- Keep provider/theme setup consistent across stories

## Testing Notes

Storybook interaction tests are authored with `play` functions and run inside the Storybook environment. There is not yet a dedicated repo-level convenience script for Storybook interaction runs.

## Scripts

```bash
pnpm storybook
pnpm build-storybook
pnpm typecheck
pnpm test
pnpm build
```

## Related Docs

- [Main README](../../README.md)
- [React package README](../../packages/react/README.md)
- [Architecture reference](../../docs/reference/architecture.md)
- [Testing reference](../../docs/reference/testing.md)
