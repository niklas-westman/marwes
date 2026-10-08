/**
 * Vue adapter: wires the shared update and hydration contract for Textarea.
 */
import userEvent from "@testing-library/user-event"
import { screen } from "@testing-library/vue"
import type { Component } from "vue"
import { runTextareaUpdatesContract } from "../../../../../../tests/contracts/textarea-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { Textarea } from "../textarea"

runTextareaUpdatesContract("vue", {
  ...createUpdateHydrationHarness(Textarea as Component),
  getTextbox: () => screen.getByRole("textbox") as HTMLTextAreaElement,
  async type(element, text) {
    await userEvent.setup().type(element, text)
  },
})
