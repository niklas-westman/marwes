# Marwes Storybook

Component development environment for Marwes design system.

## Purpose

Storybook is the primary environment for:
- **Isolated development** - Build components without app context
- **Visual documentation** - Document component APIs and variants
- **Interaction testing** - Test user interactions and states
- **Accessibility checks** - Run automated a11y audits
- **Design QA** - Compare against Figma designs

## Quick Start

```bash
# From monorepo root
pnpm dev:storybook

# Or from this directory
pnpm storybook
```

Opens at `http://localhost:6006`

## Structure

```
src/
├── stories/
│   ├── Configure.mdx              # Storybook welcome page
│   ├── heading.stories.tsx        # Typography stories
│   ├── paragraph.stories.tsx
│   ├── icon.stories.tsx
│   ├── input.stories.tsx
│   ├── button/
│   │   ├── primary-button.stories.tsx
│   │   ├── secondary-button.stories.tsx
│   │   ├── danger-button.stories.tsx
│   │   └── ...
│   └── checkbox/
│       ├── checkbox.stories.tsx
│       └── checkbox-field.stories.tsx
│
.storybook/
├── main.ts                        # Storybook configuration
├── preview.ts                     # Global decorators & theme setup
└── manager.ts                     # UI customization (planned)
```

## Workspace Aliases

Storybook is configured to resolve workspace packages as if installed:

```ts
// Instead of relative imports:
import { Button } from '../../../packages/react/src/components/button'

// Use package names:
import { Button } from '@marwes-ui/react'
import { firstEdition } from '@marwes-ui/presets'
import { createButtonRecipe } from '@marwes-ui/core'
```

**Configuration:** See `.storybook/main.ts` `viteFinal` function.

## Installed Addons

- **@storybook/addon-a11y** - Accessibility testing
- **@storybook/addon-docs** - Auto-generated documentation
- **@storybook/addon-vitest** - Vitest integration
- **@storybook/addon-themes** - Theme switching support
- **@chromatic-com/storybook** - Visual regression (future)

## Writing Stories

### Basic Story Example

```tsx
// src/stories/button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@marwes-ui/react'

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    tone: {
      control: 'select',
      options: ['primary', 'secondary', 'danger'],
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    tone: 'primary',
  },
}
```

### Story Best Practices

1. **Use `argTypes`** for interactive controls
2. **Add `tags: ['autodocs']`** for auto-generated docs
3. **Group related stories** in folders
4. **Provide realistic examples** not just defaults
5. **Test all variants** (sizes, tones, states)

## Accessibility Testing

Every story automatically runs axe-core accessibility checks via `@storybook/addon-a11y`.

**Check the "Accessibility" panel** in Storybook to see:
- Color contrast issues
- Missing ARIA attributes
- Semantic HTML violations
- Keyboard navigation problems

## Testing

Storybook interaction tests are authored with `play` functions and run inside the Storybook environment. A dedicated repo-level script is not yet wired.

## Development Workflow

1. **Create component** in `packages/react/src/components/`
2. **Write story** in `apps/storybook-react/src/stories/`
3. **Run Storybook** with `pnpm dev:storybook`
4. **Test variants** using controls
5. **Check a11y panel** for issues
6. **Iterate** until perfect

## Figma Integration

When syncing components from Figma:

1. Use Figma MCP to fetch design context
2. Compare with current component in Storybook
3. Update theme/preset/component as needed
4. Verify visual match in Storybook

See [FIGMA_TO_MARWES.md](../../docs/FIGMA_TO_MARWES.md) for workflow.

## Related Documentation

- [Main README](../../README.md) - Monorepo overview
- [React Package](../../packages/react/README.md) - Component API reference
- [Testing Guide](../../docs/TESTING.md) - Test strategy
- [Architecture](../../docs/ARCHITECTURE.md) - System design

## Scripts

```bash
pnpm storybook        # Start Storybook dev server
pnpm build-storybook  # Build static Storybook
pnpm dev              # Start the local Vite app in this workspace
pnpm build            # Build the local Vite app
pnpm preview          # Preview local Vite app build
```

## Deployment

### Building for Production

```bash
pnpm build  # or pnpm build-storybook
```

This generates a static site in `storybook-static/` ready for deployment to:
- **CloudFront/S3**: Upload the entire `storybook-static/` folder
- **Netlify/Vercel**: Point to `apps/storybook-react` with build command `pnpm build`
- **GitHub Pages**: Deploy the `storybook-static/` directory

The static build includes:
- All stories with interactive controls
- Accessibility testing addon
- Auto-generated documentation
- Theme switching support

**Note**: The `build` script runs type-checking before building to catch errors early. Use `build-storybook` to skip type-checking if needed.

### Local Preview
```bash
npx serve storybook-static
```
