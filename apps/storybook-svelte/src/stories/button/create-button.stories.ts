import {
  storybookA11yPolicy,
  storybookButtonPurposeArgTypes,
  storybookLayout,
} from "@marwes-ui/core"
import { CreateButton } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Buttons/Purpose/CreateButton",
  component: CreateButton,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: storybookButtonPurposeArgTypes,
} satisfies Meta<typeof CreateButton>

export default meta
type Story = StoryObj<typeof meta>

export const CreateExample: Story = {
  args: { children: "Create", iconRight: "plus" },
}
