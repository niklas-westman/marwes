import { screen } from "@testing-library/vue"
import type { Component } from "vue"
import { runFieldWiringUpdatesContract } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { SearchField } from "../field-variants"

runFieldWiringUpdatesContract("vue", "SearchField", {
  ...createUpdateHydrationHarness(SearchField as Component, ({ helper, ...props }) => ({
    ...props,
    input: { value: "Invoice" },
    ...(helper ? { helperText: helper } : {}),
  })),
  getControl: (label) => screen.getByRole("searchbox", { name: label }),
})
