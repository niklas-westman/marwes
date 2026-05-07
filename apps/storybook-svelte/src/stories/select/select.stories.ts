import { storybookLayout } from "@marwes-ui/core"
import { Select } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Inputs/Atom/Select",
  component: Select,
  parameters: { ...storybookLayout.centered },
  tags: ["autodocs"],
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
