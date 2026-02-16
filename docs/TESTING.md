# Testing Strategy

Comprehensive testing approach for Marwes component system.

## Testing Philosophy

Marwes uses a **layered testing strategy** matching the 3-layer architecture:

1. **Core (Unit Tests)** - Pure logic without DOM
2. **React (Integration Tests)** - Component behavior with React Testing Library
3. **Storybook (Visual/Interaction)** - Visual regression and user interactions
4. **Playground (Manual)** - Real-world integration scenarios

> Status note (2026-02-11): automated test scripts are not fully wired in all workspaces yet. This document describes the target testing model and near-term setup.

---

## Core Package Tests

**Location:** `packages/core/src/**/__tests__/`

### What to Test
- RenderKit output correctness
- A11y prop mapping logic
- Theme merge/normalize behavior
- Recipe className generation
- CSS variable generation

### Example Test Structure
```typescript
// packages/core/src/components/atoms/button/__tests__/button-recipe.test.ts

import { describe, it, expect } from 'vitest'
import { createButtonRecipe } from '../button-recipe'
import { defaultTheme } from '../../../theme/theme-defaults'

describe('createButtonRecipe', () => {
  it('should create solid primary button RenderKit', () => {
    const kit = createButtonRecipe(defaultTheme, {
      variant: 'solid',
      tone: 'primary'
    })

    expect(kit.tag).toBe('button')
    expect(kit.className).toContain('mw-btn--solid')
    expect(kit.className).toContain('mw-btn--primary')
    expect(kit.vars['--mw-primary']).toBe(defaultTheme.color.primary)
    expect(kit.a11y.type).toBe('button')
  })

  it('should handle disabled state correctly', () => {
    const kit = createButtonRecipe(defaultTheme, { disabled: true })

    expect(kit.a11y.disabled).toBe(true)
    expect(kit.a11y.ariaDisabled).toBe(true)
  })

  it('should render as link when href is provided', () => {
    const kit = createButtonRecipe(defaultTheme, { 
      href: '/home',
      as: 'a' 
    })

    expect(kit.tag).toBe('a')
    expect(kit.a11y.href).toBe('/home')
    expect(kit.a11y.role).toBe('button')
  })
})
```

### Run Core Tests
```bash
# Current baseline
pnpm --filter @marwes-ui/core typecheck

# Planned once test script is added
# pnpm --filter @marwes-ui/core test
```

**Why Core Tests Matter:**
- No DOM needed = fast tests
- Pure logic = predictable results
- Catches issues before they reach React

---

## React Package Tests

**Location:** `packages/react/src/**/__tests__/`

### What to Test
- Component rendering
- Props handling
- Event callbacks
- Theme context integration
- User interactions

### Example Test Structure
```typescript
// packages/react/src/components/__tests__/button.test.tsx

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../button'
import { MarwesProvider } from '../../provider/marwes-provider'
import { firstEdition } from '@marwes-ui/presets'

const renderWithProvider = (ui: React.ReactElement) => {
  return render(
    <MarwesProvider preset={firstEdition}>
      {ui}
    </MarwesProvider>
  )
}

describe('Button', () => {
  it('should render children correctly', () => {
    renderWithProvider(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('should call onClick when clicked', async () => {
    const handleClick = vi.fn()
    renderWithProvider(<Button onClick={handleClick}>Click me</Button>)
    
    await userEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should apply correct classes for variant and tone', () => {
    renderWithProvider(
      <Button variant="solid" tone="primary">Button</Button>
    )
    
    const button = screen.getByRole('button')
    expect(button.className).toContain('mw-btn--solid')
    expect(button.className).toContain('mw-btn--primary')
  })

  it('should be disabled when disabled prop is true', () => {
    renderWithProvider(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

### Run React Tests
```bash
# Current baseline
pnpm --filter @marwes-ui/react typecheck

# Planned once test script is added
# pnpm --filter @marwes-ui/react test
```

---

## Storybook Tests

**Location:** `apps/storybook-react/src/stories/*.stories.tsx`

### Visual Regression Testing
Use Storybook's built-in visual testing or Chromatic for automated visual diffs.

### Interaction Testing
```typescript
// apps/storybook-react/src/stories/button/primary-button.stories.tsx

import { expect } from '@storybook/test'
import { within, userEvent } from '@storybook/test'

export const InteractionTest: Story = {
  args: {
    children: 'Click me',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button')
    
    await userEvent.click(button)
    await expect(button).toHaveFocus()
  }
}
```

### Accessibility Testing
Storybook has `@storybook/addon-a11y` enabled. Check for:
- Color contrast
- ARIA attributes
- Keyboard navigation
- Focus management

### Run Storybook Tests
```bash
# Start Storybook
pnpm dev:storybook
```

---

## Playground Testing (Manual)

**Location:** `apps/playground-react/`

### Purpose
- Test complex component compositions
- Verify theme overrides work correctly
- Debug integration issues
- Test responsive behavior
- Validate Figma token integrations

### Example Scenarios
```tsx
// apps/playground-react/src/App.tsx

function FormExample() {
  const [email, setEmail] = useState('')
  const [terms, setTerms] = useState(false)

  return (
    <form>
      <Input
        label="Email"
        type="email"
        value={email}
        onValueChange={setEmail}
        required
      />
      
      <CheckboxField
        label="I accept the terms"
        checked={terms}
        onChange={(e) => setTerms(e.target.checked)}
      />
      
      <Button type="submit" disabled={!terms}>
        Submit
      </Button>
    </form>
  )
}
```

### Run Playground
```bash
pnpm dev:playground
```

---

## Accessibility Testing

### Automated (Storybook)
- `@storybook/addon-a11y` runs axe-core on every story
- Checks color contrast, ARIA, semantic HTML

### Manual Testing Checklist

#### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Enter/Space activates buttons
- [ ] Escape closes dialogs/popovers
- [ ] Arrow keys navigate menus/lists

#### Screen Readers
Test with:
- **VoiceOver** (macOS/iOS)
- **NVDA** (Windows)
- **JAWS** (Windows)

Verify:
- [ ] All interactive elements are announced
- [ ] State changes are communicated
- [ ] Form fields have proper labels
- [ ] Error messages are associated correctly

#### Focus Management
- [ ] Focus visible indicator on all focusable elements
- [ ] Focus trap works in modals/dialogs
- [ ] Focus returns to trigger after closing overlays

---

## Performance Testing

### Bundle Size
```bash
# Check bundle sizes
pnpm build
pnpm analyze # (if analyzer is set up)
```

**Targets:**
- Core: < 15KB gzipped
- React: < 5KB gzipped
- Presets: < 10KB gzipped per preset

### Runtime Performance
Use React DevTools Profiler to measure:
- Component render times
- Re-render frequency
- Unnecessary re-renders

---

## Test Coverage Goals

| Package | Target Coverage | Current |
|---------|----------------|---------|
| `@marwes-ui/core` | 90% | TBD |
| `@marwes-ui/react` | 80% | TBD |
| `@marwes-ui/presets` | N/A (CSS only) | - |

---

## Continuous Integration

### GitHub Actions (Planned)
```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
      
      - run: pnpm install
      - run: pnpm typecheck
      - run: pnpm -r test --if-present
      - run: pnpm build
```

---

## Testing Tools

### Current Stack
- **Vitest** - Unit/integration test runner
- **React Testing Library** - React component testing
- **@storybook/test** - Storybook interaction tests
- **@storybook/addon-a11y** - Automated a11y checks
- **User Event** - Realistic user interactions

### Future Additions
- **Chromatic** - Visual regression testing
- **Playwright** - E2E testing (if needed)
- **Lighthouse CI** - Performance monitoring

---

## Writing Good Tests

### Best Practices

1. **Test Behavior, Not Implementation**
   ```typescript
   // ✅ Good - tests user-visible behavior
   expect(screen.getByRole('button')).toBeDisabled()
   
   // ❌ Bad - tests implementation details
   expect(component.state.disabled).toBe(true)
   ```

2. **Use Accessible Queries**
   ```typescript
   // ✅ Good - queries by role/label (how users interact)
   screen.getByRole('button', { name: 'Submit' })
   
   // ❌ Bad - queries by test IDs or classes
   screen.getByTestId('submit-button')
   ```

3. **Keep Tests Focused**
   - One test = one behavior
   - Clear test names that describe the scenario
   - Arrange-Act-Assert pattern

4. **Mock Minimally**
   - Only mock external dependencies
   - Don't mock the code you're testing
   - Avoid over-mocking (makes tests brittle)

---

## Test Maintenance

### When to Update Tests
- New components added → write new tests
- Bugs fixed → add regression tests
- Refactoring → tests should still pass (if behavior unchanged)
- Breaking changes → update tests to match new API

### Test Hygiene
- Remove obsolete tests
- Keep test data realistic
- Use test utilities for common setup
- Document complex test scenarios

---

## Running All Tests

```bash
# Current baseline validation
pnpm typecheck
pnpm build

# Run tests where scripts exist
pnpm -r test --if-present
```

---

## Related Documentation

- [Engineering Guide](ENGINEERING.md) - Code conventions
- [Architecture](ARCHITECTURE.md) - System design
- Contributing guide - TODO (file not yet added)

---

Last updated: 2026-02-11
