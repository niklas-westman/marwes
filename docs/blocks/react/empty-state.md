# React Block: Empty State

A focused panel for first-run, no-results, or cleared-list states.

```tsx
import { Button, ButtonVariant, Card, H1, Paragraph } from "@marwes-ui/react"

export function EmptyStateBlock() {
  return (
    <section className="empty-state" aria-labelledby="empty-state-title">
      <Card className="empty-state-card">
        <H1 id="empty-state-title" size="h2">No projects yet</H1>
        <Paragraph>
          Create your first project to start collecting activity, settings, and reports in one place.
        </Paragraph>
        <div className="empty-state-actions">
          <Button variant={ButtonVariant.primary}>Create project</Button>
          <Button variant={ButtonVariant.secondary}>Import data</Button>
        </div>
      </Card>
    </section>
  )
}
```

```css
.empty-state {
  min-height: 28rem;
  display: grid;
  place-items: center;
  padding: var(--mw-spacing-sp-24);
  color: var(--mw-color-text);
}

.empty-state-card {
  max-width: 32rem;
  text-align: center;
}

.empty-state-actions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: var(--mw-spacing-sp-12);
  margin-top: var(--mw-spacing-sp-24);
}
```
