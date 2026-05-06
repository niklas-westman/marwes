import { storybookA11yPolicy, storybookLayout, storybookStatTileArgTypes } from "@marwes-ui/core"
import { StatTile } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react-vite"

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, max-content)",
  gap: "1rem",
  alignItems: "start",
}

const meta = {
  title: "StatTile/Atom",
  component: StatTile,
  parameters: {
    ...storybookLayout.padded,

    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: storybookStatTileArgTypes,
  args: {
    label: "Revenue",
    value: "$48,200",
    subtitle: "vs $42,900 last month",
    trendValue: "12%",
    trendDirection: "positive",
    tone: "neutral",
  },
} satisfies Meta<typeof StatTile>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const NegativeTrend: Story = {
  args: {
    label: "Churn risk",
    value: "4.8%",
    subtitle: "vs 3.9% last month",
    trendValue: "0.9%",
    trendDirection: "negative",
    tone: "danger",
  },
}

export const ToneMatrix: Story = {
  render: () => (
    <div style={gridStyle}>
      <StatTile
        label="Revenue"
        value="$48,200"
        subtitle="vs $42,900 last month"
        trendValue="12%"
        trendDirection="positive"
      />
      <StatTile
        tone="brand"
        label="Active Accounts"
        value="1,284"
        subtitle="new business pipeline"
        trendValue="8%"
        trendDirection="positive"
      />
      <StatTile
        tone="success"
        label="Conversion"
        value="18.2%"
        subtitle="vs 16.4% last month"
        trendValue="11%"
        trendDirection="positive"
      />
      <StatTile
        tone="warning"
        label="Response Time"
        value="2.4h"
        subtitle="support median"
        trendValue="6%"
        trendDirection="negative"
      />
      <StatTile
        tone="danger"
        label="Churn Risk"
        value="4.8%"
        subtitle="vs 3.9% last month"
        trendValue="0.9%"
        trendDirection="negative"
      />
    </div>
  ),
}
