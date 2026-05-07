import {
  storybookA11yPolicy,
  storybookButtonGeneralArgTypes,
  storybookLayout,
} from "@marwes-ui/core"
import { Button } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Buttons/Atom/Button",
  component: Button,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: {
    ...storybookButtonGeneralArgTypes,
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    variant: "primary",
    action: "button",
    children: "Base Button",
  },
}

export const AsLink: Story = {
  args: {
    children: "Go to docs",
    href: "https://example.com",
    action: "navigate",
    variant: "text",
    as: "a",
  },
}

export const Loading: Story = {
  args: {
    children: "Saving...",
    loading: true,
    variant: "primary",
    action: "submit",
  },
}

export const Disabled: Story = {
  args: {
    children: "Disabled",
    disabled: true,
    variant: "primary",
  },
}

export const Secondary: Story = {
  args: {
    children: "Secondary",
    variant: "secondary",
  },
}

export const Text: Story = {
  args: {
    children: "Text Button",
    variant: "text",
  },
}

export const Success: Story = {
  args: {
    children: "Approve",
    variant: "success",
    iconLeft: "check",
  },
}

export const Small: Story = {
  args: {
    children: "Small",
    size: "sm",
    variant: "primary",
  },
}

export const Large: Story = {
  args: {
    children: "Large",
    size: "lg",
    variant: "primary",
  },
}
