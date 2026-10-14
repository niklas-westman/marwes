import { screen } from "@testing-library/react"
import type { FieldWiringProps } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { runFieldWiringUpdatesContract } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { InputOtpField } from "../input-otp-field"

runFieldWiringUpdatesContract("react", "InputOtpField", {
  ...createUpdateHydrationHarness(({ helper, ...props }: FieldWiringProps) => (
    <InputOtpField
      {...props}
      inputOtp={{ value: "123456" }}
      {...(helper ? { helperText: helper } : {})}
    />
  )),
  getControl: (label) => screen.getByRole("textbox", { name: label }),
})
