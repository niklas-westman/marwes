import {
  AccordionField,
  CurrencyField,
  EmailField,
  PhoneField,
  Text,
  TextVariant,
} from "@marwes-ui/react"
import { useState } from "react"
import styled from "styled-components"
// Atom is no longer publicly exported; deep-import for PurposeSelect's custom layout.
import { Select } from "../../../../../packages/react/src/components/input/select"

import { CodeIconButton } from "../../components/CodeIconButton"
import { CodeSnippetModal } from "../../components/CodeSnippetModal"
import type { ComponentDisplayOptions } from "../playground-settings"
import { accordionSnippets } from "./accordion-snippets"
import { inputSnippets } from "./input-snippets"
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
  const [accordionCodeOpen, setAccordionCodeOpen] = useState(false)
  const [inputCodeOpen, setInputCodeOpen] = useState(false)

  return (
    <ShowcaseFlexRow>
      <AccordionCard $basis="36rem" $minHeight="19.375rem">
        {options.showLabels && <Text variant={TextVariant.overline}>Accordion</Text>}
        <CodeIconButton
          ariaLabel="View Accordion code example"
          onClick={() => setAccordionCodeOpen(true)}
        />
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
      <InputCard $basis="21.5rem" $minHeight="19.375rem">
        {options.showLabels && <Text variant={TextVariant.overline}>Input fields</Text>}
        <CodeIconButton
          ariaLabel="View Input fields code example"
          onClick={() => setInputCodeOpen(true)}
        />
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
      <CodeSnippetModal
        open={accordionCodeOpen}
        onOpenChange={setAccordionCodeOpen}
        title="Accordion"
        snippets={accordionSnippets}
      />
      <CodeSnippetModal
        open={inputCodeOpen}
        onOpenChange={setInputCodeOpen}
        title="Input fields"
        snippets={inputSnippets}
      />
    </ShowcaseFlexRow>
  )
}

export { RowAccordionInput }
