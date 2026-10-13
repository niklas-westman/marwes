import { screen } from "@testing-library/vue"
import type { Component } from "vue"
import { runFieldWiringUpdatesContract } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { PaginationField } from "../pagination-field"

runFieldWiringUpdatesContract("vue", "PaginationField", {
  ...createUpdateHydrationHarness(PaginationField as Component, ({ helper, ...props }) => ({
    ...props,
    pagination: { pageCount: 10, modelValue: 4 },
    ...(helper ? { description: helper } : {}),
  })),
  getControl: (label) => screen.getByRole("navigation", { name: label }),
})
