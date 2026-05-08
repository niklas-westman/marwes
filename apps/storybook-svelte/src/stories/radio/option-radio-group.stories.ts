import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { OptionRadioGroup } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Radio/Purpose/Option",
  component: OptionRadioGroup,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof OptionRadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    name: "theme",
    label: "Select theme",
    options: [
      { value: "light", label: "Light" },
      { value: "dark", label: "Dark" },
      { value: "system", label: "System" },
    ],
    defaultValue: "system",
  },
}

export const Controlled: Story = {
  args: {
    name: "theme-controlled",
    label: "Select theme",
    options: [
      { value: "light", label: "Light" },
      { value: "dark", label: "Dark" },
      { value: "system", label: "System" },
    ],
    value: "dark",
  },
}

export const WithDescription: Story = {
  args: {
    name: "theme-desc",
    label: "Select theme",
    description: "Choose your preferred appearance.",
    options: [
      { value: "light", label: "Light" },
      { value: "dark", label: "Dark" },
    ],
  },
}

export const WithError: Story = {
  args: {
    name: "theme-err",
    label: "Select theme",
    error: "Please select a theme.",
    options: [
      { value: "light", label: "Light" },
      { value: "dark", label: "Dark" },
    ],
  },
}
