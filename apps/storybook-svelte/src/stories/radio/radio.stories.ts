import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { Radio } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Radio/Atom",
  component: Radio,
  parameters: { ...storybookLayout.centered, ...storybookA11yPolicy.smoke },
  tags: ["autodocs"],
} satisfies Meta<typeof Radio>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { ariaLabel: "Option", value: "opt1" } }
export const Checked: Story = { args: { ariaLabel: "Checked", value: "opt1", checked: true } }
export const Disabled: Story = { args: { ariaLabel: "Disabled", value: "opt1", disabled: true } }
export const Invalid: Story = { args: { ariaLabel: "Invalid", value: "opt1", invalid: true } }
export const AllStates: Story = { args: { ariaLabel: "Default state", value: "opt1" } }
export const RadioGroup: Story = {
  args: { ariaLabel: "In a group", value: "opt1", name: "group1" },
}
