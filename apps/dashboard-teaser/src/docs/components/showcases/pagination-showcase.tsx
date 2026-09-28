import { PaginationField } from "@marwes-ui/react"
import { useState } from "react"

import { ShowcaseCard, ShowcaseGrid, ShowcaseStack } from "./showcase-layout"

function PaginationShowcase(): JSX.Element {
  const [labeledPage, setLabeledPage] = useState(1)
  const [iconPage, setIconPage] = useState(3)

  return (
    <ShowcaseGrid>
      <ShowcaseCard>
        <h3>Labeled controls</h3>
        <p>Text labels keep the current page visible without relying on icons alone.</p>
        <ShowcaseStack>
          <PaginationField
            label="Search results"
            pagination={{
              page: labeledPage,
              pageCount: 10,
              controlDisplay: "label",
              maxVisibleItems: 5,
              onPageChange: setLabeledPage,
            }}
          />
        </ShowcaseStack>
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>Icon controls</h3>
        <p>A compact icon layout keeps the same accessible previous/next semantics.</p>
        <ShowcaseStack>
          <PaginationField
            label="Order history"
            pagination={{
              page: iconPage,
              pageCount: 8,
              controlDisplay: "icon",
              maxVisibleItems: 5,
              onPageChange: setIconPage,
            }}
          />
        </ShowcaseStack>
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>First and last</h3>
        <p>Jumping to the boundary pages stays available for long result sets.</p>
        <ShowcaseStack>
          <PaginationField
            label="Audit log"
            pagination={{
              page: 12,
              pageCount: 40,
              controlDisplay: "icon",
              maxVisibleItems: 3,
              showFirstLast: true,
            }}
          />
        </ShowcaseStack>
      </ShowcaseCard>
    </ShowcaseGrid>
  )
}

export default PaginationShowcase
