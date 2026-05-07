import { storybookLayout } from "@marwes-ui/core"
import { Checkbox } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Checkbox/Atom",
  component: Checkbox,
  parameters: { ...storybookLayout.centered },
  tags: ["autodocs"],
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { ariaLabel: "Accept terms" } }
export const Checked: Story = { args: { checked: true, ariaLabel: "Accept terms" } }
export const Disabled: Story = { args: { disabled: true, ariaLabel: "Disabled" } }
export const Indeterminate: Story = { args: { indeterminate: true, ariaLabel: "Select all" } }
