import { RadioGroupField, RatingRadioGroup, YesNoRadioGroup } from "@marwes-ui/react"
import { useState } from "react"

import { ShowcaseCard, ShowcaseGrid, ShowcaseStack } from "./showcase-layout"

function RadioShowcase(): JSX.Element {
  const [plan, setPlan] = useState("personal")
  const [acceptsTerms, setAcceptsTerms] = useState("no")
  const [satisfaction, setSatisfaction] = useState("3")

  return (
    <ShowcaseGrid>
      <ShowcaseCard>
        <h3>Grouped choice</h3>
        <p>A labeled radio group with a disabled option kept visible for context.</p>
        <ShowcaseStack>
          <RadioGroupField
            name="plan"
            label="Account plan"
            options={[
              { value: "personal", label: "Personal" },
              { value: "team", label: "Team" },
              { value: "enterprise", label: "Enterprise", disabled: true },
            ]}
            value={plan}
            onChange={setPlan}
          />
        </ShowcaseStack>
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>Binary choice</h3>
        <p>Explicit yes/no semantics without inventing a two-option list by hand.</p>
        <ShowcaseStack>
          <YesNoRadioGroup
            name="accept-terms"
            label="Do you accept the terms?"
            value={acceptsTerms}
            onChange={setAcceptsTerms}
          />
        </ShowcaseStack>
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>Rating scale</h3>
        <p>A generated numeric scale reports intent as a rating, not a generic option list.</p>
        <ShowcaseStack>
          <RatingRadioGroup
            name="satisfaction"
            label="How satisfied are you?"
            value={satisfaction}
            onChange={setSatisfaction}
          />
        </ShowcaseStack>
      </ShowcaseCard>
    </ShowcaseGrid>
  )
}

export default RadioShowcase
