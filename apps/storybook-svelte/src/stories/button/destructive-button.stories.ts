import {
  storybookA11yPolicy,
  storybookButtonPurposeArgTypes,
  storybookLayout,
} from "@marwes-ui/core"
import { DestructiveButton } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Buttons/Purpose/DestructiveButton",
  component: DestructiveButton,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: storybookButtonPurposeArgTypes,
} satisfies Meta<typeof DestructiveButton>

export default meta
type Story = StoryObj<typeof meta>

export const DestructiveExample: Story = {
  args: { children: "Delete", iconRight: "trash" },
}
