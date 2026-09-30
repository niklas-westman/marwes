import { SwitchField } from "@marwes-ui/react"
import { useState } from "react"

export function Example() {
  const [checked, setChecked] = useState(false)

  return <SwitchField label="Label" switch={{ checked, onCheckedChange: setChecked }} />
}
