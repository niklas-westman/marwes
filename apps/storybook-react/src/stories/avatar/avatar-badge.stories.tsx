import { AvatarSize, storybookLayout } from "@marwes-ui/core"
import { AvatarBadge } from "@marwes-ui/react"
import type { AvatarBadgeProps } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

const meta: Meta<typeof AvatarBadge> = {
  title: "Avatar/Molecule/AvatarBadge",
  component: AvatarBadge,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof AvatarBadge>

export const Default: Story = {
  args: {
    size: AvatarSize.medium,
    initials: "MW",
  },
}

const avatarBadgePreviews: Array<{
  label: string
  props: AvatarBadgeProps
}> = [
  {
    label: "Small",
    props: {
      size: AvatarSize.small,
      initials: "MW",
    },
  },
  {
    label: "Medium",
    props: {
      size: AvatarSize.medium,
      initials: "MW",
    },
  },
  {
    label: "Large",
    props: {
      size: AvatarSize.large,
      initials: "MW",
    },
  },
]

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
      {avatarBadgePreviews.map((preview) => (
        <div key={preview.label} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ fontSize: 12, color: "#666666" }}>{preview.label}</span>
          <AvatarBadge {...preview.props} />
        </div>
      ))}
    </div>
  ),
}

export const DarkSizes: Story = {
  render: () => (
    <div
      className="mw-theme--dark"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 24,
        padding: 24,
        background: "#2e2e2e",
        borderRadius: 12,
      }}
    >
      {avatarBadgePreviews.map((preview) => (
        <div
          key={`dark-${preview.label}`}
          style={{ display: "flex", flexDirection: "column", gap: 8 }}
        >
          <span style={{ fontSize: 12, color: "#d4d4d4" }}>{preview.label}</span>
          <AvatarBadge {...preview.props} />
        </div>
      ))}
    </div>
  ),
}
