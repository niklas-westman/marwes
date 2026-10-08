/**
 * Vue adapter: wires the shared update and hydration contract for AccordionField.
 */
import userEvent from "@testing-library/user-event"
import { screen } from "@testing-library/vue"
import type { Component } from "vue"
import { runAccordionFieldUpdatesContract } from "../../../../../../tests/contracts/accordion-field-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { AccordionField } from "../accordion-field"

runAccordionFieldUpdatesContract("vue", {
  ...createUpdateHydrationHarness(AccordionField as Component),
  getTrigger: (title) => screen.getByRole("button", { name: title }),
  getAllTriggers: () => screen.getAllByRole("button"),
  async click(element) {
    await userEvent.setup().click(element)
  },
})
