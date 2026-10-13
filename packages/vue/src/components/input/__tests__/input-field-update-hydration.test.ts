/**
 * Vue adapter: wires the shared field wiring contract for InputField.
 */
import { screen } from "@testing-library/vue"
import type { Component } from "vue"
import type { FieldWiringProps } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { runFieldWiringUpdatesContract } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { InputField } from "../input-field"

runFieldWiringUpdatesContract("vue", "InputField", {
  ...createUpdateHydrationHarness(
    InputField as Component,
    ({ helper, ...props }: FieldWiringProps) => ({
      ...props,
      input: {},
      ...(helper ? { helperText: helper } : {}),
    }),
  ),
  getControl: (label) => screen.getByRole("textbox", { name: label }),
})
