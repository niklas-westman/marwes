import { IconName, storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { ContextMenu } from "@marwes-ui/react"
import type { ContextMenuEntry } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const fileActions: ContextMenuEntry[] = [
  { value: "edit", label: "Edit", icon: IconName.Edit },
  { value: "preview", label: "Preview", icon: IconName.Eye },
  { value: "download", label: "Download", icon: IconName.Download },
  { kind: "divider" },
  { value: "bookmark", label: "Bookmark", icon: IconName.Bookmark },
  { value: "report", label: "Report", icon: IconName.Flag },
  { kind: "divider" },
  { value: "delete", label: "Delete", icon: IconName.Trash, destructive: true },
]

const meta = {
  title: "ContextMenu/Atom",
  component: ContextMenu,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
} satisfies Meta<typeof ContextMenu>

export default meta
type Story = StoryObj<typeof ContextMenu>

export const Default: Story = {
  args: {
    ariaLabel: "File actions",
    items: fileActions,
  },
}

export const DisabledItem: Story = {
  args: {
    ariaLabel: "File actions with disabled download",
    items: fileActions.map((item) =>
      item.kind === "divider" || item.value !== "download" ? item : { ...item, disabled: true },
    ),
  },
}

export const QuickActions: Story = {
  args: {
    ariaLabel: "Quick actions",
    items: [
      { value: "edit", label: "Edit", icon: IconName.Edit },
      { value: "preview", label: "Preview", icon: IconName.Eye },
      { value: "download", label: "Download", icon: IconName.Download },
    ],
  },
}
