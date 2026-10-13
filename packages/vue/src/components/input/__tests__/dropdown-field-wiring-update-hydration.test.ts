import { screen } from "@testing-library/vue"
import type { Component } from "vue"
import { runFieldWiringUpdatesContract } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { DropdownField } from "../field-variants"

runFieldWiringUpdatesContract("vue", "DropdownField", {
  ...createUpdateHydrationHarness(DropdownField as Component, ({ helper, ...props }) => ({
    ...props,
    select: { options: [{ value: "se", label: "Sweden" }], value: "se", name: "country" },
    ...(helper ? { helperText: helper } : {}),
  })),
  getControl: (label) => screen.getByRole("combobox", { name: label }),
})
