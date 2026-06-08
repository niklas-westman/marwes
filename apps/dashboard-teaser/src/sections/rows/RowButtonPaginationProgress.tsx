import { Button, ButtonVariant, Pagination, ProgressBar, Text, TextVariant } from "@marwes-ui/react"
import { useState } from "react"
import styled from "styled-components"

import { FlexCard, ShowcaseRow } from "./shared"

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
        <Text variant={TextVariant.overline}>Button</Text>
        <ButtonRow>
          <Button>Label →</Button>
          <Button variant={ButtonVariant.secondary}>Label →</Button>
          <Button variant={ButtonVariant.text}>Label →</Button>
        </ButtonRow>
      </ItemCard>
      <ItemCard>
        <Text variant={TextVariant.overline}>Pagination</Text>
        <Pagination
          page={currentPage}
          pageCount={10}
          controlDisplay="label"
          maxVisibleItems={5}
          onPageChange={setCurrentPage}
        />
      </ItemCard>
      <ItemCard>
        <Text variant={TextVariant.overline}>Progress bar</Text>
        <ProgressBar label="Progress" value={60} size="small" />
      </ItemCard>
    </ShowcaseRow>
  )
}

export { RowButtonPaginationProgress }
