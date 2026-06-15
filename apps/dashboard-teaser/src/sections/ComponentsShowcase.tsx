import styled from "styled-components"

import { Text, TextVariant } from "@marwes-ui/react"
import { dashboardRadius, dashboardRowStyles, responsiveShellPadding } from "../styles/theme-utils"
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

const ContentGrid = styled.div`
  width: 100%;
  max-width: ${({ theme }) =>
    `calc(${theme.breakpoint.wideDesktop}px - (${theme.spacing.sp72} * 2))`};
  margin: 0 auto;
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

const Row = styled.div<{ $desktopHeight: string }>`
  ${dashboardRowStyles}

  ${({ theme }) => theme.media.wideDesktopAndAbove} {
    min-height: ${(p) => p.$desktopHeight};
  }
`

function ComponentsShowcase(): JSX.Element {
  return (
    <ShowcaseContainer>
      <ContentGrid>
        <Text variant={TextVariant.overline}>Components</Text>
        <Row $desktopHeight="32.25rem">
          <RowSwitchCard />
        </Row>
        <Row $desktopHeight="19.375rem">
          <RowAccordionInput />
        </Row>
        <Row $desktopHeight="29.5rem">
          <RowToastMenuAvatar />
        </Row>
        <Row $desktopHeight="12.625rem">
          <RowAvatarBreadcrumbDialog />
        </Row>
        <Row $desktopHeight="13.5rem">
          <RowBanner />
        </Row>
        <Row $desktopHeight="9rem">
          <RowButtonPaginationProgress />
        </Row>
        <Row $desktopHeight="15.75rem">
          <RowSegmented />
        </Row>
        <Row $desktopHeight="10.25rem">
          <RowSpinner />
        </Row>
      </ContentGrid>
    </ShowcaseContainer>
  )
}

export { ComponentsShowcase }
