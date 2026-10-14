import { screen } from "@testing-library/vue"
import type { Component } from "vue"
import type { FieldWiringProps } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { runFieldWiringUpdatesContract } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { EmailField } from "../field-variants"

runFieldWiringUpdatesContract("vue", "EmailField", {
  ...createUpdateHydrationHarness(
    EmailField as Component,
    ({ helper, ...props }: FieldWiringProps) => ({
      ...props,
      input: { value: "user@example.com" },
      ...(helper ? { helperText: helper } : {}),
    }),
  ),
  getControl: (label) => screen.getByRole("textbox", { name: label }),
})
