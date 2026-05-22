import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { Input } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Input/Atom/Input",
  component: Input,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    placeholder: "Enter text...",
  },
}

export const Controlled: Story = {
  args: {
    ariaLabel: "Controlled input",
    value: "Controlled value",
  },
}

export const WithValue: Story = {
  args: {
    ariaLabel: "Input with value",
    value: "Hello world",
  },
}

export const Disabled: Story = {
  args: {
    placeholder: "Disabled",
    disabled: true,
  },
}

export const Invalid: Story = {
  args: {
    placeholder: "Invalid input",
    invalid: true,
  },
}

export const Password: Story = {
  args: {
    type: "password",
    placeholder: "Enter password",
  },
}
