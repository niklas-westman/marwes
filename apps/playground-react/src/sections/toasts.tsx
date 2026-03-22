import { Toast } from "@marwes-ui/react"
import { ComponentStack, PreviewSection, SectionDescription, SectionTitle } from "./section.styles"

const VARIANTS = ["subtle", "outline", "rich"] as const

function ToastsSection(): JSX.Element {
  return (
    <PreviewSection>
      <SectionTitle>Toast</SectionTitle>

      <SectionDescription>Variants — subtle, outline, rich</SectionDescription>
      <ComponentStack style={{ maxWidth: 480 }}>
        {VARIANTS.map((v) => (
          <Toast key={v} variant={v} onDismiss={() => {}}>
            {v.charAt(0).toUpperCase() + v.slice(1)} — Your changes have been saved.
          </Toast>
        ))}
      </ComponentStack>

      <div style={{ marginTop: 24 }}>
        <SectionDescription>With action</SectionDescription>
        <Toast
          variant="outline"
          action={
            <button type="button" style={{ all: "unset", cursor: "pointer" }}>
              Undo
            </button>
          }
          onDismiss={() => {}}
        >
          3 items moved to archive.
        </Toast>
      </div>
    </PreviewSection>
  )
}

export { ToastsSection }
