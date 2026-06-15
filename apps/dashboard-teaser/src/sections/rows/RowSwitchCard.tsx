import {
  Badge,
  CheckboxField,
  CheckboxGroupField,
  InputOtp,
  Card as MwCard,
  Radio,
  RadioGroupField,
  SwitchField,
  Text,
  TextVariant,
} from "@marwes-ui/react"
import { useState } from "react"
import styled from "styled-components"

import type { ComponentDisplayOptions } from "../playground-settings"
import { CardTitle, Card as ShowcaseCard } from "./shared"

const FirstSectionFlex = styled.div`
  --first-section-gap: ${({ theme }) => `clamp(${theme.spacing.sp16}, 2vw, ${theme.spacing.sp24})`};

  display: flex;
  flex-wrap: wrap;
  width: 100%;
  min-width: 0;
  gap: var(--first-section-gap);
  align-items: flex-start;

  > * {
    min-width: 0;
  }

  @container (max-width: 58rem) {
    --first-section-card-basis: calc((100% - var(--first-section-gap)) / 2);
  }

  @container (max-width: 38rem) {
    --first-section-card-basis: 100%;
  }
`

const FirstSectionCard = styled(ShowcaseCard)<{
  $basis: string
  $grow?: number
  $responsiveOrder: number
}>`
  flex: ${(p) => `${p.$grow ?? 0} 1 ${p.$basis}`};
  max-width: ${(p) => p.$basis};
  width: auto;
  min-height: ${(p) => p.$height ?? "auto"};
  order: ${(p) => p.$responsiveOrder};

  @container (max-width: 58rem) {
    flex-basis: var(--first-section-card-basis);
    max-width: var(--first-section-card-basis);
  }

  @container (max-width: 38rem) {
    flex-basis: 100%;
    max-width: 100%;
    min-height: auto;
  }
`

const CheckboxShowcaseCard = styled(FirstSectionCard)`
  .mw-checkbox-group-field__options {
    margin-top: 0.4375rem;
  }

  .mw-checkbox-group-field__option {
    min-height: 1.5rem;
    height: 1.5rem;
  }
`

const SingleRadioField = styled.label`
  display: inline-flex;
  min-height: 1.5rem;
  padding-top: 0.1875rem;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sp8};
  box-sizing: content-box;
  cursor: pointer;
  user-select: none;
`

const DemoArea = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sp24};
  align-items: center;
`

const InlineCheckboxes = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sp8};
  align-items: center;
`

const BadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => `calc(${theme.spacing.sp4} + ${theme.spacing.sp2})`};
  align-items: center;
`

const OtpCard = styled(FirstSectionCard)`
  .mw-input-otp {
    max-width: 100%;
  }

  .mw-input-otp__cells {
    width: min(100%, max-content);
  }
`

type RowSwitchCardProps = {
  options: ComponentDisplayOptions
}

function RowSwitchCard({ options }: RowSwitchCardProps): JSX.Element {
  const [switchA, setSwitchA] = useState(true)
  const [switchB, setSwitchB] = useState(false)
  const [inlineChecks, setInlineChecks] = useState([false, true, true])
  const [groupValues, setGroupValues] = useState<string[]>(["1"])
  const [radioValue, setRadioValue] = useState("1")
  const [radioGroupValue, setRadioGroupValue] = useState("1")
  const [otpValue, setOtpValue] = useState("")

  const toggleInlineCheck = (index: number): void => {
    setInlineChecks((prev) => prev.map((v, i) => (i === index ? !v : v)))
  }

  return (
    <FirstSectionFlex>
      <FirstSectionCard $basis="24rem" $height="15.125rem" $responsiveOrder={1}>
        {options.showLabels && <Text variant={TextVariant.overline}>Switch</Text>}
        <DemoArea>
          <SwitchField label="Label" switch={{ checked: switchA, onCheckedChange: setSwitchA }} />
          <SwitchField label="Label" switch={{ checked: switchB, onCheckedChange: setSwitchB }} />
        </DemoArea>
      </FirstSectionCard>
      <CheckboxShowcaseCard $basis="15.625rem" $height="19.25rem" $responsiveOrder={2}>
        {options.showLabels && <Text variant={TextVariant.overline}>Checkbox</Text>}
        <CardTitle>Size</CardTitle>
        <InlineCheckboxes>
          <CheckboxField
            label="Label"
            checkbox={{
              checked: inlineChecks[0],
              onCheckedChange: () => toggleInlineCheck(0),
            }}
          />
          <CheckboxField
            label="Label"
            checkbox={{
              checked: inlineChecks[1],
              onCheckedChange: () => toggleInlineCheck(1),
            }}
          />
          <CheckboxField
            label="Label"
            checkbox={{
              checked: inlineChecks[2],
              onCheckedChange: () => toggleInlineCheck(2),
            }}
          />
        </InlineCheckboxes>
        <CheckboxGroupField
          label="Group label"
          description={options.showDescriptions ? "Select all that apply" : undefined}
          options={[
            { value: "1", label: "Label" },
            { value: "2", label: "Label" },
            { value: "3", label: "Label" },
          ]}
          value={groupValues}
          onChange={setGroupValues}
        />
      </CheckboxShowcaseCard>
      <FirstSectionCard $basis="15.625rem" $height="19.25rem" $responsiveOrder={3}>
        {options.showLabels && <Text variant={TextVariant.overline}>Radio</Text>}
        <SingleRadioField htmlFor="demo-radio-single-1">
          <Radio
            id="demo-radio-single-1"
            name="demo-radio-single"
            value="1"
            checked={radioValue === "1"}
            onCheckedChange={(checked) => {
              if (checked) setRadioValue("1")
            }}
          />
          <Text variant={TextVariant.label}>Label</Text>
        </SingleRadioField>
        <RadioGroupField
          name="demo-radio-group"
          label="Group label"
          description={options.showDescriptions ? "Select one option" : undefined}
          options={[
            { value: "1", label: "Label" },
            { value: "2", label: "Label" },
            { value: "3", label: "Label" },
          ]}
          value={radioGroupValue}
          onChange={setRadioGroupValue}
        />
      </FirstSectionCard>
      <FirstSectionCard $basis="23.75rem" $height="15.625rem" $responsiveOrder={4}>
        {options.showLabels && <Text variant={TextVariant.overline}>Card</Text>}
        <MwCard title="Card title">
          {options.showDescriptions
            ? "Card description text goes here. This provides more context about the card content."
            : undefined}
        </MwCard>
      </FirstSectionCard>
      <OtpCard $basis="23.75rem" $height="11.5rem" $responsiveOrder={5}>
        {options.showLabels && <Text variant={TextVariant.overline}>One-Time Password</Text>}
        <InputOtp
          label="Verification code"
          length={6}
          helperText={
            options.showHelperText ? "Enter the 6-digit code sent to your email" : undefined
          }
          value={otpValue}
          onValueChange={setOtpValue}
        />
      </OtpCard>
      <FirstSectionCard $basis="8.25rem" $height="11.5rem" $responsiveOrder={6}>
        {options.showLabels && <Text variant={TextVariant.overline}>Badge</Text>}
        <BadgeRow>
          <Badge>Badge</Badge>
          <Badge variant="info">Badge</Badge>
          <Badge variant="success">Badge</Badge>
          <Badge variant="warning">Badge</Badge>
          <Badge variant="error">Badge</Badge>
        </BadgeRow>
      </FirstSectionCard>
    </FirstSectionFlex>
  )
}

export { RowSwitchCard }
