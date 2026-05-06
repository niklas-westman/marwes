import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { MarwesProvider, ThemeMode, Tooltip } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof Tooltip> = {
  title: "Tooltip/Atom",
  component: Tooltip,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof Tooltip>

export const Default: Story = {
  args: {
    children: "Tooltip text",
  },
}

export const Dark: Story = {
  render: (args) => (
    <MarwesProvider theme={{ mode: ThemeMode.dark }}>
      <div style={{ padding: 24, background: "#2e2e2e", borderRadius: 8 }}>
        <Tooltip {...args} />
      </div>
    </MarwesProvider>
  ),
  args: {
    children: "Tooltip text",
  },
}
