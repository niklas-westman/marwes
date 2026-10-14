/**
 * Vue adapter: wires the shared field wiring contract for SwitchField.
 */
import { screen } from "@testing-library/vue"
import type { Component } from "vue"
import type { FieldWiringProps } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { runFieldWiringUpdatesContract } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { SwitchField } from "../switch-field"

runFieldWiringUpdatesContract("vue", "SwitchField", {
  ...createUpdateHydrationHarness(
    SwitchField as Component,
    ({ helper, ...props }: FieldWiringProps) => ({
      ...props,
      switch: {},
      ...(helper ? { description: helper } : {}),
    }),
  ),
  getControl: (label) => screen.getByRole("switch", { name: label }),
})
