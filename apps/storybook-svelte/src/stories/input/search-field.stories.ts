import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { SearchField } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Input/Purpose/SearchField",
  component: SearchField,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SearchField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: "Search",
    input: { placeholder: "Search..." },
  },
}
