import { Breadcrumb } from "@marwes-ui/react"

export function Example() {
  return (
    <Breadcrumb
      homeHref="/"
      items={[
        { label: "Label", href: "/section" },
        { label: "Label", href: "/section/child" },
        { label: "Current page" },
      ]}
    />
  )
}
