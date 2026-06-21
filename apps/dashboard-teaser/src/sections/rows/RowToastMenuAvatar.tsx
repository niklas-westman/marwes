import {
  Avatar,
  AvatarBadge,
  AvatarGroup,
  Breadcrumb,
  ContextMenu,
  ErrorToast,
  IconName,
  InfoToast,
  SuccessToast,
  Text,
  TextVariant,
  Toast,
  WarningToast,
} from "@marwes-ui/react"
import type { BreadcrumbItem, ContextMenuEntry, SegmentedControlItem } from "@marwes-ui/react"
import { useState } from "react"
import styled from "styled-components"
// Atom is no longer publicly exported; deep-import for the toast variant picker.
import { SegmentedControl } from "../../../../../packages/react/src/components/segmented-control/segmented-control"

import type { ComponentDisplayOptions } from "../playground-settings"
import { Card, FlexAreaCard, ShowcaseFlexRow, ShowcaseSectionLabel } from "./shared"

type ToastVariant = "subtle" | "outline" | "rich"

const ToastMosaicRow = styled(ShowcaseFlexRow)``

const ToastCard = styled(FlexAreaCard)`
  order: 1;

  .mw-segmented-control,
  .mw-toast {
    width: 100%;
    min-width: 0;
    max-width: 100%;
  }
`

const MenuCard = styled(FlexAreaCard)`
  order: 2;

  .mw-context-menu {
    width: min(100%, 13.25rem);
    max-width: 100%;
  }
`

const RightStack = styled.div`
  display: flex;
  flex: 1 1 15.625rem;
  flex-direction: column;
  gap: var(--showcase-row-gap);
  min-width: 0;
  order: 3;

  @container (max-width: 54rem) {
    flex-basis: 100%;
  }

  @container (max-width: 38rem) {
    flex-basis: 100%;
  }
`

const AvatarCard = styled(Card)`
  flex: 0 1 auto;

  ${({ theme }) => theme.media.wideDesktopAndAbove} {
    min-height: 9rem;
  }
`

const BreadcrumbCard = styled(Card)`
  flex: 1 1 18.75rem;

  ${({ theme }) => theme.media.wideDesktopAndAbove} {
    min-height: 18.75rem;
  }

  .mw-breadcrumb {
    max-width: 100%;
  }
`

const ToastList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sp16};
`

const toastVariantItems: SegmentedControlItem<ToastVariant>[] = [
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

type RowToastMenuAvatarProps = {
  options: ComponentDisplayOptions
}

function RowToastMenuAvatar({ options }: RowToastMenuAvatarProps): JSX.Element {
  const [toastVariant, setToastVariant] = useState<ToastVariant>("subtle")
  const [dismissedToasts, setDismissedToasts] = useState<Set<string>>(new Set())
  const resolvedContextMenuItems = options.showIcons
    ? contextMenuItems
    : contextMenuItems.map((item) =>
        item.kind === "divider" ? item : { ...item, icon: undefined },
      )

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
    <ToastMosaicRow>
      <ToastCard $basis="22rem" $grow={0} $minHeight="29.5rem">
        {options.showLabels && <Text variant={TextVariant.overline}>Toast</Text>}
        <SegmentedControl
          items={toastVariantItems}
          value={toastVariant}
          onValueChange={(v) => {
            setToastVariant(v)
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
      <MenuCard $basis="17.25rem" $grow={0} $minHeight="29.5rem">
        {options.showLabels && <Text variant={TextVariant.overline}>Context menu</Text>}
        <ContextMenu ariaLabel="File actions" items={resolvedContextMenuItems} />
      </MenuCard>
      <RightStack>
        <AvatarCard>
          {options.showLabels && <ShowcaseSectionLabel>Avatar</ShowcaseSectionLabel>}
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
          {options.showLabels && <Text variant={TextVariant.overline}>Breadcrumb</Text>}

          <Breadcrumb homeHref="#" items={breadcrumbItems} />
        </BreadcrumbCard>
      </RightStack>
    </ToastMosaicRow>
  )
}

export { RowToastMenuAvatar }
