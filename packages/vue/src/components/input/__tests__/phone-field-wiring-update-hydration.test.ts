import { screen } from "@testing-library/vue"
import type { Component } from "vue"
import { runFieldWiringUpdatesContract } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { PhoneField } from "../field-variants"

runFieldWiringUpdatesContract("vue", "PhoneField", {
  ...createUpdateHydrationHarness(PhoneField as Component, ({ helper, ...props }) => ({
    ...props,
    input: { value: "+46123456789" },
    ...(helper ? { helperText: helper } : {}),
  })),
  getControl: (label) => screen.getByRole("textbox", { name: label }),
})
