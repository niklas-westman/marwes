import { CurrencyField, EmailField, PhoneField } from "@marwes-ui/react"
import { useState } from "react"

export function Example() {
  const [amount, setAmount] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  return (
    <>
      <CurrencyField
        label="Amount"
        currency="USD"
        input={{ placeholder: "0.00", value: amount, onValueChange: setAmount }}
      />
      <EmailField
        label="Email"
        input={{ placeholder: "you@example.com", value: email, onValueChange: setEmail }}
      />
      <PhoneField
        label="Phone"
        input={{ placeholder: "+1 (555) 000-0000", value: phone, onValueChange: setPhone }}
      />
    </>
  )
}
