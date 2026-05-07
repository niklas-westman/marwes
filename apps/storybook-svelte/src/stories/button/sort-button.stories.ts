import {
  storybookA11yPolicy,
  storybookButtonPurposeArgTypes,
  storybookLayout,
} from "@marwes-ui/core"
import { SortButton } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Buttons/Purpose/SortButton",
  component: SortButton,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: storybookButtonPurposeArgTypes,
} satisfies Meta<typeof SortButton>

export default meta
type Story = StoryObj<typeof meta>

export const SortExample: Story = {
  args: { children: "Sort" },
}
