import { BannerVariant, storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { Banner } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"
import BannerDarkGallery from "./BannerDarkGallery.svelte"
import BannerGallery from "./BannerGallery.svelte"

const VARIANTS = Object.values(BannerVariant)

const meta = {
  title: "Banner/Atom",
  component: Banner,
  parameters: {
    ...storybookLayout.padded,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: VARIANTS,
    },
    showIcon: { control: "boolean" },
    dismissible: { control: "boolean" },
  },
} satisfies Meta<typeof Banner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: "Banner message — describe the event, update, or action needed here.",
    variant: "info",
    showIcon: true,
    dismissible: true,
  },
}

export const WithAction: Story = {
  args: {
    children: "Banner message — describe the event, update, or action needed here.",
    variant: "info",
    showIcon: true,
    dismissible: true,
  },
}

export const AllVariants: Story = {
  render: () => ({
    Component: BannerGallery,
    props: {},
  }),
}

export const WithoutIcon: Story = {
  args: {
    children: "Banner message without an icon.",
    variant: "neutral",
    showIcon: false,
    dismissible: true,
  },
}

export const NonDismissible: Story = {
  args: {
    children: "This banner cannot be dismissed.",
    variant: "warning",
    showIcon: true,
    dismissible: false,
  },
}

export const DarkVariants: Story = {
  render: () => ({
    Component: BannerDarkGallery,
    props: {},
  }),
}
