import { screen } from "@testing-library/vue"
import type { Component } from "vue"
import { runFieldWiringUpdatesContract } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { DateOfBirthField } from "../field-variants"

runFieldWiringUpdatesContract("vue", "DateOfBirthField", {
  ...createUpdateHydrationHarness(DateOfBirthField as Component, ({ helper, ...props }) => ({
    ...props,
    input: { value: "2000-01-02" },
    ...(helper ? { helperText: helper } : {}),
  })),
  getControl: (label) => screen.getByLabelText(label),
})
