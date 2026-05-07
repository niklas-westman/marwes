import { storybookLayout } from "@marwes-ui/core"
import { Accordion } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Layout/Atom/Accordion",
  component: Accordion,
  parameters: { ...storybookLayout.padded },
  tags: ["autodocs"],
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

export const Closed: Story = {
  args: { title: "Click to expand", open: false, children: "Panel content goes here." },
}

export const Open: Story = {
  args: { title: "Expanded section", open: true, children: "This content is visible." },
}

export const Disabled: Story = {
  args: { title: "Disabled", disabled: true, children: "Cannot open." },
}
