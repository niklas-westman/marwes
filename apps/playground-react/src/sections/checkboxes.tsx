import { CheckboxField } from "@marwes-ui/react"

import { ComponentStack, PreviewSection, SectionTitle } from "./section.styles"

function CheckboxesSection(): JSX.Element {
  return (
    <PreviewSection>
      <SectionTitle>Checkboxes</SectionTitle>
      <ComponentStack>
        <CheckboxField
          label="Accept terms and conditions"
          description="You agree to our Terms of Service and Privacy Policy"
          checkbox={{ ariaLabel: "Accept terms" }}
        />
        <CheckboxField
          label="Subscribe to newsletter"
          checkbox={{ ariaLabel: "Subscribe", defaultChecked: true }}
        />
        <CheckboxField
          label="Required field"
          error="You must accept to continue"
          checkbox={{ ariaLabel: "Required" }}
        />
        <CheckboxField
          label="Disabled option"
          checkbox={{ ariaLabel: "Disabled", disabled: true }}
        />
      </ComponentStack>
    </PreviewSection>
  )
}

export { CheckboxesSection }
