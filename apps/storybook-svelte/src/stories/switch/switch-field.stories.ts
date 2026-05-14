import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { SwitchField } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Switch/Molecule",
  component: SwitchField,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SwitchField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: "Enable notifications",
    description: "Receive important account and product updates.",
  },
}

export const WithError: Story = {
  args: {
    label: "Require approval before publishing",
    error: "Review mode must stay enabled for this workspace.",
  },
}

export const Disabled: Story = {
  args: {
    label: "Automatic backups",
    description: "This setting is managed by your organization.",
    switch: { checked: true, disabled: true },
  },
}

export const Controlled: Story = {
  args: {
    label: "Dark mode",
    description: "Toggle dark theme.",
    switch: { checked: true },
  },
}

export const Playground: Story = {
  args: {
    label: "Playground toggle",
    description: "Experiment with the switch field.",
  },
}
