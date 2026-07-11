import { IconName, storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { ContextMenuEntry, ContextMenuProps } from "@marwes-ui/vue"
import { ContextMenu } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

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
  component: ContextMenu as unknown as object,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
} satisfies Meta<ContextMenuProps>

export default meta
type Story = StoryObj<ContextMenuProps>

export const Default: Story = {
  render: () => ({
    components: { ContextMenu },
    setup: () => ({ fileActions }),
    template: `<ContextMenu ariaLabel="File actions" :items="fileActions" />`,
  }),
}

export const DisabledItem: Story = {
  render: () => ({
    components: { ContextMenu },
    setup: () => ({
      items: fileActions.map((item) =>
        item.kind === "divider" || item.value !== "download" ? item : { ...item, disabled: true },
      ),
    }),
    template: `<ContextMenu ariaLabel="File actions with disabled download" :items="items" />`,
  }),
}

export const QuickActions: Story = {
  render: () => ({
    components: { ContextMenu },
    setup: () => ({
      items: [
        { value: "edit", label: "Edit", icon: IconName.Edit },
        { value: "preview", label: "Preview", icon: IconName.Eye },
        { value: "download", label: "Download", icon: IconName.Download },
      ],
    }),
    template: `<ContextMenu ariaLabel="Quick actions" :items="items" />`,
  }),
}
