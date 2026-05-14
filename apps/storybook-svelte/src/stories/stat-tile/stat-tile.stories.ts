import { storybookA11yPolicy, storybookLayout, storybookStatTileArgTypes } from "@marwes-ui/core"
import { StatTile } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"
import StatTileToneMatrix from "./StatTileToneMatrix.svelte"

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
  render: () => ({
    Component: StatTileToneMatrix,
    props: {},
  }),
}
