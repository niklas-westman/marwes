import { storybookLayout } from "@marwes-ui/core"
import { Textarea } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Inputs/Atom/Textarea",
  component: Textarea,
  parameters: { ...storybookLayout.centered },
  tags: ["autodocs"],
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { placeholder: "Enter text..." } }
export const WithValue: Story = { args: { value: "Some content here" } }
export const Disabled: Story = { args: { placeholder: "Disabled", disabled: true } }
export const CustomRows: Story = { args: { placeholder: "5 rows", rows: 5 } }
