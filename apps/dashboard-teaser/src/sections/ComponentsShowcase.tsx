import styled from "styled-components"

import { Drawer, Icon, IconName, MarwesProvider, Text, TextVariant } from "@marwes-ui/react"
import { type Dispatch, type SetStateAction, useEffect, useState } from "react"
import { CustomizeFab } from "../components/CustomizeFab"
import { useIsCompactBreakpoint, useIsMobileBreakpoint } from "../hooks/use-breakpoint"
import { dashboardRadius, dashboardRowStyles, responsiveShellPadding } from "../styles/theme-utils"
import { PlaygroundControls } from "./PlaygroundControls"
import { createDashboardThemeInput } from "./playground-settings"
import type { PlaygroundColorVision, PlaygroundSettings } from "./playground-settings"
import { RowAccordionInput } from "./rows/RowAccordionInput"
import { RowAvatarBreadcrumbDialog } from "./rows/RowAvatarBreadcrumbDialog"
import { RowBanner } from "./rows/RowBanner"
import { RowButtonPaginationProgress } from "./rows/RowButtonPaginationProgress"
import { RowSegmented } from "./rows/RowSegmented"
import { RowSpinner } from "./rows/RowSpinner"
import { RowSwitchCard } from "./rows/RowSwitchCard"
import { RowToastMenuAvatar } from "./rows/RowToastMenuAvatar"

const ShowcaseContainer = styled.section`
  width: 100%;
  padding: 0 ${({ theme }) => responsiveShellPadding(theme)};
`

const ShowcaseLayout = styled.div<{ $sidebarVisible: boolean }>`
  width: 100%;
  max-width: ${({ theme }) =>
    `calc(${theme.breakpoint.wideDesktop}px - (${theme.spacing.sp72} * 2))`};
  margin: 0 auto;
  display: grid;
  grid-template-columns: ${(p) =>
    p.$sidebarVisible ? "15.25rem minmax(0, 1fr)" : "minmax(0, 1fr)"};
  gap: ${({ theme }) => `calc(${theme.spacing.sp32} + ${theme.spacing.sp4})`};
  align-items: start;
`

const ContentGrid = styled.div`
  width: 100%;
  min-width: 0;
  container-type: inline-size;
  background: ${({ theme }) => theme.color.surface};
  border-radius: ${({ theme }) => dashboardRadius(theme, 8)};
  padding: ${({ theme }) => `clamp(${theme.spacing.sp16}, 3vw, ${theme.spacing.sp32})`};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => `clamp(${theme.spacing.sp16}, 2vw, ${theme.spacing.sp24})`};

  ${({ theme }) => theme.media.mobileAndBelow} {
    border-radius: ${({ theme }) => dashboardRadius(theme, 3)};
  }
`

const PreviewThemeScope = styled.div`
  min-width: 0;

  > [data-marwes-theme="true"] {
    display: flex;
    min-width: 0;
    flex-direction: column;
    gap: ${({ theme }) => `clamp(${theme.spacing.sp16}, 2vw, ${theme.spacing.sp24})`};
    background: transparent !important;
  }

  &[data-dashboard-color-vision="protanopia"] > [data-marwes-theme="true"] {
    filter: url("#dashboard-cvd-protanopia");
  }

  &[data-dashboard-color-vision="deuteranopia"] > [data-marwes-theme="true"] {
    filter: url("#dashboard-cvd-deuteranopia");
  }

  &[data-dashboard-color-vision="tritanopia"] > [data-marwes-theme="true"] {
    filter: url("#dashboard-cvd-tritanopia");
  }
`

const ControlsColumn = styled.div`
  position: sticky;
  top: ${({ theme }) => theme.spacing.sp24};
  padding-top: ${({ theme }) => `calc(${theme.spacing.sp16} + ${theme.spacing.sp4})`};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sp16};
`

const HideSidebarButton = styled.button`
  align-self: flex-end;
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sp4};
  border: 0;
  background: transparent;
  padding: ${({ theme }) => `${theme.spacing.sp4} ${theme.spacing.sp8}`};
  color: ${({ theme }) => theme.color.textMuted};
  cursor: pointer;
  font: inherit;
  font-size: 0.75rem;
  border-radius: ${({ theme }) => `calc(${theme.ui.radius} * 1.5)`};

  &:hover {
    color: ${({ theme }) => theme.color.text};
    background: ${({ theme }) => theme.color.surface};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.primary.base};
    outline-offset: 2px;
  }
`

const DrawerPanelScope = styled.div<{ $isMobile: boolean }>`
  .mw-drawer__panel {
    ${(p) => (p.$isMobile ? "width: 100vw; max-width: 100vw;" : "")}
  }
`

const Row = styled.div<{ $desktopHeight: string }>`
  ${dashboardRowStyles}

  ${({ theme }) => theme.media.wideDesktopAndAbove} {
    min-height: ${(p) => p.$desktopHeight};
  }
`

type ComponentsShowcaseProps = {
  settings: PlaygroundSettings
  onSettingsChange: Dispatch<SetStateAction<PlaygroundSettings>>
}

function ColorVisionFilters(): JSX.Element {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <defs>
        <filter id="dashboard-cvd-protanopia">
          <feColorMatrix
            values="0.567 0.433 0 0 0
                    0.558 0.442 0 0 0
                    0 0.242 0.758 0 0
                    0 0 0 1 0"
          />
        </filter>
        <filter id="dashboard-cvd-deuteranopia">
          <feColorMatrix
            values="0.625 0.375 0 0 0
                    0.7 0.3 0 0 0
                    0 0.3 0.7 0 0
                    0 0 0 1 0"
          />
        </filter>
        <filter id="dashboard-cvd-tritanopia">
          <feColorMatrix
            values="0.95 0.05 0 0 0
                    0 0.433 0.567 0 0
                    0 0.475 0.525 0 0
                    0 0 0 1 0"
          />
        </filter>
      </defs>
    </svg>
  )
}

function getColorVisionAttribute(
  colorVision: PlaygroundColorVision,
): PlaygroundColorVision | undefined {
  return colorVision === "normal" ? undefined : colorVision
}

function ComponentsShowcase({ settings, onSettingsChange }: ComponentsShowcaseProps): JSX.Element {
  const { componentOptions } = settings
  const previewThemeInput = createDashboardThemeInput(settings)
  const colorVisionAttribute = getColorVisionAttribute(settings.accessibility.colorVision)

  const isCompact = useIsCompactBreakpoint()
  const isMobile = useIsMobileBreakpoint()
  const [sidebarHidden, setSidebarHidden] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Close the drawer when we cross out of the compact range so the inline
  // sidebar takes over cleanly.
  useEffect(() => {
    if (!isCompact && drawerOpen) setDrawerOpen(false)
  }, [isCompact, drawerOpen])

  // Esc-to-close. The library Drawer doesn't ship a key handler.
  useEffect(() => {
    if (!drawerOpen) return
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === "Escape") setDrawerOpen(false)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [drawerOpen])

  const sidebarVisible = !isCompact && !sidebarHidden
  const showFab = isCompact || sidebarHidden

  const handleFabClick = (): void => {
    if (isCompact) {
      setDrawerOpen(true)
    } else {
      setSidebarHidden(false)
    }
  }

  return (
    <ShowcaseContainer>
      <ColorVisionFilters />
      <ShowcaseLayout $sidebarVisible={sidebarVisible}>
        {sidebarVisible && (
          <ControlsColumn>
            <HideSidebarButton type="button" onClick={() => setSidebarHidden(true)}>
              <Icon name={IconName.X} decorative size={14} />
              Hide
            </HideSidebarButton>
            <PlaygroundControls settings={settings} onSettingsChange={onSettingsChange} />
          </ControlsColumn>
        )}
        <ContentGrid>
          <Text variant={TextVariant.overline}>Components</Text>
          <PreviewThemeScope data-dashboard-color-vision={colorVisionAttribute}>
            <MarwesProvider theme={previewThemeInput}>
              <Row $desktopHeight="32.25rem">
                <RowSwitchCard options={componentOptions} />
              </Row>
              <Row $desktopHeight="19.375rem">
                <RowAccordionInput options={componentOptions} />
              </Row>
              <Row $desktopHeight="29.5rem">
                <RowToastMenuAvatar options={componentOptions} />
              </Row>
              <Row $desktopHeight="12.625rem">
                <RowAvatarBreadcrumbDialog options={componentOptions} />
              </Row>
              <Row $desktopHeight="13.5rem">
                <RowBanner options={componentOptions} />
              </Row>
              <Row $desktopHeight="9rem">
                <RowButtonPaginationProgress options={componentOptions} />
              </Row>
              <Row $desktopHeight="15.75rem">
                <RowSegmented />
              </Row>
              <Row $desktopHeight="10.25rem">
                <RowSpinner options={componentOptions} />
              </Row>
            </MarwesProvider>
          </PreviewThemeScope>
        </ContentGrid>
      </ShowcaseLayout>

      {showFab && <CustomizeFab onClick={handleFabClick} />}

      {isCompact && drawerOpen && (
        <DrawerPanelScope $isMobile={isMobile}>
          <Drawer
            placement="left"
            size={isMobile ? "large" : "medium"}
            modal={isMobile}
            showScrim={isMobile}
            dismissible
            onClose={() => setDrawerOpen(false)}
            title="Playground"
          >
            <PlaygroundControls settings={settings} onSettingsChange={onSettingsChange} />
          </Drawer>
        </DrawerPanelScope>
      )}
    </ShowcaseContainer>
  )
}

export { ComponentsShowcase }
export type { ComponentsShowcaseProps }
