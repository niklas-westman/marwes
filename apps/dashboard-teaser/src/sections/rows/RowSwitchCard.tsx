import {
  Badge,
  CheckboxField,
  CheckboxGroupField,
  InputOtp,
  Card as MwCard,
  RadioGroupField,
  SwitchField,
} from "@marwes-ui/react"
import { useState } from "react"
import styled from "styled-components"

import { CardTitle, ShowcaseCard, ShowcaseGrid, ShowcaseSectionLabel } from "./shared"

const DemoArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const InlineCheckboxes = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`

const BadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
`

const OtpCard = styled(ShowcaseCard)`
  .mw-input-otp {
    max-width: 100%;
  }

  .mw-input-otp__cells {
    width: min(100%, max-content);
  }
`

function RowSwitchCard(): JSX.Element {
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
    <ShowcaseGrid>
      <ShowcaseCard $desktopSpan={3}>
        <ShowcaseSectionLabel>Switch</ShowcaseSectionLabel>
        <DemoArea>
          <SwitchField label="Label" switch={{ checked: switchA, onCheckedChange: setSwitchA }} />
          <SwitchField label="Label" switch={{ checked: switchB, onCheckedChange: setSwitchB }} />
        </DemoArea>
      </ShowcaseCard>
      <ShowcaseCard $desktopSpan={3}>
        <ShowcaseSectionLabel>Card</ShowcaseSectionLabel>
        <MwCard title="Card title">
          Card description text goes here. This provides more context about the card content.
        </MwCard>
      </ShowcaseCard>
      <ShowcaseCard $desktopSpan={3}>
        <ShowcaseSectionLabel>Checkbox</ShowcaseSectionLabel>
        <CardTitle>Size</CardTitle>
        <InlineCheckboxes>
          <CheckboxField
            label="Label"
            checkbox={{ checked: inlineChecks[0], onCheckedChange: () => toggleInlineCheck(0) }}
          />
          <CheckboxField
            label="Label"
            checkbox={{ checked: inlineChecks[1], onCheckedChange: () => toggleInlineCheck(1) }}
          />
          <CheckboxField
            label="Label"
            checkbox={{ checked: inlineChecks[2], onCheckedChange: () => toggleInlineCheck(2) }}
          />
        </InlineCheckboxes>
        <CheckboxGroupField
          label="Group label"
          description="Select all that apply"
          options={[
            { value: "1", label: "Label" },
            { value: "2", label: "Label" },
            { value: "3", label: "Label" },
          ]}
          value={groupValues}
          onChange={setGroupValues}
        />
      </ShowcaseCard>
      <ShowcaseCard $desktopSpan={3}>
        <ShowcaseSectionLabel>Radio</ShowcaseSectionLabel>
        <RadioGroupField
          name="demo-radio-single"
          label="Label"
          options={[{ value: "1", label: "Label" }]}
          value={radioValue}
          onChange={setRadioValue}
        />
        <RadioGroupField
          name="demo-radio-group"
          label="Group label"
          description="Select one option"
          options={[
            { value: "1", label: "Label" },
            { value: "2", label: "Label" },
            { value: "3", label: "Label" },
          ]}
          value={radioGroupValue}
          onChange={setRadioGroupValue}
        />
      </ShowcaseCard>
      <OtpCard $desktopSpan={6}>
        <ShowcaseSectionLabel>One-Time Password</ShowcaseSectionLabel>
        <InputOtp
          label="Verification code"
          length={6}
          helperText="Enter the 6-digit code sent to your email"
          value={otpValue}
          onValueChange={setOtpValue}
        />
      </OtpCard>
      <ShowcaseCard $desktopSpan={6}>
        <ShowcaseSectionLabel>Badge</ShowcaseSectionLabel>
        <BadgeRow>
          <Badge>Badge</Badge>
          <Badge variant="info">Badge</Badge>
          <Badge variant="success">Badge</Badge>
          <Badge variant="warning">Badge</Badge>
          <Badge variant="error">Badge</Badge>
        </BadgeRow>
      </ShowcaseCard>
    </ShowcaseGrid>
  )
}

export { RowSwitchCard }
