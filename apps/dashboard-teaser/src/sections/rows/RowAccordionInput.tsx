import {
  AccordionField,
  CurrencyField,
  EmailField,
  PhoneField,
  Select,
  Text,
  TextVariant,
} from "@marwes-ui/react"
import { useState } from "react"
import styled from "styled-components"

import type { ComponentDisplayOptions } from "../playground-settings"
import { FlexAreaCard, ShowcaseFlexRow, ShowcaseStack } from "./shared"

const AccordionCard = styled(FlexAreaCard)`
  @container (max-width: 54rem) {
    flex-basis: 100%;
  }
`

const InputCard = styled(FlexAreaCard)`
  @container (max-width: 54rem) {
    flex-basis: 100%;
  }
`

const PurposeSelect = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sp8};
  align-items: flex-start;

  .mw-select__control {
    width: 8.4375rem;
  }

  .mw-select {
    width: 100%;
    font-weight: 500;
    letter-spacing: -0.02625rem;
  }
`

type FieldType = "currency" | "email" | "phone"

type RowAccordionInputProps = {
  options: ComponentDisplayOptions
}

function RowAccordionInput({ options }: RowAccordionInputProps): JSX.Element {
  const [openItems, setOpenItems] = useState<string[]>(["1"])
  const [selectedField, setSelectedField] = useState<FieldType>("currency")
  const [currencyValue, setCurrencyValue] = useState("")
  const [emailValue, setEmailValue] = useState("")
  const [phoneValue, setPhoneValue] = useState("")

  return (
    <ShowcaseFlexRow>
      <AccordionCard $basis="36rem" $minHeight="19.375rem">
        {options.showLabels && <Text variant={TextVariant.overline}>Accordion</Text>}
        <AccordionField
          label=""
          items={[
            {
              value: "1",
              title: "Accordion title",
              content: options.showDescriptions
                ? "Accordion content goes here. This is the expandable section that provides more detail."
                : "",
            },
            {
              value: "2",
              title: "Accordion title",
              content: options.showDescriptions ? "More content for this section." : "",
            },
            {
              value: "3",
              title: "Accordion title",
              content: options.showDescriptions ? "Additional expandable content." : "",
            },
          ]}
          openItems={openItems}
          onOpenItemsChange={setOpenItems}
        />
      </AccordionCard>
      <InputCard $basis="21.5rem" $grow={0} $minHeight="19.375rem">
        {options.showLabels && <Text variant={TextVariant.overline}>Input fields</Text>}
        <ShowcaseStack>
          <PurposeSelect>
            {options.showLabels && <Text variant={TextVariant.overline}>Purpose</Text>}
            <Select
              label="Purpose"
              options={[
                { value: "currency", label: "Currency field" },
                { value: "email", label: "Email field" },
                { value: "phone", label: "Phone field" },
              ]}
              value={selectedField}
              onValueChange={(v) => setSelectedField(v as FieldType)}
            />
          </PurposeSelect>
          {selectedField === "currency" && (
            <CurrencyField
              label="Amount"
              helperText={options.showHelperText ? "Amount in USD" : undefined}
              currency="USD"
              input={{
                placeholder: "0.00",
                value: currencyValue,
                onValueChange: setCurrencyValue,
              }}
            />
          )}
          {selectedField === "email" && (
            <EmailField
              label="Email"
              helperText={options.showHelperText ? "Enter your email address" : undefined}
              input={{
                placeholder: "you@example.com",
                value: emailValue,
                onValueChange: setEmailValue,
              }}
            />
          )}
          {selectedField === "phone" && (
            <PhoneField
              label="Phone"
              helperText={options.showHelperText ? "Enter your phone number" : undefined}
              input={{
                placeholder: "+1 (555) 000-0000",
                value: phoneValue,
                onValueChange: setPhoneValue,
              }}
            />
          )}
        </ShowcaseStack>
      </InputCard>
    </ShowcaseFlexRow>
  )
}

export { RowAccordionInput }
