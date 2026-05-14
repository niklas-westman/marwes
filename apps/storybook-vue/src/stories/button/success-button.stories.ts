import {
  storybookA11yPolicy,
  storybookButtonPurposeArgTypes,
  storybookLayout,
} from "@marwes-ui/core"
import { SuccessButton } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Buttons/Purpose/SuccessButton",
  component: SuccessButton,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: storybookButtonPurposeArgTypes,
} satisfies Meta<typeof SuccessButton>

export default meta
type Story = StoryObj<typeof meta>

export const SuccessExample: Story = {
  args: {},
  render: (args) => ({
    components: { SuccessButton },
    setup() {
      return { args }
    },
    template: `<SuccessButton v-bind="args">Approved</SuccessButton>`,
  }),
}
