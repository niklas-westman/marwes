import {
  Avatar,
  AvatarGroup,
  ErrorToast,
  Icon,
  IconName,
  InfoToast,
  SegmentedControl,
  SuccessToast,
  Toast,
  WarningToast,
} from "@marwes-ui/react"
import type { SegmentedControlItem } from "@marwes-ui/react"
import { useState } from "react"
type ToastVariant = "subtle" | "outline" | "rich"
import styled from "styled-components"

import { CardTitle, FlexCard } from "./shared"

const RowContainer = styled.div`
  display: flex;
  gap: 24px;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`

const ToastCard = styled(FlexCard)`
  max-width: 352px;
`

const MenuCard = styled(FlexCard)`
  max-width: 276px;
`

const RightColumn = styled(FlexCard)``

const SectionLabel = styled.h4`
  font-family: "Instrument Sans", sans-serif;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--mw-color-text-muted, #595959);
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

const ContextMenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid var(--mw-color-border, #e5e5e5);
  border-radius: 8px;
  overflow: hidden;
  padding: 4px;
`

const MenuItem = styled.div<{ $destructive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  font-family: "Instrument Sans", sans-serif;
  font-size: 12px;
  color: ${(p) => (p.$destructive ? "#d90429" : "var(--mw-color-text, #141414)")};
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.15s;

  &:hover {
    background: var(--mw-color-surface-subtle, #f5f5f5);
  }
`

const MenuDivider = styled.div`
  height: 1px;
  background: var(--mw-color-border, #e5e5e5);
  margin: 4px 0;
`

const MenuIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 12px;
  height: 12px;
  opacity: 0.6;
`

const SubSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const AvatarRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
`

const BreadcrumbWrapper = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: "Instrument Sans", sans-serif;
  font-size: 12px;
`

const BreadcrumbItem = styled.a`
  color: #5859fc;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`

const BreadcrumbSeparator = styled.span`
  color: var(--mw-color-text-muted, #595959);
  font-size: 10px;
`

const BreadcrumbCurrent = styled.span`
  color: var(--mw-color-text, #141414);
  font-weight: 500;
`

const BreadcrumbHome = styled.span`
  display: flex;
  align-items: center;
  color: var(--mw-color-text-muted, #595959);
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
    <RowContainer>
      <ToastCard>
        <SectionLabel>Toast</SectionLabel>
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
        <SectionLabel>Context menu</SectionLabel>
        <ContextMenuWrapper>
          <MenuItem>
            <MenuIcon>
              <Icon name={IconName.Edit} decorative />
            </MenuIcon>
            Edit
          </MenuItem>
          <MenuItem>
            <MenuIcon>
              <Icon name={IconName.Eye} decorative />
            </MenuIcon>
            Preview
          </MenuItem>
          <MenuItem>
            <MenuIcon>
              <Icon name={IconName.Download} decorative />
            </MenuIcon>
            Download
          </MenuItem>
          <MenuDivider />
          <MenuItem>
            <MenuIcon>
              <Icon name={IconName.Bookmark} decorative />
            </MenuIcon>
            Bookmark
          </MenuItem>
          <MenuItem>
            <MenuIcon>
              <Icon name={IconName.Flag} decorative />
            </MenuIcon>
            Report
          </MenuItem>
          <MenuDivider />
          <MenuItem $destructive>
            <MenuIcon>
              <Icon name={IconName.Trash} decorative />
            </MenuIcon>
            Delete
          </MenuItem>
        </ContextMenuWrapper>
      </MenuCard>
      <RightColumn>
        <SubSection>
          <CardTitle>Avatar</CardTitle>
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
        </SubSection>
        <SubSection>
          <CardTitle>Breadcrumb</CardTitle>
          <BreadcrumbWrapper>
            <BreadcrumbHome>
              <Icon name={IconName.Home} decorative size={12} />
            </BreadcrumbHome>
            <BreadcrumbSeparator>›</BreadcrumbSeparator>
            <BreadcrumbItem href="#">Label</BreadcrumbItem>
            <BreadcrumbSeparator>›</BreadcrumbSeparator>
            <BreadcrumbItem href="#">Label</BreadcrumbItem>
            <BreadcrumbSeparator>›</BreadcrumbSeparator>
            <BreadcrumbCurrent>Current page</BreadcrumbCurrent>
          </BreadcrumbWrapper>
        </SubSection>
      </RightColumn>
    </RowContainer>
  )
}

export { RowToastMenuAvatar }
