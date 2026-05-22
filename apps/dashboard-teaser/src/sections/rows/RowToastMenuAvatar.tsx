import {
  Avatar,
  AvatarGroup,
  Breadcrumb,
  ContextMenu,
  ErrorToast,
  IconName,
  InfoToast,
  SegmentedControl,
  SuccessToast,
  Toast,
  WarningToast,
} from "@marwes-ui/react"
import type { BreadcrumbItem, ContextMenuEntry, SegmentedControlItem } from "@marwes-ui/react"
import { useState } from "react"
type ToastVariant = "subtle" | "outline" | "rich"
import styled from "styled-components"

import { ShowcaseCard, ShowcaseGrid, ShowcaseSectionLabel } from "./shared"

const ToastCard = styled(ShowcaseCard)`
  .mw-segmented-control,
  .mw-toast {
    width: 100%;
    min-width: 0;
    max-width: 100%;
  }
`

const MenuCard = styled(ShowcaseCard)`
  .mw-context-menu {
    width: min(100%, var(--mw-context-menu-width, 212px));
    max-width: 100%;
  }
`

const AvatarCard = styled(ShowcaseCard)``

const BreadcrumbCard = styled(ShowcaseCard)`
  .mw-breadcrumb {
    max-width: 100%;
  }
`

const ToastList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const toastVariantItems: SegmentedControlItem[] = [
  { value: "subtle", label: "Label" },
  { value: "outline", label: "Outline" },
  { value: "rich", label: "Rich" },
]

const contextMenuItems: ContextMenuEntry[] = [
  { value: "edit", label: "Edit", icon: IconName.Edit },
  { value: "preview", label: "Preview", icon: IconName.Eye },
  { value: "download", label: "Download", icon: IconName.Download },
  { kind: "divider" },
  { value: "bookmark", label: "Bookmark", icon: IconName.Bookmark },
  { value: "report", label: "Report", icon: IconName.Flag },
  { kind: "divider" },
  { value: "delete", label: "Delete", icon: IconName.Trash, destructive: true },
]

const breadcrumbItems: BreadcrumbItem[] = [
  { label: "Label", href: "#" },
  { label: "Label", href: "#" },
  { label: "Current page" },
]

const AvatarRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
`

function RowToastMenuAvatar(): JSX.Element {
  const [toastVariant, setToastVariant] = useState<ToastVariant>("subtle")
  const [dismissedToasts, setDismissedToasts] = useState<Set<string>>(new Set())

  const dismissToast = (id: string): void => {
    setDismissedToasts((prev) => new Set([...prev, id]))
  }

  const resetToasts = (): void => {
    setDismissedToasts(new Set())
  }

  const visibleToasts = [
    { id: "neutral", Component: Toast, message: "Neutral message" },
    { id: "info", Component: InfoToast, message: "Meeting starts in 10 min" },
    { id: "success", Component: SuccessToast, message: "Your email is verified" },
    { id: "warning", Component: WarningToast, message: "Connection unstable" },
    { id: "error", Component: ErrorToast, message: "Something went wrong" },
  ].filter((t) => !dismissedToasts.has(t.id))

  return (
    <ShowcaseGrid>
      <ToastCard $desktopSpan={3}>
        <ShowcaseSectionLabel>Toast</ShowcaseSectionLabel>
        <SegmentedControl
          items={toastVariantItems}
          value={toastVariant}
          onValueChange={(v) => {
            setToastVariant(v as ToastVariant)
            resetToasts()
          }}
          variant="inverse"
          ariaLabel="Toast variant"
        />
        <ToastList>
          {visibleToasts.map(({ id, Component, message }) => (
            <Component key={id} variant={toastVariant} onDismiss={() => dismissToast(id)}>
              {message}
            </Component>
          ))}
          {visibleToasts.length === 0 && (
            <button onClick={resetToasts} type="button" className="mw-segmented-control__item">
              Reset toasts
            </button>
          )}
        </ToastList>
      </ToastCard>
      <MenuCard $desktopSpan={3}>
        <ShowcaseSectionLabel>Context menu</ShowcaseSectionLabel>
        <ContextMenu ariaLabel="File actions" items={contextMenuItems} />
      </MenuCard>
      <AvatarCard $desktopSpan={3}>
        <ShowcaseSectionLabel>Avatar</ShowcaseSectionLabel>
        <AvatarRow>
          <AvatarGroup
            items={[{ initials: "MO" }, { initials: "MO" }, { initials: "MO" }]}
            overflowCount={3}
          />
          <Avatar initials="MO" />
          <Avatar initials="MO" />
          <Avatar initials="MO" size="small" />
          <Avatar size="small" />
        </AvatarRow>
      </AvatarCard>
      <BreadcrumbCard $desktopSpan={3}>
        <ShowcaseSectionLabel>Breadcrumb</ShowcaseSectionLabel>
        <Breadcrumb homeHref="#" items={breadcrumbItems} />
      </BreadcrumbCard>
    </ShowcaseGrid>
  )
}

export { RowToastMenuAvatar }
