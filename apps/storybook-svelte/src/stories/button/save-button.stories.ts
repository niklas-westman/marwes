import {
  storybookA11yPolicy,
  storybookButtonPurposeArgTypes,
  storybookLayout,
} from "@marwes-ui/core"
import { SaveButton } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Buttons/Purpose/SaveButton",
  component: SaveButton,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: storybookButtonPurposeArgTypes,
} satisfies Meta<typeof SaveButton>

export default meta
type Story = StoryObj<typeof meta>

export const SaveExample: Story = {
  args: { children: "Save" },
}
