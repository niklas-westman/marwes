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

import { FlexCard, ShowcaseRow, ShowcaseStack } from "./shared"

const AccordionCard = styled(FlexCard).attrs({
  $desktopWidth: "54rem",
})``

const InputCard = styled(FlexCard)`
  ${({ theme }) => theme.media.wideDesktopAndAbove} {
    flex: 0 0 21.5rem;
  }

  ${({ theme }) => theme.media.wideDesktopAndBelow} {
    max-width: 21.5rem;
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

function RowAccordionInput(): JSX.Element {
  const [openItems, setOpenItems] = useState<string[]>(["1"])
  const [selectedField, setSelectedField] = useState<FieldType>("currency")
  const [currencyValue, setCurrencyValue] = useState("")
  const [emailValue, setEmailValue] = useState("")
  const [phoneValue, setPhoneValue] = useState("")

  return (
    <ShowcaseRow>
      <AccordionCard>
        <Text variant={TextVariant.overline}>Accordion</Text>
        <AccordionField
          label=""
          items={[
            {
              value: "1",
              title: "Accordion title",
              content:
                "Accordion content goes here. This is the expandable section that provides more detail.",
            },
            {
              value: "2",
              title: "Accordion title",
              content: "More content for this section.",
            },
            {
              value: "3",
              title: "Accordion title",
              content: "Additional expandable content.",
            },
          ]}
          openItems={openItems}
          onOpenItemsChange={setOpenItems}
        />
      </AccordionCard>
      <InputCard>
        <Text variant={TextVariant.overline}>Input fields</Text>
        <ShowcaseStack>
          <PurposeSelect>
            <Text variant={TextVariant.overline}>Purpose</Text>
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
              helperText="Amount in USD"
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
              helperText="Enter your email address"
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
              helperText="Enter your phone number"
              input={{
                placeholder: "+1 (555) 000-0000",
                value: phoneValue,
                onValueChange: setPhoneValue,
              }}
            />
          )}
        </ShowcaseStack>
      </InputCard>
    </ShowcaseRow>
  )
}

export { RowAccordionInput }
