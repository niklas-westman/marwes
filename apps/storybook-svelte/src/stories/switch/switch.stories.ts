import { SwitchSize, storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { Switch } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"
import SwitchShowcase from "./SwitchShowcase.svelte"

const meta = {
  title: "Switch/Atom",
  component: Switch,
  parameters: { ...storybookLayout.centered, ...storybookA11yPolicy.smoke },
  tags: ["autodocs"],
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    ariaLabel: { control: "text" },
    size: {
      control: { type: "inline-radio" },
      options: Object.values(SwitchSize),
    },
  },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { ariaLabel: "Toggle" } }
export const Off: Story = { args: { ariaLabel: "Off", checked: false } }
export const On: Story = { args: { ariaLabel: "On", checked: true } }
export const Checked: Story = { args: { ariaLabel: "Checked", checked: true } }
export const Disabled: Story = { args: { ariaLabel: "Disabled", disabled: true } }
export const CheckedDisabled: Story = {
  args: { ariaLabel: "Checked disabled", checked: true, disabled: true },
}
export const AllStates: Story = {
  render: () => ({
    Component: SwitchShowcase,
    props: { showcase: "states" },
  }),
}
export const SizeComparison: Story = {
  render: () => ({
    Component: SwitchShowcase,
    props: { showcase: "sizes" },
  }),
}
