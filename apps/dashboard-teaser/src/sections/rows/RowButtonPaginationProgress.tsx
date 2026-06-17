import { Button, ButtonVariant, ProgressBar, Text, TextVariant } from "@marwes-ui/react"
import { useState } from "react"
import styled from "styled-components"
// Atom is no longer publicly exported; deep-import for inline Pagination demo.
import { Pagination } from "../../../../../packages/react/src/components/pagination/pagination"

import type { ComponentDisplayOptions } from "../playground-settings"
import { FlexAreaCard, ShowcaseFlexRow } from "./shared"

const ItemCard = styled(FlexAreaCard)`
  justify-content: center;
`

const ProgressCard = styled(ItemCard)`
  .mw-progress-bar {
    width: 100%;
  }
`

const ButtonRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sp16};
  align-items: center;
  flex-wrap: wrap;
`

type RowButtonPaginationProgressProps = {
  options: ComponentDisplayOptions
}

function RowButtonPaginationProgress({ options }: RowButtonPaginationProgressProps): JSX.Element {
  const [currentPage, setCurrentPage] = useState(1)

  return (
    <ShowcaseFlexRow>
      <ItemCard $basis="15rem" $minHeight="9rem">
        {options.showLabels && <Text variant={TextVariant.overline}>Button</Text>}
        <ButtonRow>
          <Button>Label →</Button>
          <Button variant={ButtonVariant.secondary}>Label →</Button>
          <Button variant={ButtonVariant.text}>Label →</Button>
        </ButtonRow>
      </ItemCard>
      <ItemCard $basis="15rem" $minHeight="9rem">
        {options.showLabels && <Text variant={TextVariant.overline}>Pagination</Text>}
        <Pagination
          page={currentPage}
          pageCount={10}
          controlDisplay="label"
          maxVisibleItems={5}
          onPageChange={setCurrentPage}
        />
      </ItemCard>
      <ProgressCard $basis="15rem" $minHeight="9rem">
        {options.showLabels && <Text variant={TextVariant.overline}>Progress bar</Text>}
        <ProgressBar label="Progress" value={60} size="small" />
      </ProgressCard>
    </ShowcaseFlexRow>
  )
}

export { RowButtonPaginationProgress }
