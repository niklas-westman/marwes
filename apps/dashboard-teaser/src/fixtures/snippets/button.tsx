import { Button, ButtonVariant } from "@marwes-ui/react"

export function Example() {
  return (
    <>
      <Button>Label →</Button>
      <Button variant={ButtonVariant.secondary}>Label →</Button>
      <Button variant={ButtonVariant.text}>Label →</Button>
    </>
  )
}
