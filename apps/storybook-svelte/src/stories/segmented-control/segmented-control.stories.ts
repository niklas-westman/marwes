import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { Meta, StoryObj } from "@storybook/svelte"
import SegmentedControlPreview from "./SegmentedControlPreview.svelte"
import SegmentedControlShowcase from "./SegmentedControlShowcase.svelte"

const meta = {
  title: "Segmented Control/SegmentedControl",
  component: SegmentedControlPreview,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "inverse", "pill"],
    },
    size: {
      control: "select",
      options: ["sm", "md"],
    },
    disabled: { control: "boolean" },
    ariaLabel: { control: "text" },
  },
} satisfies Meta<typeof SegmentedControlPreview>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    value: "compact",
    ariaLabel: "View density",
  },
}

export const ThreeSegments: Story = {
  args: {
    items: [
      { value: "react", label: "React" },
      { value: "vue", label: "Vue" },
      { value: "svelte", label: "Svelte" },
    ],
    value: "react",
    ariaLabel: "Framework",
  },
}

export const Inverse: Story = {
  args: {
    value: "compact",
    variant: "inverse",
    ariaLabel: "View density",
  },
}

export const Pill: Story = {
  args: {
    items: [
      { value: "light", label: "☀️", ariaLabel: "Light mode" },
      { value: "dark", label: "🌙", ariaLabel: "Dark mode" },
    ],
    value: "light",
    variant: "pill",
    ariaLabel: "Theme mode",
  },
}

export const Small: Story = {
  args: {
    value: "compact",
    size: "sm",
    ariaLabel: "View density",
  },
}

export const Disabled: Story = {
  args: {
    value: "compact",
    disabled: true,
    ariaLabel: "View density",
  },
}

export const AllVariants: Story = {
  render: () => ({
    Component: SegmentedControlShowcase,
  }),
}
