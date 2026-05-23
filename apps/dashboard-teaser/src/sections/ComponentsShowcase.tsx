import styled from "styled-components"

import {
  dashboardRadius,
  dashboardRowStyles,
  responsiveShellPadding,
  sectionLabelStyles,
} from "../styles/theme-utils"
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
  background: ${({ theme }) => theme.color.surfaceSubtle};
  border-radius: ${({ theme }) => dashboardRadius(theme, 4)};
  padding: ${({ theme }) => `clamp(${theme.spacing.sp16}, 3vw, ${theme.spacing.sp32})`};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => `clamp(${theme.spacing.sp16}, 2vw, ${theme.spacing.sp24})`};

  ${({ theme }) => theme.media.mobileAndBelow} {
    border-radius: ${({ theme }) => dashboardRadius(theme, 3)};
  }
`

const SectionTitle = styled.h2`
  ${sectionLabelStyles}
  color: ${({ theme }) => theme.color.text};
`

const Row = styled.div`
  ${dashboardRowStyles}
`

function ComponentsShowcase(): JSX.Element {
  return (
    <ShowcaseContainer>
      <ContentGrid>
        <SectionTitle>Components</SectionTitle>
        <Row>
          <RowSwitchCard />
        </Row>
        <Row>
          <RowAccordionInput />
        </Row>
        <Row>
          <RowToastMenuAvatar />
        </Row>
        <Row>
          <RowAvatarBreadcrumbDialog />
        </Row>
        <Row>
          <RowBanner />
        </Row>
        <Row>
          <RowButtonPaginationProgress />
        </Row>
        <Row>
          <RowSegmented />
        </Row>
        <Row>
          <RowSpinner />
        </Row>
      </ContentGrid>
    </ShowcaseContainer>
  )
}

export { ComponentsShowcase }
