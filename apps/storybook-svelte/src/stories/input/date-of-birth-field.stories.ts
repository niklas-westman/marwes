import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { DateOfBirthField } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Input/Purpose/DateOfBirthField",
  component: DateOfBirthField,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DateOfBirthField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { label: "Date of birth" },
}
