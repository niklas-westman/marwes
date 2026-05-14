import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { Tooltip } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"
import TooltipDark from "./TooltipDark.svelte"

const meta = {
  title: "Tooltip/Atom",
  component: Tooltip,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: "Tooltip content",
  },
}

export const Dark: Story = {
  render: () => ({
    Component: TooltipDark,
    props: {},
  }),
}
