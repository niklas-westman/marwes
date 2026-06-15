import styled from "styled-components"

import { MarwesProvider, Text, TextVariant } from "@marwes-ui/react"
import type { Dispatch, SetStateAction } from "react"
import { dashboardRadius, dashboardRowStyles, responsiveShellPadding } from "../styles/theme-utils"
import { PlaygroundControls } from "./PlaygroundControls"
import { createDashboardThemeInput } from "./playground-settings"
import type { PlaygroundSettings } from "./playground-settings"
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

const ShowcaseLayout = styled.div`
  width: 100%;
  max-width: ${({ theme }) =>
    `calc(${theme.breakpoint.wideDesktop}px - (${theme.spacing.sp72} * 2))`};
  margin: 0 auto;
  display: grid;
  grid-template-columns: 15.25rem minmax(0, 1fr);
  gap: ${({ theme }) => `calc(${theme.spacing.sp32} + ${theme.spacing.sp4})`};
  align-items: start;

  ${({ theme }) => theme.media.desktopAndBelow} {
    grid-template-columns: minmax(0, 1fr);
  }
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
`

const ControlsColumn = styled.div`
  position: sticky;
  top: ${({ theme }) => theme.spacing.sp24};
  padding-top: ${({ theme }) => `calc(${theme.spacing.sp16} + ${theme.spacing.sp4})`};

  ${({ theme }) => theme.media.desktopAndBelow} {
    position: static;
    padding-top: 0;
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

function ComponentsShowcase({ settings, onSettingsChange }: ComponentsShowcaseProps): JSX.Element {
  const { componentOptions } = settings
  const previewThemeInput = createDashboardThemeInput(settings)

  return (
    <ShowcaseContainer>
      <ShowcaseLayout>
        <ControlsColumn>
          <PlaygroundControls settings={settings} onSettingsChange={onSettingsChange} />
        </ControlsColumn>
        <ContentGrid>
          <Text variant={TextVariant.overline}>Components</Text>
          <PreviewThemeScope>
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
    </ShowcaseContainer>
  )
}

export { ComponentsShowcase }
export type { ComponentsShowcaseProps }
