import { fireEvent, screen } from "@testing-library/vue"
import type { Component } from "vue"
import {
  type TextValueUpdatesProps,
  runTextValueUpdatesContract,
} from "../../../../../../tests/contracts/text-value-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { RichTextField } from "../rich-text-field"
runTextValueUpdatesContract(
  "vue",
  "RichTextField",
  {
    ...createUpdateHydrationHarness<TextValueUpdatesProps>(RichTextField as Component, (props) => ({
      label: "Notes",
      editor: { ...props },
    })),
    getControl: () => screen.getByRole("textbox", { name: "Notes" }),
    getValue: () => screen.getByRole("textbox", { name: "Notes" }).innerHTML,
    async blur() {
      await fireEvent.blur(screen.getByRole("textbox", { name: "Notes" }))
    },
    async setUserValue(value) {
      const control = screen.getByRole("textbox", { name: "Notes" }) as HTMLInputElement
      if (
        control.disabled ||
        control.readOnly ||
        control.getAttribute("contenteditable") === "false"
      )
        return
      control.innerHTML = value
      await fireEvent.input(control)
    },
  },
  {
    initial: "<p>Server notes</p>",
    updated: "<p>Client notes</p>",
    rawDefault: "<p>Server notes</p>",
  },
)
