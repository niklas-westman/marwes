import { storybookA11yPolicy, storybookLayout, storybookRadioArgTypes } from "@marwes-ui/core"
import type { Meta, StoryObj } from "@storybook/svelte"
// Atom is no longer publicly exported; deep-import for story documentation.
import Radio from "../../../../../packages/svelte/src/lib/components/radio/Radio.svelte"
import RadioShowcase from "./RadioShowcase.svelte"

const meta = {
  title: "Radio/Atom",
  component: Radio,
  parameters: { ...storybookLayout.centered, ...storybookA11yPolicy.smoke },
  tags: ["autodocs"],
  argTypes: storybookRadioArgTypes,
} satisfies Meta<typeof Radio>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { ariaLabel: "Option", value: "opt1" } }
export const Checked: Story = { args: { ariaLabel: "Checked", value: "opt1", checked: true } }
export const Disabled: Story = { args: { ariaLabel: "Disabled", value: "opt1", disabled: true } }
export const Invalid: Story = { args: { ariaLabel: "Invalid", value: "opt1", invalid: true } }
export const RadioGroup: Story = {
  render: () => ({ Component: RadioShowcase, props: { showcase: "radio-group" } }),
}

export const AllStates: Story = {
  render: () => ({ Component: RadioShowcase, props: { showcase: "all-states" } }),
}
