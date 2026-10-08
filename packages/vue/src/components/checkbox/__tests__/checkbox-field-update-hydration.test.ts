/**
 * Vue adapter: wires the shared field wiring contract for CheckboxField.
 */
import { screen } from "@testing-library/vue"
import type { Component } from "vue"
import { runFieldWiringUpdatesContract } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { CheckboxField } from "../checkbox-field"

runFieldWiringUpdatesContract("vue", "CheckboxField", {
  ...createUpdateHydrationHarness(CheckboxField as Component, ({ helper, ...props }) => ({
    ...props,
    checkbox: {},
    ...(helper ? { description: helper } : {}),
  })),
  getControl: (label) => screen.getByRole("checkbox", { name: label }),
  marksErrorAsInvalid: true,
})
