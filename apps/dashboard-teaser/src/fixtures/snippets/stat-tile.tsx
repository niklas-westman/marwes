import { StatTile } from "@marwes-ui/react"

export function Example() {
  return (
    <StatTile
      label="Monthly revenue"
      value="$24,800"
      subtitle="Compared with last month"
      trendValue="12%"
      trendDirection="positive"
      tone="success"
    />
  )
}
