import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { CurrencyField } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Input/Purpose/CurrencyField",
  component: CurrencyField,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CurrencyField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: "Amount",
    input: { placeholder: "0.00" },
  },
}
