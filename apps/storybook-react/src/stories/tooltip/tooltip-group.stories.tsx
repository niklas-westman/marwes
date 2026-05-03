import { IconName, storybookLayout } from "@marwes-ui/core"
import { MarwesProvider, ThemeMode, TooltipGroup } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof TooltipGroup> = {
  title: "Tooltip/Molecule/TooltipGroup",
  component: TooltipGroup,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: {
    icon: {
      control: "select",
      options: [IconName.HelpCircle, IconName.Info],
    },
  },
}

export default meta

type Story = StoryObj<typeof TooltipGroup>

export const Default: Story = {
  args: {
    content: "Tooltip text",
    triggerLabel: "Show help",
    defaultOpen: true,
  },
}

export const WithInfoIcon: Story = {
  args: {
    content: "Tooltip text",
    icon: IconName.Info,
    triggerLabel: "Show info",
    defaultOpen: true,
  },
}

export const Interactive: Story = {
  args: {
    content: "Tooltip text",
    triggerLabel: "Show help",
  },
}

export const Dark: Story = {
  render: (args) => (
    <MarwesProvider theme={{ mode: ThemeMode.dark }}>
      <div style={{ padding: 24, background: "#2e2e2e", borderRadius: 8 }}>
        <TooltipGroup {...args} />
      </div>
    </MarwesProvider>
  ),
  args: {
    content: "Tooltip text",
    triggerLabel: "Show help",
    defaultOpen: true,
  },
}
