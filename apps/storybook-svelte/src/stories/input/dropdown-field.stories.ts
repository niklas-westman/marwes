import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { DropdownField } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const options = [
  { value: "se", label: "Sweden" },
  { value: "us", label: "United States" },
  { value: "no", label: "Norway" },
]

const meta = {
  title: "Input/Purpose/DropdownField",
  component: DropdownField,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DropdownField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: "Country",
    select: { options, placeholder: "Choose a country" },
  },
}
