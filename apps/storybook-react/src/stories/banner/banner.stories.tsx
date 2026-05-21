import { BannerVariant, storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { Banner, Button, MarwesProvider, ThemeMode } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

const VARIANTS = Object.values(BannerVariant)

const meta: Meta<typeof Banner> = {
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
    showAction: { control: "boolean" },
  },
}

export default meta

type Story = StoryObj<typeof Banner>

export const Default: Story = {
  args: {
    children: "Banner message — describe the event, update, or action needed here.",
    variant: BannerVariant.info,
    showIcon: true,
    dismissible: true,
  },
}

export const WithAction: Story = {
  args: {
    children: "Banner message — describe the event, update, or action needed here.",
    variant: BannerVariant.info,
    showIcon: true,
    dismissible: true,
    action: <Button size="sm">Learn more</Button>,
  },
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
      {VARIANTS.map((variant) => (
        <Banner key={variant} variant={variant} showIcon dismissible>
          {`${variant.charAt(0).toUpperCase() + variant.slice(1)} — Banner message describing the event or action needed.`}
        </Banner>
      ))}
    </div>
  ),
}

export const WithoutIcon: Story = {
  args: {
    children: "Banner message without an icon.",
    variant: BannerVariant.neutral,
    showIcon: false,
    dismissible: true,
  },
}

export const NonDismissible: Story = {
  args: {
    children: "This banner cannot be dismissed.",
    variant: BannerVariant.warning,
    showIcon: true,
    dismissible: false,
  },
}

export const DarkVariants: Story = {
  render: () => (
    <MarwesProvider theme={{ mode: ThemeMode.dark }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          width: "100%",
          padding: 16,
          background: "#0f0f0f",
          borderRadius: 8,
        }}
      >
        {VARIANTS.map((variant) => (
          <Banner key={variant} variant={variant} showIcon dismissible>
            {`${variant.charAt(0).toUpperCase() + variant.slice(1)} — Banner message in dark mode.`}
          </Banner>
        ))}
      </div>
    </MarwesProvider>
  ),
}
