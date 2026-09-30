import { ContextMenu, IconName } from "@marwes-ui/react"

export function Example() {
  return (
    <ContextMenu
      ariaLabel="File actions"
      items={[
        { value: "edit", label: "Edit", icon: IconName.Edit },
        { value: "preview", label: "Preview", icon: IconName.Eye },
        { value: "download", label: "Download", icon: IconName.Download },
        { kind: "divider" },
        { value: "bookmark", label: "Bookmark", icon: IconName.Bookmark },
        { value: "report", label: "Report", icon: IconName.Flag },
        { kind: "divider" },
        { value: "delete", label: "Delete", icon: IconName.Trash, destructive: true },
      ]}
    />
  )
}
