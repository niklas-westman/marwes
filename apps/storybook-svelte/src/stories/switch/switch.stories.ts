import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { Switch } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Switch/Atom",
  component: Switch,
  parameters: { ...storybookLayout.centered, ...storybookA11yPolicy.smoke },
  tags: ["autodocs"],
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Off: Story = { args: { checked: false, ariaLabel: "Dark mode" } }
export const On: Story = { args: { checked: true, ariaLabel: "Dark mode" } }
export const Disabled: Story = { args: { checked: false, disabled: true, ariaLabel: "Disabled" } }
