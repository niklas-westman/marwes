import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { Checkbox } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"
import CheckboxShowcase from "./CheckboxShowcase.svelte"

const meta = {
  title: "Checkbox/Atom",
  component: Checkbox,
  parameters: { ...storybookLayout.centered, ...storybookA11yPolicy.smoke },
  tags: ["autodocs"],
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { ariaLabel: "Accept terms" } }
export const Checked: Story = { args: { ariaLabel: "Checked", checked: true } }
export const Disabled: Story = { args: { ariaLabel: "Disabled", disabled: true } }
export const Indeterminate: Story = { args: { ariaLabel: "Indeterminate", indeterminate: true } }
export const Invalid: Story = { args: { ariaLabel: "Invalid", invalid: true } }

export const Controlled: Story = {
  render: () => ({ Component: CheckboxShowcase, props: { showcase: "controlled" } }),
}

export const Playground: Story = {
  render: () => ({ Component: CheckboxShowcase, props: { showcase: "playground" } }),
}

export const Sizes: Story = {
  render: () => ({ Component: CheckboxShowcase, props: { showcase: "sizes" } }),
}

export const AllStates: Story = {
  render: () => ({ Component: CheckboxShowcase, props: { showcase: "all-states" } }),
}

export const UncontrolledDefaultChecked: Story = {
  render: () => ({ Component: CheckboxShowcase, props: { showcase: "uncontrolled" } }),
}
