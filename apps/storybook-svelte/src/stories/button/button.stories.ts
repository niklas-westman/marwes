import {
  SpinnerVariants,
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
    children: {
      control: "text",
    },
    loading: {
      control: "object",
      description:
        "Boolean shorthand or loading config object with isLoading, disableWhileLoading, spinnerVariant, and loadingLabel.",
    },
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

export const LoadingWithLabel: Story = {
  args: {
    children: "Save",
    loading: {
      isLoading: true,
      loadingLabel: "Saving…",
    },
    variant: "primary",
    action: "submit",
  },
}

export const LoadingInteractive: Story = {
  args: {
    children: "Refresh",
    loading: {
      isLoading: true,
      disableWhileLoading: false,
      loadingLabel: "Refreshing…",
    },
    variant: "secondary",
    action: "button",
  },
}

export const LoadingWithCustomSpinner: Story = {
  args: {
    children: "Refresh",
    loading: {
      isLoading: true,
      spinnerVariant: SpinnerVariants.dual,
      loadingLabel: "Refreshing…",
    },
    variant: "secondary",
    action: "button",
  },
}

export const LoadingFullConfig: Story = {
  args: {
    children: "Save",
    variant: "primary",
    action: "submit",
    iconLeft: "plus",
    iconRight: "checkCircle",
    loading: {
      isLoading: true,
      disableWhileLoading: false,
      spinnerVariant: SpinnerVariants.dual,
      loadingLabel: "Saving…",
    },
  },
}

export const LoadingFullConfigBlocking: Story = {
  args: {
    children: "Save",
    variant: "primary",
    action: "submit",
    iconLeft: "plus",
    iconRight: "checkCircle",
    loading: {
      isLoading: true,
      disableWhileLoading: true,
      spinnerVariant: SpinnerVariants.dual,
      loadingLabel: "Saving…",
    },
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
