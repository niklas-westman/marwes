import { screen } from "@testing-library/vue"
import type { Component } from "vue"
import type { FieldWiringProps } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { runFieldWiringUpdatesContract } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { PasswordField } from "../field-variants"

runFieldWiringUpdatesContract("vue", "PasswordField", {
  ...createUpdateHydrationHarness(
    PasswordField as Component,
    ({ helper, ...props }: FieldWiringProps) => ({
      ...props,
      input: { value: "Secret" },
      ...(helper ? { helperText: helper } : {}),
    }),
  ),
  getControl: (label) => screen.getByLabelText(label),
})
