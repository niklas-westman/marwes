import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { Meta, StoryObj } from "@storybook/svelte"
// Atom is no longer publicly exported; deep-import for story documentation.
import Textarea from "../../../../../packages/svelte/src/lib/components/input/Textarea.svelte"

const meta = {
  title: "Input/Atom/Textarea",
  component: Textarea,
  parameters: { ...storybookLayout.centered, ...storybookA11yPolicy.smoke },
  tags: ["autodocs"],
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { placeholder: "Enter text..." } }
export const Basic: Story = { args: { placeholder: "Enter text..." } }
export const Controlled: Story = {
  args: { ariaLabel: "Controlled textarea", value: "Controlled content" },
}
export const WithValue: Story = {
  args: { ariaLabel: "Textarea with value", value: "Some content here" },
}
export const Disabled: Story = { args: { placeholder: "Disabled", disabled: true } }
export const CustomRows: Story = { args: { placeholder: "5 rows", rows: 5 } }
export const Invalid: Story = { args: { placeholder: "Invalid content", invalid: true } }
