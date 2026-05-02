import {
  storybookButtonPurposeArgTypes,
  storybookDocsDescription,
  storybookLayout,
} from "@marwes-ui/core"
import { LinkButton } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "Buttons/Purpose/LinkButton",
  component: LinkButton,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  args: {
    href: "#",
  },
  argTypes: storybookButtonPurposeArgTypes,
} satisfies Meta<typeof LinkButton>

export default meta

export const LinkExample: StoryObj<typeof LinkButton> = {
  args: {
    children: "Go here",
  },
  parameters: {
    docs: {
      description: {
        story: storybookDocsDescription.linkButton,
      },
    },
  },
}
