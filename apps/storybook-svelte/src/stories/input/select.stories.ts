import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { Select } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Input/Atom/Select",
  component: Select,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: {
    native: {
      control: "boolean",
      description: "Use native browser select chrome instead of Marwes visual treatment.",
    },
  },
  args: {
    native: false,
  },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

const options = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "svelte", label: "Svelte" },
]

export const Default: Story = {
  args: { options, placeholder: "Select a framework" },
}

export const WithValue: Story = {
  args: { options, value: "svelte" },
}

export const Disabled: Story = {
  args: { options, disabled: true, placeholder: "Disabled" },
}

export const Native: Story = {
  args: { options, native: true, placeholder: "Native browser select" },
}

export const Invalid: Story = {
  args: { options, invalid: true, value: "react" },
}
