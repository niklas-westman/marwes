import { StatTile } from "@marwes-ui/react"

import { ShowcaseCard, ShowcaseGrid } from "./showcase-layout"

function StatTileShowcase(): JSX.Element {
  return (
    <ShowcaseGrid>
      <ShowcaseCard>
        <h3>Positive trend</h3>
        <p>Tone and trend direction reinforce a genuinely good outcome.</p>
        <StatTile
          label="Monthly revenue"
          value="$24,800"
          subtitle="Compared with last month"
          trendValue="12%"
          trendDirection="positive"
          tone="success"
        />
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>Negative trend</h3>
        <p>A real decline gets a matching tone instead of a neutral or upbeat one.</p>
        <StatTile
          label="Churn rate"
          value="4.2%"
          subtitle="Compared with last quarter"
          trendValue="1.1%"
          trendDirection="negative"
          tone="danger"
        />
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>No trend</h3>
        <p>A trend is optional; a plain metric stays honest when there is nothing to compare.</p>
        <StatTile label="Active workspaces" value="1,204" subtitle="All plans" tone="neutral" />
      </ShowcaseCard>
    </ShowcaseGrid>
  )
}

export default StatTileShowcase
