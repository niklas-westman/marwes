import { useState } from "react"
// Atom is no longer publicly exported; deep-import for playground demo.
import { Switch } from "../../../../packages/react/src/components/switch/switch"
import { ComponentRow, PreviewSection, SectionDescription, SectionTitle } from "./section.styles"

function SwitchesSection(): JSX.Element {
  const [on, setOn] = useState(false)

  return (
    <PreviewSection>
      <SectionTitle>Switch</SectionTitle>

      <SectionDescription>States — off, on, disabled</SectionDescription>
      <ComponentRow>
        <Switch>Notifications</Switch>
        <Switch checked>Dark mode</Switch>
        <Switch disabled>Locked setting</Switch>
        <Switch checked disabled>
          Forced on
        </Switch>
      </ComponentRow>

      <div style={{ marginTop: 24 }}>
        <SectionDescription>Interactive</SectionDescription>
        <Switch checked={on} onClick={() => setOn((v) => !v)}>
          {on ? "Enabled" : "Disabled"}
        </Switch>
      </div>
    </PreviewSection>
  )
}

export { SwitchesSection }
