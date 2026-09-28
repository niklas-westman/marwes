import { FeatureToggle, PermissionSwitch, PreferenceSwitch } from "@marwes-ui/react"
import { useState } from "react"

import { ShowcaseCard, ShowcaseGrid, ShowcaseStack } from "./showcase-layout"

function SwitchShowcase(): JSX.Element {
  const [autoSave, setAutoSave] = useState(true)
  const [betaAccess, setBetaAccess] = useState(false)

  return (
    <ShowcaseGrid>
      <ShowcaseCard>
        <h3>Preference toggle</h3>
        <p>An immediate on/off preference with a connected description.</p>
        <ShowcaseStack>
          <PreferenceSwitch
            label="Autosave drafts"
            description="Save changes automatically every few seconds."
            switch={{ checked: autoSave, onCheckedChange: setAutoSave }}
          />
        </ShowcaseStack>
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>Feature toggle with error</h3>
        <p>A blocked feature keeps the switch visible along with a truthful error.</p>
        <ShowcaseStack>
          <FeatureToggle
            label="Enable beta workspace"
            error="Beta access requires an approved workspace plan."
            switch={{ checked: betaAccess, onCheckedChange: setBetaAccess }}
          />
        </ShowcaseStack>
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>Disabled permission</h3>
        <p>A locked permission stays visible with its granted state instead of disappearing.</p>
        <ShowcaseStack>
          <PermissionSwitch
            label="Admin access"
            description="Managed by your workspace owner."
            switch={{ checked: true, disabled: true }}
          />
        </ShowcaseStack>
      </ShowcaseCard>
    </ShowcaseGrid>
  )
}

export default SwitchShowcase
