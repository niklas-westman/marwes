import { fireEvent, screen } from "@testing-library/vue"
import type { Component } from "vue"
import {
  type TextValueUpdatesProps,
  runTextValueUpdatesContract,
} from "../../../../../../tests/contracts/text-value-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { InputOtpField } from "../input-otp-field"
runTextValueUpdatesContract(
  "vue",
  "InputOtpField",
  {
    ...createUpdateHydrationHarness<TextValueUpdatesProps>(InputOtpField as Component, (props) => ({
      label: "Notes",
      inputOtp: { ...props },
    })),
    getControl: () => screen.getByRole("textbox", { name: "Notes" }),
    getValue: () => (screen.getByRole("textbox", { name: "Notes" }) as HTMLInputElement).value,
    async setUserValue(value) {
      const control = screen.getByRole("textbox", { name: "Notes" }) as HTMLInputElement
      if (
        control.disabled ||
        control.readOnly ||
        control.getAttribute("contenteditable") === "false"
      )
        return
      await fireEvent.input(control, { target: { value } })
    },
  },
  { initial: "123456", updated: "654321", rawDefault: "ab12 345678" },
)
