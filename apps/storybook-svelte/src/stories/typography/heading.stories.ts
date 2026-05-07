import { storybookLayout } from "@marwes-ui/core"
import { H1, H2, H3 } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const metaH1 = {
  title: "Typography/Atom/H1",
  component: H1,
  parameters: { ...storybookLayout.padded },
  tags: ["autodocs"],
} satisfies Meta<typeof H1>

export default metaH1
type Story = StoryObj<typeof metaH1>

export const Default: Story = { args: { children: "Heading Level 1" } }
export const WithSizeOverride: Story = { args: { children: "H1 with h3 size", size: "h3" } }
