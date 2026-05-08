import { IconName, storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { TooltipGroup } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"
import TooltipGroupDark from "./TooltipGroupDark.svelte"

const meta = {
  title: "Tooltip/Molecule/TooltipGroup",
  component: TooltipGroup,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: {
    icon: {
      control: "select",
      options: [IconName.HelpCircle, IconName.Info],
    },
  },
} satisfies Meta<typeof TooltipGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    content: "Helpful information",
    triggerLabel: "Show help",
    defaultOpen: true,
  },
}

export const WithInfoIcon: Story = {
  args: {
    content: "Helpful information",
    icon: IconName.Info,
    triggerLabel: "Show info",
    defaultOpen: true,
  },
}

export const Interactive: Story = {
  args: {
    content: "Helpful information",
    triggerLabel: "Show help",
  },
}

export const Dark: Story = {
  render: () => ({
    Component: TooltipGroupDark,
    props: {},
  }),
}
