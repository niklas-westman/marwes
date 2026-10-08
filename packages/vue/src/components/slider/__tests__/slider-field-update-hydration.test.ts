/**
 * Vue adapter: wires the shared field wiring contract for SliderField.
 */
import { screen } from "@testing-library/vue"
import type { Component } from "vue"
import { runFieldWiringUpdatesContract } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { SliderField } from "../slider-field"

runFieldWiringUpdatesContract("vue", "SliderField", {
  ...createUpdateHydrationHarness(SliderField as Component, ({ helper, ...props }) => ({
    ...props,
    slider: {},
    ...(helper ? { description: helper } : {}),
  })),
  getControl: (label) => screen.getByRole("slider", { name: label }),
  marksErrorAsInvalid: true,
})
