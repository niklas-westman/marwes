import { Button, Pagination, SliderField } from "@marwes-ui/react"
import { useState } from "react"
import styled from "styled-components"

import { FlexCard } from "./shared"

const RowContainer = styled.div`
  display: flex;
  gap: 24px;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`

const ItemCard = styled(FlexCard)`
  justify-content: center;
`

const SectionLabel = styled.h4`
  font-family: "Instrument Sans", sans-serif;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--mw-color-text-muted, #595959);
`

const ButtonRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
`

function RowButtonPaginationProgress(): JSX.Element {
  const [currentPage, setCurrentPage] = useState(1)
  const [progress, setProgress] = useState(60)

  return (
    <RowContainer>
      <ItemCard>
        <SectionLabel>Button</SectionLabel>
        <ButtonRow>
          <Button>Label →</Button>
          <Button variant="secondary">Label →</Button>
          <Button variant="text">Label →</Button>
        </ButtonRow>
      </ItemCard>
      <ItemCard>
        <SectionLabel>Pagination</SectionLabel>
        <Pagination
          page={currentPage}
          pageCount={10}
          siblingCount={2}
          onPageChange={setCurrentPage}
        />
      </ItemCard>
      <ItemCard>
        <SectionLabel>Progress bar</SectionLabel>
        <SliderField
          label="Progress"
          maxValueLabel={`${progress}%`}
          slider={{
            min: 0,
            max: 100,
            step: 1,
            value: progress,
            onValueChange: setProgress,
          }}
        />
      </ItemCard>
    </RowContainer>
  )
}

export { RowButtonPaginationProgress }
