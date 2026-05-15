import { storybookA11yPolicy, storybookCheckboxArgTypes, storybookLayout } from "@marwes-ui/core"
import { Checkbox } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"
import CheckboxShowcase from "./CheckboxShowcase.svelte"

const meta = {
  title: "Checkbox/Atom",
  component: Checkbox,
  parameters: { ...storybookLayout.centered, ...storybookA11yPolicy.smoke },
  tags: ["autodocs"],
  args: { size: "md" },
  argTypes: storybookCheckboxArgTypes,
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: { ariaLabel: "Accept terms" },
}

export const UncontrolledDefaultChecked: Story = {
  render: () => ({ Component: CheckboxShowcase, props: { showcase: "uncontrolled" } }),
}

export const Controlled: Story = {
  render: () => ({ Component: CheckboxShowcase, props: { showcase: "controlled" } }),
}

export const Indeterminate: Story = {
  render: () => ({ Component: CheckboxShowcase, props: { showcase: "indeterminate" } }),
}

export const Disabled: Story = {
  render: () => ({ Component: CheckboxShowcase, props: { showcase: "disabled" } }),
}

export const Invalid: Story = {
  render: () => ({ Component: CheckboxShowcase, props: { showcase: "invalid" } }),
}

export const Sizes: Story = {
  render: () => ({ Component: CheckboxShowcase, props: { showcase: "sizes" } }),
}

export const AllStates: Story = {
  render: () => ({ Component: CheckboxShowcase, props: { showcase: "all-states" } }),
}
