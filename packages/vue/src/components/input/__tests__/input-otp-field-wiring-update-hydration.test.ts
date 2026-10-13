import { screen } from "@testing-library/vue"
import type { Component } from "vue"
import { runFieldWiringUpdatesContract } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { InputOtpField } from "../input-otp-field"

runFieldWiringUpdatesContract("vue", "InputOtpField", {
  ...createUpdateHydrationHarness(InputOtpField as Component, ({ helper, ...props }) => ({
    ...props,
    inputOtp: { value: "123456" },
    ...(helper ? { helperText: helper } : {}),
  })),
  getControl: (label) => screen.getByRole("textbox", { name: label }),
})
