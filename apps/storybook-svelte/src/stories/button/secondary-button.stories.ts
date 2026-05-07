import {
  storybookA11yPolicy,
  storybookButtonGeneralArgTypes,
  storybookLayout,
} from "@marwes-ui/core"
import { SecondaryButton } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Buttons/Variant/SecondaryButton",
  component: SecondaryButton,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: storybookButtonGeneralArgTypes,
} satisfies Meta<typeof SecondaryButton>

export default meta
type Story = StoryObj<typeof meta>

export const SecondaryExample: Story = {
  args: { children: "Secondary Button" },
}
