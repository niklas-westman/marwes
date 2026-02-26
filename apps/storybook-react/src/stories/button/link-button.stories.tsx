// import { ButtonVariant } from "@marwes-ui/core";
// import { ButtonVariant } from "@marwes-ui/core";
import {
  ButtonVariant,
  IconName,
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
  argTypes: storybookButtonPurposeArgTypes,
} satisfies Meta<typeof LinkButton>

export default meta

export const LinkExample: StoryObj<typeof LinkButton> = {
  args: {
    children: "Go here",
    iconRight: IconName.ArrowRight,
    variant: ButtonVariant.text,
  },
  parameters: {
    docs: {
      description: {
        story: storybookDocsDescription.linkButton,
      },
    },
  },
}
