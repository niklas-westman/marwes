import { AccordionField } from "@marwes-ui/react"
import { useState } from "react"

export function Example() {
  const [openItems, setOpenItems] = useState<string[]>(["1"])

  return (
    <AccordionField
      label=""
      items={[
        { value: "1", title: "Accordion title", content: "First section content." },
        { value: "2", title: "Accordion title", content: "Second section content." },
        { value: "3", title: "Accordion title", content: "Third section content." },
      ]}
      openItems={openItems}
      onOpenItemsChange={setOpenItems}
    />
  )
}
