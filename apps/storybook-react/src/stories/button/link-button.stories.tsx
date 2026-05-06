import {
  storybookA11yPolicy,
  storybookButtonPurposeArgTypes,
  storybookDocsDescription,
  storybookLayout,
} from "@marwes-ui/core"
import { LinkButton } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "Buttons/Purpose/LinkButton",
  component: LinkButton,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  args: {
    ...storybookA11yPolicy.smoke,
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
