# React Block: Dashboard Shell

A starting dashboard screen with a header, summary cards, and an activity panel.

```tsx
import { Button, ButtonVariant, Card, H1, Paragraph, StatCard, StatusBadge } from "@marwes-ui/react"

const stats = [
  ["Revenue", "$42.8k", "Up 12%"],
  ["Customers", "1,284", "32 new"],
  ["Open tasks", "18", "4 urgent"],
]

export function DashboardShellBlock() {
  return (
    <main className="dashboard-shell">
      <header className="dashboard-header">
        <div>
          <StatusBadge>Live</StatusBadge>
          <H1>Operations dashboard</H1>
          <Paragraph>Track the signals that need attention today.</Paragraph>
        </div>
        <Button variant={ButtonVariant.primary}>Create report</Button>
      </header>

      <section className="dashboard-grid" aria-label="Key metrics">
        {stats.map(([title, value, note]) => (
          <StatCard key={title} title={title}>
            <strong>{value}</strong>
            <span>{note}</span>
          </StatCard>
        ))}
      </section>

      <Card title="Recent activity">
        <ul className="activity-list">
          <li>Deployment completed for customer portal.</li>
          <li>New invite accepted by finance team.</li>
          <li>Theme tokens updated in staging.</li>
        </ul>
      </Card>
    </main>
  )
}
```

```css
.dashboard-shell {
  min-height: 100dvh;
  display: grid;
  align-content: start;
  gap: var(--mw-spacing-sp-24);
  padding: var(--mw-spacing-sp-32);
  color: var(--mw-color-text);
  background: var(--mw-color-background);
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  gap: var(--mw-spacing-sp-24);
  align-items: start;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
  gap: var(--mw-spacing-sp-16);
}

.dashboard-grid strong {
  display: block;
  margin-top: var(--mw-spacing-sp-8);
  font-size: 1.75rem;
}

.dashboard-grid span,
.activity-list {
  color: var(--mw-color-text-muted);
}
```
