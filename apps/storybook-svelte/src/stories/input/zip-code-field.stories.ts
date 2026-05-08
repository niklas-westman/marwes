import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { ZipCodeField } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Input/Purpose/ZipCodeField",
  component: ZipCodeField,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ZipCodeField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { label: "ZIP code", input: { placeholder: "12345" } },
}
