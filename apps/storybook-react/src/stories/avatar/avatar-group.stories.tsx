import { storybookLayout } from "@marwes-ui/core"
import { AvatarGroup, MarwesProvider } from "@marwes-ui/react"
import type { AvatarGroupProps } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

const sampleItems: AvatarGroupProps["items"] = [
  { id: "mw", initials: "MW" },
  { id: "nk", initials: "NK" },
  { id: "as", initials: "AS" },
  { id: "guest", type: "icon", ariaLabel: "Guest member" },
]

const meta: Meta<typeof AvatarGroup> = {
  title: "Avatar/Molecule/AvatarGroup",
  component: AvatarGroup,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof AvatarGroup>

export const Default: Story = {
  args: {
    ariaLabel: "Project members",
    items: sampleItems,
    overflowCount: 3,
  },
}

export const WithoutOverflow: Story = {
  args: {
    ariaLabel: "Design reviewers",
    items: sampleItems,
  },
}

export const DarkPreview: Story = {
  render: () => (
    <MarwesProvider theme={{ mode: "dark" }}>
      <div style={{ padding: 24, background: "#2e2e2e", borderRadius: 12 }}>
        <AvatarGroup ariaLabel="Project members" items={sampleItems} overflowCount={3} />
      </div>
    </MarwesProvider>
  ),
}
