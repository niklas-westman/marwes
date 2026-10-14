/**
 * React adapter: wires the shared update and hydration contract for Textarea.
 */
import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type { TextareaUpdatesProps } from "../../../../../../tests/contracts/textarea-updates.contract"
import { runTextareaUpdatesContract } from "../../../../../../tests/contracts/textarea-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { Textarea } from "../textarea"

runTextareaUpdatesContract("react", {
  ...createUpdateHydrationHarness((props: TextareaUpdatesProps) => <Textarea {...props} />),
  getTextbox: () => screen.getByRole("textbox") as HTMLTextAreaElement,
  async type(element, text) {
    await userEvent.setup().type(element, text)
  },
})
