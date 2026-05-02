import {
  CurrencyField,
  EmailField,
  InputField,
  PasswordField,
  PhoneField,
  SearchField,
  URLField,
} from "@marwes-ui/react"

import { ComponentGrid, PreviewSection, SectionTitle } from "./section.styles"

function InputFieldsSection(): JSX.Element {
  return (
    <PreviewSection>
      <SectionTitle>Input Fields</SectionTitle>
      <ComponentGrid>
        <InputField
          label="Full name"
          helperText="As it appears on your ID"
          input={{ placeholder: "Jane Doe" }}
        />
        <EmailField label="Email" input={{ placeholder: "jane@example.com" }} />
        <PasswordField label="Password" input={{ placeholder: "Enter password" }} />
        <SearchField label="Search" input={{ placeholder: "Search anything..." }} />
        <PhoneField label="Phone" input={{ placeholder: "+1 (555) 000-0000" }} />
        <URLField label="Website" input={{ placeholder: "https://example.com" }} />
        <CurrencyField label="Amount" input={{ placeholder: "0.00" }} />
        <InputField
          label="With error"
          error="This field is required"
          input={{ placeholder: "Required" }}
        />
      </ComponentGrid>
    </PreviewSection>
  )
}

export { InputFieldsSection }
