import {
  storybookA11yPolicy,
  storybookButtonGeneralArgTypes,
  storybookLayout,
} from "@marwes-ui/core"
import { PrimaryButton } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Buttons/Variant/PrimaryButton",
  component: PrimaryButton,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: storybookButtonGeneralArgTypes,
} satisfies Meta<typeof PrimaryButton>

export default meta
type Story = StoryObj<typeof meta>

export const PrimaryExample: Story = {
  args: { children: "Primary Button" },
}
