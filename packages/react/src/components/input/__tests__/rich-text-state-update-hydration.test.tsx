import { fireEvent, screen } from "@testing-library/react"
import {
  type TextValueUpdatesProps,
  runTextValueUpdatesContract,
} from "../../../../../../tests/contracts/text-value-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { RichTextField } from "../rich-text-field"
runTextValueUpdatesContract(
  "react",
  "RichTextField",
  {
    ...createUpdateHydrationHarness((props: TextValueUpdatesProps) => (
      <RichTextField label="Notes" editor={props} />
    )),
    getControl: () => screen.getByRole("textbox", { name: "Notes" }),
    getValue: () => screen.getByRole("textbox", { name: "Notes" }).innerHTML,
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
