import {
  Button,
  ButtonVariant,
  CheckboxField,
  EmailField,
  MarwesProvider,
  SubmitButton,
} from "@marwes-ui/react"
import { useState } from "react"

export function App() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  return (
    <MarwesProvider>
      <EmailField
        label="Email"
        input={{ value: email, onValueChange: setEmail, placeholder: "you@example.com" }}
      />
      <CheckboxField
        label="Send me product updates"
        checkbox={{ checked: subscribed, onCheckedChange: setSubscribed }}
      />
      <Button variant={ButtonVariant.secondary}>Preview</Button>
      <SubmitButton>Save</SubmitButton>
    </MarwesProvider>
  )
}
