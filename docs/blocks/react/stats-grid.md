# React Block: Stats Grid

A compact KPI grid for dashboards, project pages, and reports.

```tsx
import { StatCard, StatusBadge } from "@marwes-ui/react"

const items = [
  { label: "Conversion", value: "8.4%", status: "Healthy" },
  { label: "Latency", value: "142ms", status: "Stable" },
  { label: "Errors", value: "0.03%", status: "Low" },
]

export function StatsGridBlock() {
  return (
    <section className="stats-grid" aria-label="Product metrics">
      {items.map((item) => (
        <StatCard key={item.label} title={item.label}>
          <div className="stat-content">
            <strong>{item.value}</strong>
            <StatusBadge>{item.status}</StatusBadge>
          </div>
        </StatCard>
      ))}
    </section>
  )
}
```

```css
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  gap: var(--mw-spacing-sp-16);
}

.stat-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--mw-spacing-sp-12);
}

.stat-content strong {
  font-size: 1.5rem;
}
```
