import { storybookLayout } from "@marwes-ui/core"
import { Radio } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Radio/Atom",
  component: Radio,
  parameters: { ...storybookLayout.centered },
  tags: ["autodocs"],
} satisfies Meta<typeof Radio>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { name: "option", value: "a", ariaLabel: "Option A" } }
export const Checked: Story = {
  args: { name: "option", value: "a", checked: true, ariaLabel: "Option A" },
}
export const Disabled: Story = {
  args: { name: "option", value: "a", disabled: true, ariaLabel: "Disabled" },
}
