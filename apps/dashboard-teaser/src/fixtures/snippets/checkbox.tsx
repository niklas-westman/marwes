import { CheckboxField, CheckboxGroupField } from "@marwes-ui/react"
import { useState } from "react"

export function Example() {
  const [checked, setChecked] = useState(false)
  const [values, setValues] = useState<string[]>(["1"])

  return (
    <>
      <CheckboxField label="Label" checkbox={{ checked, onCheckedChange: setChecked }} />
      <CheckboxGroupField
        label="Group label"
        options={[
          { value: "1", label: "Label" },
          { value: "2", label: "Label" },
          { value: "3", label: "Label" },
        ]}
        value={values}
        onChange={setValues}
      />
    </>
  )
}
