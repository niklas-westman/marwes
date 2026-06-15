import {
  Avatar,
  AvatarBadge,
  AvatarGroup,
  Breadcrumb,
  ContextMenu,
  ErrorToast,
  IconName,
  InfoToast,
  SegmentedControl,
  SuccessToast,
  Text,
  TextVariant,
  Toast,
  WarningToast,
} from "@marwes-ui/react"
import type { BreadcrumbItem, ContextMenuEntry, SegmentedControlItem } from "@marwes-ui/react"
import { useState } from "react"
import styled from "styled-components"

import { Card, ShowcaseSectionLabel } from "./shared"

type ToastVariant = "subtle" | "outline" | "rich"

const ToastMosaicGrid = styled.div`
  display: grid;
  width: 100%;
  height: 100%;
  min-width: 0;
  gap: ${({ theme }) => `clamp(${theme.spacing.sp16}, 2vw, ${theme.spacing.sp24})`};

  ${({ theme }) => theme.media.wideDesktopAndAbove} {
    grid-template-columns: minmax(20rem, 22rem) minmax(15.5rem, 17.25rem) minmax(0, 1fr);
    grid-template-rows: 9rem 21rem;
  }

  > * {
    min-width: 0;
  }

  ${({ theme }) => theme.media.wideDesktopAndBelow} {
    height: auto;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-template-rows: none;
  }

  ${({ theme }) => theme.media.tabletAndBelow} {
    grid-template-columns: minmax(0, 1fr);
  }
`

const ToastCard = styled(Card)`
  grid-column: 1;
  grid-row: span 2;
  flex-shrink: 1;
  height: 100%;

  .mw-segmented-control,
  .mw-toast {
    width: 100%;
    min-width: 0;
    max-width: 100%;
  }

  ${({ theme }) => theme.media.wideDesktopAndBelow} {
    grid-column: span 1;
    grid-row: auto;
  }

  ${({ theme }) => theme.media.tabletAndBelow} {
    grid-column: 1 / -1;
  }
`

const MenuCard = styled(Card)`
  grid-column: 2;
  grid-row: span 2;
  flex-shrink: 1;
  height: 100%;

  .mw-context-menu {
    width: min(100%, 13.25rem);
    max-width: 100%;
  }

  ${({ theme }) => theme.media.wideDesktopAndBelow} {
    grid-column: span 1;
    grid-row: auto;
  }

  ${({ theme }) => theme.media.tabletAndBelow} {
    grid-column: 1 / -1;
  }
`

const AvatarCard = styled(Card)`
  grid-column: 3;
  grid-row: 1;
  flex-shrink: 1;
  height: 100%;
  min-height: 0;

  ${({ theme }) => theme.media.wideDesktopAndBelow} {
    grid-column: 1 / -1;
    grid-row: auto;
  }
`

const BreadcrumbCard = styled(Card)`
  grid-column: 3;
  grid-row: 2;
  flex-shrink: 1;
  height: 100%;
  min-height: 0;

  .mw-breadcrumb {
    max-width: 100%;
  }

  ${({ theme }) => theme.media.wideDesktopAndBelow} {
    grid-column: 1 / -1;
    grid-row: auto;
  }
`

const ToastList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sp16};
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

const robotAvatarSrc = `${import.meta.env.BASE_URL}assets/avatar-robot.png`

const AvatarRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sp16};
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
    {
      id: "success",
      Component: SuccessToast,
      message: "Your email is verified",
    },
    { id: "warning", Component: WarningToast, message: "Connection unstable" },
    { id: "error", Component: ErrorToast, message: "Something went wrong" },
  ].filter((t) => !dismissedToasts.has(t.id))

  return (
    <ToastMosaicGrid>
      <ToastCard>
        <Text variant={TextVariant.overline}>Toast</Text>
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
      <MenuCard>
        <Text variant={TextVariant.overline}>Context menu</Text>
        <ContextMenu ariaLabel="File actions" items={contextMenuItems} />
      </MenuCard>
      <AvatarCard>
        <ShowcaseSectionLabel>Avatar</ShowcaseSectionLabel>
        <AvatarRow>
          <AvatarGroup
            items={[
              { initials: "MO" },
              { initials: "MO" },
              { initials: "MO" },
              { type: "icon", ariaLabel: "Guest member" },
            ]}
            overflowCount={3}
          />
          <AvatarBadge initials="MO" statusLabel="Online" />
          <Avatar src={robotAvatarSrc} alt="Marwes robot" />
          <Avatar initials="MO" size="small" />
          <Avatar type="icon" ariaLabel="User icon fallback" />
        </AvatarRow>
      </AvatarCard>
      <BreadcrumbCard>
        <Text variant={TextVariant.overline}>Breadcrumb</Text>

        <Breadcrumb homeHref="#" items={breadcrumbItems} />
      </BreadcrumbCard>
    </ToastMosaicGrid>
  )
}

export { RowToastMenuAvatar }
