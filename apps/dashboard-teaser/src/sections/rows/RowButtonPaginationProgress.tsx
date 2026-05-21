import { Button, SliderField } from "@marwes-ui/react"
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

/* Pagination */
const PaginationWrapper = styled.nav`
  display: flex;
  align-items: center;
  gap: 2px;
  font-family: "Instrument Sans", sans-serif;
  font-size: 13px;
  flex-wrap: wrap;
`

const PaginationNav = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  border: none;
  background: none;
  font-family: "Instrument Sans", sans-serif;
  font-size: 13px;
  color: var(--mw-color-text, #141414);
  cursor: pointer;
  padding: 4px 8px;

  &:hover {
    opacity: 0.7;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`

const PageButton = styled.button<{ $active?: boolean }>`
  min-width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 6px;
  background: ${(p) => (p.$active ? "#2f31fc" : "transparent")};
  color: ${(p) => (p.$active ? "#ffffff" : "var(--mw-color-text, #141414)")};
  font-family: "Instrument Sans", sans-serif;
  font-size: 13px;
  cursor: pointer;

  &:hover:not([disabled]) {
    background: ${(p) => (p.$active ? "#2f31fc" : "var(--mw-color-surface-subtle, #f5f5f5)")};
  }
`

const Ellipsis = styled.span`
  padding: 0 4px;
  color: var(--mw-color-text-muted, #595959);
`

function RowButtonPaginationProgress(): JSX.Element {
  const [currentPage, setCurrentPage] = useState(1)
  const [progress, setProgress] = useState(60)

  const pages = [1, 2, 3, "ellipsis", 10] as const

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
        <PaginationWrapper>
          <PaginationNav
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            ‹ Previous
          </PaginationNav>
          {pages.map((page) =>
            page === "ellipsis" ? (
              <Ellipsis key="ellipsis">…</Ellipsis>
            ) : (
              <PageButton
                key={page}
                $active={currentPage === page}
                type="button"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </PageButton>
            ),
          )}
          <PaginationNav
            type="button"
            disabled={currentPage === 10}
            onClick={() => setCurrentPage((p) => Math.min(10, p + 1))}
          >
            Next ›
          </PaginationNav>
        </PaginationWrapper>
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
