import { screen } from "@testing-library/react"
import { runFieldWiringUpdatesContract } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { InputOtpField } from "../input-otp-field"

runFieldWiringUpdatesContract("react", "InputOtpField", {
  ...createUpdateHydrationHarness(({ helper, ...props }) => (
    <InputOtpField
      {...props}
      inputOtp={{ value: "123456" }}
      {...(helper ? { helperText: helper } : {})}
    />
  )),
  getControl: (label) => screen.getByRole("textbox", { name: label }),
})
