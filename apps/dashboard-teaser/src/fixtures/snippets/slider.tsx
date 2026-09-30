import { SliderField } from "@marwes-ui/react"

export function Example() {
  return (
    <SliderField
      label="Volume"
      description="Adjust media volume"
      slider={{ min: 0, max: 100, step: 1, defaultValue: 40 }}
    />
  )
}
