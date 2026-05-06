import {
  storybookA11yPolicy,
  storybookButtonPurposeArgTypes,
  storybookDocsDescription,
  storybookLayout,
} from "@marwes-ui/core"
import { DestructiveButton } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

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
  args: {
    error: true,
  },
  render: (args) => ({
    components: { DestructiveButton },
    setup() {
      return { args }
    },
    template: `<DestructiveButton v-bind="args">Delete</DestructiveButton>`,
  }),
  parameters: {
    docs: {
      description: {
        story: storybookDocsDescription.destructiveButton,
      },
    },
  },
}
