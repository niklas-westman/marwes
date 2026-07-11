import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { SkipLink } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof SkipLink> = {
  title: "SkipLink/Atom",
  component: SkipLink,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: {
    href: { control: "text" },
    children: { control: "text" },
  },
}

export default meta

type Story = StoryObj<typeof SkipLink>

export const Default: Story = {
  args: {
    href: "#main",
    children: "Skip to main content",
  },
  render: (args) => (
    <div style={{ position: "relative", minHeight: "120px", padding: "1rem" }}>
      <SkipLink {...args} />
      <p>Focus the page (press Tab) to reveal the skip link in the top-left.</p>
    </div>
  ),
}
