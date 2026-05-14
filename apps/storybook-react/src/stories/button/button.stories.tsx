import {
  SpinnerVariants,
  storybookA11yPolicy,
  storybookButtonGeneralArgTypes,
  storybookLayout,
} from "@marwes-ui/core"
import { Button } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

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
    children: "Base Button",
    variant: "primary",
    action: "button",
  },
}

export const AsLink: Story = {
  args: {
    children: "Go to docs",
    href: "https://example.com",
    action: "navigate",
    variant: "text",
  },
}

export const Loading: Story = {
  args: {
    children: "Saving…",
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
