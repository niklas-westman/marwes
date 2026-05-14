import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { Meta, StoryObj } from "@storybook/svelte"
import TabAtomPreview from "./TabAtomPreview.svelte"
import TabShowcase from "./TabShowcase.svelte"

const meta = {
  title: "Tab/Atom",
  component: TabAtomPreview,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: {
    selected: { control: "boolean" },
    disabled: { control: "boolean" },
    ariaLabel: { control: "text" },
    ariaControls: { control: "text" },
  },
} satisfies Meta<typeof TabAtomPreview>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    selected: true,
    disabled: false,
  },
}

export const Selected: Story = {
  args: {
    selected: true,
    disabled: false,
  },
}

export const Disabled: Story = {
  args: {
    selected: false,
    disabled: true,
  },
}

export const IconOnly: Story = {
  args: {
    selected: false,
    ariaLabel: "Settings",
  },
}

export const WithAriaLabel: Story = {
  args: {
    selected: true,
    ariaLabel: "Settings",
  },
}

export const TabBar: Story = {
  render: () => ({
    Component: TabShowcase,
    props: { showcase: "bar" },
  }),
}

export const AllStates: Story = {
  render: () => ({
    Component: TabShowcase,
    props: { showcase: "states" },
  }),
}
