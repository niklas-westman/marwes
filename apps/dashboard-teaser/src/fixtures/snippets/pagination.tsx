import { PaginationField } from "@marwes-ui/react"
import { useState } from "react"

export function Example() {
  const [page, setPage] = useState(1)

  return (
    <PaginationField
      label="Search results"
      pagination={{
        page,
        pageCount: 10,
        controlDisplay: "label",
        maxVisibleItems: 5,
        onPageChange: setPage,
      }}
    />
  )
}
