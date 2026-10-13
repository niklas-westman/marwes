import { screen } from "@testing-library/vue"
import type { Component } from "vue"
import { runFieldWiringUpdatesContract } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { CurrencyField } from "../field-variants"

runFieldWiringUpdatesContract("vue", "CurrencyField", {
  ...createUpdateHydrationHarness(CurrencyField as Component, ({ helper, ...props }) => ({
    ...props,
    input: { value: "42" },
    ...(helper ? { helperText: helper } : {}),
  })),
  getControl: (label) => screen.getByRole("textbox", { name: label }),
})
