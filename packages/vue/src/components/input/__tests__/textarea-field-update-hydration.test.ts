/**
 * Vue adapter: wires the shared field wiring contract for TextareaField.
 */
import { screen } from "@testing-library/vue"
import type { Component } from "vue"
import { runFieldWiringUpdatesContract } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { TextareaField } from "../textarea-field"

runFieldWiringUpdatesContract("vue", "TextareaField", {
  ...createUpdateHydrationHarness(TextareaField as Component, ({ helper, ...props }) => ({
    ...props,
    textarea: {},
    ...(helper ? { helperText: helper } : {}),
  })),
  getControl: (label) => screen.getByRole("textbox", { name: label }),
  marksErrorAsInvalid: true,
})
