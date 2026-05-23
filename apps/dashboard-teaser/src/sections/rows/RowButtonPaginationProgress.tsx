import { Button, ButtonVariant, Pagination, ProgressBar } from "@marwes-ui/react"
import { useState } from "react"
import styled from "styled-components"

import { FlexCard, ShowcaseRow, ShowcaseSectionLabel } from "./shared"

const ItemCard = styled(FlexCard)`
  justify-content: center;
`

const ButtonRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sp16};
  align-items: center;
  flex-wrap: wrap;
`

function RowButtonPaginationProgress(): JSX.Element {
  const [currentPage, setCurrentPage] = useState(1)

  return (
    <ShowcaseRow>
      <ItemCard>
        <ShowcaseSectionLabel>Button</ShowcaseSectionLabel>
        <ButtonRow>
          <Button>Label →</Button>
          <Button variant={ButtonVariant.secondary}>Label →</Button>
          <Button variant={ButtonVariant.text}>Label →</Button>
        </ButtonRow>
      </ItemCard>
      <ItemCard>
        <ShowcaseSectionLabel>Pagination</ShowcaseSectionLabel>
        <Pagination
          page={currentPage}
          pageCount={10}
          siblingCount={2}
          onPageChange={setCurrentPage}
        />
      </ItemCard>
      <ItemCard>
        <ShowcaseSectionLabel>Progress bar</ShowcaseSectionLabel>
        <ProgressBar label="Progress" value={60} size="small" />
      </ItemCard>
    </ShowcaseRow>
  )
}

export { RowButtonPaginationProgress }
