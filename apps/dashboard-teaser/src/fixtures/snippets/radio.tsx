import { RadioGroupField } from "@marwes-ui/react"
import { useState } from "react"

export function Example() {
  const [value, setValue] = useState("1")

  return (
    <RadioGroupField
      name="options"
      label="Group label"
      options={[
        { value: "1", label: "Label" },
        { value: "2", label: "Label" },
        { value: "3", label: "Label" },
      ]}
      value={value}
      onChange={setValue}
    />
  )
}
