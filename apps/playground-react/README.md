# Marwes React Playground

Integration testing and experimentation environment for Marwes components.

## Purpose

The playground is used for:
- **Integration testing** - Test components in realistic app scenarios
- **Theme override testing** - Verify custom themes work correctly
- **Component composition** - Build complex UIs combining multiple components
- **Debugging** - Reproduce and fix integration issues
- **Examples** - Demonstrate real-world usage patterns

## Quick Start

```bash
# From monorepo root
pnpm dev:playground

# Or from this directory
pnpm dev
```

Opens at `http://localhost:5173`

## When to Use Playground vs Storybook

| Use Case | Storybook | Playground |
|----------|-----------|------------|
| Single component development | ✅ | ❌ |
| Visual documentation | ✅ | ❌ |
| Testing component variants | ✅ | ❌ |
| Complex forms | ❌ | ✅ |
| Multi-component flows | ❌ | ✅ |
| Theme customization | ⚠️ | ✅ |
| Debugging integration issues | ❌ | ✅ |

## Example Use Cases

### Testing Complex Forms

```tsx
// src/examples/SignupForm.tsx
import { useState } from 'react'
import { Input, Checkbox, CheckboxField, Button } from '@marwes-ui/react'

export function SignupForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [terms, setTerms] = useState(false)
  const [errors, setErrors] = useState({})

  const handleSubmit = (e) => {
    e.preventDefault()
    // Test validation, error handling, etc.
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Email"
        type="email"
        value={email}
        onValueChange={setEmail}
        invalid={!!errors.email}
        helperText={errors.email}
        required
      />
      
      <Input
        label="Password"
        type="password"
        value={password}
        onValueChange={setPassword}
        invalid={!!errors.password}
        helperText={errors.password}
        required
      />
      
      <CheckboxField
        label="I accept the terms and conditions"
        checked={terms}
        onChange={(e) => setTerms(e.target.checked)}
        invalid={!!errors.terms}
        helperText={errors.terms}
      />
      
      <Button type="submit" disabled={!terms}>
        Sign Up
      </Button>
    </form>
  )
}
```

### Testing Theme Overrides

```tsx
// src/App.tsx
import { MarwesProvider } from '@marwes-ui/react'
import { firstEdition } from '@marwes-ui/presets'

function App() {
  return (
    <MarwesProvider 
      preset={firstEdition}
      theme={{
        color: {
          primary: '#5B8CFF',
          danger: '#DC2626',
        },
        font: {
          primary: 'Inter, sans-serif',
        },
        ui: {
          radius: 8,
          density: 'comfortable',
        },
      }}
    >
      <YourApp />
    </MarwesProvider>
  )
}
```

### Testing Component Composition

```tsx
// Test how components work together
<Card>
  <H1>Welcome</H1>
  <Paragraph>Get started with Marwes</Paragraph>
  
  <Input label="Search" placeholder="Type to search..." />
  
  <div style={{ display: 'flex', gap: '8px' }}>
    <Button tone="primary">Submit</Button>
    <Button variant="outline">Cancel</Button>
  </div>
</Card>
```

## Development Workflow

1. **Reproduce issue** - Create a minimal reproduction
2. **Test hypothesis** - Try different approaches
3. **Iterate quickly** - HMR gives instant feedback
4. **Verify fix** - Ensure the solution works in context
5. **Move to Storybook** - Document the working solution

## Project Structure

```
src/
├── App.tsx           # Main app with MarwesProvider
├── App.css           # App-specific styles
├── main.tsx          # Entry point
├── examples/         # Usage examples (optional)
│   ├── FormExample.tsx
│   ├── ThemeExample.tsx
│   └── ...
└── assets/           # Static assets
```

## Testing Checklist

Use the playground to verify:

- [ ] Theme overrides apply correctly
- [ ] Components compose well together
- [ ] Form validation flows work end-to-end
- [ ] Responsive behavior is correct
- [ ] Focus management works in complex UIs
- [ ] Loading states transition smoothly
- [ ] Error states display properly
- [ ] Accessibility works in realistic scenarios

## Debugging Tips

### Theme Issues
```tsx
// Log current theme to console
import { useTheme } from '@marwes-ui/react'

function DebugTheme() {
  const theme = useTheme()
  console.log('Current theme:', theme)
  return null
}
```

### RenderKit Output
```tsx
// See what core is generating
import { createButtonRecipe } from '@marwes-ui/core'
import { useTheme } from '@marwes-ui/react'

function DebugButton() {
  const theme = useTheme()
  const kit = createButtonRecipe(theme, { tone: 'primary' })
  console.log('Button RenderKit:', kit)
  return <button className={kit.className}>Test</button>
}
```

## Related Documentation

- [Main README](../../README.md) - Monorepo overview
- [Storybook](../storybook-react/README.md) - Component development
- [Architecture](../../docs/ARCHITECTURE.md) - System design
- [Testing Guide](../../docs/TESTING.md) - Test strategy

## Scripts

```bash
pnpm dev          # Start dev server with HMR
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm lint         # Run linter
pnpm typecheck    # Type check
```
