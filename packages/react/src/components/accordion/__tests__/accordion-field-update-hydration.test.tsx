/**
 * React adapter: wires the shared update and hydration contract for AccordionField.
 */
import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { runAccordionFieldUpdatesContract } from "../../../../../../tests/contracts/accordion-field-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { AccordionField } from "../accordion-field"

runAccordionFieldUpdatesContract("react", {
  ...createUpdateHydrationHarness((props) => <AccordionField {...props} />),
  getTrigger: (title) => screen.getByRole("button", { name: title }),
  getAllTriggers: () => screen.getAllByRole("button"),
  async click(element) {
    await userEvent.setup().click(element)
  },
})
