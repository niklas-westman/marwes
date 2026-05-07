import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { PhoneField } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Input/Purpose/PhoneField",
  component: PhoneField,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PhoneField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: "Phone number",
    input: { placeholder: "+1 (555) 000-0000" },
  },
}
