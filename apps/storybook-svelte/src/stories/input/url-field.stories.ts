import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { URLField } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Input/Purpose/URLField",
  component: URLField,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof URLField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: "Website URL",
    input: { placeholder: "https://example.com" },
  },
}
