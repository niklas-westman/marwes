import { InputOtpField } from "@marwes-ui/react"
import { useState } from "react"

export function Example() {
  const [value, setValue] = useState("")

  return (
    <InputOtpField
      label="Verification code"
      helperText="Enter the 6-digit code sent to your email"
      inputOtp={{ length: 6, value, onValueChange: setValue }}
    />
  )
}
