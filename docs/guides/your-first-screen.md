# Your First Marwes Screen

This guide turns the installed package into a real app surface. It is intentionally product-shaped instead of component-by-component.

## Goal

Build a small workspace overview with:

- page shell
- hero panel
- stats
- setup form
- primary action

## Screen

```tsx
import {
  Button,
  ButtonVariant,
  Card,
  H1,
  InputField,
  Paragraph,
  StatCard,
  StatusBadge,
} from "@marwes-ui/react"

const stats = [
  ["Components", "24"],
  ["Frameworks", "React + Vue"],
  ["Status", "Ready"],
]

export function FirstMarwesScreen() {
  return (
    <main className="mw-demo-shell">
      <section className="mw-demo-hero">
        <StatusBadge>New workspace</StatusBadge>
        <H1>Build consistent UI faster</H1>
        <Paragraph size="lg">
          Start from accessible components, shared theme variables, and product-ready layout patterns.
        </Paragraph>
        <Button variant={ButtonVariant.primary}>Create workspace</Button>
      </section>

      <section className="mw-demo-grid" aria-label="Workspace summary">
        {stats.map(([label, value]) => (
          <StatCard key={label} title={label}>
            <strong>{value}</strong>
          </StatCard>
        ))}
      </section>

      <Card title="Setup details" className="mw-demo-form-card">
        <InputField
          label="Workspace name"
          helperText="This appears in navigation and notifications."
          input={{ placeholder: "Acme operations" }}
        />
        <InputField
          label="Owner email"
          input={{ type: "email", placeholder: "you@example.com" }}
        />
        <Button variant={ButtonVariant.secondary}>Save draft</Button>
      </Card>
    </main>
  )
}
```

```css
.mw-demo-shell {
  min-height: 100dvh;
  display: grid;
  gap: var(--mw-spacing-sp-24);
  padding: var(--mw-spacing-sp-32);
  color: var(--mw-color-text);
  background:
    radial-gradient(circle at top left, var(--mw-color-primary-disabled), transparent 22rem),
    var(--mw-color-background);
}

.mw-demo-hero,
.mw-demo-form-card {
  max-width: 48rem;
}

.mw-demo-hero {
  display: grid;
  gap: var(--mw-spacing-sp-16);
}

.mw-demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  gap: var(--mw-spacing-sp-16);
}

.mw-demo-grid strong {
  display: block;
  margin-top: var(--mw-spacing-sp-8);
  font-size: 1.5rem;
}
```

## Why this pattern works

- Product layout uses Marwes CSS variables, not one-off colors.
- Components keep a11y and semantic contracts close to the source package.
- `StatCard`, `StatusBadge`, and purpose buttons communicate intent better than generic wrappers.
- The screen is small enough to copy, then easy to split into local app components.

## Next steps

- Use [Vite](./vite.md) or [Next.js](./next.md) setup depending on the app.
- Pull from [React Blocks](../blocks/README.md) when you need richer app sections.
