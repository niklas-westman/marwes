import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { YesNoRadioGroup } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Radio/Purpose/YesNo",
  component: YesNoRadioGroup,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof YesNoRadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    name: "accept-terms",
    label: "Do you accept the terms?",
    defaultValue: "no",
  },
}

export const CustomLabels: Story = {
  args: {
    name: "newsletter",
    label: "Subscribe to newsletter?",
    yesLabel: "Subscribe",
    noLabel: "No thanks",
  },
}

export const Controlled: Story = {
  args: {
    name: "controlled-yn",
    label: "Enable feature?",
    value: "yes",
  },
}

export const WithError: Story = {
  args: {
    name: "required-yn",
    label: "Do you accept?",
    error: "You must select an option.",
  },
}
