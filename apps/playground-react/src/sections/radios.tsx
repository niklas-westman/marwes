import { useState } from "react"
// Atom is no longer publicly exported; deep-import for playground demo.
import { Radio } from "../../../../packages/react/src/components/radio/radio"
import { ComponentRow, PreviewSection, SectionDescription, SectionTitle } from "./section.styles"

const OPTIONS = ["Small", "Medium", "Large"] as const

function RadiosSection(): JSX.Element {
  const [selected, setSelected] = useState<string>("Small")

  return (
    <PreviewSection>
      <SectionTitle>Radio</SectionTitle>

      <SectionDescription>States — unchecked, checked, disabled, invalid</SectionDescription>
      <ComponentRow>
        {/* biome-ignore lint/a11y/noLabelWithoutControl: <Radio> renders a native input */}
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
          <Radio name="states" ariaLabel="Unchecked" /> Unchecked
        </label>
        {/* biome-ignore lint/a11y/noLabelWithoutControl: <Radio> renders a native input */}
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
          <Radio name="states" ariaLabel="Checked" checked onChange={() => {}} /> Checked
        </label>
        {/* biome-ignore lint/a11y/noLabelWithoutControl: <Radio> renders a native input */}
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
          <Radio name="states" ariaLabel="Disabled" disabled /> Disabled
        </label>
        {/* biome-ignore lint/a11y/noLabelWithoutControl: <Radio> renders a native input */}
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
          <Radio name="states" ariaLabel="Invalid" invalid /> Invalid
        </label>
      </ComponentRow>

      <div style={{ marginTop: 24 }}>
        <SectionDescription>Interactive group</SectionDescription>
        <div role="radiogroup" aria-label="Size" style={{ display: "flex", gap: 16 }}>
          {OPTIONS.map((opt) => (
            // biome-ignore lint/a11y/noLabelWithoutControl: <Radio> renders a native input
            <label
              key={opt}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              <Radio
                name="size"
                value={opt}
                checked={selected === opt}
                onCheckedChange={(checked) => {
                  if (checked) setSelected(opt)
                }}
              />
              {opt}
            </label>
          ))}
        </div>
      </div>
    </PreviewSection>
  )
}

export { RadiosSection }
