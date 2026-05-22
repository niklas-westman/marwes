import styled from "styled-components"

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
  padding: 0 clamp(16px, 4vw, 72px);
`

const ContentGrid = styled.div`
  width: 100%;
  max-width: 1296px;
  margin: 0 auto;
  background: var(--mw-color-surface-subtle, #f8f8f8);
  border-radius: 16px;
  padding: clamp(16px, 3vw, 32px);
  display: flex;
  flex-direction: column;
  gap: clamp(16px, 2vw, 24px);

  @media (max-width: 768px) {
    border-radius: 12px;
  }
`

const SectionTitle = styled.h2`
  font-family: "Instrument Sans", sans-serif;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--mw-color-text, #141414);
`

const Row = styled.div`
  display: flex;
  gap: 24px;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
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
