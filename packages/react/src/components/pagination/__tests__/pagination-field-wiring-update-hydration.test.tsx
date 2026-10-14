import { screen } from "@testing-library/react"
import type { FieldWiringProps } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { runFieldWiringUpdatesContract } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { PaginationField } from "../pagination-field"

runFieldWiringUpdatesContract("react", "PaginationField", {
  ...createUpdateHydrationHarness(({ helper, ...props }: FieldWiringProps) => (
    <PaginationField
      {...props}
      pagination={{ pageCount: 10, page: 4 }}
      {...(helper ? { description: helper } : {})}
    />
  )),
  getControl: (label) => screen.getByRole("navigation", { name: label }),
})
