import { ContextMenu, IconName } from "@marwes-ui/react"

import { ShowcaseCard, ShowcaseGrid } from "./showcase-layout"

function ContextMenuShowcase(): JSX.Element {
  return (
    <ShowcaseGrid>
      <ShowcaseCard>
        <h3>File actions</h3>
        <p>Icons, grouped dividers, and a visually distinct destructive action.</p>
        <ContextMenu
          ariaLabel="File actions"
          items={[
            { value: "edit", label: "Edit", icon: IconName.Edit },
            { value: "download", label: "Download", icon: IconName.Download },
            { kind: "divider" },
            { value: "delete", label: "Delete", icon: IconName.Trash, destructive: true },
          ]}
        />
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>Selection only</h3>
        <p>A minimal label-only menu when icons would not add meaning.</p>
        <ContextMenu
          ariaLabel="Row actions"
          items={[
            { value: "duplicate", label: "Duplicate" },
            { value: "move", label: "Move to folder" },
            { value: "rename", label: "Rename" },
          ]}
        />
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>Disabled action</h3>
        <p>An action stays visible but unavailable rather than disappearing from the list.</p>
        <ContextMenu
          ariaLabel="Document actions"
          items={[
            { value: "share", label: "Share", icon: IconName.Users },
            { value: "export", label: "Export", icon: IconName.Download, disabled: true },
          ]}
        />
      </ShowcaseCard>
    </ShowcaseGrid>
  )
}

export default ContextMenuShowcase
