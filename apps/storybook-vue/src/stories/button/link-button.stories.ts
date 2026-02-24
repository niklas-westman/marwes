import {
  storybookButtonPurposeArgTypes,
  storybookDocsDescription,
  storybookLayout,
} from "@marwes-ui/core"
import { LinkButton } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Buttons/Purpose/LinkButton",
  component: LinkButton,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: storybookButtonPurposeArgTypes,
} satisfies Meta<typeof LinkButton>

export default meta
type Story = StoryObj<typeof meta>

export const LinkExample: Story = {
  args: {
    href: "#",
    iconRight: "arrowRight",
    variant: "text",
  },
  render: (args) => ({
    components: { LinkButton },
    setup() {
      return { args }
    },
    template: `<LinkButton v-bind="args">Go here</LinkButton>`,
  }),
  parameters: {
    docs: {
      description: {
        story: storybookDocsDescription.linkButton,
      },
    },
  },
}
